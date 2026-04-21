<?php

use App\Http\Controllers\Api\V1\AdminController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\GameController;
use App\Http\Controllers\Api\V1\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    Route::prefix('auth')->group(function () {
        Route::post('/signup', [AuthController::class, 'signup']);
        Route::post('/signin', [AuthController::class, 'signin']);
        Route::post('/signout', [AuthController::class, 'signout'])->middleware('api.auth');
    });

    Route::get('/games', [GameController::class, 'index']);
    Route::get('/games/{slug}', [GameController::class, 'show']);
    Route::get('/games/{slug}/scores', [GameController::class, 'scores']);

    Route::middleware('api.auth')->group(function () {
        Route::post('/games', [GameController::class, 'store']);
        Route::put('/games/{slug}', [GameController::class, 'update']);
        Route::delete('/games/{slug}', [GameController::class, 'destroy']);
        Route::post('/games/{slug}/scores', [GameController::class, 'submitScore']);
    });

    Route::post('/games/{slug}/upload', [GameController::class, 'upload']);

    Route::middleware('api.auth')->group(function () {
        Route::get('/admins', [AdminController::class, 'index']);
    });

    Route::middleware('api.auth')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::get('/users/{username}', [UserController::class, 'show']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
    });
});

Route::fallback(function () {
    return response()->json(['status' => 'not-found', 'message' => 'Not found'], 404);
});
