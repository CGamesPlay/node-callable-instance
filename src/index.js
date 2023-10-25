export const CALL = Symbol("Callable.CALL"); // CALL symbol
const BOUND = Symbol("Callable.BOUND"); // unique symbol for binding function
class Callable extends Function {
  static get CALL() {
    // getter for CALL symbol
    return CALL;
  }
  get [Symbol.toStringTag]() {
    // creates stringTag (Object.prototype.toString.call(new Callable()) === [object Callable])
    return "Callable";
  }
  constructor(property) {
    super("...a", "return this.a[this.b][this.c](...a)"); // calls func assigned to property from class that extends Callable
    if (property === undefined) {
      property = CALL;
    }
    this[BOUND] = this.bind({
      // binds to property, bound symbol and this
      a: this,
      b: BOUND,
      c: property,
    });
    Object.defineProperty(
      this[BOUND],
      "name",
      Object.getOwnPropertyDescriptor(this.constructor, "name")
    ); // copies constructor name
    return this[BOUND];
  }
}

export default Callable;
