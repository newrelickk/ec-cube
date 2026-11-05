#!/bin/bash
. ~/.bashrc
~/restart.sh
export PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"
nvm install 20 && nvm use 20
cd ~/ec-cube/scripts/puppeteer
echo "自動テスト環境準備中"
npm i --silent
echo "自動テスト環境準備完了"
echo "テストユーザーを作成します。"
node createUsers.js
echo "テストユーザーを作成しました。"
echo "自動テストを開始します。"
# 何らかの理由で test.js が終了しても自動で再起動する
(while true; do node test.js; sleep 5; done) &
