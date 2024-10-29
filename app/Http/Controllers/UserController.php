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
            'hint' => 100,
            'power' => 150,
            'freeze' => 200,
        ];
    
        if (!array_key_exists($privilegeName, $privilegePrices)) {
            return response()->json(['message' => 'Invalid privilege name!'], 400);
        }
    
        $cost = $privilegePrices[$privilegeName];
    
        // Check if the user has enough coins
        if ($user->coins < $cost) {
            return response()->json(['message' => 'Not enough coins!'], 400);
        }
    
        // Deduct coins from the user
        $user->coins -= $cost;
        $user->save(); // Save the user model after deducting coins
    
        // Retrieve or create the privilege record
        $privilege = Privilege::firstOrCreate(
            ['user_id' => $user->id],
            ['hint_quantity' => 0, 'power_quantity' => 0, 'freeze_quantity' => 0]
        );
    
        // Update the specific privilege quantity based on the purchase
        if ($privilegeName === 'hint') {
            $privilege->hint_quantity++;
        } elseif ($privilegeName === 'power') {
            $privilege->power_quantity++;
        } elseif ($privilegeName === 'freeze') {
            $privilege->freeze_quantity++;
        }
    
        // Save the updated privilege record
        $privilege->save();
    
        // Return the updated coins and privileges in the response
        return response()->json([
            'message' => 'Privilege purchased successfully!',
            'updatedCoins' => $user->coins,
            'updatedPrivileges' => [
                'hint_quantity' => $privilege->hint_quantity,
                'power_quantity' => $privilege->power_quantity,
                'freeze_quantity' => $privilege->freeze_quantity,
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

        // Since `owned_pictures` is cast to array, no need for additional handling
        $ownedPictures = $user->owned_pictures ?? [];

        return response()->json(['owned_pictures' => $ownedPictures]);
    } catch (\Exception $e) {
        // Log the exception for debugging
        \Log::error("Error fetching user-owned pictures: " . $e->getMessage());
        return response()->json(['error' => 'Internal Server Error'], 500);
    }
}
    
}
