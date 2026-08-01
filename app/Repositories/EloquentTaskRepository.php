<?php

namespace App\Repositories;

use App\Models\Task;
use App\Repositories\Contracts\TaskRepositoryInterface;
use Illuminate\Support\Collection;

class EloquentTaskRepository implements TaskRepositoryInterface
{
    public function forUser(int $userId, string $filter = 'today'): Collection
    {
        $query = Task::query()->where('user_id', $userId);

        return match ($filter) {
            'today' => $query->dueToday()->orderBy('due_date')->get(),
            'upcoming' => $query->where('due_date', '>=', now())
                ->where('status', '!=', Task::STATUS_COMPLETED)->orderBy('due_date')->get(),
            'completed' => $query->completed()->latest('completed_at')->get(),
            'overdue' => $query->overdue()->orderBy('due_date')->get(),
            default => $query->latest()->get(),
        };
    }

    public function create(int $userId, array $data): Task
    {
        return Task::create([...$data, 'user_id' => $userId]);
    }

    public function update(Task $task, array $data): Task
    {
        $task->update($data);
        return $task->fresh();
    }

    public function delete(Task $task): void { $task->delete(); }

    public function weeklyCompletionScore(int $userId): int
    {
        $total = $this->weeklyTotalCount($userId);
        return $total === 0 ? 0 : (int) round(($this->weeklyCompletedCount($userId) / $total) * 100);
    }

    public function weeklyCompletedCount(int $userId): int
    {
        return Task::where('user_id', $userId)->completed()
            ->whereBetween('completed_at', [now()->startOfWeek(), now()->endOfWeek()])->count();
    }

    public function weeklyTotalCount(int $userId): int
    {
        return Task::where('user_id', $userId)
            ->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count();
    }

    public function weeklyHistory(int $userId, int $weeks = 4): array
    {
        $history = [];
        for ($offset = $weeks - 1; $offset >= 0; $offset--) {
            $start = now()->subWeeks($offset)->startOfWeek();
            $end = now()->subWeeks($offset)->endOfWeek();
            $total = Task::where('user_id', $userId)->whereBetween('created_at', [$start, $end])->count();
            $done = Task::where('user_id', $userId)->completed()->whereBetween('completed_at', [$start, $end])->count();
            $history[] = ['week' => 'W'.$start->weekOfYear, 'score' => $total === 0 ? 0 : (int) round(($done / $total) * 100)];
        }
        return $history;
    }
}
