<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Game extends Model
{
    use SoftDeletes;

    protected $table = 'games';

    protected $fillable = ['title', 'slug', 'description', 'created_by'];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    public function author()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function versions()
    {
        return $this->hasMany(GameVersion::class, 'game_id')->orderBy('id', 'asc');
    }

    public function latestVersion()
    {
        return $this->hasOne(GameVersion::class, 'game_id')->latestOfMany('id');
    }

    public function scores()
    {
        return $this->hasManyThrough(Score::class, GameVersion::class, 'game_id', 'game_version_id');
    }
}
