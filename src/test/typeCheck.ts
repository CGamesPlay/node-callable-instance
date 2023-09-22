import { expectType } from "ts-expect";

import Callable, { CALL, RedefineCall } from "callable-instance";

class RepeaterWithFuncGeneric extends Callable<(x: string) => string, 'go'> {
  constructor(public count: number) {
    super('go');
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
    expectType<(x: string) => string>(new RepeaterWithFuncGeneric(5).go);
  });

  it("is an instance of Repeater", function () {
    expectType<RepeaterWithFuncGeneric>(new RepeaterWithFuncGeneric(5));
    //expectType<typeof CallableInstance>(new Repeater(5));
    expectType<Function>(new RepeaterWithFuncGeneric(5));
    expectType<Object>(new RepeaterWithFuncGeneric(5));
  });
});

interface IRepeaterWithCall {
  [CALL](arg: string): string
}

class RepeaterWithCALL extends Callable<typeof RepeaterWithCALL> {
  constructor(public count: number) {
    super();
  }

  go(arg: string): string {
    return arg.repeat(this.count);
  }

  // [CALL] = '234'
  [CALL](arg: string): string {
    return this.go(arg)
  }
}

class RepeaterWithTest extends Callable<(arg: 'test') => string> {
  constructor(public count: number) {
    super();
  }

  go(arg: string): string {
    return arg.repeat(this.count);
  }

  // [CALL] = '234'
  [CALL](arg: string): string {
    return this.go(arg)
  }
}

const test23 = new RepeaterWithTest(23)
const ggg = test23('test')

const test = new RepeaterWithCALL(4)
test.go('23')
// const TTTTTT = test.CALL
const test2 = test('23')

describe("Callable With CALL Generic (TypeScript)", function () {
  it("is callable", function () {
    expectType<(x: string) => string>(new RepeaterWithCALL(1));
    // @ts-expect-error wrong type for constructor
    new RepeaterWithCALL("testing");
    // @ts-expect-error wrong type for method
    new RepeaterWithCALL(5).go(5);
    // Valid propert access.
    new RepeaterWithCALL(5).count = 4;
  });

  it("is an object", function () {
    expectType<RepeaterWithCALL>(new RepeaterWithCALL(5));
    expectType<(x: string) => string>(new RepeaterWithCALL(5).go);
  });

  it("is an instance of Repeater", function () {
    expectType<RepeaterWithCALL>(new RepeaterWithCALL(5));
    //expectType<typeof CallableInstance>(new Repeater(5));
    expectType<Function>(new RepeaterWithCALL(5));
    expectType<Object>(new RepeaterWithCALL(5));
  });
});

interface IRepeaterWithCallableCall {
  // go: (arg: string): string
  [Callable.CALL](arg: string): string
  // [Callable.CALL]: string

}

class RepeaterWithCallableCALL extends Callable<IRepeaterWithCallableCall> {
  constructor(public count: number) {
    super();
  }

  go(arg: string): string {
    return arg.repeat(this.count);
  }

  [Callable.CALL](arg: string): string {
    return this.go(arg)
  }
}

const check = new RepeaterWithCallableCALL(23)
check('23')

describe("Callable With Callable.CALL Generic (TypeScript)", function () {
  it("is callable", function () {
    expectType<(x: string) => string>(new RepeaterWithCallableCALL(1));
    // @ts-expect-error wrong type for constructor
    new RepeaterWithCallableCALL("testing");
    // @ts-expect-error wrong type for method
    new RepeaterWithCallableCALL(5).go(5);
    // Valid propert access.
    new RepeaterWithCallableCALL(5).count = 4;
  });

  it("is an object", function () {
    expectType<RepeaterWithCallableCALL>(new RepeaterWithCallableCALL(5));
    expectType<(x: string) => string>(new RepeaterWithCallableCALL(5).go);
  });

  it("is an instance of Repeater", function () {
    expectType<RepeaterWithCallableCALL>(new RepeaterWithCallableCALL(5));
    //expectType<typeof CallableInstance>(new Repeater(5));
    expectType<Function>(new RepeaterWithCallableCALL(5));
    expectType<Object>(new RepeaterWithCallableCALL(5));
  });
});

interface IRepeaterWithCustomProperty {
  $call(arg: string): string
}

class RepeaterWithCustomProperty extends Callable<IRepeaterWithCustomProperty, '$call'> {
  constructor(public count: number) {
    super("$call");
  }

  go(arg: string): string {
    return arg.repeat(this.count);
  }

  $call(arg: string): string {
    return this.go(arg)
  }
}

describe("Callable With Custom Property Generic (TypeScript)", function () {
  it("is callable", function () {
    expectType<(x: string) => string>(new RepeaterWithCustomProperty(1));
    // @ts-expect-error wrong type for constructor
    new RepeaterWithCustomProperty("testing");
    // @ts-expect-error wrong type for method
    new RepeaterWithCustomProperty(5).go(5);
    // Valid propert access.
    new RepeaterWithCustomProperty(5).count = 4;
  });

  it("is an object", function () {
    expectType<RepeaterWithCustomProperty>(new RepeaterWithCustomProperty(5));
    expectType<(x: string) => string>(new RepeaterWithCustomProperty(5).go);
  });

  it("is an instance of Repeater", function () {
    expectType<RepeaterWithCustomProperty>(new RepeaterWithCustomProperty(5));
    //expectType<typeof CallableInstance>(new Repeater(5));
    expectType<Function>(new RepeaterWithCustomProperty(5));
    expectType<Object>(new RepeaterWithCustomProperty(5));
  });
});


class TestCallable extends Callable<typeof TestCallable, 'test'>{
  constructor() {
    super('test')
  }

  test() {
    return 'test'
  }
}

const testst = new TestCallable()

class TestCallableExtends extends (TestCallable as RedefineCall)<typeof TestCallableExtends, typeof TestCallable, 'test'>{
  constructor() {
    super()
  }
  test() {
    return 23
  }
}

const newewe = new TestCallableExtends()
newewe.test()
const ttt = newewe()