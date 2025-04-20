<?php

namespace App\Http\Controllers;

use App\Models\GameResult;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class GameHistoryController extends Controller
{
    public function index()
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not authenticated'
                ], 401);
            }

            $history = GameResult::where('user_id', $user->id)
                ->orderBy('completed_at', 'desc')
                ->get()
                ->map(function ($game) {
                    // Safely handle JSON fields
                    $failedCountries = $game->failed_countries;
                    $semiCorrectCountries = $game->semi_correct_countries;
                    $perfectCountries = $game->perfect_countries;
                    
                    // If the fields are already arrays (due to Laravel casting), use them directly
                    if (is_array($failedCountries)) {
                        $failedCountries = $failedCountries;
                    } else {
                        $failedCountries = $failedCountries ? json_decode($failedCountries, true) : [];
                    }
                    
                    if (is_array($semiCorrectCountries)) {
                        $semiCorrectCountries = $semiCorrectCountries;
                    } else {
                        $semiCorrectCountries = $semiCorrectCountries ? json_decode($semiCorrectCountries, true) : [];
                    }
                    
                    if (is_array($perfectCountries)) {
                        $perfectCountries = $perfectCountries;
                    } else {
                        $perfectCountries = $perfectCountries ? json_decode($perfectCountries, true) : [];
                    }

                    return [
                        'id' => $game->id,
                        'game_type' => $game->game_type,
                        'total_countries' => $game->total_countries,
                        'time_played' => $game->time_played,
                        'score' => (float)$game->score,
                        'correct_guesses' => $game->correct_guesses,
                        'hints_used' => $game->hints_used,
                        'skips_used' => $game->skips_used,
                        'flags_used' => $game->flags_used,
                        'earned_xp' => $game->earned_xp,
                        'earned_coins' => $game->earned_coins,
                        'completed_at' => $game->completed_at->toDateTimeString(),
                        'failed_countries' => $failedCountries,
                        'semi_correct_countries' => $semiCorrectCountries,
                        'perfect_countries' => $perfectCountries,
                    ];
                });

            return response()->json($history);

        } catch (\Exception $e) {
            Log::error('Game history error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Server error',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}