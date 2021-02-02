import { exportDiagrams } from "./exportDiagrams";
import { Callback, IS_WINDOWS } from "./utils";
import glob from "glob"
import { exec } from "child_process"
import { mocked } from "ts-jest/utils"

jest.mock("glob", () => {
    return jest.fn()
})
jest.mock("child_process", () => {
    return {
        exec: jest.fn()
    }
})

describe("exportDiagrams", () => {
    mocked(exec).mockImplementation((arg, cb: any) => {
        return cb(null, "exec called");
    })
    beforeEach(() => {
        mocked(glob).mockClear()
        mocked(exec).mockClear()
    })
    test("call exec once and glob once", async () => {
        mocked(glob).mockImplementation((_, cb: any) => {
            return cb(null, ["aaa/uuu.pu"])
        })


        await exportDiagrams("aaa", "eee", "./bin/hello.jar")

        expect(mocked(glob).mock.calls.length).toBe(1)
        expect(mocked(glob).mock.calls[0][0]).toBe("aaa/**/*.{pu,puml}")
        expect(mocked(exec).mock.calls.length).toBe(1)
        if (IS_WINDOWS) {
            expect(mocked(exec).mock.calls[0][0]).toBe("chcp 65001 & java -Dfile.encoding=UTF-8 -jar ./bin/hello.jar aaa/uuu.pu -o ..\\eee")
        } else {
            expect(mocked(exec).mock.calls[0][0]).toBe("java -Dfile.encoding=UTF-8 -jar ./bin/hello.jar aaa/uuu.pu -o ..\\eee")
        }
    })
    test("call exec twice and glob once", async () => {
        mocked(glob).mockImplementation((_, cb: any) => {
            return cb(null, ["bbb/uuu.pu", "bbb/ttt.puml"])
        })
        await exportDiagrams("bbb", "eee", "./hello.jar")

        expect(mocked(glob).mock.calls.length).toBe(1)
        expect(mocked(glob).mock.calls[0][0]).toBe("bbb/**/*.{pu,puml}")
        expect(mocked(exec).mock.calls.length).toBe(2)
        if (IS_WINDOWS) {
            expect(mocked(exec).mock.calls[0][0]).toBe("chcp 65001 & java -Dfile.encoding=UTF-8 -jar ./hello.jar bbb/uuu.pu -o ..\\eee")
            expect(mocked(exec).mock.calls[1][0]).toBe("chcp 65001 & java -Dfile.encoding=UTF-8 -jar ./hello.jar bbb/ttt.puml -o ..\\eee")
        } else {
            expect(mocked(exec).mock.calls[0][0]).toBe("java -Dfile.encoding=UTF-8 -jar ./hello.jar bbb/uuu.pu -o ..\\eee")
            expect(mocked(exec).mock.calls[1][0]).toBe("java -Dfile.encoding=UTF-8 -jar ./hello.jar bbb/ttt.puml -o ..\\eee")

        }
    })
})
