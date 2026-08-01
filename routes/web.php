<?php

use Illuminate\Support\Facades\Route;

Route::view('/', 'original.home')->name('home');
Route::view('/login', 'original.login')->name('login');
Route::view('/register', 'original.register')->name('register');

Route::get('/app/{page?}', function (?string $page = 'dashboard') {
    $allowed = ['dashboard', 'tasks', 'habits', 'journal', 'mood', 'notifications', 'profile'];
    abort_unless(in_array($page, $allowed, true), 404);

    return view('original.app', compact('page'));
})->name('app');

Route::view('/admin/dashboard', 'original.admin')->name('admin.dashboard');
