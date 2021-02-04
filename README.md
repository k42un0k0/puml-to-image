# puml-to-image

puml を画像へ変換するスクリプト

コピペがめんどくさいので npm package 化して npm install できるようにしました

## install

gpr から npm package をインストールするときには npm の設定が必要です

`.npmrc`をプロジェクトルートに配置してください

`${{token}}`はこのリポジトリのオーナーからもらってください

### `.npmrc`

```.npmrc
@k42un0k0:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${{token}}
```

