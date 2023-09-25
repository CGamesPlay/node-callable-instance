"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CALL = void 0;
exports.CALL = Symbol("Callable.CALL"); // CALL symbol
const BOUND = Symbol("Callable.BOUND"); // unique symbol for binding function
class Callable extends Function {
    static get CALL() {
        return exports.CALL;
    }
    get [Symbol.toStringTag]() {
        return "Callable";
    }
    constructor(property = exports.CALL) {
        super("...a", "return this.a[this.b][this.c](...a)"); // calls property from child class ( function (...args)){ return this[BOUND][property](...args)})
        this[BOUND] = this.bind({
            a: this,
            b: BOUND,
            c: property
        });
        Object.defineProperty(this[BOUND], "name", Object.getOwnPropertyDescriptor(this.constructor, "name")); // copies constructor name
        return this[BOUND]; // returns Bound function
    }
}
exports.default = Callable;
