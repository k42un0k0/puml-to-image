import chalk from "chalk";
import glob from "glob";
import { exec } from "child_process";
import { IS_WINDOWS } from "./lib/utils";
import path from "path";
import util from "util";

const globP = util.promisify(glob);
const execP = util.promisify(exec);

const EXECUTE_PROCESS_PATH = "./";

export async function pumlToImage(
  inputDirName: string,
  outputDirName: string,
  jarFilePath: string
) {
  console.log(chalk.green("export diagrams"));

  let files: string[] = [];
  try {
    // inputDirNameから*.puを検索
    files = await findAllPuml(inputDirName);
  } catch (error) {
    throw error;
  }

  // すべての.pu を全て画像化
  const promises = files.map(
    exportImage(inputDirName, outputDirName, jarFilePath)
  );

  try {
    await Promise.all(promises);
  } catch (error) {
    throw error;
  }
  console.log(chalk.green("Done!!"));
  return;
}

function findAllPuml(rootDir: string) {
  console.log("find puml files");
  let globPattern = "**/*.{pu,puml}";
  if (rootDir) {
    globPattern = `${rootDir}/${globPattern}`;
  }
  return globP(globPattern);
}

function exportImage(
  fromDirName: string,
  toDirName: string,
  jarFilePath: string
) {
  console.log(`export image to ${toDirName}`);

  return function (file: string) {
    // 相対pathで出力用フォルダを指定する
    function generateOutputPath() {
      const fileDirPath = path.dirname(file);
      return path.join(
        path.relative(fileDirPath, EXECUTE_PROCESS_PATH),
        fileDirPath.replace(RegExp(fromDirName, "g"), toDirName)
      );
    }
    const outputPath = generateOutputPath();
    console.log(`from ${file}`);

    let javaCommand = `java -Dfile.encoding=UTF-8 -jar ${jarFilePath} ${file} -o ${outputPath}`;
    // windowsの場合、出力をutf-8に変換
    if (IS_WINDOWS) {
      javaCommand = "chcp 65001 & " + javaCommand;
    }
    return execP(javaCommand).then((res) => {
      console.log(`output of ${file}: ` + JSON.stringify(res));
      return res;
    });
  };
}
