<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LevelController extends Controller
{
    public function levelUp(Request $request)
    {
        $user = Auth::user();
        $xpNeeded = 100 * (1.2 ** ($user->level - 1));
    
        if ($user->xp >= $xpNeeded) {
            $user->xp -= $xpNeeded;
            $user->level++;
            $user->save();
    
            return response()->json([
                'success' => true,
                'level' => $user->level,
                'xp' => $user->xp,
                'xpneeded' => 100 * (1.2 ** ($user->level - 1))
            ]);
        }
    
        return response()->json([
            'success' => false,
            'message' => 'Not enough XP for level up'
        ], 400);
    }
}