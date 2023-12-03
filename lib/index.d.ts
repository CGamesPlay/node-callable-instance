declare module "callable-instance" {
  const CALL: unique symbol;

  type BaseProperty = symbol | string | number;
  type CustomProperty = Exclude<BaseProperty, typeof CALL>;

  type BaseFunc = (...args: any) => any;
  type BaseClass = abstract new (...args: any) => any;
  type BaseInterface = {
    [k: BaseProperty]: any;
  };

  type ExtractFuncFromInterface<
    I extends BaseInterface,
    P extends BaseProperty
  > = I[P] extends BaseFunc ? I[P] : never;

  interface CloneFuncFromClass<C extends BaseClass, P extends BaseProperty> {
    /**
     * For TS generics and function overload support use interface or function type for Callable
     */
    (...args: Parameters<InstanceType<C>[P]>): ReturnType<InstanceType<C>[P]>;
  }
  type ExtractFunc<
    C extends BaseClass | BaseFunc | BaseInterface,
    P extends BaseProperty
  > = C extends BaseClass
    ? CloneFuncFromClass<C, P>
    : C extends BaseFunc
    ? C
    : C extends BaseInterface
    ? ExtractFuncFromInterface<C, P>
    : never;

  export interface CallableConstructor {
    get CALL(): typeof CALL;

    makeCallable<I extends BaseInterface, P extends CustomProperty>(
      object: I,
      property: P
    ): PickProperties<I> & ExtractFuncFromInterface<I, P>;
    makeCallable<I extends BaseInterface>(
      object: I
    ): PickProperties<I> & ExtractFuncFromInterface<I, typeof CALL>;

    clone<C extends BaseInterface & BaseFunc>(callableObject: C): C;

    new <
      C extends BaseClass | BaseFunc | BaseInterface,
      P extends CustomProperty
    >(
      property: P
    ): ExtractFunc<C, P>;

    new <C extends BaseClass | BaseFunc | BaseInterface>(): ExtractFunc<
      C,
      typeof CALL
    >;
  }

  type PickProperties<Obj extends Record<BaseProperty, unknown>> = {
    [k in keyof Obj]: Obj[k];
  };

  export type OverrideCall<S extends BaseClass> = {
    new <
      C extends BaseClass | BaseFunc | BaseInterface,
      P extends BaseProperty = typeof CALL
    >(
      ...args: ConstructorParameters<S>
    ): Omit<PickProperties<InstanceType<S>>, P> & ExtractFunc<C, P>;
  } & S;

  const Callable: CallableConstructor;

  export default Callable;
}
