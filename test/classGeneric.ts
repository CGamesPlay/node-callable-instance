import { expectType } from "ts-expect";
import Callable, { OverrideCall } from "callable-instance";

// TESTS FOR CLASS-TYPE GENERICS
class RepeaterWithClassGeneric extends Callable<
  typeof RepeaterWithClassGeneric,
  "go"
> {
  constructor(public count: number) {
    super("go");
  }

  go(arg: string): string {
    return arg.repeat(this.count);
  }
}

describe("Callable With Class Generic and custom property (TypeScript)", function () {
  it("is callable", function () {
    expectType<(x: string) => string>(new RepeaterWithClassGeneric(1));
    // @ts-expect-error wrong type for constructor
    new RepeaterWithClassGeneric("testing");
    // @ts-expect-error wrong type for method
    new RepeaterWithClassGeneric(5).go(5);
    // Valid propert access.
    new RepeaterWithClassGeneric(5).count = 4;
  });

  it("is an object", function () {
    expectType<RepeaterWithClassGeneric>(new RepeaterWithClassGeneric(5));
    expectType<(x: string) => string>(new RepeaterWithClassGeneric(5));
    expectType<(x: string) => string>(new RepeaterWithClassGeneric(5).go);
  });

  it("is an instance of Repeater", function () {
    expectType<RepeaterWithClassGeneric>(new RepeaterWithClassGeneric(5));
    expectType<Callable>(new RepeaterWithClassGeneric(5));
    expectType<Function>(new RepeaterWithClassGeneric(5));
    expectType<Object>(new RepeaterWithClassGeneric(5));
  });
});

class RepeaterWithClassOverride extends (RepeaterWithClassGeneric as OverrideCall<
  typeof RepeaterWithClassGeneric
>)<typeof RepeaterWithClassOverride, "go"> {
  constructor() {
    super(23);
  }
  go() {
    return 23;
  }
}

describe("Callable With Class Override Generic and custom property (TypeScript)", function () {
  it("is callable", function () {
    expectType<() => number>(new RepeaterWithClassOverride());
    // @ts-expect-error wrong type for constructor
    new RepeaterWithClassOverride()("testing");
    // @ts-expect-error wrong type for method
    new RepeaterWithClassOverride()(5).go(5);
    // Valid propert access.
    new RepeaterWithClassOverride().count = 4;
  });

  it("is an object", function () {
    expectType<RepeaterWithClassOverride>(new RepeaterWithClassOverride());
    expectType<() => number>(new RepeaterWithClassOverride().go);
    expectType<() => number>(new RepeaterWithClassOverride());
    expectType<(x: number) => number>(new RepeaterWithClassOverride().go);
  });

  it("is an instance of Repeater", function () {
    // is not passed because for typescript OverrideCall is other class
    expectType<RepeaterWithClassOverride>(new RepeaterWithClassOverride());
    expectType<Callable>(new RepeaterWithClassOverride());
    expectType<Function>(new RepeaterWithClassOverride());
    expectType<Object>(new RepeaterWithClassOverride());
  });
});
