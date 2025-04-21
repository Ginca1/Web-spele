<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class LeaderboardController extends Controller
{
    public function index(Request $request)
    {
        try {
            $users = User::orderBy('level', 'desc')
                ->orderBy('xp', 'desc')
                ->orderBy('coins', 'desc')
                ->select('id', 'name', 'xp', 'picture_id', 'level', 'coins')
                ->get()
                ->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'xp' => (int) $user->xp,
                        'level' => (int) $user->level,
                        'picture_id' => (int) $user->picture_id,
                        'coins' => (int) $user->coins,
                    ];
                });

            return response()->json([
                'success' => true,
                'users' => $users,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load leaderboard data.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}