<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('scores', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('game_version_id');
            $table->double('score', 13, 2);
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('game_version_id')->references('id')->on('game_versions');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('scores');
    }
};