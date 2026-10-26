#!/bin/bash
. ~/.bashrc
cd ~/ec-cube
if [ -f /tmp/service.pid ]; then
  ps aux | grep php | awk '{print $2}' | xargs kill 2&>1 > /dev/null
  echo "起動中のサンプルサービスを停止しました。"
  sleep 5;
fi
echo "サンプルサービスを起動します。しばらくお待ちください。"
APP_ENV=dev nohup php -S 0.0.0.0:8000 -t . scripts/router.php > /tmp/service.log 2>&1 &
echo $! > /tmp/service.pid
echo "サンプルサービスが起動しました。 http://$HOSTNAME.$_SANDBOX_ID.instruqt.io:8000 にアクセスしてみましょう。"
