# 3A · Backend Documentation

## 3A.1 Overview

The backend of the **Lifestyle** system is a **Laravel 11** REST API written in **PHP 8.2**, backed by **MySQL 8** (or SQLite for tests). It exposes JSON endpoints consumed by the frontend and serves a Blade-rendered admin dashboard for administrators. Authentication uses **Laravel Sanctum** with personal access tokens for the API and session cookies for the admin panel.

The application follows a **layered architecture** (Presentation → HTTP → Domain → Persistence) mirrored in the folder layout, with dependency inversion via a Repository layer so the persistence technology can be swapped without touching business logic.

---

## 3A.2 Project structure

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Api/            ← REST endpoints consumed by the frontend
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── DashboardController.php
│   │   │   │   ├── TaskController.php
│   │   │   │   ├── HabitController.php
│   │   │   │   ├── JournalController.php
│   │   │   │   ├── MoodController.php
│   │   │   │   └── NotificationController.php
│   │   │   └── Admin/          ← Blade-rendered admin dashboard
│   │   │       ├── AdminDashboardController.php
│   │   │       ├── UserController.php
│   │   │       └── ReportsController.php
│   │   ├── Requests/           ← FormRequest validation classes
│   │   │   ├── LoginRequest.php
│   │   │   ├── RegisterRequest.php
│   │   │   ├── StoreTaskRequest.php
│   │   │   └── UpdateTaskRequest.php
│   │   └── Middleware/         ← Custom RBAC + request logging
│   ├── Models/                 ← Eloquent domain models
│   │   ├── User.php
│   │   ├── Task.php
│   │   ├── Habit.php    ├── HabitTick.php
│   │   ├── JournalEntry.php
│   │   ├── Mood.php
│   │   └── Notification.php
│   ├── Observers/              ← Model-lifecycle listeners  (Observer pattern)
│   │   └── TaskObserver.php
│   ├── Policies/               ← Authorization rules
│   │   └── TaskPolicy.php
│   ├── Providers/
│   │   └── AppServiceProvider.php   ← DI bindings for Repository + Strategy
│   ├── Repositories/           ← Repository pattern
│   │   ├── Contracts/
│   │   │   ├── TaskRepositoryInterface.php
│   │   │   └── HabitRepositoryInterface.php
│   │   ├── EloquentTaskRepository.php
│   │   └── EloquentHabitRepository.php
│   └── Services/
│       └── Notification/       ← Strategy pattern
│           ├── Contracts/
│           │   └── NotificationChannel.php
│           ├── EmailChannel.php
│           ├── PushChannel.php
│           ├── SmsChannel.php
│           └── ChannelStrategy.php
├── database/
│   ├── migrations/             ← Schema definitions (versioned)
│   ├── factories/              ← Model factories  (Factory pattern)
│   └── seeders/                ← Realistic sample data for demos
├── resources/
│   └── views/
│       └── admin/              ← Admin-dashboard Blade views
│           ├── layout.blade.php
│           ├── dashboard.blade.php
│           └── users/          index.blade.php, show.blade.php
├── routes/
│   ├── api.php                 ← Public + Sanctum-protected API routes
│   └── web.php                 ← Admin-panel routes
├── tests/
│   ├── Unit/                   ← Isolated model + service tests
│   │   ├── TaskModelTest.php
│   │   └── ChannelStrategyTest.php
│   └── Feature/                ← Full-stack HTTP tests
│       ├── AuthTest.php
│       ├── TaskApiTest.php
│       └── AdminAccessTest.php
├── composer.json
├── phpunit.xml
├── .env.example
└── README.md
```

> **Screenshot:** [`screenshots/03A-01-structure.png`](../screenshots/03A-01-structure.png) — full folder tree rendered from a file-explorer view.

---

## 3A.3 Important folders and files

| Folder / file | Responsibility |
|---|---|
| `routes/api.php` | Defines every JSON endpoint. Public routes for register/login/password-reset; the rest are wrapped in `auth:sanctum`. |
| `routes/web.php` | Admin dashboard routes, wrapped in `auth` + a custom `role:admin` middleware. |
| `app/Http/Controllers/Api/` | Thin HTTP layer — each controller validates via a `FormRequest`, delegates to a repository, returns JSON. Zero business logic here. |
| `app/Http/Requests/` | One `FormRequest` per action. Validation and authorization live here, not in the controller. |
| `app/Models/` | Eloquent entities matching the ER Diagram (§7 of the base document): User, Task, Habit, HabitTick, JournalEntry, Mood, Notification. |
| `app/Repositories/` | The **only** place that talks to Eloquent for aggregate queries. Controllers depend on the *interface*, not the implementation (see §3B.1). |
| `app/Observers/TaskObserver.php` | Reacts to Task lifecycle events (created / updated / deleted) — e.g., firing a notification when a task is completed (see §3B.2). |
| `app/Services/Notification/` | Multiple delivery channels behind a single interface (see §3B.4). |
| `app/Policies/TaskPolicy.php` | Ownership + role-based authorization rules for tasks. `authorizeResource(Task::class)` in the controller wires them in automatically. |
| `database/migrations/` | 4 migrations: users + auth tables, tasks, habits + habit_ticks, journal_entries + moods + notifications. |
| `database/factories/` | Realistic random-data factories used by tests and seeders (see §3B.3). |
| `resources/views/admin/` | Blade-rendered admin dashboard sharing the design language of the frontend (dark green + orange, Playfair Display, DM Mono labels). |
| `phpunit.xml` | Points tests at an in-memory SQLite database — the whole suite runs in seconds with no external dependencies. |

---

## 3A.4 Admin dashboard

The admin console is served under `/admin` and requires an authenticated user with `role = admin`. It provides:

- **Overview** — total users, users active today, system uptime, open issues.
- **Users** — searchable + filterable table of every account (role, status, streak, join date). Admins can view a user's detail page, suspend or restore accounts, and delete non-admin accounts.
- **Recent registrations** — latest 10 accounts at a glance from the overview page.
- **Reports** — system-wide reports on usage, task completion, and habit consistency.

Access control is enforced in two layers:

1. **Middleware** — `role:admin` on the route group. A guest is redirected to `/login`; a non-admin gets `403`.
2. **Controller** — `abort_if($user->isAdmin(), 403, …)` prevents even admins from suspending or deleting another admin.

Both layers are verified by the integration test `tests/Feature/AdminAccessTest.php` (§4).

> **Screenshot:** [`screenshots/03A-02-admin-dashboard.png`](../screenshots/03A-02-admin-dashboard.png) — the rendered admin console (design-phase mockup, `admin.html`).

---

## 3A.5 Key backend features

| Feature | Endpoints | Details |
|---|---|---|
| **Authentication** | `POST /api/register`, `/api/login`, `/api/logout`, `/api/password/forgot`, `/api/password/reset` | Sanctum personal-access tokens, bcrypt hashing, suspended-account gating, per-device token revocation. |
| **Task management** | `GET/POST/PATCH/DELETE /api/tasks`, `POST /api/tasks/{id}/complete` | Full CRUD + filter presets (today / upcoming / completed / overdue / all), ownership-only mutation via `TaskPolicy`, and observer-triggered notifications on completion. |
| **Habit tracking** | `GET/POST/PATCH/DELETE /api/habits`, `POST /api/habits/{id}/tick` | Ticks are dated (unique per habit + date), and `Habit::recalculateStreak()` recomputes `current_streak` and `best_streak` after each tick. |
| **Journal + Mood** | `GET/POST /api/journal`, `GET/POST /api/mood` | JSON-cast `tags` on journal entries; one mood record per user per day (`unique(user_id, recorded_on)`). |
| **Dashboard aggregate** | `GET /api/dashboard` | Single call returning weekly score, tasks/habits summaries, live habit streaks, and 4-week history — drives the whole home dashboard in one round-trip. |
| **Notifications** | `GET /api/notifications`, `POST /api/notifications/{id}/read`, `DELETE /api/notifications/{id}` | Backed by the `notifications` table + delivered through the pluggable Strategy channel (Email / Push / SMS) — see §3B.4. |
| **Admin** | `GET /admin`, `GET/PATCH/DELETE /admin/users`, `POST /admin/users/{id}/suspend`, `/restore` | RBAC-guarded Blade dashboard. |

> **Screenshots:** [`screenshots/03A-03-routes.png`](../screenshots/03A-03-routes.png) shows the routes file; [`screenshots/03A-04-task-controller.png`](../screenshots/03A-04-task-controller.png) shows the TaskController end-to-end.
