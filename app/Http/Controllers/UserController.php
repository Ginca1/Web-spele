<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Models\Privilege;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;


class UserController extends Controller
{
    /**
     * Update the user's profile picture.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function updateProfilePicture(Request $request)
{
    
    $request->validate([
        'picture_id' => 'required|integer|exists:pictures,id', 
    ]);
  
    $user = Auth::user();
    $pictureId = $request->input('picture_id');
    $ownedPictures = json_decode($user->owned_pictures, true) ?? [];

    if (!in_array($pictureId, $ownedPictures)) {
        return response()->json(['message' => 'You do not own this picture.'], 403);
    }

    $user->picture_id = $pictureId;
    $user->save();

    return response()->json(['message' => "Profile picture updated to picture ID {$pictureId} successfully."]);
}
    public function getUserPictureId()
    {
        $user = auth()->user();
        return response()->json(['picture_id' => $user->picture_id]);
    }
    

    public function updateUserPictureId(Request $request)
    {
        $user = auth()->user();
        $user->picture_id = $request->picture_id;
        $user->save();
        return response()->json(['message' => 'Picture ID updated successfully']);
    }

    
    public function purchasePicture(Request $request)
    {
        $user = auth()->user();
        $pictureId = $request->input('picture_id');

        $picturePrices = [
            1 => 0, // Dog (free)
            2 => 0, // Cat (free)
            3 => 0, // Frog (free)
            4 => 50, // Antelope
            5 => 75, // Horse
            6 => 100, // Lion
            7 => 125, // Snake
            8 => 150, // Tiger
            9 => 200, // Deer
        ];
    
     
        if (!array_key_exists($pictureId, $picturePrices)) {
            return response()->json(['message' => 'Invalid picture ID!'], 400);
        }
    
        $ownedPictures = json_decode($user->owned_pictures, true) ?? [];
        if (in_array($pictureId, $ownedPictures)) {
           
            if ($user->picture_id !== $pictureId) {
                $user->picture_id = $pictureId;
                $user->save();
                return response()->json(['message' => 'Profile picture updated successfully!']);
            }
            return response()->json(['message' => 'This picture is already set as your profile picture.']);
        }
 
        $cost = $picturePrices[$pictureId];
        if ($user->coins < $cost) {
            return response()->json(['message' => 'Not enough coins!'], 400);
        }
 
        $user->coins -= $cost;
        $ownedPictures[] = $pictureId;
        $user->owned_pictures = $ownedPictures;
        $user->picture_id = $pictureId; 
        $user->save();
    
        return response()->json(['message' => 'Picture purchased and profile picture updated successfully!']);
    }

    public function purchasePrivilege(Request $request)
    {
        $user = auth()->user();
        $privilegeName = $request->input('privilege_name');
       
        $privilegePrices = [
            'flag' => 100,
            'skip' => 150,
            'hint' => 200,
        ];
    
        if (!array_key_exists($privilegeName, $privilegePrices)) {
            return response()->json(['message' => 'Invalid privilege name!'], 400);
        }
    
        $cost = $privilegePrices[$privilegeName];
    
       
        if ($user->coins < $cost) {
            return response()->json(['message' => 'Not enough coins!'], 400);
        }

        $user->coins -= $cost;
        $user->save(); 
    
        $privilege = Privilege::firstOrCreate(
            ['user_id' => $user->id],
            ['hint_quantity' => 0, 'skip_quantity' => 0, 'flag_quantity' => 0]
        );
    
        
        if ($privilegeName === 'hint') {
            $privilege->hint_quantity++;
        } elseif ($privilegeName === 'skip') {
            $privilege->skip_quantity++;
        } elseif ($privilegeName === 'flag') {
            $privilege->flag_quantity++;
        }

        $privilege->save();
   
        return response()->json([
            'message' => 'Privilege purchased successfully!',
            'updatedCoins' => $user->coins,
            'updatedPrivileges' => [
                'hint_quantity' => $privilege->hint_quantity,
                'skip_quantity' => $privilege->skip_quantity,
                'flag_quantity' => $privilege->flag_quantity,
            ],
        ]);
    }

public function getOwnedPictures(): JsonResponse
{
    try {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        
        $ownedPictures = $user->owned_pictures ?? [];

        return response()->json(['owned_pictures' => $ownedPictures]);
    } catch (\Exception $e) {
      
        \Log::error("Error fetching user-owned pictures: " . $e->getMessage());
        return response()->json(['error' => 'Internal Server Error'], 500);
    }
}

public function getUserData()
{
    $user = auth()->user();
    
    // Bypass all caching
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
    
    return response()->json([
        'level' => $user->level,
        'xp' => $user->xp,
        'xpneeded' => floor(100 * (1.2 ** ($user->level - 1))),
        'timestamp' => microtime(true) // High precisio g ff vv vb bb   xx cc mm
    ]);
}
    
}
