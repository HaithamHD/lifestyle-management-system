import { useState } from "react";
import {
  Activity,
  Apple,
  Moon,
  Target,
  Dumbbell,
  Heart,
  ChevronRight,
  ArrowRight,
  Menu,
  X,
  BarChart2,
  Clock,
  Zap,
  CheckCircle,
  Star,
  TrendingUp,
} from "lucide-react";

const NAV_LINKS = ["Features", "How It Works", "Plans", "Community", "Blog"];

const PILLARS = [
  {
    icon: Activity,
    label: "Fitness",
    headline: "Move with purpose",
    body: "Track workouts, set personal records, and follow adaptive training plans tailored to your schedule and goals.",
    stat: "2.4M+ workouts logged",
    color: "bg-[#1a3d2b]",
    textColor: "text-white",
    img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=400&fit=crop&auto=format",
  },
  {
    icon: Apple,
    label: "Nutrition",
    headline: "Fuel your life",
    body: "Log meals with our smart food database, monitor macros, and receive personalized dietary guidance every day.",
    stat: "850K+ foods tracked",
    color: "bg-[#e05c3a]",
    textColor: "text-white",
    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop&auto=format",
  },
  {
    icon: Moon,
    label: "Sleep & Recovery",
    headline: "Rest better, perform better",
    body: "Monitor sleep cycles, recovery scores, and stress markers so you know exactly when to push and when to rest.",
    stat: "92% of users sleep better",
    color: "bg-[#264653]",
    textColor: "text-white",
    img: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=600&h=400&fit=crop&auto=format",
  },
  {
    icon: Target,
    label: "Habits",
    headline: "Small steps. Big change.",
    body: "Build lasting habits with streaks, reminders, and accountability tools grounded in behavioral science.",
    stat: "68-day average streak",
    color: "bg-[#f0f4f1]",
    textColor: "text-[#0f1a14]",
    img: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&h=400&fit=crop&auto=format",
  },
];

const STATS = [
  { value: "1.2M+", label: "Active Members" },
  { value: "94%", label: "Report Positive Change" },
  { value: "4.8★", label: "App Store Rating" },
  { value: "38", label: "Avg. Days to New Habit" },
];

const TESTIMONIALS = [
  {
    name: "Sara Al-Mahmoud",
    role: "Nutritionist & Marathon Runner",
    quote:
      "Lifestyle brought together everything I was managing in five different apps. The sleep-nutrition correlation data alone changed how I train.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&auto=format",
    stars: 5,
  },
  {
    name: "Karim Nasser",
    role: "Software Engineer",
    quote:
      "I lost 12 kg in six months without a strict diet — just consistent habit tracking and the weekly insights that told me where I was slipping.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format",
    stars: 5,
  },
  {
    name: "Layla Haddad",
    role: "Yoga Instructor",
    quote:
      "The mindfulness and sleep modules are genuinely thoughtful. This isn't a calorie counter — it's a life system.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&auto=format",
    stars: 5,
  },
];

const HOW_STEPS = [
  {
    num: "01",
    title: "Set your baseline",
    desc: "Answer a short lifestyle survey. We assess your current fitness, nutrition habits, sleep patterns, and goals.",
  },
  {
    num: "02",
    title: "Get your plan",
    desc: "Lifestyle generates a personalized system — not a generic template — built around your schedule and priorities.",
  },
  {
    num: "03",
    title: "Track & adapt",
    desc: "Log daily. Our engine reads your data and adjusts your plan weekly, keeping it challenging and achievable.",
  },
  {
    num: "04",
    title: "Grow continuously",
    desc: "Monthly reviews, community challenges, and expert content keep you engaged long after the initial motivation fades.",
  },
];

