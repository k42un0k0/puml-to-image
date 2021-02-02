import chalk from "chalk"
import glob from "glob"
import { exec } from "child_process"
import { cbToPromise, IS_WINDOWS } from "./utils"
import path from "path"

const pGlob = cbToPromise<string, string[]>(glob);
const pExec = cbToPromise<string, string>(exec);

const EXECUTE_PROCESS_PATH = "./";

export async function exportDiagrams(inputDirName: string, outputDirName: string, jarFilePath: string) {

    console.log(chalk.green('export diagrams'));

    let files: string[] = [];
    try {
        // inputDirNameから*.puを検索
        files = await findAllPuml(inputDirName);
    } catch (error) {
        exitWithShowError(1, error);
    }

    // すべての.pu を全て画像化
    const promises = files.map(pumlToImage(inputDirName, outputDirName, jarFilePath));

    try {
        await Promise.all(promises);
    } catch (error) {
        exitWithShowError(2, error);
    }
    console.log(chalk.green('Done!!'));
}

function exitWithShowError(code: number, err: Error) {
    console.log(chalk.red(err));
    process.exit(code);
}

function findAllPuml(rootDir: string) {
    console.log("find puml files");
    let globPattern = "**/*.{pu,puml}";
    if (rootDir) {
        globPattern = `${rootDir}/${globPattern}`;
    }
    return pGlob(globPattern);
}

function pumlToImage(fromDirName: string, toDirName: string, jarFilePath: string) {
    console.log(`export image to ${toDirName}`);

    return function (file: string) {
        // 相対pathで出力用フォルダを指定する
        function generateOutputPath() {
            const fileDirPath = path.dirname(file);
            return path.join(path.relative(fileDirPath, EXECUTE_PROCESS_PATH), fileDirPath.replace(RegExp(fromDirName, "g"), toDirName));
        }
        const outputPath = generateOutputPath()
        console.log(`from ${file}`);
        let javaCommand = `java -Dfile.encoding=UTF-8 -jar ${jarFilePath} ${file} -o ${outputPath}`
        // windowsの場合、出力をutf-8に変換
        if (IS_WINDOWS) {
            javaCommand = "chcp 65001 & " + javaCommand
        }
        return pExec(javaCommand).then((res) => {
            console.log(`output of ${file}: ` + res);
            return res;
        })
    }
}
