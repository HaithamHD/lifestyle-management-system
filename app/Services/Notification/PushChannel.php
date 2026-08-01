<?php

namespace App\Services\Notification;

use App\Services\Notification\Contracts\NotificationChannel;
use Illuminate\Support\Facades\Http;

class PushChannel implements NotificationChannel
{
    public function send(int $userId, string $message): void
    {
        $key = config('services.fcm.server_key');
        if (! $key) {
            return;
        }

        Http::withToken($key)->post('https://fcm.googleapis.com/fcm/send', [
            'to' => "/topics/user_{$userId}",
            'notification' => ['title' => 'Lifestyle', 'body' => $message],
        ]);
    }

    public function name(): string { return 'push'; }
}
