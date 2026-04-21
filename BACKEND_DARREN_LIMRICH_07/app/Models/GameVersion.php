<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GameVersion extends Model
{
    protected $table = 'game_versions';

    protected $fillable = ['game_id', 'version', 'storage_path'];

    protected $casts = [
        'version' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function game()
    {
        return $this->belongsTo(Game::class, 'game_id');
    }

    public function scores()
    {
        return $this->hasMany(Score::class, 'game_version_id');
    }
}
