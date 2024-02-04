import { expectType } from "ts-expect";
import Callable, { OverrideCall } from "callable-instance";

// TESTS FOR FUNCTION-TYPE GENERICS
class RepeaterWithFuncGeneric extends Callable<(x: string) => string, "go"> {
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
    expectType<Callable>(new RepeaterWithFuncGeneric(5));
    expectType<Function>(new RepeaterWithFuncGeneric(5));
    expectType<Object>(new RepeaterWithFuncGeneric(5));
  });
});

interface IFuncOverload {
  (x: number): number;
  (x: string): string;
}

class RepeaterWithFuncOverload extends Callable<IFuncOverload, "go"> {
  constructor(public count: number) {
    super("go");
  }

  go(arg: string): string {
    return arg.repeat(this.count);
  }
}

describe("Callable With Func overload Generic and custom property (TypeScript)", function () {
  it("is callable", function () {
    expectType<{ (x: string): string; (x: number): number }>(
      new RepeaterWithFuncOverload(1)
    );
    // @ts-expect-error wrong type for constructor
    new RepeaterWithFuncOverload("testing");
    // @ts-expect-error wrong type for method
    new RepeaterWithFuncOverload(5).go(5);
    // Valid propert access.
    new RepeaterWithFuncOverload(5).count = 4;
  });

  it("is an object", function () {
    expectType<RepeaterWithFuncOverload>(new RepeaterWithFuncOverload(5));
    expectType<(x: string) => string>(new RepeaterWithFuncOverload(5).go);
    expectType<{ (x: string): string; (x: number): number }>(
      new RepeaterWithFuncOverload(5)
    );
    expectType<(x: string) => string>(() =>
      new RepeaterWithFuncOverload(5)("23")
    );
    expectType<(x: number) => number>(() =>
      new RepeaterWithFuncOverload(5)(23)
    );
  });

  it("is an instance of Repeater", function () {
    expectType<RepeaterWithFuncOverload>(new RepeaterWithFuncOverload(5));
    expectType<Callable>(new RepeaterWithFuncOverload(5));
    expectType<Function>(new RepeaterWithFuncOverload(5));
    expectType<Object>(new RepeaterWithFuncOverload(5));
  });
});

class RepeaterWithFuncOverride extends (RepeaterWithFuncGeneric as OverrideCall<
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
    expectType<() => number>(new RepeaterWithFuncOverride());
    // @ts-expect-error wrong type for constructor
    new RepeaterWithFuncOverride()("testing");
    // @ts-expect-error wrong type for method
    new RepeaterWithFuncOverride()(5).go(5);
    // Valid propert access.
    new RepeaterWithFuncOverride().count = 4;
  });

  it("is an object", function () {
    expectType<RepeaterWithFuncOverride>(new RepeaterWithFuncOverride());
    expectType<() => number>(new RepeaterWithFuncOverride().go);
    expectType<() => number>(new RepeaterWithFuncOverride());
    expectType<(x: number) => number>(new RepeaterWithFuncOverride().go);
  });

  it("is an instance of Repeater", function () {
    // is not passed because for typescript OverrideCall is other class
    expectType<RepeaterWithFuncOverride>(new RepeaterWithFuncOverride());
    expectType<Callable>(new RepeaterWithFuncOverride());
    expectType<Function>(new RepeaterWithFuncOverride());
    expectType<Object>(new RepeaterWithFuncOverride());
  });
});

type GenericFunc = <G extends unknown>(arg: G) => G;

class RepeaterWithGenericFunc extends Callable<GenericFunc> {
  constructor(public count: number) {
    super();
  }
  [Callable.CALL]<G>(arg: G) {
    return arg;
  }
}

describe("Callable With Generic Function Generic and custom property (TypeScript)", function () {
  it("is callable", function () {
    expectType<<G extends unknown, b extends undefined>(arg: G, B: b) => G>(
      new RepeaterWithGenericFunc(23)
    );
    new RepeaterWithGenericFunc(2)("testing");
    // @ts-expect-error wrong type for method
    new RepeaterWithGenericFunc()(5).go(5);
    // Valid propert access.
    new RepeaterWithGenericFunc(2).count = 4;
  });

  it("is an object", function () {
    expectType<RepeaterWithGenericFunc>(new RepeaterWithGenericFunc(23));
    expectType<<G extends unknown>(arg: G) => G>(
      new RepeaterWithGenericFunc(23)[Callable.CALL]
    );
    expectType<<G extends unknown>(arg: G) => G>(
      new RepeaterWithGenericFunc(23)
    );
    expectType<(x: number) => number>(
      new RepeaterWithGenericFunc(23)[Callable.CALL]
    );
  });

  it("is an instance of Repeater", function () {
    // is not passed because for typescript OverrideCall is other class
    expectType<RepeaterWithGenericFunc>(new RepeaterWithGenericFunc(23));
    expectType<Callable>(new RepeaterWithGenericFunc(23));
    expectType<Function>(new RepeaterWithGenericFunc(23));
    expectType<Object>(new RepeaterWithGenericFunc(23));
  });
});
