<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\GameResult;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class GameController extends Controller
{
    public function saveResults(Request $request)
    {
        if (!$request->ajax() && !$request->wantsJson()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid request type'
            ], 400);
        }

        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not authenticated'
                ], 401);
            }
    
            $validatedData = $request->validate([
                'totalCountries' => 'required|integer|min:1',
                'timePlayed' => 'required|integer|min:0',
                'perfectGuesses' => 'required|integer|min:0',
                'hintsUsed' => 'required|integer|min:0',
                'skipsUsed' => 'required|integer|min:0',
                'flagsUsed' => 'required|integer|min:0',
                'score' => 'required|numeric|min:0',
                'correctGuesses' => 'required|integer|min:0',
                'incorrectGuesses' => 'required|integer|min:0',
                'failedCountries' => 'nullable|array',
                'semiCorrectCountries' => 'nullable|array',
                'perfectCountries' => 'nullable|array',
                'gameType' => 'required|in:europe,america,asia,africa,all' 
            ]);
    
            // Set max possible score and rewards based on game 
            switch ($validatedData['gameType']) {
                case 'europe':
                    $maxPossibleScore = 41;
                    $maxPossibleXP = 200;
                    $maxPossibleCoins = 50;
                    break;
                case 'america':
                    $maxPossibleScore = 32;
                    $maxPossibleXP = 300;
                    $maxPossibleCoins = 75;
                    break;
                case 'asia':
                    $maxPossibleScore = 54;
                    $maxPossibleXP = 500;
                    $maxPossibleCoins = 150;
                    break;
                case 'africa':
                    $maxPossibleScore = 49;
                    $maxPossibleXP = 1000;
                    $maxPossibleCoins = 300;
                    break;
                case 'all':
                    $maxPossibleScore = 178; 
                    $maxPossibleXP = 2000;  
                    $maxPossibleCoins = 600; 
                    break;
                default:
                    $maxPossibleScore = 41;
                    $maxPossibleXP = 200;
                    $maxPossibleCoins = 50;
            }
            
            // Calculate proportional rewards
            $scorePercentage = $validatedData['score'] / $maxPossibleScore;
            $earnedXP = round($scorePercentage * $maxPossibleXP);
            $earnedCoins = round($scorePercentage * $maxPossibleCoins);
            
            // Ensure minimum rewards 
            $earnedXP = max(1, $earnedXP);
            $earnedCoins = max(1, $earnedCoins);
    
            $gameResult = GameResult::create([
                'user_id' => $user->id,
                'game_type' => $validatedData['gameType'],
                'total_countries' => $validatedData['totalCountries'],
                'time_played' => $validatedData['timePlayed'],
                'perfect_guesses' => $validatedData['perfectGuesses'],
                'hints_used' => $validatedData['hintsUsed'],
                'skips_used' => $validatedData['skipsUsed'],
                'flags_used' => $validatedData['flagsUsed'],
                'score' => $validatedData['score'],
                'correct_guesses' => $validatedData['correctGuesses'],
                'incorrect_guesses' => $validatedData['incorrectGuesses'],
                'failed_countries' => $validatedData['failedCountries'] ?? null,
                'semi_correct_countries' => $validatedData['semiCorrectCountries'] ?? null,
                'perfect_countries' => $validatedData['perfectCountries'] ?? null,
                'completed_at' => now(),
                'earned_xp' => $earnedXP,
                'earned_coins' => $earnedCoins
            ]);
    
            // Update user stats
            $user->increment('xp', $earnedXP);
            $user->increment('coins', $earnedCoins);
    
            return response()->json([
                'success' => true,
                'message' => 'Game results saved successfully',
                'data' => [
                    'game_result' => $gameResult,
                    'earned_xp' => $earnedXP,
                    'earned_coins' => $earnedCoins
                ]
            ]);
    
        } catch (\Exception $e) {
            Log::error('Game results save failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Server error: ' . $e->getMessage()
            ], 500);
        }
    }
}