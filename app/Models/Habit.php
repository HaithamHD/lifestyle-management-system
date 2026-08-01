<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

class Habit extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'name', 'emoji', 'frequency', 'current_streak', 'best_streak'];

    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function ticks(): HasMany { return $this->hasMany(HabitTick::class); }

    public function tickFor(\DateTimeInterface $date): void
    {
        $this->ticks()->firstOrCreate(['date' => $date->format('Y-m-d')]);
        $this->recalculateStreak();
    }

    public function recalculateStreak(): void
    {
        $dates = $this->ticks()->orderByDesc('date')->pluck('date')
            ->map(fn ($date) => Carbon::parse($date)->format('Y-m-d'))->all();

        $streak = 0;
        $cursor = today();

        foreach ($dates as $date) {
            if ($date !== $cursor->format('Y-m-d')) {
                break;
            }
            $streak++;
            $cursor->subDay();
        }

        $this->update([
            'current_streak' => $streak,
            'best_streak' => max((int) $this->best_streak, $streak),
        ]);
    }
}
