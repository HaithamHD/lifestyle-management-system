<?php

namespace App\Services\Notification;

use App\Services\Notification\Contracts\NotificationChannel;
use InvalidArgumentException;

class ChannelStrategy
{
    public static function resolve(string $channel): NotificationChannel
    {
        return match ($channel) {
            'email' => new EmailChannel(),
            'log' => new LogChannel(),
            'push' => new PushChannel(),
            'sms' => new SmsChannel(),
            default => throw new InvalidArgumentException("Unknown notification channel: {$channel}"),
        };
    }
}
