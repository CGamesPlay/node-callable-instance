"use strict";
const CALL = Symbol("Callable.call");
const BOUND = Symbol("Callable.bound");

const PROTOTYPED_FUNCTIONS = new WeakMap();
const PROPERTIES = new WeakMap();

function createFunc() {
  return function callableFunction(...args) {
    return this[BOUND][PROPERTIES.get(this[BOUND])](...args);
  };
}

function CallableConstructor(property) {
  if (property === undefined) {
    property = CALL;
  }

  const prototype = this.constructor.prototype;

  let prototypedFunc = PROTOTYPED_FUNCTIONS.get(prototype);
  if (prototypedFunc === undefined) {
    prototypedFunc = Object.setPrototypeOf(createFunc(), prototype);
    PROTOTYPED_FUNCTIONS.set(prototype, prototypedFunc);
  }

  this[BOUND] = Function.prototype.bind.call(prototypedFunc, this);

  PROPERTIES.set(this[BOUND], property);

  Object.defineProperty(
    this[BOUND],
    "name",
    Object.getOwnPropertyDescriptor(this.constructor, "name")
  );

  return this[BOUND];
}

CallableConstructor.prototype = Function.prototype;

class Callable extends CallableConstructor {
  constructor(property) {
    super(property);
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
