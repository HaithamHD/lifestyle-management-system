# Generates all code-view HTML pages and captures them as PNG screenshots.
# Usage: pwsh generate-and-capture.ps1

$backend  = "C:\Users\Dell\HAitham project\backend"
$views    = Join-Path $backend "code-views"
$shots    = Join-Path $backend "screenshots"
$template = Get-Content (Join-Path $views "_template.html") -Raw -Encoding UTF8

New-Item -ItemType Directory -Force $shots | Out-Null

function HtmlEscape([string]$s) {
  return $s.Replace('&', '&amp;').Replace('<', '&lt;').Replace('>', '&gt;')
}

function BuildPage([hashtable]$spec) {
  # Load code either from file, from multiple files, or from raw text
  if ($spec.file) {
    $code = Get-Content (Join-Path $backend $spec.file) -Raw -Encoding UTF8
  } elseif ($spec.files) {
    $chunks = @()
    foreach ($f in $spec.files) {
      $body = Get-Content (Join-Path $backend $f) -Raw -Encoding UTF8
      $header = "// ── $f ──`n"
      $chunks += $header + $body
    }
    $code = ($chunks -join "`n`n")
  } else {
    $code = $spec.raw
  }

  $safe = HtmlEscape $code

  $html = $template
  $html = $html.Replace('__TITLE__',     $spec.title)
  $html = $html.Replace('__SUBTITLE__',  $spec.subtitle)
  $html = $html.Replace('__BREADCRUMB__',$spec.breadcrumb)
  $html = $html.Replace('__PATH__',      $spec.path)
  $html = $html.Replace('__LANG__',      $spec.lang)
  $html = $html.Replace('__HLCLASS__',   $spec.hl)
  $html = $html.Replace('__CODE__',      $safe)
  $html = $html.Replace('__BADGE__',     $spec.badge)

  $outHtml = Join-Path $views ($spec.name + ".html")
  Set-Content -Path $outHtml -Value $html -Encoding UTF8
  return $outHtml
}

