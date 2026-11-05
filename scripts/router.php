<?php

// php -S 用ルーター: 内部ディレクトリを遮断し、実在する静的ファイルはそのまま配信、それ以外は index.php へ
$root = dirname(__DIR__);
$path = rawurldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

if (strpos($path, '..') !== false || preg_match('#^/(\.[^/]*|app|src|var|vendor|bin|tests|codeception|gulp|dockerbuild|zap|scripts)(/|$)#', $path)) {
    http_response_code(403);
    exit;
}

if ($path !== '/' && is_file($root.$path) && pathinfo($path, PATHINFO_EXTENSION) !== 'php') {
    return false;
}

chdir($root);
require $root.'/index.php';
