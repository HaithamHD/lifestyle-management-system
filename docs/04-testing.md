# 4 · Testing Phase

The test suite lives under `tests/` and runs on **PHPUnit 11** against an **in-memory SQLite** database. The whole suite executes in a few seconds and requires no external services — every test uses `RefreshDatabase` so it starts from a clean schema.

Run the whole suite:

```bash
php artisan test
```

Run a single suite:

```bash
php artisan test --testsuite=Unit
php artisan test --testsuite=Feature
```

The rest of this section documents every test type performed in the format required by the assignment: **name → objective → method → result → screenshot**.

---

## 4.1 Unit Testing

Unit tests exercise a single class in isolation — no HTTP layer, no service container bootstrap unless needed for Eloquent, no external services.

### 4.1.1 TaskModelTest

| Field | Detail |
|---|---|
| **Test name** | `Tests\Unit\TaskModelTest` (6 test methods) |
| **Objective** | Verify that the `Task` model's attribute casting, state transitions, and query scopes behave correctly in isolation from the HTTP layer. |
| **Method** | PHPUnit tests that build tasks via `Task::factory()`, invoke domain methods (`markComplete()`, scopes like `dueToday()`, `overdue()`), and assert the resulting model state. Uses `RefreshDatabase` on an in-memory SQLite. |
| **Test result** | ✅ **6 / 6 passing** · 14 assertions. |
| **Screenshot** | [`screenshots/04-01-task-model-test.png`](../screenshots/04-01-task-model-test.png) — the test file plus the PHPUnit output. |

**Cases covered:** relationship with User; `markComplete()` sets status + timestamp; `is_overdue` accessor logic; `dueToday` scope; `overdue` scope excludes completed tasks.

---

### 4.1.2 ChannelStrategyTest

| Field | Detail |
|---|---|
| **Test name** | `Tests\Unit\ChannelStrategyTest` (4 test methods) |
| **Objective** | Verify that the Strategy-pattern selector (`ChannelStrategy::resolve`) returns the correct concrete `NotificationChannel` implementation for each supported channel name, and throws on unknown channels. |
| **Method** | Extends the vanilla `PHPUnit\Framework\TestCase` (no Laravel bootstrap needed — `ChannelStrategy` is pure code). Each test asserts the returned instance type and its `name()` slug. Failure path uses `expectException(InvalidArgumentException::class)`. |
| **Test result** | ✅ **4 / 4 passing** · 8 assertions. |
| **Screenshot** | [`screenshots/04-02-channel-strategy-test.png`](../screenshots/04-02-channel-strategy-test.png) |

---

## 4.2 Feature Testing

Feature tests hit real HTTP routes through the router, middleware, controllers, requests, and observers — the full stack, but still in-process.

### 4.2.1 AuthTest

| Field | Detail |
|---|---|
| **Test name** | `Tests\Feature\AuthTest` (6 test methods) |
| **Objective** | Verify the end-to-end authentication flow: register issues a token, duplicate emails are rejected, login works with correct credentials and fails with wrong ones, suspended users cannot sign in, and logout revokes the current token. |
| **Method** | Laravel's `postJson()` / `withHeader()` HTTP helpers exercise `/api/register`, `/api/login`, `/api/logout`. Assertions cover status codes, JSON structure, JSON validation errors, and database state (`assertDatabaseHas`, `assertDatabaseCount`). |
| **Test result** | ✅ **6 / 6 passing** · 18 assertions. |
| **Screenshot** | [`screenshots/04-03-auth-test.png`](../screenshots/04-03-auth-test.png) |

---

### 4.2.2 TaskApiTest

| Field | Detail |
|---|---|
| **Test name** | `Tests\Feature\TaskApiTest` (6 test methods) |
| **Objective** | Verify the Task REST API's core CRUD + custom `complete` action, including ownership scoping (one user cannot mutate another user's task), validation rejections, and side effects triggered by `TaskObserver` (a `task.completed` notification is created). |
| **Method** | `Sanctum::actingAs($user)` bypasses token issuance. Requests hit `/api/tasks/*` endpoints. Assertions cover HTTP status, JSON body shape via `assertJsonPath`, database persistence, and observer side-effects via `assertDatabaseHas('notifications', …)`. |
| **Test result** | ✅ **6 / 6 passing** · 21 assertions. |
| **Screenshot** | [`screenshots/04-04-task-api-test.png`](../screenshots/04-04-task-api-test.png) |

---

## 4.3 Integration Testing

Integration tests verify that multiple layers interoperate correctly — in this case, session auth + role middleware + admin controllers + policies.

### 4.3.1 AdminAccessTest

| Field | Detail |
|---|---|
| **Test name** | `Tests\Feature\AdminAccessTest` (5 test methods) |
| **Objective** | Verify that the admin dashboard's access control cannot be bypassed: guests are redirected to login, regular users get 403, admins can enter and manage users, and admins cannot suspend or delete each other. |
| **Method** | Uses Laravel's session-based `actingAs()` (as opposed to Sanctum) to simulate a browser session, then hits `/admin` and `/admin/users/{id}/suspend`. Assertions cover HTTP redirects, `403` responses, the returned view name, view-data keys, and post-condition database state (user status, token revocation). |
| **Test result** | ✅ **5 / 5 passing** · 12 assertions. |
| **Screenshot** | [`screenshots/04-05-admin-access-test.png`](../screenshots/04-05-admin-access-test.png) |

---

## 4.4 Manual Testing

In addition to the automated suite above, the following manual tests were performed against a running instance during development:

| Test | Objective | Method | Result |
|---|---|---|---|
| **Registration → dashboard flow** | Confirm a new user reaches a populated dashboard within one session. | Open frontend, register a new account with a fresh email, verify redirect to `/dashboard`, confirm empty-state cards render correctly. | ✅ Pass |
| **Task quick-add & natural-language date parsing** | Verify the "Team standup tomorrow at 10:30" quick-add produces a task with `due_date` set to the next day at 10:30. | Type the string into the quick-add input on the Tasks page, submit, inspect the created card. | ✅ Pass |
| **Habit streak recovery** | Confirm streak counter recovers correctly after a missed day. | Tick a daily habit for 5 consecutive days, skip a day, tick again, confirm `current_streak = 1` (not 0, not 6). | ✅ Pass |
| **Suspended account flow** | Confirm a suspended user cannot log in via the API and existing tokens are invalidated. | Admin panel → suspend a test user → attempt API login with their old credentials → attempt to call `/api/me` with their previously issued token. | ✅ Pass — login returns 422 "account suspended", `/me` returns 401. |
| **Responsive layout on mobile** | Confirm the sidebar collapses cleanly on ≤ 768 px viewports and the dashboard cards stack. | Chrome DevTools device toolbar → iPhone 14 Pro / Pixel 7. | ✅ Pass |

> **Screenshot:** [`screenshots/04-06-manual-tests.png`](../screenshots/04-06-manual-tests.png) — summary sheet.

---

## 4.5 Suite summary

| Suite | Files | Tests | Assertions | Status |
|---|---|---|---|---|
| Unit | 2 | 10 | 22 | ✅ All pass |
| Feature (API) | 2 | 12 | 39 | ✅ All pass |
| Feature (Integration) | 1 | 5 | 12 | ✅ All pass |
| Manual | — | 5 | — | ✅ All pass |
| **Total** | **5 files + manual** | **27 automated + 5 manual** | **73** | ✅ 100 % |

> **Screenshot:** [`screenshots/04-07-suite-summary.png`](../screenshots/04-07-suite-summary.png) — full PHPUnit output.
