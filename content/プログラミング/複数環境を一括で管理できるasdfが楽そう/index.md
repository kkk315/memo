---
date: 2025-07-17
---

自分はわりといろいろなツールやアプリを試して結局使わない性分で、それらのデータを白紙に戻すためOS自体を定期的に入れ直すタイプです。  
何かしらの環境構築などの説明をする時、逆に受ける時の環境をまっさらな状態にしておきたいというのもあります。

そもそも個人開発であまりバージョンを変えることもないため、バージョン差異で困った時はいちいち調べなければならない、むしろ今自分が何を使ってるかもわからないというデメリットがあります。直に入れるのは入れるのでなんだかなという感じもあります。
メリットとしては毎回どんなツールにしようか調べるので、地味にトレンドには敏感になっていることでしょうか。

とはいえ言語によってはOSごとにツールが違っていたりするのもめんどくさいですし、いい加減もっと楽にバージョン管理をしたい、できればコマンド覚えるのは一種類が良い、そしてgitで管理できると最高。

そんな気持ちでいた所、**asdf**というバージョン管理ツールを知ったので試してみました。

## asdfとは
[asdf公式](https://asdf-vm.com/)  
簡単に言うと、Node.js、Python、Ruby、Goなど、あらゆる言語を一括で管理できるバージョン管理ツールです。
各言語ごとのツールを個別に使う必要がなくなります。

各ディレクトリ内で、そこで使う言語とバージョンを記載した``.tool-versions``を作成することで、そのディレクトリでは指定のバージョンの言語を利用可能になります。設定ファイルをユーザーが作ることも可能ですが、asdfでバージョンを指定するコマンドを打てば勝手に作成されるので作り忘れもなくなります。

## インストール

このページに一通りの環境ごとにインストール方法が網羅されています。  
[Getting Started](https://asdf-vm.com/guide/getting-started.html)

今回はubuntu 24.04にいれるため、自分でバイナリをインストールします。  
Macならbrew一発で入れられるので楽かもしれません。


まずは[リリースページ](https://github.com/asdf-vm/asdf/releases)で最新バージョンのバイナリのリンクのURLを控えておきます。  
記事作成時点ではv0.18.0が最新のため、Ubuntuの場合は  
``https://github.com/asdf-vm/asdf/releases/download/v0.18.0/asdf-v0.18.0-linux-amd64.tar.gz``  
となります。

```bash
# ダウンロード
$ wget https://github.com/asdf-vm/asdf/releases/download/v0.18.0/asdf-v0.18.0-linux-amd64.tar.gz

# 展開
$ tar -zxvf asdf-v0.18.0-linux-amd64.tar.gz

# /usr/local/binへ展開したasdfを移動
$ sudo mv asdf /usr/local/bin/

# パスが通っているか確認
$ type -a asdf
asdf is /usr/local/bin/asdf

# DLしたファイルを削除
$ rm asdf-v0.18.0-linux-amd64.tar.gz
```

移動先は元々パスの通っている`/usr/local/bin/`にしました。移動後のtypeコマンドで出てくるパスが移動先のものになっていればOKです。

## 使い方

おおまかな流れは以下の通りです：
- 各言語のプラグインを追加
- 各言語のバージョンを指定してインストール
- インストールしたものの中からバージョン指定を行う（この時`.tool-versions`が作られたり設定が追記されます）

### プラグインを追加
asdfはいきなり全てを管理対象としているわけではなく、プラグインの追加という形で管理対象を指定していきます。  
何があるかわからない場合は、プラグイン全てを表示するか、その結果からgrepして探しましょう。

```bash
$ asdf plugin list all | grep nodejs
nodejs                                      https://github.com/asdf-vm/asdf-nodejs.git

$ asdf plugin list all | grep python
python                                      https://github.com/danhper/asdf-python.git
```

プラグインを追加：

```bash
$ asdf plugin add nodejs
```

プラグイン一覧表示：

```bash
$ asdf list
```

### 言語本体をインストール
使いたいバージョンを指定してインストールします。  
指定できるバージョンは以下のコマンドで確認できます（Node.jsはべらぼうに多いので注意）。

```bash
# インストールできるバージョンのリストを表示する（任意）
$ asdf list all nodejs

# バージョンを指定してインストール
$ asdf install nodejs 20.15.1
# またはlatestを指定することで最新のものが入ります
$ asdf install nodejs latest
```

### バージョン指定
ディレクトリ単位でバージョンを指定します：
```bash
$ asdf set local nodejs 20.15.1 # このディレクトリのみ有効
$ asdf set global nodejs 20.15.1 # このディレクトリとそれ以下の全てで有効
```

これで`.tool-versions`というファイルができて、設定に応じたスコープでバージョン管理が有効になります。

globalとlocalを同時に指定した場合はエラーが出るので注意しましょう。
