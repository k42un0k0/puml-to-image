"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
describe("cbToPromise", function () {
    test("callback to promise with resolve", function () {
        function someCallback(arg, cb) {
            cb(undefined, arg);
        }
        var promisedFn = utils_1.cbToPromise(someCallback);
        var actual = "hello";
        return promisedFn(actual).then(function (res) {
            expect(res).toBe(actual);
        });
    });
    test("callback to promise with reject", function () {
        function someCallback(_, cb) {
            cb(Error("faild by some error"), undefined);
        }
        var promisedFn = utils_1.cbToPromise(someCallback);
        return expect(promisedFn("hello")).rejects.toThrow("faild by some error");
    });
});
