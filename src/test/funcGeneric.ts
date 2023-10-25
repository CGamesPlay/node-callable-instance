import { expectType } from "ts-expect";
import Callable, { CallableConstructor, OverrideCall } from "callable-instance";

// TESTS FOR FUNCTION-TYPE GENERICS
class RepeaterWithFuncGeneric extends Callable<(x: string)=> string, "go"> {
  constructor(public count: number) {
    super("go");
  }

  go(arg: string): string {
    return arg.repeat(this.count);
  }
}

describe("Callable With Func Generic and custom property (TypeScript)", function () {
  it("is callable", function () {
    expectType<(x: string) => string>(new RepeaterWithFuncGeneric(1));
    // @ts-expect-error wrong type for constructor
    new RepeaterWithFuncGeneric("testing");
    // @ts-expect-error wrong type for method
    new RepeaterWithFuncGeneric(5).go(5);
    // Valid propert access.
    new RepeaterWithFuncGeneric(5).count = 4;
  });

  it("is an object", function () {
    expectType<RepeaterWithFuncGeneric>(new RepeaterWithFuncGeneric(5));
    expectType<(x: string) => string>(new RepeaterWithFuncGeneric(5));
    expectType<(x: string) => string>(new RepeaterWithFuncGeneric(5).go);
  });

  it("is an instance of Repeater", function () {
    expectType<RepeaterWithFuncGeneric>(new RepeaterWithFuncGeneric(5));
    expectType<InstanceType<CallableConstructor>>(
      new RepeaterWithFuncGeneric(5)
    );
    expectType<Function>(new RepeaterWithFuncGeneric(5));
    expectType<Object>(new RepeaterWithFuncGeneric(5));
  });
});

interface FuncOverride {
  (x: number): number;
  (x: string): string;
}

class RepeaterWithTSFuncOverride extends Callable<FuncOverride, "go"> {
  constructor(public count: number) {
    super("go");
  }

  go(arg: string): string {
    return arg.repeat(this.count);
  }
}

describe("Callable With Func Overriding Generic and custom property (TypeScript)", function () {
  it("is callable", function () {
    expectType<{ (x: string): string; (x: number): number }>(
      new RepeaterWithTSFuncOverride(1)
    );
    // @ts-expect-error wrong type for constructor
    new RepeaterWithTSFuncOverride("testing");
    // @ts-expect-error wrong type for method
    new RepeaterWithTSFuncOverride(5).go(5);
    // Valid propert access.
    new RepeaterWithTSFuncOverride(5).count = 4;
  });

  it("is an object", function () {
    expectType<RepeaterWithTSFuncOverride>(new RepeaterWithTSFuncOverride(5));
    expectType<(x: string) => string>(new RepeaterWithTSFuncOverride(5).go);
    expectType<{ (x: string): string; (x: number): number }>(
      new RepeaterWithTSFuncOverride(5)
    );
    expectType<(x: string) => string>(() =>
      new RepeaterWithTSFuncOverride(5)("23")
    );
    expectType<(x: number) => number>(() =>
      new RepeaterWithTSFuncOverride(5)(23)
    );
  });

  it("is an instance of Repeater", function () {
    expectType<RepeaterWithTSFuncOverride>(new RepeaterWithTSFuncOverride(5));
    expectType<InstanceType<CallableConstructor>>(
      new RepeaterWithTSFuncOverride(5)
    );
    expectType<Function>(new RepeaterWithTSFuncOverride(5));
    expectType<Object>(new RepeaterWithTSFuncOverride(5));
  });
});

class RepeaterWithOverridenFunc extends (RepeaterWithFuncGeneric as OverrideCall<
  typeof RepeaterWithFuncGeneric
>)<() => number, "go"> {
  constructor() {
    super(23);
  }
  go() {
    return 23;
  }
}

describe("Callable With TS Func Override Generic and custom property (TypeScript)", function () {
  it("is callable", function () {
    expectType<() => number>(new RepeaterWithOverridenFunc());
    // @ts-expect-error wrong type for constructor
    new RepeaterWithOverridenFunc()("testing");
    // @ts-expect-error wrong type for method
    new RepeaterWithOverridenFunc()(5).go(5);
    // Valid propert access.
    new RepeaterWithOverridenFunc().count = 4;
  });

  it("is an object", function () {
    expectType<RepeaterWithOverridenFunc>(new RepeaterWithOverridenFunc());
    expectType<() => number>(new RepeaterWithOverridenFunc().go);
    expectType<() => number>(new RepeaterWithOverridenFunc());
    expectType<(x: number) => number>(new RepeaterWithOverridenFunc().go);
  });

  it("is an instance of Repeater", function () {
    // is not passed because for typescript OverrideCall is other class
    // expectType<typeof RepeaterWithTSFuncOverride>(new RepeaterWithOverridenFunc());
    expectType<RepeaterWithOverridenFunc>(new RepeaterWithOverridenFunc());
    expectType<InstanceType<CallableConstructor>>(
      new RepeaterWithOverridenFunc()
    );
    expectType<Function>(new RepeaterWithOverridenFunc());
    expectType<Object>(new RepeaterWithOverridenFunc());
  });
});
