import { expectType } from "ts-expect";

import CallableInstance from "../index.js";

class Repeater extends CallableInstance<[string], string> {
  constructor(public count: number) {
    super("go");
  }

  go(arg: string): string {
    return arg.repeat(this.count);
  }
}

describe("CallableInstance (TypeScript)", function () {
  it("is callable", function () {
    expectType<(x: string) => string>(new Repeater(1));
    // @ts-expect-error wrong type for constructor
    new Repeater("testing");
    // @ts-expect-error wrong type for method
    new Repeater(5).go(5);
    // Valid propert access.
    new Repeater(5).count = 4;
  });

  it("is an object", function () {
    expectType<Repeater>(new Repeater(5));
    expectType<(x: string) => string>(new Repeater(5).go);
  });

  it("is an instance of Repeater", function () {
    expectType<Repeater>(new Repeater(5));
    //expectType<typeof CallableInstance>(new Repeater(5));
    expectType<Function>(new Repeater(5));
    expectType<Object>(new Repeater(5));
  });
});
