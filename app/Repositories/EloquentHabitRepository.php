<?php

namespace App\Repositories;

use App\Models\Habit;
use App\Repositories\Contracts\HabitRepositoryInterface;
use Illuminate\Support\Collection;

class EloquentHabitRepository implements HabitRepositoryInterface
{
    public function activeForUser(int $userId): Collection
    {
        return Habit::where('user_id', $userId)->orderByDesc('current_streak')->get();
    }

    public function longestStreak(int $userId): int
    {
        return (int) Habit::where('user_id', $userId)->max('current_streak');
    }
}
