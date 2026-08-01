<?php

namespace App\Services\Notification;

use App\Models\User;
use App\Services\Notification\Contracts\NotificationChannel;
use Illuminate\Support\Facades\Http;

class SmsChannel implements NotificationChannel
{
    public function send(int $userId, string $message): void
    {
        $user = User::find($userId);
        $sid = config('services.twilio.sid');
        $token = config('services.twilio.token');
        $from = config('services.twilio.from');

        if (! $user?->phone || ! $sid || ! $token || ! $from) {
            return;
        }

        Http::withBasicAuth($sid, $token)->asForm()
            ->post("https://api.twilio.com/2010-04-01/Accounts/{$sid}/Messages.json", [
                'From' => $from,
                'To' => $user->phone,
                'Body' => $message,
            ]);
    }

    public function name(): string { return 'sms'; }
}
