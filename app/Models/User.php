<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'coins',
        'picture_id',
    ];

    

    public function privilege()
    {
        return $this->hasOne(Privilege::class);
    }
    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function pictures()
{
    return $this->belongsToMany(Picture::class, 'user_pictures')
                ->withPivot('is_equipped')
                ->withTimestamps();
}

public function equippedPicture()
{
    return $this->pictures()->wherePivot('is_equipped', true)->first();
}

public function users()
{
    return $this->belongsToMany(User::class, 'user_pictures')
                ->withPivot('is_equipped')
                ->withTimestamps();
}



public function equipPicture($pictureId)
{
  
    if ($this->pictures()->where('picture_id', $pictureId)->exists()) {
      
        $this->pictures()->updateExistingPivot($this->pictures()->pluck('picture_id')->toArray(), ['is_equipped' => false]);

        $this->pictures()->updateExistingPivot($pictureId, ['is_equipped' => true]);
    }
}

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

}
