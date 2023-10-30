"use strict";
const CALL = Symbol("Callable.call");
const PROPERTY = Symbol("Callable.property");
const BOUND_CALL = Symbol("Callable.boundCall");
const BOUND_THIS = Symbol("Callable.boundThis");

function callableFunction(...args) {
  return this[BOUND_THIS][this[BOUND_THIS][PROPERTY]](...args);
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

    this[BOUND_THIS] = Function.prototype.bind.call(
      this,
      callableFunction.bind(this)
    );

    Object.defineProperties(this[BOUND_THIS], {
      [PROPERTY]: {
        ...privateValueDescriptor,
        value: property,
      },
      name: Object.getOwnPropertyDescriptor(this.constructor, "name"),
    });

    return this[BOUND_THIS];
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

  apply(...args) {
    return this[this[PROPERTY]].apply(...args);
  }

  call(...args) {
    return this[this[PROPERTY]].call(...args);
  }

  bind(...args) {
    const boundCall = this[this[PROPERTY]].bind(...args);
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
