import { cbToPromise, Callback } from "./utils"

describe("cbToPromise", () => {
    test("callback to promise with resolve", () => {
        function someCallback(arg: string, cb: Callback<string>) {
            cb(undefined, arg);
        }
        const promisedFn = cbToPromise(someCallback)

        const actual = "hello"
        return promisedFn(actual).then((res) => {
            expect(res).toBe(actual)
        })
    })

    test("callback to promise with reject", () => {
        function someCallback(_: unknown, cb: Callback) {
            cb(Error("faild by some error"), undefined);
        }
        const promisedFn = cbToPromise(someCallback)

        return expect(promisedFn("hello")).rejects.toThrow("faild by some error")
    })
})
