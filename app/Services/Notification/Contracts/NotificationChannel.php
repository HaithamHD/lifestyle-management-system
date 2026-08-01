<?php

namespace App\Services\Notification\Contracts;

interface NotificationChannel
{
    public function send(int $userId, string $message): void;
    public function name(): string;
}
