<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role', 20)
                ->default('user')
                ->index();

            $table->string('status', 20)
                ->default('active')
                ->index();

            $table->string('avatar_url')
                ->nullable();

            $table->string('phone', 30)
                ->nullable();

            $table->timestamp('last_login_at')
                ->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['role']);
            $table->dropIndex(['status']);

            $table->dropColumn([
                'role',
                'status',
                'avatar_url',
                'phone',
                'last_login_at',
            ]);
        });
    }
};
