export type Callback<R = any, E = any> = (err: E, res: R) => void

export function cbToPromise<A = unknown, R = unknown, E = unknown>(fn: (arg: A, cb: Callback<R, E>) => void) {
    return (arg: A) => new Promise<R>((resolve, reject) => fn(arg, (err, res) => {
        if (err == null) {
            resolve(res);
        } else {
            reject(err);
        }
    }))
}

export const IS_WINDOWS = process.platform === 'win32'