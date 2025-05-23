<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Privilege extends Model
{
    use HasFactory;

    protected $fillable = [
        'hint_quantity',
        'skip_quantity',
        'flag_quantity',
        'user_id',
    ];

    // Define the reverse relationship
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