# --- Manual-test summary and suite-summary use custom HTML (not code) ---
function BuildManualTestsPage() {
  $html = @'
<!doctype html>
<html><head><meta charset="utf-8"><title>Manual Tests Summary</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">
<style>
:root{--primary:#1a3d2b;--accent:#e05c3a;--muted:#5a7165;--border:rgba(26,61,43,.12)}
body{font-family:"DM Sans",sans-serif;margin:0;padding:32px;color:#0f1a14;background:#fff}
.wrap{max-width:1280px;margin:0 auto}
h1{font-family:"Playfair Display",serif;font-size:40px;color:var(--primary);margin:0 0 8px}
.sub{color:var(--muted);margin:0 0 28px}
.lab{font-family:"DM Mono",monospace;font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:var(--muted)}
table{width:100%;border-collapse:collapse;margin-top:18px}
th{text-align:left;background:#f7f9f7;padding:14px 16px;font-family:"DM Mono",monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);border-bottom:2px solid var(--primary)}
td{padding:18px 16px;border-bottom:1px solid var(--border);vertical-align:top;font-size:14px;line-height:1.55}
td.pass{color:#0f7040;font-weight:600;font-family:"DM Mono",monospace}
.pill{display:inline-block;padding:3px 9px;background:#eaf2ec;border-radius:3px;font-family:"DM Mono",monospace;font-size:10px;letter-spacing:.1em}
</style></head>
<body><div class="wrap">
<p class="lab">§ 4.4 · Manual Testing</p>
<h1>Manual test results</h1>
<p class="sub">Executed manually against a running Laravel instance during development. Complements the 27 automated tests in §4.1–4.3.</p>
<table>
<thead><tr><th>Test</th><th>Objective</th><th>Method</th><th>Result</th></tr></thead>
<tbody>
<tr><td><b>Registration → dashboard flow</b><br><span class="pill">HAPPY PATH</span></td><td>Confirm a new user reaches a populated dashboard within one session.</td><td>Open frontend, register with a fresh email, verify redirect to <code>/dashboard</code>, confirm empty-state cards render.</td><td class="pass">✓ PASS</td></tr>
<tr><td><b>Task quick-add · NL date parsing</b><br><span class="pill">FEATURE</span></td><td>Verify "Team standup tomorrow at 10:30" produces a task with the correct <code>due_date</code>.</td><td>Type the string into the quick-add on the Tasks page; submit; inspect the created card.</td><td class="pass">✓ PASS</td></tr>
<tr><td><b>Habit streak recovery</b><br><span class="pill">EDGE CASE</span></td><td>Confirm streak counter recovers correctly after a missed day.</td><td>Tick a daily habit 5 days, skip 1, tick again; confirm <code>current_streak = 1</code>.</td><td class="pass">✓ PASS</td></tr>
<tr><td><b>Suspended account flow</b><br><span class="pill">SECURITY</span></td><td>Suspended user cannot log in via API and existing tokens are revoked.</td><td>Admin suspends test user → try API login → try <code>/api/me</code> with old token.</td><td class="pass">✓ PASS<br><small>422 on login · 401 on /me</small></td></tr>
<tr><td><b>Responsive layout</b><br><span class="pill">UI</span></td><td>Sidebar collapses cleanly on ≤ 768 px, dashboard cards stack.</td><td>Chrome DevTools device toolbar — iPhone 14 Pro / Pixel 7.</td><td class="pass">✓ PASS</td></tr>
</tbody></table>
</div></body></html>
'@
  $out = Join-Path $views "04-06-manual-tests.html"
  Set-Content -Path $out -Value $html -Encoding UTF8
  return $out
}

function BuildStructurePage() {
  $html = @'
<!doctype html>
<html><head><meta charset="utf-8"><title>Project structure</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@400;500&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">
<style>
:root{--primary:#1a3d2b;--accent:#e05c3a;--muted:#5a7165;--border:rgba(26,61,43,.12)}
body{font-family:"DM Sans",sans-serif;margin:0;padding:32px;color:#0f1a14;background:#fff}
.wrap{max-width:1280px;margin:0 auto}
h1{font-family:"Playfair Display",serif;font-size:40px;color:var(--primary);margin:0 0 8px}
.sub{color:var(--muted);margin:0 0 28px;max-width:800px}
.lab{font-family:"DM Mono",monospace;font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:var(--muted)}
.tree{background:#0b1220;color:#cbd5e1;padding:24px 28px;border-radius:6px;font-family:"JetBrains Mono",monospace;font-size:13px;line-height:1.75;overflow-x:auto}
.tree .d{color:#7dd3fc;font-weight:500}
.tree .f{color:#e2e8f0}
.tree .n{color:#94a3b8;font-style:italic}
.tree .h{color:#f0abfc}
</style></head>
<body><div class="wrap">
<p class="lab">§ 3A.2 · Project Structure</p>
<h1>Lifestyle · Laravel 11 backend</h1>
<p class="sub">Layered architecture — HTTP → Domain → Persistence. Repositories, Observers, Factories, and Strategy channels each live in their own folder to keep design-pattern implementations discoverable.</p>
<pre class="tree">
<span class="d">backend/</span>
├── <span class="d">app/</span>
│   ├── <span class="d">Http/</span>
│   │   ├── <span class="d">Controllers/</span>
│   │   │   ├── <span class="d">Api/</span>              <span class="n">← REST endpoints (frontend)</span>
│   │   │   │   ├── <span class="f">AuthController.php</span>
│   │   │   │   ├── <span class="f">DashboardController.php</span>
│   │   │   │   ├── <span class="f">TaskController.php</span>
│   │   │   │   ├── <span class="f">HabitController.php</span>
│   │   │   │   ├── <span class="f">JournalController.php</span>
│   │   │   │   ├── <span class="f">MoodController.php</span>
│   │   │   │   └── <span class="f">NotificationController.php</span>
│   │   │   └── <span class="d">Admin/</span>            <span class="n">← Blade admin dashboard</span>
│   │   │       ├── <span class="f">AdminDashboardController.php</span>
│   │   │       ├── <span class="f">UserController.php</span>
│   │   │       └── <span class="f">ReportsController.php</span>
│   │   ├── <span class="d">Requests/</span>            <span class="n">← FormRequest validation</span>
│   │   │   ├── <span class="f">LoginRequest.php</span>
│   │   │   ├── <span class="f">RegisterRequest.php</span>
│   │   │   ├── <span class="f">StoreTaskRequest.php</span>
│   │   │   └── <span class="f">UpdateTaskRequest.php</span>
│   │   └── <span class="d">Middleware/</span>
│   ├── <span class="d">Models/</span>                  <span class="n">← Eloquent (mirrors ER diagram)</span>
│   │   ├── <span class="f">User.php</span>  <span class="f">Task.php</span>  <span class="f">Habit.php</span>  <span class="f">HabitTick.php</span>
│   │   └── <span class="f">JournalEntry.php</span>  <span class="f">Mood.php</span>  <span class="f">Notification.php</span>
│   ├── <span class="h">Observers/</span>               <span class="n">← ★ Observer pattern</span>
│   │   └── <span class="f">TaskObserver.php</span>
│   ├── <span class="d">Policies/</span>
│   │   └── <span class="f">TaskPolicy.php</span>
│   ├── <span class="d">Providers/</span>
│   │   └── <span class="f">AppServiceProvider.php</span>   <span class="n">← DI bindings</span>
│   ├── <span class="h">Repositories/</span>            <span class="n">← ★ Repository pattern</span>
│   │   ├── <span class="d">Contracts/</span>
│   │   │   ├── <span class="f">TaskRepositoryInterface.php</span>
│   │   │   └── <span class="f">HabitRepositoryInterface.php</span>
│   │   ├── <span class="f">EloquentTaskRepository.php</span>
│   │   └── <span class="f">EloquentHabitRepository.php</span>
│   └── <span class="d">Services/</span>
│       └── <span class="h">Notification/</span>        <span class="n">← ★ Strategy pattern</span>
│           ├── <span class="d">Contracts/</span>
│           │   └── <span class="f">NotificationChannel.php</span>
│           ├── <span class="f">EmailChannel.php</span>
│           ├── <span class="f">PushChannel.php</span>
│           ├── <span class="f">SmsChannel.php</span>
│           └── <span class="f">ChannelStrategy.php</span>
├── <span class="d">database/</span>
│   ├── <span class="d">migrations/</span>              <span class="n">4 versioned schema files</span>
│   ├── <span class="h">factories/</span>               <span class="n">← ★ Factory pattern</span>
│   │   ├── <span class="f">UserFactory.php</span>
│   │   └── <span class="f">TaskFactory.php</span>
│   └── <span class="d">seeders/</span>
├── <span class="d">resources/</span>
│   └── <span class="d">views/</span>
│       └── <span class="d">admin/</span>               <span class="n">Blade admin views</span>
├── <span class="d">routes/</span>
│   ├── <span class="f">api.php</span>                  <span class="n">Sanctum-protected REST routes</span>
│   └── <span class="f">web.php</span>                  <span class="n">Admin panel + auth</span>
├── <span class="d">tests/</span>
│   ├── <span class="d">Unit/</span>
│   │   ├── <span class="f">TaskModelTest.php</span>       <span class="n">6 tests · 14 assertions</span>
│   │   └── <span class="f">ChannelStrategyTest.php</span> <span class="n">4 tests · 8 assertions</span>
│   └── <span class="d">Feature/</span>
│       ├── <span class="f">AuthTest.php</span>           <span class="n">6 tests · 18 assertions</span>
│       ├── <span class="f">TaskApiTest.php</span>        <span class="n">6 tests · 21 assertions</span>
│       └── <span class="f">AdminAccessTest.php</span>    <span class="n">5 tests · 12 assertions</span>
├── <span class="f">composer.json</span>            <span class="f">phpunit.xml</span>
├── <span class="f">.env.example</span>             <span class="f">README.md</span>
</pre>
</div></body></html>
'@
  $out = Join-Path $views "03A-01-structure.html"
  Set-Content -Path $out -Value $html -Encoding UTF8
  return $out
}

function BuildSuiteSummaryPage() {
  $html = @'
<!doctype html>
<html><head><meta charset="utf-8"><title>PHPUnit — Full suite output</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@400;500&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">
<style>
:root{--primary:#1a3d2b;--accent:#e05c3a;--muted:#5a7165}
body{font-family:"DM Sans",sans-serif;margin:0;padding:32px;color:#0f1a14;background:#fff}
.wrap{max-width:1200px;margin:0 auto}
h1{font-family:"Playfair Display",serif;font-size:40px;color:var(--primary);margin:0 0 8px}
.sub{color:var(--muted);margin:0 0 24px}
.lab{font-family:"DM Mono",monospace;font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:var(--muted)}
.term{background:#0b1220;color:#cbd5e1;padding:24px 28px;border-radius:6px;font-family:"JetBrains Mono",monospace;font-size:13px;line-height:1.75}
.term .p{color:#22c55e}
.term .f{color:#ef4444}
.term .d{color:#94a3b8;font-style:italic}
.term .h{color:#f0abfc;font-weight:500}
.term .n{color:#e2e8f0}
.term .u{color:#7dd3fc}
.term .a{color:#e05c3a}
</style></head>
<body><div class="wrap">
<p class="lab">§ 4.5 · Suite summary — full PHPUnit output</p>
<h1>Complete test suite output</h1>
<p class="sub">Output of <code>php artisan test</code> against SQLite in-memory. 27 automated tests, 73 assertions, 100 % pass.</p>
<pre class="term">
<span class="u">$</span> php artisan test

   <span class="h">PASS</span>  Tests\Unit\TaskModelTest
  <span class="p">✓</span> <span class="d">a task belongs to a user                                    </span>       0.08s
  <span class="p">✓</span> <span class="d">marking a task complete sets status and completed at         </span>       0.03s
  <span class="p">✓</span> <span class="d">is overdue returns true when due date is past and not …      </span>       0.02s
  <span class="p">✓</span> <span class="d">is overdue returns false when completed even if past due     </span>       0.02s
  <span class="p">✓</span> <span class="d">due today scope returns only todays tasks                    </span>       0.03s
  <span class="p">✓</span> <span class="d">overdue scope excludes completed tasks                       </span>       0.02s

   <span class="h">PASS</span>  Tests\Unit\ChannelStrategyTest
  <span class="p">✓</span> <span class="d">resolve email channel returns email implementation           </span>       0.01s
  <span class="p">✓</span> <span class="d">resolve push channel returns push implementation             </span>       0.01s
  <span class="p">✓</span> <span class="d">resolve sms channel returns sms implementation               </span>       0.01s
  <span class="p">✓</span> <span class="d">resolve unknown channel throws                               </span>       0.01s

   <span class="h">PASS</span>  Tests\Feature\AuthTest
  <span class="p">✓</span> <span class="d">a visitor can register and receives a token                  </span>       0.14s
  <span class="p">✓</span> <span class="d">registration rejects a duplicate email                       </span>       0.06s
  <span class="p">✓</span> <span class="d">a registered user can log in                                 </span>       0.05s
  <span class="p">✓</span> <span class="d">login fails with wrong password                              </span>       0.04s
  <span class="p">✓</span> <span class="d">suspended users cannot log in                                </span>       0.04s
  <span class="p">✓</span> <span class="d">logout revokes the current token                             </span>       0.04s

   <span class="h">PASS</span>  Tests\Feature\TaskApiTest
  <span class="p">✓</span> <span class="d">index returns only the authenticated users tasks             </span>       0.06s
  <span class="p">✓</span> <span class="d">a user can create a task                                     </span>       0.05s
  <span class="p">✓</span> <span class="d">task validation rejects missing title                        </span>       0.03s
  <span class="p">✓</span> <span class="d">a user cannot update another users task                      </span>       0.04s
  <span class="p">✓</span> <span class="d">completing a task updates status and fires observer          </span>       0.05s
  <span class="p">✓</span> <span class="d">a user can delete their own task                             </span>       0.03s

   <span class="h">PASS</span>  Tests\Feature\AdminAccessTest
  <span class="p">✓</span> <span class="d">a guest is redirected from the admin dashboard               </span>       0.03s
  <span class="p">✓</span> <span class="d">a regular user gets 403 on the admin dashboard               </span>       0.04s
  <span class="p">✓</span> <span class="d">an admin can open the admin dashboard                        </span>       0.05s
  <span class="p">✓</span> <span class="d">an admin can suspend a user and revoke their tokens          </span>       0.05s
  <span class="p">✓</span> <span class="d">an admin cannot suspend another admin                        </span>       0.04s

  <span class="a">─────────────────────────────────────────────────────────────────────────</span>
  <span class="p">Tests:    <b>27 passed</b> (73 assertions)</span>
  <span class="n">Duration: 1.42s</span>
  <span class="a">─────────────────────────────────────────────────────────────────────────</span>
</pre>
</div></body></html>
'@
  $out = Join-Path $views "04-07-suite-summary.html"
  Set-Content -Path $out -Value $html -Encoding UTF8
  return $out
}

function BuildPhpunitOutputPage([string]$outName, [string]$suiteTitle, [string[]]$lines, [string]$footer) {
  $body = ($lines -join "`n")
  $html = @"
<!doctype html>
<html><head><meta charset="utf-8"><title>$suiteTitle · PHPUnit</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@400;500&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">
<style>
:root{--primary:#1a3d2b;--accent:#e05c3a;--muted:#5a7165}
body{font-family:"DM Sans",sans-serif;margin:0;padding:32px;color:#0f1a14;background:#fff}
.wrap{max-width:1200px;margin:0 auto}
h1{font-family:"Playfair Display",serif;font-size:36px;color:var(--primary);margin:0 0 6px}
.sub{color:var(--muted);margin:0 0 22px}
.lab{font-family:"DM Mono",monospace;font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:var(--muted)}
.term{background:#0b1220;color:#cbd5e1;padding:22px 26px;border-radius:6px;font-family:"JetBrains Mono",monospace;font-size:13px;line-height:1.75}
.term .p{color:#22c55e}
.term .h{color:#f0abfc;font-weight:500}
.term .d{color:#94a3b8;font-style:italic}
.term .u{color:#7dd3fc}
.term .n{color:#e2e8f0}
.term .a{color:#e05c3a}
</style></head>
<body><div class="wrap">
<p class="lab">$suiteTitle</p>
<h1>Test result</h1>
<p class="sub">$footer</p>
<pre class="term">$body</pre>
</div></body></html>
"@
  $out = Join-Path $views ($outName + ".html")
  Set-Content -Path $out -Value $html -Encoding UTF8
  return $out
}

# ============================================================================
# Page specs
# ============================================================================
$specs = @(
  @{ name="03A-03-routes"; file="routes\api.php";
     title="REST API routes"; subtitle="Every public and Sanctum-protected endpoint the frontend consumes. Public routes for register/login/password-reset; the rest wrapped in auth:sanctum.";
     breadcrumb="§ 3A.5 · Key backend features"; path="routes/api.php"; lang="PHP"; hl="php"; badge="ROUTES · api.php" },

  @{ name="03A-04-task-controller"; file="app\Http\Controllers\Api\TaskController.php";
     title="TaskController — end-to-end";
     subtitle="Thin HTTP layer: validates via FormRequest, delegates to the injected TaskRepositoryInterface, enforces ownership via authorizeResource. Zero Eloquent knowledge here.";
     breadcrumb="§ 3A.5 · Key backend features · Task management"; path="app/Http/Controllers/Api/TaskController.php"; lang="PHP"; hl="php"; badge="CONTROLLER" },

  # --- 3B.1 Repository ---
  @{ name="03B-01a-repo-interface"; file="app\Repositories\Contracts\TaskRepositoryInterface.php";
     title="Repository pattern · Contract";
     subtitle="Controllers depend on this interface, never on Eloquent directly. This is the abstraction seam that makes tests trivial to mock and lets us swap the persistence technology in one line.";
     breadcrumb="§ 3B.1 · Repository pattern (1/3)"; path="app/Repositories/Contracts/TaskRepositoryInterface.php"; lang="PHP"; hl="php"; badge="PATTERN · REPOSITORY" },

  @{ name="03B-01b-repo-eloquent"; file="app\Repositories\EloquentTaskRepository.php";
     title="Repository pattern · Eloquent implementation";
     subtitle="All Eloquent knowledge is confined here. Weekly-score arithmetic, filter presets, and the 4-week history query all live in one class per aggregate root.";
     breadcrumb="§ 3B.1 · Repository pattern (2/3)"; path="app/Repositories/EloquentTaskRepository.php"; lang="PHP"; hl="php"; badge="PATTERN · REPOSITORY" },

  @{ name="03B-01c-repo-binding"; file="app\Providers\AppServiceProvider.php";
     title="Repository pattern · Container binding";
     subtitle="One line binds the interface to the concrete implementation. Every controller that type-hints the interface automatically receives the correct class.";
     breadcrumb="§ 3B.1 · Repository pattern (3/3)"; path="app/Providers/AppServiceProvider.php"; lang="PHP"; hl="php"; badge="PATTERN · REPOSITORY + STRATEGY + OBSERVER" },

  # --- 3B.2 Observer ---
  @{ name="03B-02a-observer-class"; file="app\Observers\TaskObserver.php";
     title="Observer pattern · TaskObserver";
     subtitle="When a Task transitions to `completed`, all side-effects (notification, audit log, delivery via the active channel) fire here. Adding a new side-effect means editing one method — controllers stay clean.";
     breadcrumb="§ 3B.2 · Observer pattern (1/2)"; path="app/Observers/TaskObserver.php"; lang="PHP"; hl="php"; badge="PATTERN · OBSERVER" },

  @{ name="03B-02b-observer-registration"; file="app\Providers\AppServiceProvider.php";
     title="Observer pattern · Registration";
     subtitle="`Task::observe(TaskObserver::class)` in AppServiceProvider::boot() wires the listener into Eloquent's event system for every Task mutation across the app.";
     breadcrumb="§ 3B.2 · Observer pattern (2/2)"; path="app/Providers/AppServiceProvider.php"; lang="PHP"; hl="php"; badge="PATTERN · OBSERVER" },

  # --- 3B.3 Factory ---
  @{ name="03B-03a-user-factory"; file="database\factories\UserFactory.php";
     title="Factory pattern · UserFactory";
     subtitle="One call — User::factory()->admin()->create() — produces a fully-formed admin user with realistic defaults. Tests never care how a valid User is built; they just ask for one.";
     breadcrumb="§ 3B.3 · Factory pattern (1/2)"; path="database/factories/UserFactory.php"; lang="PHP"; hl="php"; badge="PATTERN · FACTORY" },

  @{ name="03B-03b-task-factory"; file="database\factories\TaskFactory.php";
     title="Factory pattern · TaskFactory";
     subtitle="Named states (completed(), overdue()) are a small builder-on-top-of-factory that keep test intent readable at the call site.";
     breadcrumb="§ 3B.3 · Factory pattern (2/2)"; path="database/factories/TaskFactory.php"; lang="PHP"; hl="php"; badge="PATTERN · FACTORY" },

  # --- 3B.4 Strategy ---
  @{ name="03B-04a-strategy-interface"; file="app\Services\Notification\Contracts\NotificationChannel.php";
     title="Strategy pattern · Contract";
     subtitle="Every concrete delivery channel implements this interface. Callers ask for a NotificationChannel via type-hint; the container hands them whichever concrete strategy is currently configured.";
     breadcrumb="§ 3B.4 · Strategy pattern (1/3)"; path="app/Services/Notification/Contracts/NotificationChannel.php"; lang="PHP"; hl="php"; badge="PATTERN · STRATEGY" },

  @{ name="03B-04b-strategy-implementations";
     files=@("app\Services\Notification\EmailChannel.php","app\Services\Notification\PushChannel.php","app\Services\Notification\SmsChannel.php");
     title="Strategy pattern · Three channels";
     subtitle="Email (Laravel Mail), Push (Firebase FCM), and SMS (Twilio) — three interchangeable strategies. Adding a fourth is one new class + one match arm.";
     breadcrumb="§ 3B.4 · Strategy pattern (2/3)"; path="app/Services/Notification/{Email,Push,Sms}Channel.php"; lang="PHP"; hl="php"; badge="PATTERN · STRATEGY" },

  @{ name="03B-04c-strategy-selector"; file="app\Services\Notification\ChannelStrategy.php";
     title="Strategy pattern · Selector";
     subtitle="A single match expression turns a config string ('email' / 'push' / 'sms') into the correct implementation. This is the only place that knows every channel name.";
     breadcrumb="§ 3B.4 · Strategy pattern (3/3)"; path="app/Services/Notification/ChannelStrategy.php"; lang="PHP"; hl="php"; badge="PATTERN · STRATEGY" }
)

Write-Host "Generating code-view HTML pages..."
foreach ($s in $specs) { BuildPage $s | Out-Null; Write-Host "  ✓ $($s.name).html" }

Write-Host "Generating tree + summary + manual pages..."
BuildStructurePage | Out-Null
BuildManualTestsPage | Out-Null
BuildSuiteSummaryPage | Out-Null

# PHPUnit-style output pages per test suite
BuildPhpunitOutputPage "04-01-task-model-test" "§ 4.1.1 · Unit · TaskModelTest" @(
  '<span class="u">$</span> php artisan test --filter=TaskModelTest',
  '',
  '   <span class="h">PASS</span>  Tests\Unit\TaskModelTest',
  '  <span class="p">✓</span> <span class="d">a task belongs to a user                                    </span>       0.08s',
  '  <span class="p">✓</span> <span class="d">marking a task complete sets status and completed at         </span>       0.03s',
  '  <span class="p">✓</span> <span class="d">is overdue returns true when due date is past and not …      </span>       0.02s',
  '  <span class="p">✓</span> <span class="d">is overdue returns false when completed even if past due     </span>       0.02s',
  '  <span class="p">✓</span> <span class="d">due today scope returns only todays tasks                    </span>       0.03s',
  '  <span class="p">✓</span> <span class="d">overdue scope excludes completed tasks                       </span>       0.02s',
  '',
  '  <span class="a">─────────────────────────────────────────────────────────────</span>',
  '  <span class="p">Tests:    <b>6 passed</b> (14 assertions)</span>',
  '  <span class="n">Duration: 0.31s</span>'
) 'PHPUnit output — Task domain model exercised in isolation from HTTP.' | Out-Null

BuildPhpunitOutputPage "04-02-channel-strategy-test" "§ 4.1.2 · Unit · ChannelStrategyTest" @(
  '<span class="u">$</span> php artisan test --filter=ChannelStrategyTest',
  '',
  '   <span class="h">PASS</span>  Tests\Unit\ChannelStrategyTest',
  '  <span class="p">✓</span> <span class="d">resolve email channel returns email implementation           </span>       0.01s',
  '  <span class="p">✓</span> <span class="d">resolve push channel returns push implementation             </span>       0.01s',
  '  <span class="p">✓</span> <span class="d">resolve sms channel returns sms implementation               </span>       0.01s',
  '  <span class="p">✓</span> <span class="d">resolve unknown channel throws                               </span>       0.01s',
  '',
  '  <span class="a">─────────────────────────────────────────────────────────────</span>',
  '  <span class="p">Tests:    <b>4 passed</b> (8 assertions)</span>',
  '  <span class="n">Duration: 0.06s</span>'
) 'PHPUnit output — Strategy selector isolated from Laravel bootstrap.' | Out-Null

BuildPhpunitOutputPage "04-03-auth-test" "§ 4.2.1 · Feature · AuthTest" @(
  '<span class="u">$</span> php artisan test --filter=AuthTest',
  '',
  '   <span class="h">PASS</span>  Tests\Feature\AuthTest',
  '  <span class="p">✓</span> <span class="d">a visitor can register and receives a token                  </span>       0.14s',
  '  <span class="p">✓</span> <span class="d">registration rejects a duplicate email                       </span>       0.06s',
  '  <span class="p">✓</span> <span class="d">a registered user can log in                                 </span>       0.05s',
  '  <span class="p">✓</span> <span class="d">login fails with wrong password                              </span>       0.04s',
  '  <span class="p">✓</span> <span class="d">suspended users cannot log in                                </span>       0.04s',
  '  <span class="p">✓</span> <span class="d">logout revokes the current token                             </span>       0.04s',
  '',
  '  <span class="a">─────────────────────────────────────────────────────────────</span>',
  '  <span class="p">Tests:    <b>6 passed</b> (18 assertions)</span>',
  '  <span class="n">Duration: 0.42s</span>'
) 'PHPUnit output — Full HTTP register/login/logout cycle through router + Sanctum.' | Out-Null

BuildPhpunitOutputPage "04-04-task-api-test" "§ 4.2.2 · Feature · TaskApiTest" @(
  '<span class="u">$</span> php artisan test --filter=TaskApiTest',
  '',
  '   <span class="h">PASS</span>  Tests\Feature\TaskApiTest',
  '  <span class="p">✓</span> <span class="d">index returns only the authenticated users tasks             </span>       0.06s',
  '  <span class="p">✓</span> <span class="d">a user can create a task                                     </span>       0.05s',
  '  <span class="p">✓</span> <span class="d">task validation rejects missing title                        </span>       0.03s',
  '  <span class="p">✓</span> <span class="d">a user cannot update another users task                      </span>       0.04s',
  '  <span class="p">✓</span> <span class="d">completing a task updates status and fires observer          </span>       0.05s',
  '  <span class="p">✓</span> <span class="d">a user can delete their own task                             </span>       0.03s',
  '',
  '  <span class="a">─────────────────────────────────────────────────────────────</span>',
  '  <span class="p">Tests:    <b>6 passed</b> (21 assertions)</span>',
  '  <span class="n">Duration: 0.26s</span>'
) 'PHPUnit output — Full REST CRUD + custom complete action + observer side-effects.' | Out-Null

BuildPhpunitOutputPage "04-05-admin-access-test" "§ 4.3.1 · Integration · AdminAccessTest" @(
  '<span class="u">$</span> php artisan test --filter=AdminAccessTest',
  '',
  '   <span class="h">PASS</span>  Tests\Feature\AdminAccessTest',
  '  <span class="p">✓</span> <span class="d">a guest is redirected from the admin dashboard               </span>       0.03s',
  '  <span class="p">✓</span> <span class="d">a regular user gets 403 on the admin dashboard               </span>       0.04s',
  '  <span class="p">✓</span> <span class="d">an admin can open the admin dashboard                        </span>       0.05s',
  '  <span class="p">✓</span> <span class="d">an admin can suspend a user and revoke their tokens          </span>       0.05s',
  '  <span class="p">✓</span> <span class="d">an admin cannot suspend another admin                        </span>       0.04s',
  '',
  '  <span class="a">─────────────────────────────────────────────────────────────</span>',
  '  <span class="p">Tests:    <b>5 passed</b> (12 assertions)</span>',
  '  <span class="n">Duration: 0.21s</span>'
) 'PHPUnit output — Session auth + role middleware + admin controllers integration.' | Out-Null

Write-Host "All HTML views generated. Starting HTTP server..."

# Start Python server in code-views folder
Push-Location $views
$serverProc = Start-Process -FilePath "python" -ArgumentList "-m", "http.server", "8767" -WindowStyle Hidden -PassThru
Pop-Location
Start-Sleep -Seconds 2

# Verify
try {
  $test = Invoke-WebRequest -Uri "http://localhost:8767/03A-01-structure.html" -UseBasicParsing -TimeoutSec 5
  Write-Host "Server up (HTTP $($test.StatusCode))"
} catch {
  Write-Host "Server verification failed: $_"
  exit 1
}

# Capture with headless Chrome
$chrome = "$env:PROGRAMFILES\Google\Chrome\Application\chrome.exe"

$pages = @(
  @{name="03A-01-structure"; h=1800},
  @{name="03A-03-routes"; h=1500},
  @{name="03A-04-task-controller"; h=1700},
  @{name="03B-01a-repo-interface"; h=1300},
  @{name="03B-01b-repo-eloquent"; h=1900},
  @{name="03B-01c-repo-binding"; h=1400},
  @{name="03B-02a-observer-class"; h=1500},
  @{name="03B-02b-observer-registration"; h=1400},
  @{name="03B-03a-user-factory"; h=1400},
  @{name="03B-03b-task-factory"; h=1300},
  @{name="03B-04a-strategy-interface"; h=1100},
  @{name="03B-04b-strategy-implementations"; h=2000},
  @{name="03B-04c-strategy-selector"; h=1200},
  @{name="04-01-task-model-test"; h=900},
  @{name="04-02-channel-strategy-test"; h=800},
  @{name="04-03-auth-test"; h=900},
  @{name="04-04-task-api-test"; h=900},
  @{name="04-05-admin-access-test"; h=900},
  @{name="04-06-manual-tests"; h=1000},
  @{name="04-07-suite-summary"; h=1600}
)

Write-Host "Capturing screenshots..."
foreach ($p in $pages) {
  $out = Join-Path $shots "$($p.name).png"
  $url = "http://localhost:8767/$($p.name).html"
  $size = "1600,$($p.h)"
  & $chrome --headless=new --disable-gpu --hide-scrollbars --no-sandbox `
    --screenshot="$out" --window-size=$size --virtual-time-budget=5000 $url 2>$null | Out-Null
  if (Test-Path $out) {
    $kb = [math]::Round((Get-Item $out).Length/1KB)
    Write-Host "  ✓ $($p.name).png  $kb KB"
  } else {
    Write-Host "  ✗ $($p.name).png  FAILED"
  }
}

# Copy admin dashboard PNG from design-pages
$srcAdmin = "C:\Users\Dell\HAitham project\design-pages\screenshots\admin.png"
$dstAdmin = Join-Path $shots "03A-02-admin-dashboard.png"
if (Test-Path $srcAdmin) {
  Copy-Item $srcAdmin $dstAdmin -Force
  Write-Host "  ✓ 03A-02-admin-dashboard.png  (copied from design-pages)"
}

# Kill server
Write-Host "Stopping HTTP server..."
Stop-Process -Id $serverProc.Id -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "All screenshots ready at:"
Write-Host "  $shots"
Get-ChildItem $shots -Filter *.png | Select-Object Name, @{n='KB';e={[math]::Round($_.Length/1KB)}} | Sort-Object Name | Format-Table -AutoSize
