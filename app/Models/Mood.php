<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Mood extends Model
{
    use HasFactory;
    protected $fillable = ['user_id', 'score', 'emoji', 'note', 'recorded_on'];
    protected function casts(): array { return ['recorded_on' => 'date']; }
    public function user(): BelongsTo { return $this->belongsTo(User::class); }
}
