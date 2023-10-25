import { expectType } from "ts-expect";
import Callable, { CallableConstructor, OverrideCall } from "callable-instance";

// TESTS FOR INTERFACE-TYPE GENERICS
interface IRepeaterWithInterfaceGeneric {
  go: (x: string) => string;
}

class RepeaterWithInterfaceGeneric
  extends Callable<IRepeaterWithInterfaceGeneric, "go">
  implements IRepeaterWithInterfaceGeneric
{
  constructor(public count: number) {
    super("go");
  }

  go(arg: string): string {
    return arg.repeat(this.count);
  }
}

describe("Callable With Interface Generic and custom property (TypeScript)", function () {
  it("is callable", function () {
    expectType<(x: string) => string>(new RepeaterWithInterfaceGeneric(1));
    // @ts-expect-error wrong type for constructor
    new RepeaterWithInterfaceGeneric("testing");
    // @ts-expect-error wrong type for method
    new RepeaterWithInterfaceGeneric(5).go(5);
    // Valid propert access.
    new RepeaterWithInterfaceGeneric(5).count = 4;
  });

  it("is an object", function () {
    expectType<RepeaterWithInterfaceGeneric>(
      new RepeaterWithInterfaceGeneric(5)
    );
    expectType<(x: string) => string>(new RepeaterWithInterfaceGeneric(5));
    expectType<(x: string) => string>(new RepeaterWithInterfaceGeneric(5).go);
  });

  it("is an instance of Repeater", function () {
    expectType<RepeaterWithInterfaceGeneric>(
      new RepeaterWithInterfaceGeneric(5)
    );
    expectType<InstanceType<CallableConstructor>>(
      new RepeaterWithInterfaceGeneric(5)
    );
    expectType<Function>(new RepeaterWithInterfaceGeneric(5));
    expectType<Object>(new RepeaterWithInterfaceGeneric(5));
  });
});

interface FuncOverride {
  go(x: number): number;
  go(x: string): string;
}

class RepeaterWithTSInterfaceOverride
  extends Callable<FuncOverride, "go">
  implements FuncOverride
{
  constructor(public count: number) {
    super("go");
  }
  go(arg: number): number;
  go(arg: string): string;
  go(arg: string | number): string | number {
    return arg;
    // return arg.repeat(this.count);
  }
}

describe("Callable With TS Interface Override Generic and custom property (TypeScript)", function () {
  it("is callable", function () {
    expectType<{ (x: string): string; (x: number): number }>(
      new RepeaterWithTSInterfaceOverride(1)
    );
    // @ts-expect-error wrong type for constructor
    new RepeaterWithTSInterfaceOverride("testing");
    new RepeaterWithTSInterfaceOverride(5).go(5);
    // Valid propert access.
    new RepeaterWithTSInterfaceOverride(5).count = 4;
  });

  it("is an object", function () {
    expectType<RepeaterWithTSInterfaceOverride>(
      new RepeaterWithTSInterfaceOverride(5)
    );
    expectType<(x: string) => string>(
      new RepeaterWithTSInterfaceOverride(5).go
    );
    expectType<{ (x: string): string; (x: number): number }>(
      new RepeaterWithTSInterfaceOverride(5)
    );
    expectType<(x: string) => string>(() =>
      new RepeaterWithTSInterfaceOverride(5)("23")
    );
    expectType<(x: number) => number>(() =>
      new RepeaterWithTSInterfaceOverride(5)(23)
    );
  });

  it("is an instance of Repeater", function () {
    expectType<RepeaterWithTSInterfaceOverride>(
      new RepeaterWithTSInterfaceOverride(5)
    );
    expectType<InstanceType<CallableConstructor>>(
      new RepeaterWithTSInterfaceOverride(5)
    );
    expectType<Function>(new RepeaterWithTSInterfaceOverride(5));
    expectType<Object>(new RepeaterWithTSInterfaceOverride(5));
  });
});

interface OverridenType {
  go(): number;
}

class RepeaterWithOverridenFunc
  extends (RepeaterWithInterfaceGeneric as OverrideCall<
    typeof RepeaterWithInterfaceGeneric
  >)<OverridenType, "go">
  implements OverridenType
{
  constructor() {
    super(23);
  }
  go() {
    return 23;
  }
}

describe("Callable With Func Overriding Generic and custom property (TypeScript)", function () {
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
    // expectType<typeof RepeaterWithTSInterfaceOverride>(new RepeaterWithOverridenFunc());
    expectType<RepeaterWithOverridenFunc>(new RepeaterWithOverridenFunc());
    expectType<InstanceType<CallableConstructor>>(
      new RepeaterWithOverridenFunc()
    );
    expectType<Function>(new RepeaterWithOverridenFunc());
    expectType<Object>(new RepeaterWithOverridenFunc());
  });
});
