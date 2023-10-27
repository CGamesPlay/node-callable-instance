import { expectType } from "ts-expect";
import Callable, {
  OverrideCall,
} from "callable-instance";

class MyClass extends Callable<typeof MyClass> {
  constructor() {
    super();
  }
  static staticProperty = "static";
  static readonly staticReadonlyProperty = "staticReadonly" as const;
  public publicProperty = "public";
  public readonly readonlyProperty = "readonly" as const;

  private [Callable.CALL]() {
    return 32;
  }
}

describe("Class that extended Callable (TypeScript)", function () {
  it("has its properties", function () {
    expectType<string>(MyClass.staticProperty);
    MyClass.staticProperty = "test";
    expectType<"staticReadonly">(MyClass.staticReadonlyProperty);
    // MyClass.staticReadonlyProperty = 'test'
    expectType<string>(new MyClass().publicProperty);
    new MyClass().publicProperty = "test";
    expectType<"readonly">(new MyClass().readonlyProperty);
    // new MyClass().readonlyProperty = 'test'
  });
});

class Extended extends (MyClass as OverrideCall<typeof MyClass>)<
  typeof Extended
> {
  static newStaticProperty = "newStatic";
  static readonly newStaticReadonlyProperty = "readonly" as const;
  public newPublicProperty = "public";
  public readonly newReadonlyProperty = "readonly" as const;

  [Callable.CALL]() {
    return "str";
  }
}

describe("Class that extended previous (TypeScript)", function () {
  it("has parent`s properties", function () {
    expectType<string>(Extended.staticProperty);
    Extended.staticProperty = "test";
    expectType<"staticReadonly">(Extended.staticReadonlyProperty);
    // Extended.staticReadonlyProperty = 'test'
    expectType<string>(new Extended().publicProperty);
    new Extended().publicProperty = "test";
    expectType<"readonly">(new Extended().readonlyProperty);
    // new Extended().readonlyProperty = 'rer'
  });
  it("has it`s own properties", function () {
    expectType<string>(Extended.newStaticProperty);
    Extended.newStaticProperty = "test";
    expectType<"readonly">(Extended.newStaticReadonlyProperty);
    // Extended.staticReadonlyProperty = 'test'
    expectType<string>(new Extended().newPublicProperty);
    new Extended().publicProperty = "test";
    expectType<"readonly">(new Extended().newReadonlyProperty);
    // new Extended().readonlyProperty = 'rer'
  });
});
