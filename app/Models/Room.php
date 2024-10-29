<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'theme',
        'region',
        'privacy',
        'max_players',
        'current_players',
        'status',
        'room_code', 
    ];
}
