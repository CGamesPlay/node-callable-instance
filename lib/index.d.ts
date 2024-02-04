declare const CALL: unique symbol;

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

/**
 * call signature in interface type e.g {(...args: any): any} is considered function type
 *
 * call signature in interface type combined with other properties e.g {(...args: any): any, property: any} is considered interface type.
 */
type ExtractFuncFromFuncType<F extends BaseFunc, P extends BaseProperty> = Omit<
  F,
  never
> extends Record<BaseProperty, never>
  ? F
  : ExtractFuncFromInterface<F, P>;

interface CloneFuncFromClass<C extends BaseClass, P extends BaseProperty> {
  /**
   * For TS generics and function overload support use interface or function type for Callable
   */
  (...args: Parameters<InstanceType<C>[P]>): ReturnType<InstanceType<C>[P]>;
  prototype: any;
}

declare const CALLABLE_TS_KEY: unique symbol;

type ExtractFunc<
  C extends BaseClass | BaseFunc | BaseInterface,
  P extends BaseProperty
> = C extends BaseClass
  ? CloneFuncFromClass<C, P> & { [CALLABLE_TS_KEY]: never }
  : C extends BaseFunc
  ? ExtractFuncFromFuncType<C, P> & { [CALLABLE_TS_KEY]: never }
  : C extends BaseInterface
  ? ExtractFuncFromInterface<C, P> & { [CALLABLE_TS_KEY]: never }
  : never;

type PickProperties<Obj extends Record<BaseProperty, unknown>> = {
  [k in keyof Obj]: Obj[k];
};

interface CallableConstructor {
  get CALL(): typeof CALL;

  from<I extends BaseInterface, P extends CustomProperty>(
    callableLike: I,
    property: P
  ): PickProperties<I> & ExtractFuncFromInterface<I, P>;

  from<I extends BaseInterface>(
    callableLike: I
  ): PickProperties<I> & ExtractFuncFromInterface<I, typeof CALL>;

  clone<C extends BaseInterface & BaseFunc>(callable: C): C;

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

  readonly prototype: Callable;
}

export = Callable;

declare const Callable: CallableConstructor;

interface Callable extends Function {
  /**
   * Forcing typescript to distinguish Function and Callable types
   */
  [CALLABLE_TS_KEY]: never;
}

declare namespace Callable {
  export type OverrideCall<S extends BaseClass> = {
    new <
      C extends BaseClass | BaseFunc | BaseInterface,
      P extends BaseProperty = typeof CALL
    >(
      ...args: ConstructorParameters<S>
    ): Omit<PickProperties<InstanceType<S>>, P> & ExtractFunc<C, P>;
  } & S;
}
