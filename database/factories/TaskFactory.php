<?php

namespace Database\Factories;

use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TaskFactory extends Factory
{
    protected $model = Task::class;

    public function definition(): array
    {
        return [
            'user_id'     => User::factory(),
            'title'       => $this->faker->sentence(4),
            'description' => $this->faker->optional()->paragraph(),
            'due_date'    => $this->faker->dateTimeBetween('-3 days', '+7 days'),
            'status'      => Task::STATUS_PENDING,
            'priority'    => $this->faker->randomElement(['low', 'medium', 'high']),
            'category'    => $this->faker->randomElement(['work', 'personal', 'fitness', 'mindful']),
        ];
    }

    public function completed(): self
    {
        return $this->state(fn () => [
            'status'       => Task::STATUS_COMPLETED,
            'completed_at' => now(),
        ]);
    }

    public function overdue(): self
    {
        return $this->state(fn () => [
            'due_date' => now()->subDays(2),
            'status'   => Task::STATUS_PENDING,
        ]);
    }
}
