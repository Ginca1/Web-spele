<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Picture;
use App\Models\UserPicture;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class PictureController extends Controller
{
    public function buyPicture($pictureId)
    {
        $user = Auth::user();
        $picture = Picture::find($pictureId);

        // Check if the picture exists
        if (!$picture) {
            return response()->json(['error' => 'Picture not found'], 404);
        }

        // Check if the user already owns the picture
        $userPicture = UserPicture::where('user_id', $user->id)
            ->where('picture_id', $picture->id)
            ->first();

        if ($userPicture && $userPicture->owned) {
            return response()->json(['message' => 'You already own this picture'], 200);
        }

        // Check if the user has enough coins
        if ($user->coins < $picture->cost) {
            return response()->json(['error' => 'Insufficient coins'], 400);
        }

        // Deduct the coins from the user and mark the picture as owned
        $user->coins -= $picture->cost;
        $user->save();

        // Add entry to user_pictures or update existing one
        if ($userPicture) {
            $userPicture->owned = true;
            $userPicture->save();
        } else {
            UserPicture::create([
                'user_id' => $user->id,
                'picture_id' => $picture->id,
                'owned' => true,
            ]);
        }

        return response()->json(['message' => 'Picture purchased successfully'], 200);
    }
}
