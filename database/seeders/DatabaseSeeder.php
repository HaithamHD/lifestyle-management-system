<?php

namespace Database\Seeders;

use App\Models\Habit;
use App\Models\JournalEntry;
use App\Models\Mood;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::updateOrCreate(
            ['email' => 'admin@lifestyle.test'],
            ['name' => 'Lifestyle Admin', 'password' => 'Admin123!', 'role' => 'admin', 'status' => 'active']
        );

        $user = User::updateOrCreate(
            ['email' => 'user@lifestyle.test'],
            ['name' => 'Demo User', 'password' => 'Password123!', 'role' => 'user', 'status' => 'active']
        );

        Task::firstOrCreate(
            ['user_id' => $user->id, 'title' => 'Complete project report'],
            ['description' => 'Prepare the implementation and testing chapters.', 'due_date' => now()->addDay(), 'priority' => 'high', 'category' => 'University']
        );

        Habit::firstOrCreate(
            ['user_id' => $user->id, 'name' => 'Drink Water'],
            ['emoji' => '💧', 'frequency' => 'daily']
        );

        JournalEntry::firstOrCreate(
            ['user_id' => $user->id, 'title' => 'First reflection'],
            ['content' => 'Today I connected the Laravel API to the frontend.', 'tags' => ['project', 'progress']]
        );

        Mood::updateOrCreate(
            ['user_id' => $user->id, 'recorded_on' => today()->toDateString()],
            ['score' => 5, 'emoji' => '🙂', 'note' => 'Productive day']
        );
    }
}
