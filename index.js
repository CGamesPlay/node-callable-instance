// @flow

declare class CallableInstance extends Function {
  static prototype: Object;
  $call: Function;
};
function CallableInstance(property: string): Function {
  var func = this.constructor.prototype[property];
  var apply: typeof func = function() { return func.apply(apply, arguments); }
  Object.setPrototypeOf(apply, this.constructor.prototype);
  Object.getOwnPropertyNames(func).forEach(function (p) {
    Object.defineProperty(apply, p, Object.getOwnPropertyDescriptor(func, p));
  });
  return apply;
}
CallableInstance.prototype = Object.create(Function.prototype);

module.exports = CallableInstance;
