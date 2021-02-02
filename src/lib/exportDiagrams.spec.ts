import glob from "glob";
import { exec } from "child_process";
import { mocked } from "ts-jest/utils";
import { exportDiagrams } from "./exportDiagrams";
import { IS_WINDOWS } from "./utils";

jest.mock("glob", () => {
  return jest.fn();
});
jest.mock("child_process", () => {
  return {
    exec: jest.fn(),
  };
});

describe("exportDiagrams", () => {
  if (!IS_WINDOWS)
    describe("when linux", () => {
      test("call exec once and glob once", async () => {
        mocked(exec).mockImplementation((_: any, cb: any) => {
          return cb(null, "exec called");
        });
        mocked(glob).mockImplementation((_: any, cb: any) => {
          return cb(null, ["aaa/uuu.pu"]);
        });

        await exportDiagrams("aaa", "eee", "./bin/hello.jar");

        expect(mocked(glob).mock.calls.length).toBe(1);
        expect(mocked(glob).mock.calls[0][0]).toBe("aaa/**/*.{pu,puml}");
        expect(mocked(exec).mock.calls.length).toBe(1);
        expect(mocked(exec).mock.calls[0][0]).toBe(
          "java -Dfile.encoding=UTF-8 -jar ./bin/hello.jar aaa/uuu.pu -o ../eee"
        );
      });
      test("call exec twice and glob once", async () => {
        mocked(exec).mockImplementation((_: any, cb: any) => {
          return cb(null, "exec called");
        });
        mocked(glob).mockImplementation((_: any, cb: any) => {
          return cb(null, ["bbb/uuu.pu", "bbb/ttt.puml"]);
        });
        await exportDiagrams("bbb", "eee", "./hello.jar");

        expect(mocked(glob).mock.calls.length).toBe(1);
        expect(mocked(glob).mock.calls[0][0]).toBe("bbb/**/*.{pu,puml}");
        expect(mocked(exec).mock.calls.length).toBe(2);
        expect(mocked(exec).mock.calls[0][0]).toBe(
          "java -Dfile.encoding=UTF-8 -jar ./hello.jar bbb/uuu.pu -o ../eee"
        );
        expect(mocked(exec).mock.calls[1][0]).toBe(
          "java -Dfile.encoding=UTF-8 -jar ./hello.jar bbb/ttt.puml -o ../eee"
        );
      });
    });
  if (IS_WINDOWS)
    describe("when windows", () => {
      test("call exec once and glob once", async () => {
        mocked(exec).mockImplementation((_: any, cb: any) => {
          return cb(null, "exec called");
        });
        mocked(glob).mockImplementation((_: any, cb: any) => {
          return cb(null, ["aaa\\uuu.pu"]);
        });

        await exportDiagrams("aaa", "eee", "./bin/hello.jar");

        expect(mocked(glob).mock.calls.length).toBe(1);
        expect(mocked(glob).mock.calls[0][0]).toBe("aaa/**/*.{pu,puml}");
        expect(mocked(exec).mock.calls.length).toBe(1);

        expect(mocked(exec).mock.calls[0][0]).toBe(
          "chcp 65001 & java -Dfile.encoding=UTF-8 -jar ./bin/hello.jar aaa\\uuu.pu -o ..\\eee"
        );
      });
    });
});
