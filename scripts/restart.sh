#!/bin/bash
. ~/.bashrc
cd ~/ec-cube
if [ -f /tmp/service.pid ]; then
  ps aux | grep php | awk '{print $2}' | xargs kill 2&>1 > /dev/null
  echo "起動中のサンプルサービスを停止しました。"
  sleep 5;
fi
echo "サンプルサービスを起動します。しばらくお待ちください。"
nohup php bin/console server:run --env=dev -q -- 0.0.0.0:8000 &
echo $! > /tmp/service.pid
echo "サンプルサービスが起動しました。 http://$HOSTNAME.$_SANDBOX_ID.instruqt.io:8000 にアクセスしてみましょう。"
