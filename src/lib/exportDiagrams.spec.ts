import { IS_WINDOWS } from "./utils";

jest.mock("glob", () => {
  return jest.fn();
});
jest.mock("child_process", () => {
  return {
    exec: jest.fn(),
  };
});

function importStatement() {
  const glob = require("glob");
  const { exec } = require("child_process");
  const { mocked } = require("ts-jest/utils");
  const { exportDiagrams } = require("./exportDiagrams");

  return {
    glob,
    exec,
    mocked,
    exportDiagrams,
  };
}
describe("exportDiagrams", () => {
  beforeEach(() => {
    jest.resetModules();
  });
  if (!IS_WINDOWS)
    describe("when linux", () => {
      beforeEach(() => {
        jest.mock("./utils", () => {
          return {
            ...jest.requireActual<{}>("./utils"),
            IS_WINDOWS: false,
          };
        });
      });
      test("call exec once and glob once", async () => {
        const { glob, exec, mocked, exportDiagrams } = importStatement();
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
        const { glob, exec, mocked, exportDiagrams } = importStatement();
        mocked(exec).mockImplementation((arg: any, cb: any) => {
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
      beforeEach(() => {
        jest.mock("./utils", () => {
          return {
            ...jest.requireActual<{}>("./utils"),
            IS_WINDOWS: true,
          };
        });
      });
      test("call exec once and glob once", async () => {
        const { glob, exec, mocked, exportDiagrams } = importStatement();
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
