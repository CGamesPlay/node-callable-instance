"use strict";
const CALL = Symbol("Callable.CALL");
const PROPERTY = Symbol("Callable.PROPERTY");

function callableFunction(...args) {
  return this.bound[this.bound[PROPERTY]](...args);
}

const privateValueDescriptor = {
  writeable: false,
  enumerable: false,
  configurable: false,
};

const descriptors = Object.getOwnPropertyDescriptors(Function.prototype);

function callableBind(...args) {
  const bound = this.bind(this.bound[this.bound[PROPERTY]].bind(...args));
  Object.defineProperties(bound, {
    [PROPERTY]: {
      ...privateValueDescriptor,
      value: this.bound[PROPERTY],
    },
    apply: {
      ...descriptors.apply,
      value: callableApply.bind(bound),
    },
    call: {
      ...descriptors.call,
      value: callableCall.bind(bound),
    },
    bind: {
      ...descriptors.bind,
      value: callableBind.bind(this),
    },
  });
  return bound;
}

function callableApply(t, args) {
  return this[this[PROPERTY]].apply(t, args);
}

function callableCall(t, ...args) {
  return this[this[PROPERTY]].call(t, ...args);
}

class Callable extends Function {
  static get CALL() {
    return CALL;
  }

  get [Symbol.toStringTag]() {
    return "Callable";
  }

  constructor(property) {
    super("...a", "return this(...a);");
    if (property === undefined) {
      property = CALL;
    }

    this.bound = this.bind(callableFunction.bind(this));

    Object.defineProperties(this.bound, {
      [PROPERTY]: {
        ...privateValueDescriptor,
        value: property,
      },
      name: Object.getOwnPropertyDescriptor(this.constructor, "name"),
      apply: {
        ...descriptors.apply,
        value: callableApply.bind(this.bound),
      },
      call: {
        ...descriptors.call,
        value: callableCall.bind(this.bound),
      },
      bind: {
        ...descriptors.bind,
        value: callableBind.bind(this),
      },
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
}

module.exports = Callable;
