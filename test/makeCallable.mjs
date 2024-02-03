import assert from "assert";
import Callable from "callable-instance";

function getTitle(name, isDefault) {
  return `Callable.from() ${name}${isDefault ? " default" : ""} (mjs)`;
}

const createRegular = () =>
  Callable.from({
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

const createFromCallableChild = () => Callable.from(new CallableChild());

class ObjectChild extends Object {
  constructor() {
    super();
  }
  [Callable.CALL]() {
    return "ObjectChildCall";
  }
}

const createFromObjectChild = () => Callable.from(new ObjectChild());

describe(
  getTitle(
    "Callable.from with CallableChild | Array | ObjectChild | null | undefined | Function argument",
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
              "Callable.from accepts only regular object or direct instance of Callable"
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
              "Callable.from accepts only regular object or direct instance of Callable"
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
            Callable.from(null);
            return false;
          } catch (e) {
            if (
              e.message ===
              "Callable.from accepts only regular object or direct instance of Callable"
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
            Callable.from(undefined);
            return false;
          } catch (e) {
            if (
              e.message ===
              "Callable.from accepts only regular object or direct instance of Callable"
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
            Callable.from([]);
            return false;
          } catch (e) {
            if (
              e.message ===
              "Callable.from accepts only regular object or direct instance of Callable"
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
            Callable.from(function () {});
            return false;
          } catch (e) {
            if (
              e.message ===
              "Callable.from accepts only regular object or direct instance of Callable"
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
            Callable.from(23);
            return false;
          } catch (e) {
            if (
              e.message ===
              "Callable.from accepts only regular object or direct instance of Callable"
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
            Callable.from("123");
            return false;
          } catch (e) {
            if (
              e.message ===
              "Callable.from accepts only regular object or direct instance of Callable"
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
