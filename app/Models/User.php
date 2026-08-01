<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name', 'email', 'password', 'role', 'status', 'avatar_url', 'phone', 'last_login_at',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function tasks(): HasMany { return $this->hasMany(Task::class); }
    public function habits(): HasMany { return $this->hasMany(Habit::class); }
    public function journalEntries(): HasMany { return $this->hasMany(JournalEntry::class); }
    public function moods(): HasMany { return $this->hasMany(Mood::class); }
    public function appNotifications(): HasMany { return $this->hasMany(Notification::class); }

    public function isAdmin(): bool { return $this->role === 'admin'; }
    public function isModerator(): bool { return in_array($this->role, ['moderator', 'admin'], true); }
    public function isActive(): bool { return $this->status === 'active'; }
}
