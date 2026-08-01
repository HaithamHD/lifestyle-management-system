<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>{{ ucfirst($page) }} · Lifestyle</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com"></script>
<script>
tailwind.config = { theme: { extend: {
  colors: {
    background: "#ffffff", foreground: "#0f1a14", card: "#f7f9f7",
    primary: { DEFAULT: "#1a3d2b", dark: "#14301f", foreground: "#ffffff" },
    secondary: "#eaf2ec",
    muted: { DEFAULT: "#f0f4f1", foreground: "#5a7165" },
    accent: { DEFAULT: "#e05c3a", foreground: "#ffffff" },
    border: "rgba(26, 61, 43, 0.12)",
    destructive: "#c0392b",
    chart1: "#e05c3a", chart2: "#1a3d2b", chart3: "#4a9e6e", chart4: "#f4a261", chart5: "#264653",
  },
  fontFamily: {
    display: ['"Playfair Display"', "serif"],
    sans: ['"DM Sans"', "sans-serif"],
    mono: ['"DM Mono"', "monospace"],
  },
} } };
</script>
<link rel="stylesheet" href="{{ asset('css/original-overrides.css') }}">
<style> body { font-family: "DM Sans", sans-serif; color: #0f1a14; } </style>
</head>
<body class="min-h-screen bg-background" data-page="{{ $page }}">
<div class="min-h-screen flex">
  <aside id="sidebar" class="w-[260px] shrink-0 bg-primary text-white flex flex-col max-lg:fixed max-lg:inset-y-0 max-lg:left-0 max-lg:z-50 max-lg:-translate-x-full transition-transform">
    <div class="px-6 py-6 border-b border-white/10 flex items-center justify-between">
      <a href="/" class="flex items-center gap-2 group">
        <span class="w-7 h-7 bg-accent rounded-sm flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="w-4 h-4"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"/></svg>
        </span>
        <span class="font-display font-semibold text-xl text-white tracking-tight">Lifestyle</span>
      </a>
      <button id="close-sidebar" class="lg:hidden text-white/70" aria-label="Close menu">✕</button>
    </div>
    <nav class="flex-1 px-3 py-4 flex flex-col gap-6 overflow-y-auto">
      <div>
        <p class="px-3 mb-2 text-[10px] font-mono uppercase tracking-widest text-white/40">Main</p>
        <div class="flex flex-col gap-0.5">
          <a href="/app/dashboard" class="flex items-center gap-3 px-3 py-2.5 rounded-sm {{ $page === 'dashboard' ? 'bg-white/10 text-white font-medium' : 'text-white/70 hover:bg-white/5 hover:text-white' }} text-sm">
            <span class="w-4 text-center">▦</span> Dashboard
          </a>
          <a href="/app/tasks" class="flex items-center gap-3 px-3 py-2.5 rounded-sm {{ $page === 'tasks' ? 'bg-white/10 text-white font-medium' : 'text-white/70 hover:bg-white/5 hover:text-white' }} text-sm">
            <span class="w-4 text-center">✓</span> Tasks
          </a>
          <a href="/app/habits" class="flex items-center gap-3 px-3 py-2.5 rounded-sm {{ $page === 'habits' ? 'bg-white/10 text-white font-medium' : 'text-white/70 hover:bg-white/5 hover:text-white' }} text-sm">
            <span class="w-4 text-center">◎</span> Habits
          </a>
          <a href="/app/journal" class="flex items-center gap-3 px-3 py-2.5 rounded-sm {{ $page === 'journal' ? 'bg-white/10 text-white font-medium' : 'text-white/70 hover:bg-white/5 hover:text-white' }} text-sm">
            <span class="w-4 text-center">▤</span> Journal
          </a>
          <a href="/app/mood" class="flex items-center gap-3 px-3 py-2.5 rounded-sm {{ $page === 'mood' ? 'bg-white/10 text-white font-medium' : 'text-white/70 hover:bg-white/5 hover:text-white' }} text-sm">
            <span class="w-4 text-center">☺</span> Mood
          </a>
        </div>
      </div>
      <div>
        <p class="px-3 mb-2 text-[10px] font-mono uppercase tracking-widest text-white/40">Account</p>
        <div class="flex flex-col gap-0.5">
          <a href="/app/notifications" class="flex items-center gap-3 px-3 py-2.5 rounded-sm {{ $page === 'notifications' ? 'bg-white/10 text-white font-medium' : 'text-white/70 hover:bg-white/5 hover:text-white' }} text-sm"><span class="w-4 text-center">◉</span> Notifications</a>
          <a href="/app/profile" class="flex items-center gap-3 px-3 py-2.5 rounded-sm {{ $page === 'profile' ? 'bg-white/10 text-white font-medium' : 'text-white/70 hover:bg-white/5 hover:text-white' }} text-sm"><span class="w-4 text-center">○</span> Profile</a>
          <a id="admin-link" href="/admin/dashboard" class="hidden items-center gap-3 px-3 py-2.5 rounded-sm text-white/70 hover:bg-white/5 hover:text-white text-sm"><span class="w-4 text-center">⚙</span> Admin</a>
        </div>
      </div>
    </nav>
    <div class="px-5 py-5 border-t border-white/10">
      <div class="flex items-center gap-3 mb-4">
        <div id="user-avatar" class="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-sm font-semibold">U</div>
        <div class="min-w-0">
          <p id="sidebar-user-name" class="text-sm font-medium text-white truncate">Loading…</p>
          <p id="sidebar-user-email" class="text-[10px] font-mono text-white/50 truncate"></p>
        </div>
      </div>
      <button id="logout-button" class="w-full border border-white/15 text-white/70 hover:text-white hover:bg-white/5 text-xs font-mono uppercase tracking-widest rounded-sm px-3 py-2">Sign out</button>
    </div>
  </aside>

  <main class="flex-1 min-w-0 flex flex-col lg:ml-0">
    <header class="border-b border-border px-5 lg:px-8 h-16 flex items-center justify-between shrink-0">
      <div class="flex items-center gap-3">
        <button id="open-sidebar" class="lg:hidden w-9 h-9 rounded-sm border border-border">☰</button>
        <p id="current-date" class="text-[10px] font-mono uppercase tracking-widest text-muted-foreground"></p>
      </div>
      <div class="flex items-center gap-3">
        <a href="/app/notifications" class="w-9 h-9 rounded-sm border border-border hover:border-primary/40 flex items-center justify-center relative" aria-label="Notifications">♢<span id="notification-dot" class="hidden absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent"></span></a>
        <button id="primary-action" class="hidden lg:inline-flex items-center gap-2 bg-primary text-white text-sm font-medium px-4 py-2 rounded-sm hover:bg-primary-dark">＋ Add</button>
      </div>
    </header>
    <div id="live-content" class="flex-1 overflow-y-auto p-5 lg:p-8 space-y-8">
      <div class="border border-border rounded-sm p-6 flex items-center gap-3"><span class="lifestyle-spinner"></span><span class="text-sm text-muted-foreground">Loading your Lifestyle data…</span></div>
    </div>
  </main>
</div>
<div id="modal-root"></div>
<div id="toast" class="lifestyle-toast" role="status"></div>
<script>
window.LIFESTYLE = {
  page: @json($page),
  apiBase: @json(url('/api')),
  appUrl: @json(url('/app')),
  homeUrl: @json(url('/'))
};
</script>
<script src="{{ asset('js/original-app.js') }}" defer></script>
</body>
</html>
