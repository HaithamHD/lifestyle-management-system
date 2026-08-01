<?php

namespace App\Repositories\Contracts;

use Illuminate\Support\Collection;

interface HabitRepositoryInterface
{
    public function activeForUser(int $userId): Collection;
    public function longestStreak(int $userId): int;
}
