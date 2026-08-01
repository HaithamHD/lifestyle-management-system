# 3B · Design Patterns

Four design patterns are implemented in the Lifestyle backend. Each entry follows the format required by the assignment: **name → purpose → why we chose it → how we implemented it → source-code screenshot**.

---

## 3B.1 Repository Pattern

**Purpose.** Isolate persistence logic behind an interface so that controllers and services depend on the *contract* (`TaskRepositoryInterface`), never on the concrete Eloquent implementation. This means we can swap the underlying database (or mock it in tests) without touching a single line of controller code.

**Why we chose it.** Controllers were becoming littered with Eloquent query chains that were hard to test and hard to reuse. Every "give me this user's tasks due today" query was duplicated. A repository consolidates those queries into one class per aggregate root and gives us a natural seam for testing.

**Implementation.**

1. `app/Repositories/Contracts/TaskRepositoryInterface.php` declares the contract.
2. `app/Repositories/EloquentTaskRepository.php` implements it against Eloquent.
3. `app/Providers/AppServiceProvider::register()` binds the interface to the implementation in Laravel's service container.
4. `TaskController` type-hints the *interface* in its constructor; the container hands it the concrete class automatically.

The swap point is a single line — replace `EloquentTaskRepository::class` with, for example, `RedisTaskRepository::class`, and the rest of the app is unchanged.

> **Screenshots:**
> - [`screenshots/03B-01a-repo-interface.png`](../screenshots/03B-01a-repo-interface.png) — `TaskRepositoryInterface.php`
> - [`screenshots/03B-01b-repo-eloquent.png`](../screenshots/03B-01b-repo-eloquent.png) — `EloquentTaskRepository.php`
> - [`screenshots/03B-01c-repo-binding.png`](../screenshots/03B-01c-repo-binding.png) — the binding in `AppServiceProvider`

---

## 3B.2 Observer Pattern

**Purpose.** When a `Task` transitions to `completed`, several side-effects must fire: an in-app notification is created, an outgoing notification is dispatched through the active channel, and an audit-log line is written. We want those effects to happen automatically without every controller remembering to call each one.

**Why we chose it.** The alternative — sprinkling side-effect calls in every controller action that mutates a task — is fragile and leaks domain rules into the HTTP layer. The Observer pattern lets Eloquent invoke a listener class on model lifecycle events, keeping controllers thin and side-effects centralized.

**Implementation.**

1. `app/Observers/TaskObserver.php` declares handlers for `created`, `updated`, and `deleted`.
2. `updated()` inspects `wasChanged('status')` and delegates to `onCompleted()` when the transition is exactly "→ completed".
3. `onCompleted()` writes to the `notifications` table and calls the injected `NotificationChannel` — which itself is the Strategy pattern (§3B.4).
4. `AppServiceProvider::boot()` registers the observer with a single `Task::observe(TaskObserver::class)` call. All Task mutations everywhere in the app — controllers, scheduled jobs, admin actions — automatically trigger the observer.

> **Screenshots:**
> - [`screenshots/03B-02a-observer-class.png`](../screenshots/03B-02a-observer-class.png) — `TaskObserver.php`
> - [`screenshots/03B-02b-observer-registration.png`](../screenshots/03B-02b-observer-registration.png) — `AppServiceProvider::boot()`

---

## 3B.3 Factory Pattern

**Purpose.** Producing a valid `User`, `Task`, or `Habit` with realistic-looking data — and specific variations like "an admin user", "a suspended user", "a completed task", "an overdue task" — must be a one-liner in tests and seeders. Otherwise every test drags a long list of `create([...])` arrays with irrelevant details.

**Why we chose it.** Laravel's model-factory system is a canonical implementation of the Factory pattern. Rather than re-invent it, we lean into it — every test uses `User::factory()->create()` or `Task::factory()->completed()->create()`, and the factory encapsulates what "valid" means for that model.

**Implementation.**

1. `database/factories/UserFactory.php` and `TaskFactory.php` extend `Illuminate\Database\Eloquent\Factories\Factory`.
2. `definition()` returns the default random-but-valid attribute set.
3. **State methods** (`admin()`, `suspended()`, `unverified()`, `completed()`, `overdue()`) return typed variants — a small builder-on-top-of-factory that makes test intent readable.
4. Every model that needs one has the `HasFactory` trait; `User::factory()` and `Task::factory()` are then all a caller needs.

> **Screenshots:**
> - [`screenshots/03B-03a-user-factory.png`](../screenshots/03B-03a-user-factory.png) — `UserFactory.php`
> - [`screenshots/03B-03b-task-factory.png`](../screenshots/03B-03b-task-factory.png) — `TaskFactory.php`

---

## 3B.4 Strategy Pattern

**Purpose.** Notifications must be deliverable through several channels — Email today, Push (Firebase FCM) tomorrow, SMS (Twilio) for premium users. Callers (the `TaskObserver`, the scheduler, any future service) should not care which channel is active; they just call `send()`.

**Why we chose it.** The alternative — an `if ($channel === 'email') …` ladder wherever we notify — is a classic anti-pattern. It grows quadratically as channels multiply and forces every caller to know about every channel. Strategy pattern reduces the ladder to a single line hidden inside `ChannelStrategy::resolve()`.

**Implementation.**

1. `app/Services/Notification/Contracts/NotificationChannel.php` declares the strategy interface with a single `send(int $userId, string $message)` method (plus a `name()` for logging).
2. `EmailChannel`, `PushChannel`, and `SmsChannel` each implement the interface with their own transport (Laravel's `Mail`, HTTP call to FCM, Twilio REST API).
3. `ChannelStrategy::resolve(string $channel)` is a single `match` expression that returns the correct implementation.
4. `AppServiceProvider::register()` binds `NotificationChannel::class` to whichever channel the current environment configures (`config('notifications.default_channel')`). Callers only ever ask the container for `NotificationChannel`.
5. Adding a new channel = write one class + one match arm — no caller ever changes.

> **Screenshots:**
> - [`screenshots/03B-04a-strategy-interface.png`](../screenshots/03B-04a-strategy-interface.png) — the interface
> - [`screenshots/03B-04b-strategy-implementations.png`](../screenshots/03B-04b-strategy-implementations.png) — Email + Push + SMS classes side by side
> - [`screenshots/03B-04c-strategy-selector.png`](../screenshots/03B-04c-strategy-selector.png) — `ChannelStrategy::resolve()`
