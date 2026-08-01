<?php

namespace Tests\Unit;

use App\Services\Notification\ChannelStrategy;
use App\Services\Notification\EmailChannel;
use App\Services\Notification\LogChannel;
use PHPUnit\Framework\TestCase;

class ChannelStrategyTest extends TestCase
{
    public function test_it_selects_a_notification_strategy(): void
    {
        $this->assertInstanceOf(EmailChannel::class, ChannelStrategy::resolve('email'));
        $this->assertInstanceOf(LogChannel::class, ChannelStrategy::resolve('log'));
    }
}
