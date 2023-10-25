import { expectType } from "ts-expect";
import Callable, { CALL, CallableConstructor, OverrideCall } from "callable-instance";

// TESTS FOR CLASS-TYPE GENERICS

class RepeaterWithClassGeneric extends Callable<typeof RepeaterWithClassGeneric, 'go'>{
    constructor(public count: number) {
        super('go');
    }

    go(arg: string): string {
        return arg.repeat(this.count);
    }
}

describe("Callable With Class Generic and custom property (TypeScript)", function () {

    it("is callable", function () {
        expectType<(x: string) => string>(new RepeaterWithClassGeneric(1));
        // @ts-expect-error wrong type for constructor
        new RepeaterWithClassGeneric("testing");
        // @ts-expect-error wrong type for method
        new RepeaterWithClassGeneric(5).go(5);
        // Valid propert access.
        new RepeaterWithClassGeneric(5).count = 4;
    });

    it("is an object", function () {
        expectType<RepeaterWithClassGeneric>(new RepeaterWithClassGeneric(5));
        expectType<(x: string) => string>(new RepeaterWithClassGeneric(5));
        expectType<(x: string) => string>(new RepeaterWithClassGeneric(5).go);
    });

    it("is an instance of Repeater", function () {
        expectType<RepeaterWithClassGeneric>(new RepeaterWithClassGeneric(5));
        expectType<InstanceType<CallableConstructor>>(new RepeaterWithClassGeneric(5));
        expectType<Function>(new RepeaterWithClassGeneric(5));
        expectType<Object>(new RepeaterWithClassGeneric(5));
    });
});


// class RepeaterWithTSClassOverride extends Callable<typeof RepeaterWithTSClassOverride, 'go'> {
//     constructor(public count: number) {
//         super('go');
//     }
//     go(arg: string): string
//     go(arg: number): number
//     go(arg: string | number): string | number {
//         return arg
//         // return arg.repeat(this.count);
//     }
// }

//// override is not supported in class generic

// describe("Callable With TS Class Overload Generic and custom property (TypeScript)", function () {
//     it("is callable", function () {
//         expectType<{ (x: string): string, (x: number): number }>(new RepeaterWithTSClassOverride(1));
//         // @ts-expect-error wrong type for constructor
//         new RepeaterWithTSClassOverride("testing");
//         new RepeaterWithTSClassOverride(5).go(5);
//         // Valid propert access.
//         new RepeaterWithTSClassOverride(5).count = 4;
//     });

//     it("is an object", function () {
//         expectType<RepeaterWithTSClassOverride>(new RepeaterWithTSClassOverride(5));
//         expectType<(x: string) => string>(new RepeaterWithTSClassOverride(5).go);
//         expectType<{ (x: string): string, (x: number): number }>(new RepeaterWithTSClassOverride(5))
//         expectType<(x: string) => string>(() => new RepeaterWithTSClassOverride(5)('23'))
//         expectType<(x: number) => number>(() => new RepeaterWithTSClassOverride(5)(23))

//     });

//     it("is an instance of Repeater", function () {
//         expectType<RepeaterWithTSClassOverride>(new RepeaterWithTSClassOverride(5));
//         expectType<InstanceType<CallableConstructor>>(new RepeaterWithTSClassOverride(5));
//         expectType<Function>(new RepeaterWithTSClassOverride(5));
//         expectType<Object>(new RepeaterWithTSClassOverride(5));
//     });
// });



class RepeaterWithClassOverride extends (RepeaterWithClassGeneric as OverrideCall<typeof RepeaterWithClassGeneric>)<typeof RepeaterWithClassOverride, 'go'>{
    constructor() {
        super(23)
    }
    go() {
        return 23
    }
}

describe("Callable With Class Override Generic and custom property (TypeScript)", function () {
    it("is callable", function () {
        expectType<() => number>(new RepeaterWithClassOverride());
        // @ts-expect-error wrong type for constructor
        new RepeaterWithClassOverride()("testing");
        // @ts-expect-error wrong type for method
        new RepeaterWithClassOverride()(5).go(5);
        // Valid propert access.
        new RepeaterWithClassOverride().count = 4;
    });

    it("is an object", function () {
        expectType<RepeaterWithClassOverride>(new RepeaterWithClassOverride());
        expectType<() => number>(new RepeaterWithClassOverride().go);
        expectType<() => number>(new RepeaterWithClassOverride())
        expectType<(x: number) => number>(new RepeaterWithClassOverride().go)

    });

    it("is an instance of Repeater", function () {
        // is not passed because for typescript OverrideCall is other class
        // expectType<typeof RepeaterWithTSClassOverride>(new RepeaterWithClassOverride());
        expectType<RepeaterWithClassOverride>(new RepeaterWithClassOverride());
        expectType<InstanceType<CallableConstructor>>(new RepeaterWithClassOverride());
        expectType<Function>(new RepeaterWithClassOverride());
        expectType<Object>(new RepeaterWithClassOverride());
    });
});