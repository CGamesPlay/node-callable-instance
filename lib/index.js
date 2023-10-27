"use strict";
const CALL = Symbol("Callable.CALL");
const PROPERTY = Symbol("Callable.PROPERTY");

function CallableFunction(...args) {
  return this.bound[this.bound[PROPERTY]](...args);
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
    this.func = CallableFunction.bind(this);
    this.bound = this.bind(this.func);
    Object.defineProperty(this.bound, PROPERTY, {
      writeable: false,
      enumerable: false,
      configurable: false,
      value: property,
    });
    Object.defineProperty(
      this.bound,
      "name",
      Object.getOwnPropertyDescriptor(this.constructor, "name")
    );
    return this.bound;
  }

  static makeCallable(obj, property) {
    if (obj !== undefined && obj !== null) {
      const prototype = Object.getPrototypeOf(obj);
      if (prototype === Object.prototype || prototype === Callable.prototype) {
        const callableObject = new Callable(property);
        Object.defineProperties(
          callableObject,
          Object.getOwnPropertyDescriptors(obj)
        );
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
