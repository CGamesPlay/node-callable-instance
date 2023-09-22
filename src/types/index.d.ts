declare module 'callable-instance' {
    export const CALL: unique symbol;

    type BaseProperty = symbol | string;
    type CustomProperty = Exclude<BaseProperty, typeof CALL>;

    type BaseFunc = (...args: any) => any;
    type BaseClass = abstract new (...args: any) => any;
    type BaseInterface = Record<BaseProperty, any>;

    type ExtractFuncFromInterface<I extends BaseInterface, P extends BaseProperty> = I[P] extends BaseFunc ? I[P] : never;

    interface CloneFuncFromClass<C extends BaseClass, P extends BaseProperty> {
        (...args: Parameters<InstanceType<C>[P]>): ReturnType<InstanceType<C>[P]>;
    }

    type ExtractFunc<C extends BaseClass | BaseFunc | BaseInterface, P extends BaseProperty> = C extends BaseFunc
        ? C
        : C extends BaseClass
        ? CloneFuncFromClass<C, P>
        : ExtractFuncFromInterface<C, P>;

    interface CallableConstructor {
        readonly CALL: typeof CALL;
        new <C extends BaseClass | BaseFunc | BaseInterface, P extends CustomProperty>(property: P): ExtractFunc<C, P>;
        new <C extends BaseClass | BaseFunc | BaseInterface>(): ExtractFunc<C, typeof CALL>;
    }

    export interface RedefineCall {
        new <Parent extends BaseClass | BaseFunc | BaseInterface, C extends BaseClass, P extends BaseProperty = typeof CALL>(...args: ConstructorParameters<C>): Omit<InstanceType<C>, P> & ExtractFunc<Parent, P>;
    }

    const Callable: CallableConstructor;
    export default Callable;
}