# node-callable-instance

[![Build Status](https://img.shields.io/github/actions/workflow/status/CGamesPlay/node-callable-instance/node.js.yml?branch=master)](https://github.com/CGamesPlay/node-callable-instance/actions/workflows/node.js.yml) [![Download Size](https://img.shields.io/bundlephobia/min/callable-instance.svg?style=flat)](https://bundlephobia.com/package/callable-instance@latest) [![dependencies](https://img.shields.io/badge/dependencies-none-brightgreen)](https://www.npmjs.com/package/callable-instance?activeTab=dependencies) [![npm](https://img.shields.io/npm/v/callable-instance)](https://www.npmjs.com/package/callable-instance) [![npm](https://img.shields.io/npm/dw/callable-instance)](https://www.npmjs.com/package/callable-instance)

This module allows you to create an ES6 `class` or regular JS `Object` that is callable as a function.

## Installation

```
npm install callable-instance
```

## Usage

In the following example, we will create an `ExampleClass` class. The instances have all of the normal properties and methods, but are actually functions as well.

```javascript
import Callable from "callable-instance";
// If you aren't using ES modules, you can use require:
// var Callable = require("callable-instance");

class ExampleClass extends Callable {
  constructor() {
    super();
  }
  [Callable.CALL](arg) {
    return arg
  }
}

var test = new ExampleClass();
// Invoke the method normally
test[Callable.CALL]();
// Call the instance itself, redirects to [Callable.CALL]
test();
```
> **_NOTE:_**  Usage of custom method name is also supported.

```javascript
class ExampleClassWithCustomMethodName extends Callable {
    constructor(){
        // in super provide object method`s name which will be used when calling object
        super('myMethod')
    }
    myMethod(arg){
        return arg
    }
}
```

### Other Usage Variant
In the next example, we will create `callableObject` using Callable.from.

```javascript
import Callable from "callable-instance";
// Callable.from creates new callable object with all the properties from source object
const callableObject = Callable.from( {
	test: "test",
	[ Callable.CALL ]() {
		return this.test;
	},
} );

// cloning using spread operator + Callable.from. (spread looses call signature so it is important to call Callable.from again)
const cloned = Callable.from( { ...callableObject } );

// cloning using Callable.clone (accepts only direct instance of Callable. e.g. made with Callable.from)
const cloned2 = Callable.clone( callableObject );
```
> **_NOTE:_**  Usage of custom method name is also supported.

```javascript
import Callable from "callable-instance";

const callableObject = Callable.from( {
	test: "test",
	getTest() {
		return this.test;
	},
}, "getTest" ); // second parameter is optional method`s name which will be used when calling object

// but it is important to also provide method property when cloning using spread + Callable.from
const cloned = Callable.from( { ...callableObject }, "getTest" );

// Callable.clone does not have this issue
const cloned2 = Callable.clone( callableObject );
```

## Typescript


`Callable` has full typescript support.

1. **Using interface**

```typescript
// Callable has 2 generics
// 1st is for class | interface | function (for extracting type of call signature)
// 2nd optional generic is for method name (string | symbol | number) which will be used as type of call signature from 1st generic (defaults to Callable.CALL)

interface IExampleClass {
  // interface type will provide actual type of the function without limitations
  [Callable.CALL](arg: string): string
}
// implements is optional but advised https://www.typescriptlang.org/docs/handbook/interfaces.html
class ExampleClass extends Callable<IExampleClass> implements IExampleClass {
    constructor(){
        super()
    }
    [Callable.CALL](arg: string){
        return arg
    }
}
```

2. **Using function type**
```typescript
class ExampleClass extends Callable<(arg: string) => string> {
    constructor(){
        super()
    }
    [Callable.CALL](arg: string){
        return arg
    }
}
```

3. **Using class type**
```typescript
// easiest way for typing Callable
class ExampleClass extends Callable<typeof ExampleClass> {
    constructor(){
        super()
    }
    [Callable.CALL](arg: string){
        return arg
    }
}
```
> **_NOTE:_**  For function overload or generics use Interface or Function variant.

### **Override Call**

Due to typescript limitations module also provides OverrideCall type.
It can be used to override call signature in child classes.

```typescript
// Override call has 3 generics but must be written only in one way
// class Child extends (Parent as OverrideCall<typeof Parent>)<Child, propertyName>
// 1st generic is Parent. Can be only class.
// 2nd generic is Child. Can be interface | class | function
// 3rd optional generic is propertyName can be string | symbol | number. defaults to Callable.CALL

// call signature is (() => string)
class ExampleClass extends Callable<() => string> {
  constructor() {
    super();
  }
  [Callable.CALL]() {
    return "test";
  }
}

// overriding call signature to (() => number)
class ExampleClassChild extends (ExampleClass as OverrideCall<typeof ExampleClass>)<() => number> {
  constructor(){
    super();
  }

  [Callable.CALL](){
    return 100
  }
}
```

## Inherited Properties

All instances of CallableMethod are also an instances of [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function), and have all of Function's properties.

`Callable` behaves exactly like the method specified in constructor but they are not equal. `Callable` just creates an alias to the function. It's `bind`, `apply`, `call` methods behaves exactly like used function's methods. So it is safe to use `call`, `apply` or `bind` on `Callable` directly. `test.call(test2, ...args)` will return `test.instanceMethod.call(test2, ...args)`.

Libraries that accept functions will expect that they behave as Function objects do. For example, if you alter the semantics of the call or apply methods, library code may fail to work with your callable instance. This can also cause problems if your derived class wants to have a `name` or `length` property, which are built-in properties and not configurable by default. You can have your class disable the built-in descriptors of these properties to make them available for your use.

```javascript
var test = new ExampleClass();
console.log(test.name); // Will print 'ExampleClass' (constructor.name is used by default)
test.name = "hello!";
console.log(test.name); // Will print 'ExampleClass'

class NameableClass extends Callable {
  constructor() {
    super("instanceMethod");
    Object.defineProperty(this, "name", {
      value: void 0,
      enumerable: true,
      writeable: true,
      configurable: true,
    });
  }

  instanceMethod() {
    console.log(this.name);
  }
}

test = new NameableClass();
test.name = "hello!";
console.log(test.name); // Will print 'hello!'
```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Credits

Information for the implementation came from [this StackOverflow answer](http://stackoverflow.com/a/36871498/123899).

## License

Distributed under the MIT license.
