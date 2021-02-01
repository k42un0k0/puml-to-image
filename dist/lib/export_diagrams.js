"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
var chalk_1 = __importDefault(require("chalk"));
var glob_1 = __importDefault(require("glob"));
var child_process_1 = require("child_process");
var utils_1 = require("./utils");
var path_1 = __importDefault(require("path"));
var pGlob = utils_1.cbToPromise(glob_1.default);
var pExec = utils_1.cbToPromise(child_process_1.exec);
var EXECUTE_PROCESS_PATH = "./";
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var inputDirName, outputDirName, jarFilePath, files, error_1, promises, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    inputDirName = 'doc';
                    outputDirName = 'directory_contains_actual_images';
                    jarFilePath = path_1.default.resolve(__dirname, '../bin/plantuml.jar');
                    console.log(chalk_1.default.green('export diagrams'));
                    files = [];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, findAllPuml(inputDirName)];
                case 2:
                    // inputDirNameから*.puを検索
                    files = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    exitWithShowError(1, error_1);
                    return [3 /*break*/, 4];
                case 4:
                    promises = files.map(pumlToImage(inputDirName, outputDirName, jarFilePath));
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, Promise.all(promises)];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 8];
                case 7:
                    error_2 = _a.sent();
                    exitWithShowError(2, error_2);
                    return [3 /*break*/, 8];
                case 8:
                    console.log(chalk_1.default.green('Done!!'));
                    return [2 /*return*/];
            }
        });
    });
}
exports.main = main;
function exitWithShowError(code, err) {
    console.log(chalk_1.default.red(err));
    process.exit(code);
}
function findAllPuml(rootDir) {
    console.log("find puml files");
    var globPattern = "**/*.{pu,puml}";
    if (rootDir) {
        globPattern = rootDir + "/" + globPattern;
    }
    return pGlob(globPattern);
}
function pumlToImage(fromDirName, toDirName, jarFilePath) {
    console.log("export image to " + toDirName);
    return function (file) {
        // 相対pathで出力用フォルダを指定する
        function generateOutputPath() {
            var fileDirPath = path_1.default.dirname(file);
            return path_1.default.join(path_1.default.relative(fileDirPath, EXECUTE_PROCESS_PATH), fileDirPath.replace(RegExp(fromDirName, "g"), toDirName));
        }
        var outputPath = generateOutputPath();
        console.log("from " + file);
        var javaCommand = "java -Dfile.encoding=UTF-8 -jar " + jarFilePath + " " + file + " -o " + outputPath;
        // windowsの場合、出力をutf-8に変換
        if (utils_1.IS_WINDOWS) {
            javaCommand = "chcp 65001 & " + javaCommand;
        }
        return pExec(javaCommand).then(function (res) {
            console.log("output of " + file + ": " + res);
            return res;
        });
    };
}
