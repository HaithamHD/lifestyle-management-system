# Lifestyle Management System

A comprehensive **Laravel 12** web application that integrates a RESTful API with a modern native user interface. The project includes an automated Windows launcher that configures all required PHP extensions locally, eliminating the need to modify the global `php.ini` configuration.

---

# Features

The system provides a complete lifestyle management platform with the following functionality:

* User registration and authentication using **Laravel Sanctum**.
* Personalized user dashboard with weekly statistics and activity summaries.
* Task management (Create, Read, Update, Delete, and Complete tasks).
* Habit management with daily progress tracking.
* Journal entry management.
* Mood tracking and history.
* In-app notification system.
* User profile management.
* Administrative dashboard for monitoring and managing user accounts.
* Clean software architecture utilizing:

  * Repository Pattern
  * Dependency Injection
  * Observer Pattern
  * Strategy Pattern
  * Factory Pattern
  * MVC Architecture

---

# Quick Start (Windows)

1. Extract the project archive.
2. Open the project directory containing the `artisan` file.
3. Run:

```text
START-LIFESTYLE.bat
```

The launcher automatically performs the following tasks:

* Detects the installed PHP or XAMPP environment.
* Creates a project-specific PHP configuration inside `.runtime-php/php.ini`.
* Enables the required PHP extensions:

  * `mbstring`
  * `openssl`
  * `pdo_sqlite`
  * `sqlite3`
  * `fileinfo`
* Initializes the SQLite database.
* Clears all Laravel caches.
* Executes database migrations.
* Automatically selects an available port and launches the application in the default web browser.

This process affects only the project environment and does **not** modify the system-wide PHP configuration.

---

# Resolving the mbstring Extension Issue

Previous versions could produce the following error:

```text
PHP extension mbstring is disabled
```

This occurred because the active PHP installation was not loading the `mbstring` extension.

The current release resolves this automatically by generating a dedicated project-specific PHP configuration and enabling all required extensions from the local PHP or XAMPP installation.

---

# Demo Accounts

## Standard User

```text
Email: user@lifestyle.test
Password: Password123!
```

## Administrator

```text
Email: admin@lifestyle.test
Password: Admin123!
```

After signing in as an administrator, open:

```text
http://127.0.0.1:8001/admin/dashboard
```

If port **8001** is unavailable, the launcher will automatically use another available port (such as **8002** or **8003**) and display the correct URL.

---

# PHP Diagnostics

If PHP-related issues persist, execute:

```text
DIAGNOSE-PHP.bat
```

The diagnostic tool displays:

* Active PHP executable path
* Global `php.ini` location
* Project-specific `php.ini`
* Loaded PHP extensions

---

# Database

The project uses SQLite by default.

Database location:

```text
database/database.sqlite
```

To restore the demonstration data:

```text
RESET-DEMO-DATABASE.bat
```

An alternative MySQL configuration template is provided:

```text
.env.mysql.example
```

---

# Native User Interface

The original frontend resources are located in:

```text
resources/views/original/
public/css/original-overrides.css
public/js/original-app.js
frontend-source/
```

No frontend compilation is required.

Running `npm install` or `npm run dev` is **not** necessary.

The interface relies on **Google Fonts** and the **Tailwind Play CDN**, so an internet connection is required for full visual styling.

---

# Main Routes

```text
/
/login
/register
/app/dashboard
/app/tasks
/app/habits
/app/journal
/app/mood
/app/notifications
/app/profile
/admin/dashboard
/api/*
```

---

# Manual Execution

Run `START-LIFESTYLE.bat` once to generate the local PHP configuration.

Subsequently, the application can be started manually using PowerShell:

```powershell
cd "C:\Projects\Lifestyle-Original-UI-Final-v2"

$env:PHPRC = "$PWD\.runtime-php"
$env:PHP_INI_SCAN_DIR = ""

php artisan optimize:clear
php artisan migrate --force
php artisan serve --host=127.0.0.1 --port=8001
```

---

# Project Verification

Use the following commands to verify the project configuration and functionality:

```powershell
powershell -ExecutionPolicy Bypass -File .\VERIFY-PROJECT.ps1

php artisan route:list --except-vendor

php artisan test
```

These commands validate the project environment, display the registered application routes, and execute the automated test suite to ensure that all implemented features are functioning correctly.
