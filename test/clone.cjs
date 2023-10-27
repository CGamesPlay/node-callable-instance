const assert = require("assert");
const Callable = require("callable-instance");

function getTitle(name, isDefault) {
  return `Callable.clone() ${name}${isDefault ? " default" : ""} (mjs)`;
}

function isCloned(obj1, obj2) {
  const obj1Descriptors = Object.entries(
    Object.getOwnPropertyDescriptors(obj1)
  );
  const obj2Descriptors = Object.entries(
    Object.getOwnPropertyDescriptors(obj2)
  );
  const obj2DescriptorsObj = Object.getOwnPropertyDescriptors(obj2);

  if (obj1 === obj2 || obj1Descriptors.length !== obj2Descriptors.length) {
    return false;
  }
  if (Object.getPrototypeOf(obj1) !== Object.getPrototypeOf(obj2)) {
    return false;
  }
  if (
    obj1Descriptors.every(([key, value]) => {
      if (obj2DescriptorsObj[key]) {
        if (obj2DescriptorsObj[key].enumerable === value.enumerable) {
          if (obj2DescriptorsObj[key].writable === value.writable) {
            if (obj2DescriptorsObj[key].configurable === value.configurable) {
              if (obj2DescriptorsObj[key].value === value.value) {
                return true;
              }
            }
          }
        }
      }
      return false;
    })
  ) {
    return true;
  }
  return false;
}

const cloneCallable = (source) => Callable.clone(source);

function defaultTest(clone, source, name, prototypes = []) {
  return describe(getTitle(name, true), function () {
    it("is callable", function () {
      assert(typeof clone(source) === "function");
    });
    it("correctly inherits prototypes", function () {
      assert(typeof clone(source) === "function");
      const defaultPrototypes = [Object, Function, Callable];
      for (let i = 0; i !== defaultPrototypes.length; i++) {
        assert(clone(source) instanceof defaultPrototypes[i]);
      }
      for (let i = 0; i !== prototypes.length; i++) {
        assert(clone(source) instanceof defaultPrototypes[i]);
      }
    });
    it("is deepequal to source", function () {
      assert(isCloned(clone(source), source));
    });
    it("copies name property from constructor", function () {
      assert(clone(source).name === "Callable");
    });
    it("has length property set to 0 due to ...args", function () {
      assert(clone(source).length === 0);
    });
    it("has not accessible properties func, property, bound (because it returns this.bound instead of this)", function () {
      assert(clone(source).func === undefined);
      assert(clone(source).bound === undefined);
      assert(
        Object.getOwnPropertyDescriptor(clone(source), "func") === undefined
      );
      assert(
        Object.getOwnPropertyDescriptor(clone(source), "bound") === undefined
      );
    });
  });
}

defaultTest(cloneCallable, new Callable("test"), "clone of regular callable");

defaultTest(
  cloneCallable,
  Callable.makeCallable({
    test: "test",
    [Callable.CALL]() {
      return this.test;
    },
  }),
  "clone of regular callable"
);

class CallableChild extends Callable {
  constructor() {
    super();
  }
}

describe(
  getTitle(
    "clone CallableChild | Array | Object | null | undefined | Function etc",
    true
  ),
  function () {
    it("must throw on creation", function () {
      assert(
        (() => {
          try {
            Callable.clone(new CallableChild());
            return false;
          } catch (e) {
            if (
              e.message ===
              "Callable.clone accepts only direct instance of Callable. e.g created by Callable.makeCallable or with new Callable()"
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
            Callable.clone({});
            return false;
          } catch (e) {
            if (
              e.message ===
              "Callable.clone accepts only direct instance of Callable. e.g created by Callable.makeCallable or with new Callable()"
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
            Callable.clone(null);
            return false;
          } catch (e) {
            if (
              e.message ===
              "Callable.clone accepts only direct instance of Callable. e.g created by Callable.makeCallable or with new Callable()"
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
            Callable.clone(undefined);
            return false;
          } catch (e) {
            if (
              e.message ===
              "Callable.clone accepts only direct instance of Callable. e.g created by Callable.makeCallable or with new Callable()"
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
            Callable.clone([]);
            return false;
          } catch (e) {
            if (
              e.message ===
              "Callable.clone accepts only direct instance of Callable. e.g created by Callable.makeCallable or with new Callable()"
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
            Callable.clone(function () {});
            return false;
          } catch (e) {
            if (
              e.message ===
              "Callable.clone accepts only direct instance of Callable. e.g created by Callable.makeCallable or with new Callable()"
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
            Callable.clone(23);
            return false;
          } catch (e) {
            if (
              e.message ===
              "Callable.clone accepts only direct instance of Callable. e.g created by Callable.makeCallable or with new Callable()"
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
            Callable.clone("123");
            return false;
          } catch (e) {
            if (
              e.message ===
              "Callable.clone accepts only direct instance of Callable. e.g created by Callable.makeCallable or with new Callable()"
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
