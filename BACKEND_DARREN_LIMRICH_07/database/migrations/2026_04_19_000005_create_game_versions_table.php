<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('game_versions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('game_id');
            $table->integer('version');
            $table->string('storage_path');
            $table->timestamps();

            $table->foreign('game_id')->references('id')->on('games');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('game_versions');
    }
};