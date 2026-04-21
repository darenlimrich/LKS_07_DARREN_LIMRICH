<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, SoftDeletes;

    protected $table = 'users';

    protected $fillable = ['username', 'password', 'last_login_at', 'delete_reason'];

    protected $hidden = ['password'];

    protected $casts = [
        'last_login_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    public function games()
    {
        return $this->hasMany(Game::class, 'created_by');
    }

    public function scores()
    {
        return $this->hasMany(Score::class, 'user_id');
    }
}
