<!doctype html>
<html lang="ja">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" context="width-device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>つぶやきアプリ</title>
    </head>
    <body>
            <h1>つぶやきを編集する</h1>
            <div>
                <p>投稿フォーム</p>
                <a href="{{ route('tweet.index') }}">< 戻る</a>
                @if(session('feedback.success'))
                    <p style="color: green">{{ session('feedback.success') }}</p>
                @endif
                <form action="{{ route('tweet.update.put', ['tweetId' => $tweet->id]) }}" method="post">
                    @method('PUT')
                    @csrf
                    <label for="tweet-content">つぶやき</label>
                    <span>140文字まで</span>
                    <textarea id="tweet-content" type="text" name="tweet" placeholder="つぶやきを入力">{{ $tweet->content }}</textarea>
                    @error('tweet')
                    <p style="color: red;">{{ $message }}</p>
                    @enderror
                    <button type="submit">投稿</button>
                </form>
                <p>{{ $name }}</p>
            </div>
            <div>
                <p>{{ $tweet->content }}</p>
            </div>
    </body>
</html>