<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TaskApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_and_complete_a_task(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $task = $this->postJson('/api/tasks', [
            'title' => 'Finish report',
            'priority' => 'high',
        ])->assertCreated()->json();

        $this->postJson('/api/tasks/'.$task['id'].'/complete')
            ->assertOk()
            ->assertJsonPath('status', 'completed');

        $this->assertDatabaseHas('notifications', [
            'type' => 'task.completed',
        ]);
    }
}