export default function App() {
  const [navOpen, setNavOpen] = useState(false);
  const [activePillar, setActivePillar] = useState(0);

  return (
    <div className="min-h-screen bg-background text-foreground font-[DM_Sans,sans-serif] overflow-x-hidden">

      {/* ── NAV ─────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <a href="#" className="flex items-center gap-2 group">
            <span className="w-7 h-7 bg-primary rounded-sm flex items-center justify-center">
              <Heart className="w-4 h-4 text-white fill-white" />
            </span>
            <span className="font-['Playfair_Display'] font-semibold text-xl text-primary tracking-tight">
              Lifestyle
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <a
                key={l}
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
              >
                {l}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <a
              href="#"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Sign in
            </a>
            <a
              href="#"
              className="text-sm font-medium bg-primary text-white px-4 py-2 rounded-sm hover:bg-[#14301f] transition-colors"
            >
              Start free
            </a>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setNavOpen(!navOpen)}
            aria-label="Toggle menu"
          >
            {navOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {navOpen && (
          <div className="md:hidden border-t border-border bg-white px-6 py-4 flex flex-col gap-4">
            {NAV_LINKS.map((l) => (
              <a key={l} href="#" className="text-sm text-muted-foreground">
                {l}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-2 border-t border-border">
              <a href="#" className="text-sm font-medium text-foreground">Sign in</a>
              <a href="#" className="text-sm font-medium bg-primary text-white px-4 py-2 rounded-sm text-center">
                Start free
              </a>
            </div>
          </div>
        )}
      </header>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-['DM_Mono'] tracking-widest uppercase text-accent border border-accent/30 bg-accent/5 px-3 py-1.5 rounded-sm mb-6">
              <Zap className="w-3 h-3" />
              Your complete life system
            </div>

            <h1 className="font-['Playfair_Display'] text-5xl lg:text-6xl xl:text-7xl font-bold text-primary leading-[1.1] mb-6">
              Live better,
              <br />
              <em className="italic font-normal text-accent">every single</em>
              <br />
              day.
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
              Lifestyle brings together fitness, nutrition, sleep, and habits
              into one intelligent system — so you can stop managing apps and
              start managing your life.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <a
                href="#"
                className="inline-flex items-center justify-center gap-2 bg-primary text-white text-sm font-medium px-6 py-3.5 rounded-sm hover:bg-[#14301f] transition-colors group"
              >
                Get started — it's free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center gap-2 border border-border text-sm font-medium px-6 py-3.5 rounded-sm hover:border-primary hover:text-primary transition-colors"
              >
                Watch 2-min demo
              </a>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {[
                  "https://images.unsplash.com/photo-1494790108755-2616b612b830?w=40&h=40&fit=crop&auto=format",
                  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop&auto=format",
                  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&auto=format",
                  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=40&h=40&fit=crop&auto=format",
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="member"
                    className="w-8 h-8 rounded-full border-2 border-white object-cover bg-secondary"
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">1.2M+</span>{" "}
                members living better
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-sm overflow-hidden aspect-[4/5] bg-secondary">
              <img
                src="https://images.unsplash.com/photo-1547592180-85f173990554?w=700&h=875&fit=crop&auto=format"
                alt="Person tracking their healthy lifestyle"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
            </div>

            {/* Floating stat cards */}
            <div className="absolute -left-6 top-16 bg-white border border-border rounded-sm px-4 py-3 shadow-lg hidden sm:block">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-secondary rounded-sm flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-['DM_Mono'] text-xs text-muted-foreground">Weekly score</p>
                  <p className="font-semibold text-sm text-foreground">87 / 100</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-4 bottom-20 bg-accent text-white rounded-sm px-4 py-3 shadow-lg hidden sm:block">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <div>
                  <p className="text-xs opacity-80">Streak</p>
                  <p className="font-semibold text-sm">34 days</p>
                </div>
              </div>
            </div>

            <div className="absolute left-4 bottom-8 bg-white border border-border rounded-sm px-3 py-2 shadow-lg hidden sm:block">
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-xs text-muted-foreground ml-1">4.8 rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────── */}
      <section className="border-y border-border bg-primary">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-['Playfair_Display'] text-4xl font-bold text-white mb-1">
                {s.value}
              </p>
              <p className="text-sm text-white/60 font-['DM_Mono'] tracking-wide uppercase">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PILLARS ──────────────────────────────────────────────────── */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="mb-12">
          <p className="text-xs font-['DM_Mono'] tracking-widest uppercase text-muted-foreground mb-3">
            What we manage
          </p>
          <h2 className="font-['Playfair_Display'] text-4xl lg:text-5xl font-bold text-primary leading-tight max-w-2xl">
            Every dimension of your well-being, unified.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-6">
          {/* Pillar tabs */}
          <div className="flex flex-col gap-3">
            {PILLARS.map((p, i) => {
              const Icon = p.icon;
              return (
                <button
                  key={p.label}
                  onClick={() => setActivePillar(i)}
                  className={`text-left p-5 rounded-sm border transition-all duration-200 group ${
                    activePillar === i
                      ? "border-primary bg-secondary"
                      : "border-border bg-white hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-9 h-9 rounded-sm flex items-center justify-center shrink-0 ${
                      activePillar === i ? "bg-primary" : "bg-muted"
                    }`}>
                      <Icon className={`w-4 h-4 ${activePillar === i ? "text-white" : "text-muted-foreground"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-['DM_Mono'] tracking-widest uppercase text-muted-foreground mb-0.5">
                        {p.label}
                      </p>
                      <h3 className="font-['Playfair_Display'] text-xl font-semibold text-primary mb-1">
                        {p.headline}
                      </h3>
                      {activePillar === i && (
                        <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                          {p.body}
                        </p>
                      )}
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 mt-1 transition-transform ${activePillar === i ? "rotate-90 text-primary" : "text-muted-foreground"}`} />
                  </div>
                  {activePillar === i && (
                    <div className="mt-3 ml-13 pl-1">
                      <span className="inline-flex items-center gap-1.5 text-xs font-['DM_Mono'] text-accent">
                        <BarChart2 className="w-3 h-3" />
                        {p.stat}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Active pillar image */}
          <div className="relative rounded-sm overflow-hidden min-h-[400px] bg-secondary">
            <img
              key={activePillar}
              src={PILLARS[activePillar].img}
              alt={PILLARS[activePillar].label}
              className="w-full h-full object-cover absolute inset-0 transition-opacity duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="font-['Playfair_Display'] text-2xl font-bold text-white mb-1">
                {PILLARS[activePillar].headline}
              </p>
              <p className="text-sm text-white/75">{PILLARS[activePillar].stat}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section className="py-24 bg-[#f7f9f7] border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 items-start">
            <div>
              <p className="text-xs font-['DM_Mono'] tracking-widest uppercase text-muted-foreground mb-3">
                How it works
              </p>
              <h2 className="font-['Playfair_Display'] text-4xl font-bold text-primary leading-tight">
                Four steps to your best self.
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {HOW_STEPS.map((step) => (
                <div key={step.num} className="group">
                  <p className="font-['DM_Mono'] text-4xl font-medium text-border mb-4 group-hover:text-accent transition-colors duration-200">
                    {step.num}
                  </p>
                  <h3 className="font-['Playfair_Display'] text-xl font-semibold text-primary mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURE CALLOUT ──────────────────────────────────────────── */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-sm overflow-hidden aspect-square bg-secondary">
            <img
              src="https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=700&h=700&fit=crop&auto=format"
              alt="Dashboard analytics view"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
          </div>

          <div>
            <p className="text-xs font-['DM_Mono'] tracking-widest uppercase text-muted-foreground mb-4">
              Intelligent insights
            </p>
            <h2 className="font-['Playfair_Display'] text-4xl lg:text-5xl font-bold text-primary leading-tight mb-6">
              Your data,
              <br />
              <em className="italic font-normal text-accent">working for you.</em>
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed mb-8">
              Lifestyle synthesizes all your data to surface the patterns that
              matter — like why your energy dips every Thursday, or what
              combination of sleep and nutrition predicts your best workouts.
            </p>

            <div className="flex flex-col gap-4">
              {[
                { icon: BarChart2, text: "Weekly performance reports with actionable recommendations" },
                { icon: Clock, text: "Predictive reminders that adapt to your daily schedule" },
                { icon: Dumbbell, text: "Adaptive training load that prevents burnout and injury" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-secondary rounded-sm flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{text}</p>
                </div>
              ))}
            </div>

            <a
              href="#"
              className="inline-flex items-center gap-2 mt-8 text-sm font-medium text-primary hover:text-accent transition-colors group"
            >
              Explore all features
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────── */}
      <section className="py-24 bg-primary">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-['DM_Mono'] tracking-widest uppercase text-white/50 mb-3">
                Real people, real results
              </p>
              <h2 className="font-['Playfair_Display'] text-4xl font-bold text-white leading-tight">
                Life-changing is
                <br />
                not an overstatement.
              </h2>
            </div>
            <a
              href="#"
              className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors whitespace-nowrap"
            >
              Read more stories <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white/5 border border-white/10 rounded-sm p-6 hover:bg-white/10 transition-colors duration-200">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote className="font-['Playfair_Display'] text-lg italic text-white/90 leading-relaxed mb-6">
                  "{t.quote}"
                </blockquote>
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover bg-primary/50"
                  />
                  <div>
                    <p className="text-sm font-medium text-white">{t.name}</p>
                    <p className="text-xs text-white/50">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-['DM_Mono'] tracking-widest uppercase text-muted-foreground mb-4">
            Start today
          </p>
          <h2 className="font-['Playfair_Display'] text-5xl lg:text-6xl font-bold text-primary leading-tight mb-6">
            Your best life
            <br />
            <em className="italic font-normal text-accent">starts here.</em>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
            Join 1.2 million people using Lifestyle to take control of their
            fitness, nutrition, sleep, and habits — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#"
              className="inline-flex items-center justify-center gap-2 bg-primary text-white text-sm font-medium px-8 py-4 rounded-sm hover:bg-[#14301f] transition-colors group"
            >
              Create free account
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center gap-2 border border-border text-sm font-medium px-8 py-4 rounded-sm hover:border-primary hover:text-primary transition-colors"
            >
              See pricing
            </a>
          </div>
          <p className="text-xs text-muted-foreground mt-5">
            No credit card required. 14-day premium trial included.
          </p>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────── */}
      <footer className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-7 h-7 bg-primary rounded-sm flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white fill-white" />
                </span>
                <span className="font-['Playfair_Display'] font-semibold text-xl text-primary">Lifestyle</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                A web-based lifestyle management system for people serious about living well.
              </p>
            </div>

            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "Integrations", "Changelog"],
              },
              {
                title: "Company",
                links: ["About", "Blog", "Careers", "Press"],
              },
              {
                title: "Support",
                links: ["Help Center", "Contact", "Privacy", "Terms"],
              },
            ].map((col) => (
              <div key={col.title}>
                <p className="text-xs font-['DM_Mono'] tracking-widest uppercase text-muted-foreground mb-4">
                  {col.title}
                </p>
                <div className="flex flex-col gap-2.5">
                  {col.links.map((l) => (
                    <a
                      key={l}
                      href="#"
                      className="text-sm text-foreground/70 hover:text-foreground transition-colors"
                    >
                      {l}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-6 flex flex-col sm:flex-row justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              © 2025 Lifestyle. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground font-['DM_Mono']">
              LIVE BETTER · EVERY DAY
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
