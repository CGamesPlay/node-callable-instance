export declare const CallableInstance: ICallableInstance;
export interface ICallableInstance {
	new <T>(property: string | symbol): (...argv) => T;
	<T>(...argv: any[]): T;
}
