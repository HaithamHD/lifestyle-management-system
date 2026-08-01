<?php

namespace App\Repositories\Contracts;

use App\Models\Task;
use Illuminate\Support\Collection;

interface TaskRepositoryInterface
{
    public function forUser(int $userId, string $filter = 'today'): Collection;
    public function create(int $userId, array $data): Task;
    public function update(Task $task, array $data): Task;
    public function delete(Task $task): void;
    public function weeklyCompletionScore(int $userId): int;
    public function weeklyCompletedCount(int $userId): int;
    public function weeklyTotalCount(int $userId): int;
    public function weeklyHistory(int $userId, int $weeks = 4): array;
}
