<?php

namespace App\Services\Notification;

use App\Services\Notification\Contracts\NotificationChannel;
use Illuminate\Support\Facades\Log;

class LogChannel implements NotificationChannel
{
    public function send(int $userId, string $message): void
    {
        Log::info('notification.sent', compact('userId', 'message'));
    }

    public function name(): string { return 'log'; }
}
