import { exportDiagrams } from "./exportDiagrams";
import fs from "fs";
import rimraf from "rimraf";
import mkdirp from "mkdirp";
import path from "path";
import { readdirRecursively } from "./utils";

const pumlStr = `@startuml
:sample:
@enduml`;

const jarFilePath = path.resolve(__dirname, "../bin/plantuml.jar");

beforeEach(() => {
  rimraf.sync(__dirname + "/bintest");
  mkdirp.sync(__dirname + "/bintest");
  process.chdir(__dirname + "/bintest");
});

afterAll(() => {
  rimraf.sync(__dirname + "/bintest");
});

describe("exportDiagrams", () => {
  test("export diagrams", async () => {
    mkdirp.sync("from/a/b/c");
    mkdirp.sync("from/x/y");

    fs.writeFileSync("from/1.pu", pumlStr);
    fs.writeFileSync("from/2.pu", pumlStr);
    fs.writeFileSync("from/a/1.pu", pumlStr);
    fs.writeFileSync("from/a/2.pu", pumlStr);
    fs.writeFileSync("from/a/b/1.pu", pumlStr);
    fs.writeFileSync("from/a/b/2.pu", pumlStr);
    fs.writeFileSync("from/a/b/c/1.pu", pumlStr);
    fs.writeFileSync("from/a/b/c/2.pu", pumlStr);
    fs.writeFileSync("from/x/1.puml", pumlStr);
    fs.writeFileSync("from/x/2.puml", pumlStr);
    fs.writeFileSync("from/x/y/1.puml", pumlStr);
    fs.writeFileSync("from/x/y/2.puml", pumlStr);
    await exportDiagrams("from", "to", jarFilePath);
    expect(readdirRecursively("./to")).toEqual([
      "./to/1.png",
      "./to/2.png",
      "./to/a/1.png",
      "./to/a/2.png",
      "./to/a/b/1.png",
      "./to/a/b/2.png",
      "./to/a/b/c/1.png",
      "./to/a/b/c/2.png",
      "./to/x/1.png",
      "./to/x/2.png",
      "./to/x/y/1.png",
      "./to/x/y/2.png",
    ]);
  }, 15000);
  test("export diagrams without invalid extention files", async () => {
    mkdirp.sync("from/a/b/c");
    mkdirp.sync("from/x/y");

    fs.writeFileSync("from/1.txt", pumlStr);
    fs.writeFileSync("from/2.pu", pumlStr);
    fs.writeFileSync("from/a/1.md", pumlStr);
    fs.writeFileSync("from/a/2.pu", pumlStr);
    fs.writeFileSync("from/a/b/1.js", pumlStr);
    fs.writeFileSync("from/a/b/2.pu", pumlStr);
    fs.writeFileSync("from/a/b/c/1.ts", pumlStr);
    fs.writeFileSync("from/a/b/c/2.pu", pumlStr);
    fs.writeFileSync("from/x/1.d.ts", pumlStr);
    fs.writeFileSync("from/x/2.puml", pumlStr);
    fs.writeFileSync("from/x/y/1.coffee", pumlStr);
    fs.writeFileSync("from/x/y/2.puml", pumlStr);
    await exportDiagrams("from", "to", jarFilePath);
    expect(readdirRecursively("./to")).toEqual([
      "./to/2.png",
      "./to/a/2.png",
      "./to/a/b/2.png",
      "./to/a/b/c/2.png",
      "./to/x/2.png",
      "./to/x/y/2.png",
    ]);
  });
  test("noop with empty inputDir", async () => {
    mkdirp.sync("from");
    await exportDiagrams("from", "to", jarFilePath);
    expect(fs.statSync.bind(fs, "./to")).toThrow();
  });
  test("noop when not existing inputDir", async () => {
    expect(fs.statSync.bind(fs, "./hoge")).toThrow();
    await expect(exportDiagrams("hoge", "to", jarFilePath));
    expect(readdirRecursively(".")).toEqual([]);
  });
  test("reject with invalid puml", () => {
    mkdirp.sync("from");

    fs.writeFileSync("from/1.pu", pumlStr);
    fs.writeFileSync(
      "from/2.pu",
      `@startuml
:invalid actor
@enduml`
    );
    return expect(exportDiagrams("from", "to", jarFilePath)).rejects.toThrow();
  });
  test("reject when not existing jar file", () => {
    mkdirp.sync("from");

    fs.writeFileSync("from/1.pu", pumlStr);
    fs.writeFileSync("from/2.pu", pumlStr);
    expect(fs.statSync.bind(fs, "./foo.bar")).toThrow();
    return expect(exportDiagrams("from", "to", "./foo.bar")).rejects.toThrow();
  });
});
