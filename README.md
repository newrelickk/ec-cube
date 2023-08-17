<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

# はじめに
このPHPアプリケーションは、ENTSC3チームがPHP APM Agentの挙動を確認するためのサンプルアプリケーションとなります。
以下に、アプリケーションセットアップまでの手順を簡単に記載しています。

# 前提条件
挙動確認はMac上で行っており、手順についてもMacを前提とした記載となっています。Windowsを利用している場合には、コマンドなどが異なっている可能性があるので、読み替えてコマンドを実施して下さい。
また、Laravelが生成するDockerイメージを活用しているため、検証環境にてDockerが起動していることを前提としています。

# 環境セットアップ手順
## Dockerイメージの取得
- ターミナルを起動し、任意のパスへ移動する
- 以下のコマンドを実行して、Laravelベースのアプリのワークディレクトリを作成する
```
curl -s "https://laravel.build/XXXXXX" | bash
```
**補足)** **XXXXXX**の部分に任意の名前を指定することで、作業ディレクトリに同名のディレクトリが作成される
そのディレクトリ配下にLaravelで利用するさまざまなファイルが作成/展開される
コマンド実行後、ビルドに少し時間がかかるので待ち、最後にOSのパスワード入力を行う

## Laravelアプリの起動確認
- 生成されたディレクトリに移動する
**補足)** 今後、このディレクトリを起点にコマンドを実施する
- アプリを起動する
```
./vendor/bin/sail up -d
```
- 起動後、ブラウザにて以下のURLにアクセスする
```
http://localhost/
```
-  アクセスできることを確認後、アプリを停止する
```
./vendor/bin/sail down
```
## Github上のコードの展開
- 一旦、作業ディレクトリから離れ、Laravelのアプリソースコードを取得し、そのアプリを先ほど作成したディレクトリの中身と入れ替える(ディレクトリの中身だけを入れ替える/Replace)
- 置き換え後、作業ディレクトリに一旦戻り、Dockerイメージを起動する
```
./vendor/bin/sail up -d
```

## ダミーデータの生成
- テーブルの作成
```
./vendor/bin/sail artisan migrate
```
- テーブルへのデータ生成
```
./vendor/bin/sail artisan db:seed
```
**補足)** 上記コマンドを複数回実施することで、ダミーデータを大量に生成することが可能

- 生成できたかを確認するために、以下のURLにアクセスする
```
http://localhost/tweet
```
## 補足 - 便利なコマンド
```
./vendor/bin/sail mysql (MySQLサーバコンテナへアクセスする)
./vendor/bin/sail shell (アプリケーションコンテナへアクセスする)
./vendor/bin/sail root-shell (アプリケーションコンテナへ管理者権限でアクセスする)
```

# PHP Agentの導入
## Agent導入手順
**On a host - Package manager**の手順にて実施
- 管理者権限でアプリケーションコンテナにアクセスする
```
./vendor/bin/sail root-shell
```
- アクセス後、以下のコマンドを実施する
```
apt update
apt install wget
```
- New RelicポータルのAdd Dataにアクセスし、UI上に表示されたコマンドを実施する(ただし、**sudoを削除する**必要あり)
- **apt**を選択する
```
echo 'deb http://apt.newrelic.com/debian/ newrelic non-free' |  tee /etc/apt/sources.list.d/newrelic.list
wget -O- https://download.newrelic.com/548C16BF.gpg | apt-key add -
apt-get update
DEBIAN_FRONTEND=noninteractive apt-get -y -qq install newrelic-php5
```
```
NR_INSTALL_KEY=<INGEST - LICENSE> newrelic-install install
```
**all**を選択する(他のパターンでの動作確認は未実施)
- 設定ファイルをアップデートする
※アプリケーション名が“PHP Application”となったままなので、ここを更新する
```
sed -i -e "s/REPLACE_WITH_REAL_KEY/<INGEST - LICENSE>/" -e "s/newrelic.appname[[:space:]]=[[:space:]].*/newrelic.appname=\"<この部分を変更し忘れない>\"/" $(php -r "echo(PHP_CONFIG_FILE_SCAN_DIR);")/newrelic.ini
```
```
sed -i 's/;newrelic.daemon.collector_host = ""/newrelic.daemon.collector_host = "collector.newrelic.com"/' $(php -r "echo(PHP_CONFIG_FILE_SCAN_DIR);")/newrelic.ini
```
## Agentの設定ファイルの修正
- PHP Agentの挙動に与える設定ファイルが複数存在してしまっているため、以下のコマンドにて設定ファイルのパスを確認する
```
php -i | grep newrelic.ini
```
- 出力されるファイルをdiffコマンドで比較する
```
**** 実行と出力の例 ****
# php -i | grep newrelic.ini
PHP Warning: Module "newrelic" is already loaded in Unknown on line 0
/etc/php/8.2/cli/conf.d/20-newrelic.ini,
/etc/php/8.2/cli/conf.d/newrelic.ini

diff /etc/php/8.2/cli/conf.d/20-newrelic.ini /etc/php/8.2/cli/conf.d/newrelic.ini
```

上記の実施結果から、適切なライセンスやアプリ名が反映されていない設定ファイルが存在しているので、設定が正しく反映されている設定ファイルを削除する(あるいは、ファイル名を変更するなど)などで、影響がない形にする。
```
mv /etc/php/8.2/cli/conf.d/20-newrelic.ini /etc/php/8.2/cli/conf.d/20-newrelic_BACKUP.ini
```

## Agentを含めたアプリケーションの再起動
コンテナを再起動する
```
./vendor/bin/sail restart
```
**注意)** sailのup/downだとコンテナを作り直しになってしまう
