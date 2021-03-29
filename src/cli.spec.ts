import { mocked } from "ts-jest/utils";
import { pumlToImage } from "./pumlToImage"
import path from "path"

jest.mock("./pumlToImage")
describe("cli.js", () => {
    test("pass options to pumlToImage", () => {
        jest.isolateModules(() => {
            process.argv = ["node", 'cli.js', '-i', 'input', '-o', 'output', '-j', 'jarfile']
            require("./cli");
            expect(pumlToImage).toBeCalledTimes(1)
            expect(pumlToImage).toHaveBeenCalledWith(
                "input", "output", "jarfile"
            )
        })
    })
    test("pass long options to pumlToImage", () => {
        jest.isolateModules(() => {
            process.argv = ["node", 'cli.js', '--inputDirName', 'input2', '--outputDirName', 'output2', '--jarFilePath', 'jarfile2']
            require("./cli");
            expect(pumlToImage).toBeCalledTimes(1)
            expect(pumlToImage).toHaveBeenCalledWith(
                "input2", "output2", "jarfile2"
            )
        })
    })
    test("pass default values to pumlToImage", () => {
        jest.isolateModules(() => {
            process.argv = ["node", 'cli.js']
            require("./cli");
            expect(pumlToImage).toBeCalledTimes(1)
            expect(pumlToImage).toHaveBeenCalledWith(
                "doc", "directory_contains_actual_images", path.resolve(__dirname, "./bin/plantuml.jar")
            )
        })
    })
})