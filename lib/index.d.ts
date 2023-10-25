declare module "callable-instance" {
  export const CALL: unique symbol;
  export type SCALL = typeof CALL;

  type BaseProperty = symbol | string | number;
  type CustomProperty = Exclude<BaseProperty, SCALL>;

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
    readonly CALL: SCALL;

    new <
      C extends BaseClass | BaseFunc | BaseInterface,
      P extends CustomProperty
    >(
      property: P
    ): ExtractFunc<C, P>;

    new <C extends BaseClass | BaseFunc | BaseInterface>(): ExtractFunc<
      C,
      SCALL
    >;
  }

  // pick for omitting call signature
  type PickProperties<Obj extends Record<BaseProperty, unknown>> = {
    [k in keyof Obj]: Obj[k];
  };

  export type OverrideCall<S extends BaseClass> = {
    new <
      C extends BaseClass | BaseFunc | BaseInterface,
      P extends BaseProperty = SCALL
    >(
      ...args: ConstructorParameters<S>
    ): Omit<PickProperties<InstanceType<S>>, P> & ExtractFunc<C, P>;
  } & S;

  const Callable: CallableConstructor;

  export default Callable;
}
