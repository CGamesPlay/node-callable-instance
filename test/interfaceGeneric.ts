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

interface IInterfaceOverload {
  go(x: number): number;
  go(x: string): string;
}

class RepeaterWithInterfaceOverload
  extends Callable<IInterfaceOverload, "go">
  implements IInterfaceOverload
{
  constructor(public count: number) {
    super("go");
  }
  go(arg: number): number;
  go(arg: string): string;
  go(arg: string | number): string | number {
    return arg;
  }
}

describe("Callable With TS Interface Overload Generic and custom property (TypeScript)", function () {
  it("is callable", function () {
    expectType<{ (x: string): string; (x: number): number }>(
      new RepeaterWithInterfaceOverload(1)
    );
    // @ts-expect-error wrong type for constructor
    new RepeaterWithInterfaceOverload("testing");
    new RepeaterWithInterfaceOverload(5).go(5);
    // Valid propert access.
    new RepeaterWithInterfaceOverload(5).count = 4;
  });

  it("is an object", function () {
    expectType<RepeaterWithInterfaceOverload>(
      new RepeaterWithInterfaceOverload(5)
    );
    expectType<(x: string) => string>(new RepeaterWithInterfaceOverload(5).go);
    expectType<{ (x: string): string; (x: number): number }>(
      new RepeaterWithInterfaceOverload(5)
    );
    expectType<(x: string) => string>(() =>
      new RepeaterWithInterfaceOverload(5)("23")
    );
    expectType<(x: number) => number>(() =>
      new RepeaterWithInterfaceOverload(5)(23)
    );
  });

  it("is an instance of Repeater", function () {
    expectType<RepeaterWithInterfaceOverload>(
      new RepeaterWithInterfaceOverload(5)
    );
    expectType<InstanceType<CallableConstructor>>(
      new RepeaterWithInterfaceOverload(5)
    );
    expectType<Function>(new RepeaterWithInterfaceOverload(5));
    expectType<Object>(new RepeaterWithInterfaceOverload(5));
  });
});

interface IInterface {
  go(): number;
}

class RepeaterWithInterfaceOverride
  extends (RepeaterWithInterfaceGeneric as OverrideCall<
    typeof RepeaterWithInterfaceGeneric
  >)<IInterface, "go">
  implements IInterface
{
  constructor() {
    super(23);
  }
  go() {
    return 23;
  }
}

describe("Callable With Interface override Generic and custom property (TypeScript)", function () {
  it("is callable", function () {
    expectType<() => number>(new RepeaterWithInterfaceOverride());
    // @ts-expect-error wrong type for constructor
    new RepeaterWithInterfaceOverride()("testing");
    // @ts-expect-error wrong type for method
    new RepeaterWithInterfaceOverride()(5).go(5);
    // Valid propert access.
    new RepeaterWithInterfaceOverride().count = 4;
  });

  it("is an object", function () {
    expectType<RepeaterWithInterfaceOverride>(
      new RepeaterWithInterfaceOverride()
    );
    expectType<() => number>(new RepeaterWithInterfaceOverride().go);
    expectType<() => number>(new RepeaterWithInterfaceOverride());
    expectType<(x: number) => number>(new RepeaterWithInterfaceOverride().go);
  });

  it("is an instance of Repeater", function () {
    // is not passed because for typescript OverrideCall is other class
    // expectType<typeof RepeaterWithInterfaceOverload>(new RepeaterWithInterfaceOverride());
    expectType<RepeaterWithInterfaceOverride>(
      new RepeaterWithInterfaceOverride()
    );
    expectType<InstanceType<CallableConstructor>>(
      new RepeaterWithInterfaceOverride()
    );
    expectType<Function>(new RepeaterWithInterfaceOverride());
    expectType<Object>(new RepeaterWithInterfaceOverride());
  });
});

interface IGenericInterface {
  go<G extends unknown>(g: G): G;
}

class RepeaterWithGenericInterface
  extends Callable<IGenericInterface, "go">
  implements IGenericInterface
{
  constructor() {
    super("go");
  }
  public count = 23;
  go(g) {
    return g;
  }
}

describe("Callable With Generic Interface Generic and custom property (TypeScript)", function () {
  it("is callable", function () {
    expectType<<G extends unknown>(arg: G) => G>(
      new RepeaterWithGenericInterface()
    );
    new RepeaterWithGenericInterface()("testing");
    // @ts-expect-error wrong type for method
    new RepeaterWithGenericInterface()(5).go(5);
    // Valid propert access.
    new RepeaterWithGenericInterface().count = 4;
  });

  it("is an object", function () {
    expectType<RepeaterWithGenericInterface>(
      new RepeaterWithGenericInterface()
    );
    expectType<<G extends unknown>(arg: G) => G>(
      new RepeaterWithGenericInterface().go
    );
    expectType<<G extends unknown>(arg: G) => G>(
      new RepeaterWithGenericInterface()
    );
    expectType<<G extends unknown>(arg: G) => G>(
      new RepeaterWithGenericInterface().go
    );
  });

  it("is an instance of Repeater", function () {
    // is not passed because for typescript OverrideCall is other class
    expectType<RepeaterWithGenericInterface>(
      new RepeaterWithGenericInterface()
    );
    expectType<InstanceType<CallableConstructor>>(
      new RepeaterWithGenericInterface()
    );
    expectType<Function>(new RepeaterWithGenericInterface());
    expectType<Object>(new RepeaterWithGenericInterface());
  });
});

interface IFuncInterface {
  (arg: "notCallable"): "test";
  go<G extends unknown>(g: G): G;
}

class RepeaterWithFuncInterface
  extends Callable<IFuncInterface, "go">
{
  constructor() {
    super("go");
  }
  public count = 23;
  go(g) {
    return g;
  }
}

describe("Callable With Func Interface Generic", function () {
  it("is callable", function () {
    expectType<<G extends unknown>(arg: G) => G>(
      new RepeaterWithFuncInterface()
    );
    new RepeaterWithFuncInterface()("testing");
    // @ts-expect-error wrong type for method
    new RepeaterWithFuncInterface()(5).go(5);
    // Valid propert access.
    new RepeaterWithFuncInterface().count = 4;
  });

  it("should not use call signature of interface as type", function () {
    expectType<(arg: "notCallable") => "test">(
      // @ts-expect-error wrong type
      new RepeaterWithFuncInterface()
    );
    new RepeaterWithFuncInterface()("testing");
    // @ts-expect-error wrong type for method
    new RepeaterWithFuncInterface()(5).go(5);
    // Valid propert access.
    new RepeaterWithFuncInterface().count = 4;
  });

  it("is an object", function () {
    expectType<RepeaterWithFuncInterface>(
      new RepeaterWithFuncInterface()
    );
    expectType<<G extends unknown>(arg: G) => G>(
      new RepeaterWithFuncInterface().go
    );
    expectType<<G extends unknown>(arg: G) => G>(
      new RepeaterWithFuncInterface()
    );
    expectType<<G extends unknown>(arg: G) => G>(
      new RepeaterWithFuncInterface().go
    );
  });
});
