declare module 'callable-instance' {
    export const CALL: unique symbol;
    export type SCALL = typeof CALL

    type BaseProperty = symbol | string | number;
    type CustomProperty = Exclude<BaseProperty, SCALL>;

    type BaseFunc = (...args: any) => any;
    type BaseClass = abstract new (...args: any) => any;
    type BaseInterface = {
        [k: BaseProperty]: any
    };

    type ExtractFuncFromInterface<I extends BaseInterface, P extends BaseProperty> = I[P] extends BaseFunc ? I[P] : never;

    // to avoid error (recursively references itself as a base type)
    interface CloneFuncFromClass<C extends BaseClass, P extends BaseProperty> {
        (...args: Parameters<InstanceType<C>[P]>): ReturnType<InstanceType<C>[P]>;
    }

    type ExtractFunc<C extends BaseClass | BaseFunc | BaseInterface, P extends BaseProperty> = C extends BaseClass
        ? CloneFuncFromClass<C, P>
        : C extends BaseFunc
        ? C
        : C extends BaseInterface
        ? ExtractFuncFromInterface<C, P>
        : never

    export interface CallableConstructor {
        readonly CALL: SCALL;
        new <C extends BaseClass | BaseFunc | BaseInterface, P extends CustomProperty>(property: P): ExtractFunc<C, P>;
        new <C extends BaseClass | BaseFunc | BaseInterface>(): ExtractFunc<C, SCALL>;
    }

    export type OverrideCall<S extends BaseClass> = {
        new <C extends BaseClass | BaseFunc | BaseInterface, P extends BaseProperty = SCALL>(...args: ConstructorParameters<S>):
            Pick<InstanceType<S>, BaseProperty> & ExtractFunc<C, P>
    } & Omit<S, 'new'>

    const Callable: CallableConstructor;
    export default Callable;
}