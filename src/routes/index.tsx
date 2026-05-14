import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { ReadinessScore } from "@/components/ReadinessScore";
import { MarketHeatmap } from "@/components/MarketHeatmap";
import { CompanyCheatSheet } from "@/components/CompanyCheatSheet";
import { FeatureDialog, type FeatureKey } from "@/components/FeatureDialog";
import {
  ArrowUpRight,
  Sparkles,
  Map,
  FileText,
  Mic,
  Building2,
  Activity,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SkillMapper — From classroom to placement, quantified" },
      {
        name: "description",
        content:
          "Career-readiness command center for engineering students. Identify your skill gaps, follow AI-generated roadmaps, and prep for placements at Google, Atlassian, TCS and more.",
      },
      { property: "og:title", content: "SkillMapper — From classroom to placement, quantified" },
      {
        property: "og:description",
        content:
          "Bridge the gap between your university stack and what top tech companies actually hire for.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const [openFeature, setOpenFeature] = useState<FeatureKey | null>(null);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 size-[700px] bg-electric/15 blur-[160px] rounded-full pointer-events-none" />
        <div className="absolute top-40 right-0 size-[500px] bg-purple/15 blur-[160px] rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-hairline bg-surface/60 backdrop-blur">
              <span className="size-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Placement Season 2026 — Live Market Sync
              </span>
            </div>
          </div>

          <h1 className="text-center text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight leading-[0.95] text-balance">
            From classroom <span className="text-muted-foreground">to placement,</span>
            <br />
            <span className="text-gradient-brand">quantified.</span>
          </h1>

          <p className="mt-8 text-center text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            SkillMapper is the career-readiness command center for 2nd and 3rd year engineering students.
            Identify your skill gaps, follow an AI-generated roadmap, and walk into interviews ready.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              to="/dashboard"
              className="group inline-flex items-center gap-2 bg-gradient-brand text-white text-sm font-bold tracking-wide uppercase px-6 py-3 rounded-xl shadow-[var(--shadow-glow-blue)] hover:opacity-95 transition-opacity"
            >
              Launch Dashboard
              <ArrowUpRight className="size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 bg-surface border border-hairline text-foreground text-sm font-bold tracking-wide uppercase px-6 py-3 rounded-xl hover:bg-surface-2 transition-colors"
            >
              See features
            </a>
          </div>

          {/* Floating preview */}
          <div className="relative mt-20 mx-auto max-w-5xl">
            <div className="absolute -inset-px bg-gradient-brand rounded-[1.4rem] opacity-30 blur-xl" />
            <div className="relative grid grid-cols-1 md:grid-cols-5 gap-4 p-4 md:p-5 bg-card/80 backdrop-blur-xl border border-hairline rounded-2xl">
              <div className="md:col-span-2">
                <ReadinessScore score={74} />
              </div>
              <div className="md:col-span-3">
                <MarketHeatmap />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section id="features" className="relative py-24 border-t border-hairline">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-widest text-electric mb-3">The platform</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Everything between you and your first offer.</h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Five modules engineered for the engineering student. Each one closes a specific gap between coursework and what
              companies actually screen for.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureCard
              icon={<Sparkles className="size-4" />}
              title="AI Skill Gap Analyzer"
              desc="Onboard your stack. We compare it against role-specific industry personas and surface what to learn first."
              accent="blue"
            />
            <FeatureCard
              icon={<Map className="size-4" />}
              title="Dynamic Roadmap"
              desc="A vertical timeline tuned to your pace. Toggle Video vs. Reading and we re-pick resources accordingly."
              accent="purple"
            />
            <FeatureCard
              icon={<FileText className="size-4" />}
              title="AI Resume Optimizer"
              desc="Drop your PDF. Get an ATS score and replacement action verbs that match the JD you're targeting."
              accent="blue"
            />
            <FeatureCard
              icon={<Mic className="size-4" />}
              title="Mock Interview Simulation"
              desc="Pick a role, pick a persona — Stressed Recruiter or Friendly Mentor — and run through 3 sharp questions."
              accent="purple"
            />
            <FeatureCard
              icon={<Building2 className="size-4" />}
              title="Company Cheat Sheets"
              desc="Google, Atlassian, TCS, Uber and more. The exact pattern, not the folklore."
              accent="blue"
            />
            <FeatureCard
              icon={<Activity className="size-4" />}
              title="Market Heatmap"
              desc="What's actually hiring right now. LLM Ops, Cloud Native, Rust — with weekly delta signals."
              accent="purple"
            />
          </div>
        </div>
      </section>

      {/* Companies preview */}
      <section id="companies" className="py-24 border-t border-hairline">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-purple mb-3">Company intel</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Stop guessing the <span className="text-gradient-brand">interview pattern</span>.
            </h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-lg">
              Every company hires differently. Get the cheat sheet — focus areas, GPA cutoffs, DSA difficulty, and the
              questions students actually saw last cycle.
            </p>
            <Link
              to="/dashboard"
              className="mt-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-electric hover:text-foreground transition-colors"
            >
              Open the full intel <ArrowUpRight className="size-4" />
            </Link>
          </div>
          <CompanyCheatSheet />
        </div>
      </section>

      <footer className="border-t border-hairline py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} SkillMapper · Built for the next generation of engineers.</p>
          <p className="text-[10px] font-mono text-muted-foreground/70">v0.1 · ALPHA</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  accent: "blue" | "purple";
}) {
  const ring = accent === "blue" ? "text-electric bg-electric-soft border-electric/20" : "text-purple bg-purple-soft border-purple/20";
  return (
    <div className="group relative bg-card border border-hairline rounded-2xl p-6 hover:border-electric/40 transition-colors overflow-hidden">
      <div className="absolute -top-16 -right-16 size-40 bg-electric/0 group-hover:bg-electric/10 blur-3xl transition-colors" />
      <div className={`relative inline-flex items-center justify-center size-9 rounded-lg border ${ring} mb-5`}>{icon}</div>
      <h3 className="relative text-base font-bold text-foreground mb-2 tracking-tight">{title}</h3>
      <p className="relative text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}
