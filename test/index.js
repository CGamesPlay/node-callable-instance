"use strict";

var assert = require("assert");
var CallableInstance = require("../index");

class MyTest extends CallableInstance {
  constructor(message) {
    super("go");
    this.message = message;
  }

  go(arg) {
    return arg || this.message;
  }
}

describe("callable-instance", function () {
  it("is callable", function () {
    assert(new MyTest("testing")() === "testing");
    assert(new MyTest()("arg") === "arg");
  });

  it("is an object", function () {
    assert(new MyTest("testing").go() === "testing");
  });

  it("is an instance of MyTest", function () {
    assert(new MyTest("testing") instanceof MyTest);
    assert(new MyTest("testing") instanceof CallableInstance);
    assert(new MyTest("testing") instanceof Function);
    assert(new MyTest("testing") instanceof Object);
  });

  it("is a function", function () {
    assert(typeof new MyTest("testing") === "function");
  });

  it("copies the name property", function () {
    assert(new MyTest("testing").name === "go");
  });

  it("copies the length property", function () {
    assert(new MyTest("testing").length === 1);
  });
});
