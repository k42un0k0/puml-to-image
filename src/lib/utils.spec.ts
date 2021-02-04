import { IS_WINDOWS, readdirRecursively } from "./utils";
import fs from "fs";
import rimraf from "rimraf";
import mkdirp from "mkdirp";
import { exec } from "child_process"
import * as util from "util"

const execP = util.promisify(exec)

async function clear() {
  if (IS_WINDOWS) {
    try {
      await execP(`rd /s/q ${__dirname + "\\bintest"}`)
    } catch {
      // noop
    }
  } else {
    rimraf.sync(__dirname + "/bintest");
  }
}
beforeEach(async () => {
  await clear();
  mkdirp.sync(__dirname + "/bintest");
  process.chdir(__dirname + "/bintest");
});

afterAll(async () => {
  await clear();
});

describe("readdirRecursively", () => {
  test("export diagrams", async () => {
    mkdirp.sync("a/b/c");
    mkdirp.sync("x/y");

    fs.writeFileSync("a/1.txt", "\n");
    fs.writeFileSync("a/2.txt", "\n");
    fs.writeFileSync("a/b/1.txt", "\n");
    fs.writeFileSync("a/b/2.txt", "\n");
    fs.writeFileSync("a/b/c/1.txt", "\n");
    fs.writeFileSync("a/b/c/2.txt", "\n");
    fs.writeFileSync("x/1.txt", "\n");
    fs.writeFileSync("x/2.txt", "\n");
    fs.writeFileSync("x/y/1.txt", "\n");
    fs.writeFileSync("x/y/2.txt", "\n");
    expect(readdirRecursively(".")).toEqual([
      "./a/1.txt",
      "./a/2.txt",
      "./a/b/1.txt",
      "./a/b/2.txt",
      "./a/b/c/1.txt",
      "./a/b/c/2.txt",
      "./x/1.txt",
      "./x/2.txt",
      "./x/y/1.txt",
      "./x/y/2.txt",
    ]);
  });
});
