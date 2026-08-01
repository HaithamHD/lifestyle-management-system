<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\HabitController;
use App\Http\Controllers\Api\JournalController;
use App\Http\Controllers\Api\MoodController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\TaskController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function (): void {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::patch('/profile', [AuthController::class, 'updateProfile']);

    Route::get('/dashboard', [DashboardController::class, 'index']);

    Route::apiResource('tasks', TaskController::class);
    Route::post('/tasks/{task}/complete', [TaskController::class, 'complete']);

    Route::apiResource('habits', HabitController::class);
    Route::post('/habits/{habit}/tick', [HabitController::class, 'tick']);

    Route::apiResource('journal', JournalController::class);
    Route::apiResource('mood', MoodController::class)->only(['index', 'store']);

    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);

    Route::prefix('admin')->middleware('admin')->group(function (): void {
        Route::get('/dashboard', [AdminController::class, 'dashboard']);
        Route::get('/users', [AdminController::class, 'users']);
        Route::patch('/users/{user}/status', [AdminController::class, 'updateStatus']);
    });
});
