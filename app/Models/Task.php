<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Task extends Model
{
    use HasFactory;

    public const STATUS_PENDING = 'pending';
    public const STATUS_IN_PROGRESS = 'in_progress';
    public const STATUS_COMPLETED = 'completed';

    protected $fillable = ['user_id', 'title', 'description', 'due_date', 'status', 'priority', 'category', 'completed_at'];

    protected function casts(): array
    {
        return ['due_date' => 'datetime', 'completed_at' => 'datetime'];
    }

    public function user(): BelongsTo { return $this->belongsTo(User::class); }

    public function markComplete(): void
    {
        $this->update(['status' => self::STATUS_COMPLETED, 'completed_at' => now()]);
    }

    protected function isOverdue(): Attribute
    {
        return Attribute::get(fn () => $this->due_date && $this->due_date->isPast() && $this->status !== self::STATUS_COMPLETED);
    }

    public function scopePending($query) { return $query->where('status', self::STATUS_PENDING); }
    public function scopeCompleted($query) { return $query->where('status', self::STATUS_COMPLETED); }
    public function scopeDueToday($query) { return $query->whereDate('due_date', today()); }
    public function scopeOverdue($query)
    {
        return $query->where('due_date', '<', now())->where('status', '!=', self::STATUS_COMPLETED);
    }
}
