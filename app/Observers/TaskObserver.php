<?php

namespace App\Observers;

use App\Models\Notification;
use App\Models\Task;
use App\Services\Notification\Contracts\NotificationChannel;
use Illuminate\Support\Facades\Log;

class TaskObserver
{
    public function __construct(private readonly NotificationChannel $notifier) {}

    public function created(Task $task): void
    {
        Log::info('task.created', ['id' => $task->id, 'user_id' => $task->user_id]);
    }

    public function updated(Task $task): void
    {
        if ($task->wasChanged('status') && $task->status === Task::STATUS_COMPLETED) {
            Notification::create([
                'user_id' => $task->user_id,
                'type' => 'task.completed',
                'message' => "You completed \"{$task->title}\" — nice work.",
                'data' => ['task_id' => $task->id],
            ]);

            $this->notifier->send($task->user_id, "Task done: {$task->title}");
        }
    }

    public function deleted(Task $task): void
    {
        Log::info('task.deleted', ['id' => $task->id, 'user_id' => $task->user_id]);
    }
}
