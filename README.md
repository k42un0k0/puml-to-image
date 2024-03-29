[![Node.js CI](https://github.com/k42un0k0/puml-to-image/workflows/Node.js%20CI/badge.svg)](https://github.com/k42un0k0/puml-to-image/actions?query=workflow%3A%22Node.js+CI%22)

# puml-to-image

puml を画像へ変換するスクリプト

コピペがめんどくさいので npm package 化して npm install できるようにしました

## Attention

このパッケージは gpr にホストされており、 gpr から npm package をインストールするときには npm の設定が必要です

なので`.npmrc`をプロジェクトルートに配置してください

`${{token}}`は github の [personal access token](https://github.com/settings/tokens) から作成してください

### `.npmrc`

```.npmrc
@k42un0k0:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${{token}}
```

## Getting Started

```
$ npm install @k42un0k0/puml-to-image
$ mkdir doc
$ echo -e "@startuml\n:sample:\n@enduml" > doc/sample.pu
```

```
$ npx puml-to-image
```

## CLI Usage

```
puml-to-image [options]
```

### Options

- `-i`, `--inputDirName`: 画像化したい PlantUML ファイルを置いているフォルダの名前
- `-o`, `--outputDirName`: 出力先のフォルダの名前
- `-j`, `--jarFilePath`: PlantUML ファイルを画像にする jar ファイルへのパス
  - デフォルトではこのパッケージに同梱された jar ファイルを使用します

# Maintenance

## リリース作業
1. `npm version hogehoge` でバージョンを挙げる
2. `v{hogehoge}`タグをつける
3. タグとmasterブランチをpushする
4. githubでreleaseを作る
5. releaseの作成に反応してgithubアクションが動きgprにリリースされる
