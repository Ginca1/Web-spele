<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MissionController extends Controller
{
    public function claimReward(Request $request)
    {
        $user = Auth::user();
        
        $validated = $request->validate([
            'coins' => 'required|integer',
            'xp' => 'required|integer',
            'mission_id' => 'required|integer'
        ]);
        
        // Update user's coins and XP
        $user->coins += $validated['coins'];
        $user->xp += $validated['xp'];
        
        // Save which missions have been claimed
        $claimedMissions = json_decode($user->claimed_missions ?? '[]', true);
        $claimedMissions[] = $validated['mission_id'];
        $user->claimed_missions = json_encode(array_unique($claimedMissions));
        
        $user->save();
        
        return response()->json([
            'success' => true,
            'newCoins' => $user->coins,
            'newXp' => $user->xp
        ]);
    }
}