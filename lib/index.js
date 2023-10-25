"use strict";
const CALL = Symbol("Callable.CALL");
const BOUND = Symbol("Callable.BOUND");
class Callable extends Function {
  static get CALL() {
    return CALL;
  }
  get [Symbol.toStringTag]() {
    return "Callable";
  }
  constructor(property) {
    super("...a", "return this.a[this.b][this.c](...a)");
    if (property === undefined) {
      property = CALL;
    }
    this[BOUND] = this.bind({
      a: this,
      b: BOUND,
      c: property,
    });
    Object.defineProperty(
      this[BOUND],
      "name",
      Object.getOwnPropertyDescriptor(this.constructor, "name")
    );
    return this[BOUND];
  }
}

module.exports = Callable;
