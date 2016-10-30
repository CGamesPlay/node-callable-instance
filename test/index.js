// @flow
var expect = require('chai').expect;
var CallableInstance = require('../index');

declare function describe(x: string, f: () => void): void;
declare function it(x: string, f: () => void): void;

class MyTest extends CallableInstance {
  message: ?string;

  constructor(message: ?string) {
    super('go');
    this.message = message;
  }

  go(arg: ?string) {
    return arg || this.message;
  }
}

describe('callable-instance', function() {
  it('is callable', function() {
    expect(new MyTest("testing")()).to.equal("testing");
    expect(new MyTest()("arg")).to.equal("arg");
  });

  it('is an object', function() {
    expect(new MyTest("testing").go()).to.equal("testing");
  });

  it('is an instance of MyTest', function() {
    expect(new MyTest("testing")).to.be.instanceOf(MyTest);
    expect(new MyTest("testing")).to.be.instanceOf(CallableInstance);
    expect(new MyTest("testing")).to.be.instanceOf(Function);
    expect(new MyTest("testing")).to.be.instanceOf(Object);
  });

  it('is a function', function() {
    expect(new MyTest("testing")).to.be.a("function");
  });

  it('copies the name property', function() {
    expect(new MyTest("testing").name).to.equal('go');
  });

  it('copies the length property', function() {
    expect(new MyTest("testing").length).to.equal(1);
  });
});
