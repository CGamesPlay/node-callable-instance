"use strict";
const CALL = Symbol("Callable.call");

const PROTOTYPED_FUNCTIONS = new WeakMap();
const PROPERTIES = new WeakMap();

class Callable extends Function {
  constructor(property) {
    if (property === undefined) {
      property = CALL;
    }

    const prototype = new.target.prototype;
    let prototypedFunc = PROTOTYPED_FUNCTIONS.get(prototype);
    if (prototypedFunc === undefined) {
      function callableFunction(...args) {
        return this.a[PROPERTIES.get(this.a)](...args);
      }
      prototypedFunc = Object.setPrototypeOf(callableFunction, prototype);
      PROTOTYPED_FUNCTIONS.set(prototype, prototypedFunc);
    }

    const funcThis = {};
    funcThis.a = Function.prototype.bind.call(prototypedFunc, funcThis);

    PROPERTIES.set(funcThis.a, property);

    Object.defineProperty(
      funcThis.a,
      "name",
      Object.getOwnPropertyDescriptor(new.target, "name")
    );

    return funcThis.a;
  }

  static get CALL() {
    return CALL;
  }

  static makeCallable(obj, property) {
    if (obj !== undefined && obj !== null) {
      const prototype = Object.getPrototypeOf(obj);
      if (prototype === Object.prototype || prototype === Callable.prototype) {
        const callableObject = new Callable(property);
        const properties = Object.getOwnPropertyDescriptors(obj);
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
      return Callable.makeCallable(obj, PROPERTIES.get(obj));
    }
    throw new TypeError(
      "Callable.clone accepts only direct instance of Callable"
    );
  }

  get [Symbol.toStringTag]() {
    return "Callable";
  }

  apply(...args) {
    return this[PROPERTIES.get(this)].apply(...args);
  }

  call(...args) {
    return this[PROPERTIES.get(this)].call(...args);
  }

  bind(...args) {
    return this[PROPERTIES.get(this)].bind(...args);
  }
}

module.exports = Callable;
