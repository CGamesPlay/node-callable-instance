import assert from "assert";
import Callable from "callable-instance";

function getTitle(name, isDefault) {
  return `Callable.makeCallable() ${name}${isDefault ? " default" : ""} (mjs)`;
}

const createRegular = () =>
  Callable.makeCallable({
    test: "test",
    [Callable.CALL]() {
      return this.test;
    },
  });

function defaultTest(create, name, prototypes = []) {
  return describe(getTitle(name, true), function () {
    it("is callable", function () {
      assert(typeof create() === "function");
    });
    it("correctly inherits prototypes", function () {
      assert(typeof create() === "function");
      const defaultPrototypes = [Object, Function, Callable];
      for (let i = 0; i !== defaultPrototypes.length; i++) {
        assert(create() instanceof defaultPrototypes[i]);
      }
      for (let i = 0; i !== prototypes.length; i++) {
        assert(create() instanceof defaultPrototypes[i]);
      }
    });
    it("copies name property from constructor", function () {
      assert(create().name === "Callable");
    });
    it("has length property set to 0 due to ...args", function () {
      assert(create().length === 0);
    });
    it("has not accessible properties func, property, bound (because it returns this.bound instead of this)", function () {
      assert(create().func === undefined);
      assert(create().bound === undefined);
      assert(Object.getOwnPropertyDescriptor(create(), "func") === undefined);
      assert(Object.getOwnPropertyDescriptor(create(), "bound") === undefined);
    });
  });
}

defaultTest(createRegular, "creation from regular object");

const createFromCallable = () => createRegular(createRegular());

defaultTest(createFromCallable, "creation from Callable");

class CallableChild extends Callable {
  constructor() {
    super();
  }
  [Callable.CALL]() {
    return "CallableChildCall";
  }
}

const createFromCallableChild = () =>
  Callable.makeCallable(new CallableChild());

class ObjectChild extends Object {
  constructor() {
    super();
  }
  [Callable.CALL]() {
    return "ObjectChildCall";
  }
}

const createFromObjectChild = () => Callable.makeCallable(new ObjectChild());

describe(
  getTitle(
    "makeCallable from CallableChild | Array | ObjectChild | null | undefined | Function etc",
    true
  ),
  function () {
    it("must throw on creation", function () {
      assert(
        (() => {
          try {
            createFromCallableChild();
            return false;
          } catch (e) {
            if (
              e.message ===
              "Callable.makeCallable accepts only regular object or direct instance of Callable"
            ) {
              return true;
            }
            return false;
          }
        })()
      );
      assert(
        (() => {
          try {
            createFromObjectChild();
            return false;
          } catch (e) {
            if (
              e.message ===
              "Callable.makeCallable accepts only regular object or direct instance of Callable"
            ) {
              return true;
            }
            return false;
          }
        })()
      );
      assert(
        (() => {
          try {
            Callable.makeCallable(null);
            return false;
          } catch (e) {
            if (
              e.message ===
              "Callable.makeCallable accepts only regular object or direct instance of Callable"
            ) {
              return true;
            }
            return false;
          }
        })()
      );
      assert(
        (() => {
          try {
            Callable.makeCallable(undefined);
            return false;
          } catch (e) {
            if (
              e.message ===
              "Callable.makeCallable accepts only regular object or direct instance of Callable"
            ) {
              return true;
            }
            return false;
          }
        })()
      );
      assert(
        (() => {
          try {
            Callable.makeCallable([]);
            return false;
          } catch (e) {
            if (
              e.message ===
              "Callable.makeCallable accepts only regular object or direct instance of Callable"
            ) {
              return true;
            }
            return false;
          }
        })()
      );
      assert(
        (() => {
          try {
            Callable.makeCallable(function () {});
            return false;
          } catch (e) {
            if (
              e.message ===
              "Callable.makeCallable accepts only regular object or direct instance of Callable"
            ) {
              return true;
            }
            return false;
          }
        })()
      );
      assert(
        (() => {
          try {
            Callable.makeCallable(23);
            return false;
          } catch (e) {
            if (
              e.message ===
              "Callable.makeCallable accepts only regular object or direct instance of Callable"
            ) {
              return true;
            }
            return false;
          }
        })()
      );
      assert(
        (() => {
          try {
            Callable.makeCallable("123");
            return false;
          } catch (e) {
            if (
              e.message ===
              "Callable.makeCallable accepts only regular object or direct instance of Callable"
            ) {
              return true;
            }
            return false;
          }
        })()
      );
    });
  }
);
