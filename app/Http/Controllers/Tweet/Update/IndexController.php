<?php

namespace App\Http\Controllers\Tweet\Update;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Tweet;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class IndexController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $tweetId = (int)$request->route('tweetId');
        //dd($tweetId);
        $tweet = Tweet::where('id', $tweetId)->firstOrFail();
        /*
        $tweet = Tweet::where('id', $tweetId)->first();
        if(is_null($tweet)){
            throw new NotFoundHttpException('存在しないつぶやきです。');
        }
        */
        //dd($tweet);
        return view('tweet.update')->with('tweet', $tweet)->with('name', 'Laravel');
    }
}
