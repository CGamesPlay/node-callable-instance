"use strict";
const CALL = Symbol("Callable.CALL");
const PROPERTY = Symbol("Callable.PROPERTY");
const BOUND_CALL = Symbol("Callable.BOUND");

function callableFunction(...args) {
  return this.bound[this.bound[PROPERTY]](...args);
}

const privateValueDescriptor = {
  writeable: false,
  enumerable: false,
  configurable: false,
};

class Callable extends Function {
  static get CALL() {
    return CALL;
  }

  constructor(property) {
    super("...a", "return this(...a);");
    if (property === undefined) {
      property = CALL;
    }

    this.bound = Function.prototype.bind.call(
      this,
      callableFunction.bind(this)
    );

    Object.defineProperties(this.bound, {
      [PROPERTY]: {
        ...privateValueDescriptor,
        value: property,
      },
      name: Object.getOwnPropertyDescriptor(this.constructor, "name"),
    });

    return this.bound;
  }

  static makeCallable(obj, property) {
    if (obj !== undefined && obj !== null) {
      const prototype = Object.getPrototypeOf(obj);
      if (prototype === Object.prototype || prototype === Callable.prototype) {
        const callableObject = new Callable(property);
        const properties = Object.getOwnPropertyDescriptors(obj);
        delete properties[PROPERTY];
        Object.defineProperties(callableObject, properties);
        return callableObject;
      }
    }
    throw new TypeError(
      "Callable.makeCallable accepts only regular object or direct instance of Callable"
    );
  }

  static clone(obj) {
    if (
      obj !== undefined &&
      obj !== null &&
      Object.getPrototypeOf(obj) === Callable.prototype
    ) {
      return Callable.makeCallable(obj, obj[PROPERTY]);
    }
    throw new TypeError(
      "Callable.clone accepts only direct instance of Callable. e.g created by Callable.makeCallable or with new Callable()"
    );
  }

  get [Symbol.toStringTag]() {
    return "Callable";
  }

  apply(t, args) {
    return this[this[PROPERTY]].apply(t, args);
  }

  call(t, ...args) {
    return this[this[PROPERTY]].call(t, ...args);
  }

  bind(t, ...args) {
    const boundCall = this[this[PROPERTY]].bind(t, ...args);
    const bound = Function.prototype.bind.call(this, boundCall);
    Object.defineProperties(bound, {
      [BOUND_CALL]: {
        ...privateValueDescriptor,
        value: boundCall,
      },
      [PROPERTY]: {
        ...privateValueDescriptor,
        value: BOUND_CALL,
      },
    });
    return bound;
  }
}

module.exports = Callable;
