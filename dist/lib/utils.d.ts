export declare type Callback<R = any, E = any> = (err: E, res: R) => void;
export declare function cbToPromise<A = unknown, R = unknown, E = unknown>(fn: (arg: A, cb: Callback<R, E>) => void): (arg: A) => Promise<R>;
export declare const IS_WINDOWS: boolean;
