"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CALL = void 0;
exports.CALL = Symbol("Callable.CALL");
const BOUND = Symbol("Callable.BOUND");
class Callable extends Function {
    static get CALL() {
        return exports.CALL;
    }
    get [Symbol.toStringTag]() {
        return "Callable";
    }
    constructor(property = exports.CALL) {
        super("...a", "return this.a[this.b][this.c](...a)");
        this[BOUND] = this.bind({
            a: this,
            b: BOUND,
            c: property
        });
        Object.defineProperty(this[BOUND], "name", Object.getOwnPropertyDescriptor(this.constructor, "name"));
        return this[BOUND];
    }
}
exports.default = Callable;
