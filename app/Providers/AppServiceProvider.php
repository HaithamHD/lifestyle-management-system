<?php

namespace App\Providers;

use App\Models\Task;
use App\Observers\TaskObserver;
use App\Policies\TaskPolicy;
use App\Repositories\Contracts\HabitRepositoryInterface;
use App\Repositories\Contracts\TaskRepositoryInterface;
use App\Repositories\EloquentHabitRepository;
use App\Repositories\EloquentTaskRepository;
use App\Services\Notification\ChannelStrategy;
use App\Services\Notification\Contracts\NotificationChannel;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(TaskRepositoryInterface::class, EloquentTaskRepository::class);
        $this->app->bind(HabitRepositoryInterface::class, EloquentHabitRepository::class);
        $this->app->singleton(NotificationChannel::class, fn () => ChannelStrategy::resolve(config('notifications.default_channel', 'email')));
    }

    public function boot(): void
    {
        Gate::policy(Task::class, TaskPolicy::class);
        Task::observe(TaskObserver::class);
    }
}
