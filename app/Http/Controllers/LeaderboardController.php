<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class LeaderboardController extends Controller
{
    public function index(Request $request)
    {
        // Force JSON  nxd bcvb mmmmmmm
        $request->headers->set('Accept', 'application/json');
        
        try {
            $users = User::orderBy('xp', 'desc')
                ->orderBy('level', 'desc')
                ->orderBy('games_completed', 'desc')
                ->select('id', 'name', 'xp', 'picture_id', 'level', 'games_completed')
                ->get()
                ->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'xp' => $user->xp,
                        'level' => $user->level,
                        'picture_id' => $user->picture_id,
                        'games_completed' => $user->games_completed
                    ];
                });

            return response()->json([
                'success' => true,
                'users' => $users
            ], 200, [], JSON_NUMERIC_CHECK);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching leaderboard: ' . $e->getMessage()
            ], 500);
        }
    }
}