<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\Contracts\HabitRepositoryInterface;
use App\Repositories\Contracts\TaskRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __construct(
        private readonly TaskRepositoryInterface $tasks,
        private readonly HabitRepositoryInterface $habits,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        return response()->json([
            'summary' => [
                'weekly_score' => $this->tasks->weeklyCompletionScore($userId),
                'tasks_done' => $this->tasks->weeklyCompletedCount($userId),
                'tasks_total' => $this->tasks->weeklyTotalCount($userId),
                'longest_streak' => $this->habits->longestStreak($userId),
                'mood_average' => $request->user()->moods()->latest('recorded_on')->limit(7)->avg('score'),
            ],
            'today_tasks' => $this->tasks->forUser($userId, 'today'),
            'live_habits' => $this->habits->activeForUser($userId),
            'week_history' => $this->tasks->weeklyHistory($userId, 4),
        ]);
    }
}
