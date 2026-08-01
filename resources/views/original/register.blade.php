<!DOCTYPE html>

<html lang="en">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1" name="viewport"/>
<title>Create account · Lifestyle</title>
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&amp;family=DM+Sans:wght@400;500;700&amp;family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com"></script>
<script>
tailwind.config = {
  theme: {
    extend: {
      colors: {
        background: "#ffffff", foreground: "#0f1a14", card: "#f7f9f7",
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
    },
  },
};
</script>
<style> body { font-family: "DM Sans", sans-serif; color: #0f1a14; } </style>
</head>
<body class="min-h-screen bg-background" data-page="register">
<div class="min-h-screen grid grid-cols-1 lg:grid-cols-[1fr_1.05fr]">
<!-- ── IMAGE PANE (LEFT this time, mirrors login) ────────────── -->
<div class="relative hidden lg:block overflow-hidden bg-primary">
<img alt="Sunlight through leaves" class="absolute inset-0 w-full h-full object-cover opacity-70" src="https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=1200&amp;h=1600&amp;fit=crop&amp;auto=format"/>
<div class="absolute inset-0 bg-gradient-to-tl from-primary via-primary/60 to-transparent"></div>
<div class="relative z-10 h-full flex flex-col justify-between p-12">
<div>
<p class="text-xs font-mono tracking-widest uppercase text-white/60 mb-4">Join Lifestyle</p>
<h2 class="font-display text-5xl font-bold text-white leading-tight max-w-md mb-6">
          One system for the<br/><em class="italic font-normal text-accent">life you want.</em>
</h2>
<p class="text-white/75 max-w-md leading-relaxed">
          Tasks, habits, journal, and mood tracking — connected. No more scattered notes and abandoned apps.
        </p>
</div>
<div class="grid grid-cols-2 gap-4 max-w-md">
<div class="bg-white/5 border border-white/10 rounded-sm p-4">
<p class="font-display text-3xl font-bold text-white mb-1">1.2M+</p>
<p class="text-xs font-mono uppercase tracking-widest text-white/60">Active members</p>
</div>
<div class="bg-white/5 border border-white/10 rounded-sm p-4">
<p class="font-display text-3xl font-bold text-white mb-1">68<span class="text-lg">d</span></p>
<p class="text-xs font-mono uppercase tracking-widest text-white/60">Avg. new habit</p>
</div>
</div>
</div>
</div>
<!-- ── FORM ─────────────────────────────────────────────────── -->
<div class="flex flex-col px-8 lg:px-16 py-8">
<div class="flex items-center justify-between mb-16">
<a class="flex items-center gap-2 group" href="/">
<span class="w-7 h-7 bg-primary rounded-sm flex items-center justify-center">
<svg class="w-4 h-4" fill="white" viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"></path></svg>
</span>
<span class="font-display font-semibold text-xl text-primary tracking-tight">Lifestyle</span>
</a>
<p class="text-sm text-muted-foreground">
        Already have an account?
        <a class="font-medium text-foreground hover:text-primary transition-colors" href="/login">Sign in →</a>
</p>
</div>
<div class="flex-1 flex items-center">
<div class="w-full max-w-md">
<p class="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-4">Create your account</p>
<h1 class="font-display text-5xl lg:text-6xl font-bold text-primary leading-[1.05] mb-4">
          Start<br/>
<em class="italic font-normal text-accent">living better.</em>
</h1>
<p class="text-base text-muted-foreground leading-relaxed mb-10 max-w-sm">
          Free to start. No credit card. 14-day premium trial included.
        </p>
<form class="flex flex-col gap-5" id="register-form">
<div class="grid grid-cols-2 gap-3">
<div>
<label class="block text-xs font-mono tracking-widest uppercase text-muted-foreground mb-2">First name</label>
<input class="w-full bg-muted border border-transparent focus:border-primary/40 rounded-sm px-4 py-3 text-sm outline-none" id="first_name" name="first_name" type="text" value="Test"/>
</div>
<div>
<label class="block text-xs font-mono tracking-widest uppercase text-muted-foreground mb-2">Last name</label>
<input class="w-full bg-muted border border-transparent focus:border-primary/40 rounded-sm px-4 py-3 text-sm outline-none" id="last_name" name="last_name" type="text" value="User"/>
</div>
</div>
<div>
<label class="block text-xs font-mono tracking-widest uppercase text-muted-foreground mb-2">Email</label>
<input class="w-full bg-muted border border-transparent focus:border-primary/40 rounded-sm px-4 py-3 text-sm outline-none" id="email" name="email" type="email" value=""/>
</div>
<div>
<label class="block text-xs font-mono tracking-widest uppercase text-muted-foreground mb-2">Password</label>
<input class="w-full bg-muted border border-transparent focus:border-primary/40 rounded-sm px-4 py-3 text-sm outline-none" id="password" name="password" type="password" value="Password123!"/>
<div class="mt-2 flex gap-1">
<div class="flex-1 h-1 bg-primary rounded-full"></div>
<div class="flex-1 h-1 bg-primary rounded-full"></div>
<div class="flex-1 h-1 bg-accent rounded-full"></div>
<div class="flex-1 h-1 bg-border rounded-full"></div>
</div>
<p class="text-xs text-muted-foreground mt-1.5">Strong — 12 characters, mixed case, symbols.</p>
</div><div><label class="block text-xs font-mono tracking-widest uppercase text-muted-foreground mb-2" for="password_confirmation">Confirm password</label><input class="w-full border border-border rounded-sm px-4 py-3 text-sm outline-none focus:border-primary transition-colors" id="password_confirmation" name="password_confirmation" type="password" value="Password123!"/></div>
<label class="flex items-start gap-2.5 text-sm text-muted-foreground mt-1 cursor-pointer">
<input checked="" class="mt-0.5 w-4 h-4 rounded-sm accent-primary shrink-0" type="checkbox"/>
<span>I agree to the <a class="text-foreground underline decoration-dotted underline-offset-2" href="#">Terms of Service</a> and <a class="text-foreground underline decoration-dotted underline-offset-2" href="#">Privacy Policy</a>.</span>
</label>
<div class="hidden text-sm text-red-700 bg-red-50 border border-red-200 rounded-sm px-4 py-3" id="auth-error"></div><button class="mt-4 inline-flex items-center justify-center gap-2 bg-primary text-white text-sm font-medium px-6 py-3.5 rounded-sm hover:bg-primary-dark transition-colors group" type="submit">
            Create account
            <svg class="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
</button>
</form>
</div>
</div>
<p class="text-xs text-muted-foreground mt-12">
      Trusted by 1.2M+ people. Data encrypted end-to-end. Cancel any time.
    </p>
</div>
</div>
<script>window.LIFESTYLE={page:'register',apiBase:'/api',appUrl:'/app',homeUrl:'/'};</script><script defer="" src="/js/original-app.js"></script></body>
</html>
