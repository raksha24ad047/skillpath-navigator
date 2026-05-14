import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { skillGaps as mockGaps, type SkillStatus } from "@/lib/mock-data";
import { analyzeSkillGap, type SkillBaseline } from "@/lib/skill-analysis.functions";
import { Sparkles, ArrowUpRight, Loader2 } from "lucide-react";

const statusStyles: Record<SkillStatus, { label: string; className: string }> = {
  missing: { label: "MISSING", className: "text-danger" },
  partial: { label: "PARTIAL", className: "text-warning" },
  strong: { label: "STRONG", className: "text-success" },
};

type Persona = "sde-1-product" | "sde-1-service" | "sde-1-startup";

const personaLabels: Record<Persona, string> = {
  "sde-1-product": "SDE-1, Product",
  "sde-1-service": "SDE-1, Service",
  "sde-1-startup": "SDE-1, Startup",
};

export function SkillGapPanel({ compact = false }: { compact?: boolean }) {
  const [filter, setFilter] = useState<"all" | SkillStatus>("all");
  const [stackInput, setStackInput] = useState(
    "React, TypeScript, Node.js, Postgres, Docker, REST APIs, Leetcode (Medium)"
  );
  const [persona, setPersona] = useState<Persona>("sde-1-product");
  const [aiGaps, setAiGaps] = useState<SkillBaseline[] | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useServerFn(analyzeSkillGap);

  const source: { name: string; status: SkillStatus; you: number; industry: number; note: string }[] =
    aiGaps ?? mockGaps;
  const items = source.filter((s) => (filter === "all" ? true : s.status === filter));
  const visible = compact ? items.slice(0, 3) : items;

  async function runAnalysis() {
    setLoading(true);
    setError(null);
    try {
      const stack = stackInput
        .split(/[,\n]/)
        .map((s) => s.trim())
        .filter(Boolean);
      if (stack.length === 0) {
        throw new Error("Add at least one skill");
      }
      const result = await analyze({ data: { stack, persona } });
      setAiGaps(result.gaps);
      setAiSummary(result.summary);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-card border border-hairline rounded-2xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Skill Gap Analyzer</h3>
          <p className="text-sm text-foreground/80 mt-1">
            Your stack vs. industry baseline for{" "}
            <span className="text-electric font-semibold">{personaLabels[persona]}</span>
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1 p-1 bg-surface-2 rounded-full border border-hairline text-[10px] font-bold tracking-widest">
          {(["all", "missing", "partial", "strong"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full uppercase transition-colors ${
                filter === f ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {!compact && (
        <div className="mb-6 p-4 rounded-xl bg-surface-2/40 border border-hairline space-y-3">
          <div className="flex items-center gap-1 p-1 bg-surface-2 rounded-full border border-hairline w-fit text-[10px] font-bold tracking-widest">
            {(Object.keys(personaLabels) as Persona[]).map((p) => (
              <button
                key={p}
                onClick={() => setPersona(p)}
                className={`px-3 py-1 rounded-full uppercase transition-colors ${
                  persona === p ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {personaLabels[p].replace("SDE-1, ", "")}
              </button>
            ))}
          </div>
          <textarea
            value={stackInput}
            onChange={(e) => setStackInput(e.target.value)}
            rows={2}
            placeholder="React, TypeScript, Postgres, Docker..."
            className="w-full text-sm bg-background border border-hairline rounded-lg px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-electric/50 resize-none"
          />
          {aiSummary && (
            <p className="text-xs text-muted-foreground border-l-2 border-electric/40 pl-3">{aiSummary}</p>
          )}
          {error && <p className="text-xs text-danger">{error}</p>}
        </div>
      )}

      <div className="space-y-5">
        {visible.map((s) => (
          <div key={s.name} className="group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-foreground">{s.name}</span>
              <span className={`text-[10px] font-mono font-bold ${statusStyles[s.status].className}`}>
                {statusStyles[s.status].label}
              </span>
            </div>
            <div className="relative h-1.5 w-full bg-surface-2 rounded-full overflow-hidden mb-2">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-brand rounded-full transition-all"
                style={{ width: `${s.you}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 size-2.5 rounded-full bg-foreground border-2 border-background"
                style={{ left: `calc(${s.industry}% - 5px)` }}
                title={`Industry: ${s.industry}%`}
              />
            </div>
            <p className="text-xs text-muted-foreground">{s.note}</p>
          </div>
        ))}
      </div>

      <button
        onClick={runAnalysis}
        disabled={loading}
        className="mt-6 w-full py-3 bg-gradient-brand rounded-xl text-xs font-bold text-white tracking-widest uppercase hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-[var(--shadow-glow-blue)] disabled:opacity-60"
      >
        {loading ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />}
        {loading ? "Analyzing your stack…" : aiGaps ? "Re-run analysis" : "Analyze with AI"}
        {!loading && <ArrowUpRight className="size-3.5" />}
      </button>
    </div>
  );
}
