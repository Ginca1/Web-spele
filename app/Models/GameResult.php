<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GameResult extends Model
{
    use HasFactory;
//saves data sd sd
    protected $fillable = [
        'user_id',
        'game_type',
        'countries_completed',
        'total_countries',
        'time_played',
        'perfect_guesses',
        'hints_used',
        'skips_used',
        'flags_used',
        'score',
        'correct_guesses',
        'incorrect_guesses',
        'failed_countries',
        'semi_correct_countries',
        'perfect_countries',
        'earned_xp',
        'earned_coins',
    ];

    protected $casts = [
        'completed_at' => 'datetime',
        'failed_countries' => 'array',
        'semi_correct_countries' => 'array',
        'perfect_countries' => 'array',
    ];
}