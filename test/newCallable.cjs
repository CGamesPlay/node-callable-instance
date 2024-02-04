var assert = require("assert");
var Callable = require("callable-instance");

function getTitle(Class, isDefault) {
  return `${Class.name}${isDefault ? " default" : ""} (cjs)`;
}

describe(getTitle(Callable) + " Callable Class Test", function () {
  it("correctly inherits prototypes", function () {
    assert(new Callable() instanceof Object);
    assert(new Callable() instanceof Function);
    assert(new Callable() instanceof Callable);
  });
});

function defaultTest(Class, prototypes = []) {
  return describe(getTitle(Class, true), function () {
    it("is callable", function () {
      assert(typeof new Class("msg") === "function");
    });
    it("correctly inherits prototypes", function () {
      assert(typeof new Class("msg") === "function");
      const defaultPrototypes = [Object, Function, Callable, Class];
      for (let i = 0; i !== defaultPrototypes.length; i++) {
        assert(new Class("msg") instanceof defaultPrototypes[i]);
      }
      for (let i = 0; i !== prototypes.length; i++) {
        assert(new Class("msg") instanceof prototypes[i]);
      }
    });
    it("it's bind method has only Function prototype(returns instance of Function, not Callable)", function () {
      assert(typeof new Class("msg").bind({}) === "function");
      const defaultPrototypes = [Object, Function];
      for (let i = 0; i !== defaultPrototypes.length; i++) {
        assert(new Class("msg").bind({}) instanceof defaultPrototypes[i]);
      }
    });
    it("it's call, apply method is overriden and works exactly like [CALL].apply, [CALL].call", function () {
      assert(typeof new Class("msg").call === "function");
      assert(typeof new Class("msg").apply === "function");
      const defaultPrototypes = [Object, Function];
      for (let i = 0; i !== defaultPrototypes.length; i++) {
        assert(new Class("msg").call instanceof defaultPrototypes[i]);
        assert(new Class("msg").apply instanceof defaultPrototypes[i]);
      }
    });
    it("copies name property from constructor", function () {
      assert(new Class("test").name === Class.name);
    });
    it("has length property set to 0 due to ...args", function () {
      assert(new Class("testing").length === 0);
    });
  });
}

class MyTest extends Callable {
  constructor(message) {
    super("go");
    this.message = message;
  }

  go(arg) {
    return arg || this.message;
  }
}

defaultTest(MyTest);

describe(getTitle(MyTest), function () {
  it("has same return as go method", function () {
    assert(new MyTest("test").go("arg") === new MyTest("test")("arg"));
  });
  it("correctly bounds this", function () {
    const test = new MyTest("testing");
    assert(test() === "testing");
    assert(test.go() === "testing");
    test.message = "new message";
    assert(test() === "new message");
    assert(test.go() === "new message");
  });
  it("has own string tag Callable", function () {
    assert(
      Object.prototype.toString.call(new MyTest("test")) === "[object Callable]"
    );
  });
  it("supports property redefine", function () {
    const obj = new MyTest("testing");
    assert(obj() === obj.go());
    obj.go = () => {
      return null;
    };
    assert(obj() === null);
    assert(obj.go() === null);
    obj.go = function () {
      return MyTest;
    };
    assert(obj() === MyTest);
    assert(obj.go() === MyTest);
  });
});

class MyTestExtended extends MyTest {
  constructor(msg) {
    super();
    this.message = msg;
  }
  go() {
    return this.message;
  }
}

defaultTest(MyTestExtended, [MyTest]);

describe(getTitle(MyTestExtended), function () {
  it("has same return as go method", function () {
    assert(new MyTest("test").go("arg") === new MyTest("test")("arg"));
  });
  it("correctly bounds this", function () {
    const test = new MyTest("testing");
    assert(test() === "testing");
    assert(test.go() === "testing");
    test.message = "new message";
    assert(test() === "new message");
    assert(test.go() === "new message");
  });
  it("has own string tag Callable", function () {
    assert(
      Object.prototype.toString.call(new MyTest("test")) === "[object Callable]"
    );
  });
  it("supports property redefine", function () {
    const obj = new MyTestExtended("testing");
    assert(obj() === obj.go());
    obj.go = () => {
      return null;
    };
    assert(obj() === null);
    assert(obj.go() === null);
    obj.go = function () {
      return MyTestExtended;
    };
    assert(obj() === MyTestExtended);
    assert(obj.go() === MyTestExtended);
  });
});

class MyTestWithCall extends Callable {
  constructor(message) {
    super();
    this.message = message;
  }
  get [Symbol.toStringTag]() {
    return "Redefined";
  }
  go(arg) {
    return arg || this.message;
  }
  [Callable.CALL](arg) {
    return this.go(arg);
  }
}

defaultTest(MyTestWithCall);

describe(getTitle(MyTestWithCall), function () {
  it("has same return as go method", function () {
    assert(new MyTestWithCall("test").go("arg") === new MyTest("test")("arg"));
  });
  it("correctly bounds this", function () {
    const test = new MyTestWithCall("testing");
    assert(test() === "testing");
    assert(test.go() === "testing");
    assert(test[Callable.CALL]() === "testing");
    assert(test[Callable.CALL]() === "testing");
    test.message = "new message";
    assert(test() === "new message");
    assert(test.go() === "new message");
    assert(test[Callable.CALL]() === "new message");
    assert(test[Callable.CALL]() === "new message");
    test.go = () => "different";
    assert(test.go() === "different");
    assert(test[Callable.CALL]() === "different");
    assert(test[Callable.CALL]() === "different");
    test[Callable.CALL] = () => "called";
    assert(test.go() === "different");
    assert(test[Callable.CALL]() === "called");
    assert(test[Callable.CALL]() === "called");
    assert(test.message === "new message");
  });
  it("has own string tag Redefined", function () {
    assert(
      Object.prototype.toString.call(new MyTestWithCall("test")) ===
        "[object Redefined]"
    );
  });
  it("supports property redefine", function () {
    const obj = new MyTestWithCall("testing");
    assert(obj() === obj.go());
    obj.go = () => {
      return null;
    };
    assert(obj() === null);
    assert(obj.go() === null);
    obj.go = function () {
      return MyTestWithCall;
    };
    assert(obj() === MyTestWithCall);
    assert(obj.go() === MyTestWithCall);
    obj[Callable.CALL] = function () {
      return "check";
    };
    assert(obj() === "check");
    assert(obj.go() === MyTestWithCall);
  });
});
