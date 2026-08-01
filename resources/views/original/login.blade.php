<!DOCTYPE html>

<html lang="en">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1" name="viewport"/>
<title>Sign in · Lifestyle</title>
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&amp;family=DM+Sans:wght@400;500;700&amp;family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com"></script>
<script>
tailwind.config = {
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        foreground: "#0f1a14",
        card: "#f7f9f7",
        primary: { DEFAULT: "#1a3d2b", dark: "#14301f", foreground: "#ffffff" },
        secondary: "#eaf2ec",
        muted: { DEFAULT: "#f0f4f1", foreground: "#5a7165" },
        accent: { DEFAULT: "#e05c3a", foreground: "#ffffff" },
        border: "rgba(26, 61, 43, 0.12)",
      },
      fontFamily: {
        display: ['"Playfair Display"', "serif"],
        sans: ['"DM Sans"', "sans-serif"],
        mono: ['"DM Mono"', "monospace"],
      },
      borderRadius: { sm: "0.25rem" },
    },
  },
};
</script>
<style>
  body { font-family: "DM Sans", sans-serif; color: #0f1a14; }
</style>
</head>
<body class="min-h-screen bg-background" data-page="login">
<div class="min-h-screen grid grid-cols-1 lg:grid-cols-[1.05fr_1fr]">
<!-- ── FORM ─────────────────────────────────────────────────── -->
<div class="flex flex-col px-8 lg:px-16 py-8">
<!-- Top bar: logo -->
<div class="flex items-center justify-between mb-16">
<a class="flex items-center gap-2 group" href="/">
<span class="w-7 h-7 bg-primary rounded-sm flex items-center justify-center">
<!-- Heart -->
<svg class="w-4 h-4" fill="white" viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"></path></svg>
</span>
<span class="font-display font-semibold text-xl text-primary tracking-tight">Lifestyle</span>
</a>
<p class="text-sm text-muted-foreground">
        New here?
        <a class="font-medium text-foreground hover:text-primary transition-colors" href="/register">Create an account →</a>
</p>
</div>
<!-- Center form -->
<div class="flex-1 flex items-center">
<div class="w-full max-w-md">
<p class="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-4">Welcome back</p>
<h1 class="font-display text-5xl lg:text-6xl font-bold text-primary leading-[1.05] mb-4">
          Sign in to<br/>
<em class="italic font-normal text-accent">keep going.</em>
</h1>
<p class="text-base text-muted-foreground leading-relaxed mb-10 max-w-sm">
          Pick up where you left off. Your tasks, habits, and reflections are waiting.
        </p>
<form class="flex flex-col gap-5" id="login-form">
<div>
<label class="block text-xs font-mono tracking-widest uppercase text-muted-foreground mb-2">Email</label>
<input autocomplete="email" class="w-full bg-muted border border-transparent focus:border-primary/40 rounded-sm px-4 py-3.5 text-sm outline-none transition-colors" id="email" name="email" type="email" value="user@lifestyle.test"/>
</div>
<div>
<div class="flex items-center justify-between mb-2">
<label class="block text-xs font-mono tracking-widest uppercase text-muted-foreground">Password</label>
<a class="text-xs text-muted-foreground hover:text-primary transition-colors" href="#">Forgot?</a>
</div>
<input autocomplete="current-password" class="w-full bg-muted border border-transparent focus:border-primary/40 rounded-sm px-4 py-3.5 text-sm outline-none transition-colors" id="password" name="password" type="password" value="Password123!"/>
</div>
<label class="flex items-center gap-2.5 text-sm text-muted-foreground mt-1 cursor-pointer">
<input checked="" class="w-4 h-4 rounded-sm accent-primary" type="checkbox"/>
            Keep me signed in on this device
          </label>
<div class="hidden text-sm text-red-700 bg-red-50 border border-red-200 rounded-sm px-4 py-3" id="auth-error"></div><button class="mt-4 inline-flex items-center justify-center gap-2 bg-primary text-white text-sm font-medium px-6 py-3.5 rounded-sm hover:bg-primary-dark transition-colors group" type="submit">
            Sign in
            <svg class="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
</button>
<div class="relative my-2">
<div class="absolute inset-0 flex items-center"><div class="w-full border-t border-border"></div></div>
<div class="relative flex justify-center"><span class="bg-background px-3 text-xs font-mono uppercase tracking-widest text-muted-foreground">or</span></div>
</div>
<button class="inline-flex items-center justify-center gap-2 border border-border text-sm font-medium px-6 py-3.5 rounded-sm hover:border-primary hover:text-primary transition-colors" type="button">
            Continue with Google
          </button>
</form>
</div>
</div>
<!-- Bottom -->
<p class="text-xs text-muted-foreground mt-12">
      By continuing you agree to Lifestyle's <a class="underline decoration-dotted underline-offset-2" href="#">Terms</a> and <a class="underline decoration-dotted underline-offset-2" href="#">Privacy Policy</a>.
    </p>
</div>
<!-- ── IMAGE PANE ────────────────────────────────────────────── -->
<div class="relative hidden lg:block overflow-hidden bg-primary">
<img alt="Person meditating at sunrise" class="absolute inset-0 w-full h-full object-cover opacity-70" src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&amp;h=1600&amp;fit=crop&amp;auto=format"/>
<div class="absolute inset-0 bg-gradient-to-tr from-primary via-primary/60 to-transparent"></div>
<!-- Editorial quote -->
<div class="relative z-10 h-full flex flex-col justify-end p-12">
<div class="max-w-md">
<p class="text-xs font-mono tracking-widest uppercase text-white/60 mb-4">A member's note</p>
<blockquote class="font-display text-3xl lg:text-4xl italic font-normal text-white leading-tight mb-6">
          "The system just holds me accountable. I stopped bouncing between apps and started actually finishing days."
        </blockquote>
<div class="flex items-center gap-3">
<img alt="member" class="w-10 h-10 rounded-full object-cover border-2 border-white/20" src="https://images.unsplash.com/photo-1494790108755-2616b612b830?w=80&amp;h=80&amp;fit=crop&amp;auto=format"/>
<div>
<p class="text-sm font-medium text-white">Sara Al-Mahmoud</p>
<p class="text-xs text-white/60">Member since 2024</p>
</div>
</div>
</div>
<!-- floating chip -->
<div class="absolute top-12 right-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-sm px-4 py-3">
<div class="flex items-center gap-2">
<svg class="w-4 h-4 text-accent" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 6 9 17l-5-5"></path></svg>
<div>
<p class="text-xs text-white/60">Streak protected</p>
<p class="text-sm font-medium text-white">34 days</p>
</div>
</div>
</div>
</div>
</div>
</div>
<script>window.LIFESTYLE={page:'login',apiBase:'/api',appUrl:'/app',homeUrl:'/'};</script><script defer="" src="/js/original-app.js"></script></body>
</html>
