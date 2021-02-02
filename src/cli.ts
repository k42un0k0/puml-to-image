#!/usr/bin/env node
import path from "path"
import * as yargs from 'yargs'
import { exportDiagrams } from "./lib/exportDiagrams"

const inputDirName = "doc";
const outputDirName = 'directory_contains_actual_images';
const jarFilePath = path.resolve(__dirname, './bin/plantuml.jar')

const argv = yargs
    .scriptName("puml-to-image")
    .usage('$0 [args]', "PlantUMLファイルをpng画像へ変換します")
    .option("inputDirName", {
        alias: "i",
        description: "画像化する対象のディレクトリ名",
        default: inputDirName
    })
    .option("outputDirName", {
        alias: "o",
        description: "出力するディレクトリ名",
        default: outputDirName
    })
    .option("jarFilePath", {
        alias: "j",
        description: "PlantUMLを画像化するjarファイルのパス",
        default: jarFilePath
    })
    .help()
    .epilogue('より詳細な情報は以下のリンクを参照してください\nhttps://github.com/k42un0k0/puml-to-image')
    .argv



exportDiagrams(argv.inputDirName, argv.outputDirName, argv.jarFilePath);