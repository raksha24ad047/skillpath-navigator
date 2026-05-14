import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { ReadinessScore } from "@/components/ReadinessScore";
import { MarketHeatmap } from "@/components/MarketHeatmap";
import { SkillGapPanel } from "@/components/SkillGapPanel";
import { CompanyCheatSheet } from "@/components/CompanyCheatSheet";
import { roadmap } from "@/lib/mock-data";
import { FileText, Mic, ArrowUpRight, BookOpen, Video } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard · SkillMapper" },
      { name: "description", content: "Your Career Readiness Score, market heatmap, skill gap analysis, roadmap and company cheat sheets." },
      { property: "og:title", content: "Dashboard · SkillMapper" },
      { property: "og:description", content: "Career-readiness command center for engineering students." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const [mode, setMode] = useState<"video" | "reading">("video");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      <main className="max-w-7xl mx-auto px-6 py-10 md:py-12">
        {/* Header */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-electric mb-2">Engineer Command Center</p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Welcome back, Aryan.</h1>
            <p className="text-muted-foreground mt-1 max-w-xl">
              You're trending up — your readiness score climbed 6 points this week.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">System Status</span>
              <p className="text-sm text-success flex items-center gap-2 justify-end mt-0.5">
                Live Market Sync
                <span className="size-1.5 bg-success rounded-full animate-pulse" />
              </p>
            </div>
          </div>
        </header>

        {/* Top row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <ReadinessScore score={74} />
          </div>
          <div className="lg:col-span-8">
            <MarketHeatmap />
          </div>
        </div>

        {/* Middle row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          <div className="lg:col-span-7">
            <SkillGapPanel />
          </div>
          <div className="lg:col-span-5">
            <CompanyCheatSheet />
          </div>
        </div>

        {/* Bottom row: Roadmap + Action cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          <div className="lg:col-span-7 bg-card border border-hairline rounded-2xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Dynamic Roadmap</h3>
                <p className="text-sm text-foreground/80 mt-1">Adapted to your pace and learning style.</p>
              </div>
              <div className="flex items-center gap-1 p-1 bg-surface-2 rounded-full border border-hairline">
                <button
                  onClick={() => setMode("video")}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                    mode === "video" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Video className="size-3" /> Video
                </button>
                <button
                  onClick={() => setMode("reading")}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                    mode === "reading" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <BookOpen className="size-3" /> Reading
                </button>
              </div>
            </div>

            <ol className="relative space-y-4 pl-6 border-l border-hairline">
              {roadmap.map((step, i) => (
                <li key={step.title} className="relative">
                  <span
                    className={`absolute -left-[31px] top-1 size-3 rounded-full ${
                      i === 0 ? "bg-gradient-brand shadow-[var(--shadow-glow-blue)]" : "bg-surface-2 border border-hairline"
                    }`}
                  />
                  <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-surface-2/40 border border-hairline hover:border-electric/30 transition-colors">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-electric mb-1">{step.stage}</p>
                      <p className="text-sm font-semibold text-foreground">{step.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {step.duration} · {mode === "video" && step.type === "Reading" ? "Video alt" : step.type}
                      </p>
                    </div>
                    <button className="text-muted-foreground hover:text-foreground transition-colors">
                      <ArrowUpRight className="size-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="lg:col-span-5 grid grid-cols-1 gap-6">
            <ActionCard
              icon={<FileText className="size-4" />}
              eyebrow="Resume Engine"
              title="Optimize for ATS"
              meta="Current ATS score · 68/100"
              cta="Drop a PDF"
              accent="blue"
            />
            <ActionCard
              icon={<Mic className="size-4" />}
              eyebrow="Mock Interview"
              title="Run a simulation"
              meta="Last session · Frontend Developer · 3.4/5"
              cta="Pick a persona"
              accent="purple"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function ActionCard({
  icon,
  eyebrow,
  title,
  meta,
  cta,
  accent,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  meta: string;
  cta: string;
  accent: "blue" | "purple";
}) {
  const ring = accent === "blue" ? "text-electric bg-electric-soft border-electric/20" : "text-purple bg-purple-soft border-purple/20";
  return (
    <div className="group relative bg-card border border-hairline rounded-2xl p-6 hover:border-electric/40 transition-colors overflow-hidden">
      <div className={`absolute -top-16 -right-16 size-40 ${accent === "blue" ? "bg-electric/10" : "bg-purple/10"} blur-3xl pointer-events-none`} />
      <div className={`relative inline-flex items-center justify-center size-9 rounded-lg border ${ring} mb-4`}>{icon}</div>
      <p className="relative text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{eyebrow}</p>
      <h3 className="relative text-lg font-bold tracking-tight">{title}</h3>
      <p className="relative text-xs text-muted-foreground mt-1">{meta}</p>
      <button className="relative mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground hover:text-electric transition-colors">
        {cta} <ArrowUpRight className="size-3.5" />
      </button>
    </div>
  );
}
