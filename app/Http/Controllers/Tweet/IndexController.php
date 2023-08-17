<?php

namespace App\Http\Controllers\Tweet;

use App\Http\Controllers\Controller;
use App\Models\Tweet;
use Illuminate\Http\Request;

use App\Services\TweetService;

class IndexController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, TweetService $tweetService)
    {
        //$tweetService = new TweetService();
        $tweets = $tweetService->getTweets();
        //dd($tweets);
        return view('tweet.index')
            ->with('tweets',$tweets)
            ->with('name', 'laravel');
    }
}
