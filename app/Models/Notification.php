<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    use HasFactory;

    public const STATUS_UNREAD = 'unread';
    public const STATUS_READ = 'read';

    protected $fillable = ['user_id', 'type', 'message', 'data', 'status', 'read_at'];
    protected function casts(): array { return ['data' => 'array', 'read_at' => 'datetime']; }
    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function markAsRead(): void { $this->update(['status' => self::STATUS_READ, 'read_at' => now()]); }
}
