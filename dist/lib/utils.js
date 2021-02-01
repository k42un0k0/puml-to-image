"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IS_WINDOWS = exports.cbToPromise = void 0;
function cbToPromise(fn) {
    return function (arg) { return new Promise(function (resolve, reject) { return fn(arg, function (err, res) {
        if (err == null) {
            resolve(res);
        }
        else {
            reject(err);
        }
    }); }); };
}
exports.cbToPromise = cbToPromise;
exports.IS_WINDOWS = process.platform === 'win32';
