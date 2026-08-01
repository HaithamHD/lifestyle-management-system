<?php

namespace App\Services\Notification;

use App\Models\User;
use App\Services\Notification\Contracts\NotificationChannel;
use Illuminate\Support\Facades\Mail;

class EmailChannel implements NotificationChannel
{
    public function send(int $userId, string $message): void
    {
        $user = User::find($userId);
        if (! $user) {
            return;
        }

        Mail::raw($message, fn ($mail) => $mail->to($user->email)->subject('Lifestyle notification'));
    }

    public function name(): string { return 'email'; }
}
