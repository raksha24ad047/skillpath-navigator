import { useState } from "react";
import { skillGaps, type SkillStatus } from "@/lib/mock-data";
import { Sparkles, ArrowUpRight } from "lucide-react";

const statusStyles: Record<SkillStatus, { label: string; className: string }> = {
  missing: { label: "MISSING", className: "text-danger" },
  partial: { label: "PARTIAL", className: "text-warning" },
  strong: { label: "STRONG", className: "text-success" },
};

export function SkillGapPanel({ compact = false }: { compact?: boolean }) {
  const [filter, setFilter] = useState<"all" | SkillStatus>("all");
  const items = skillGaps.filter((s) => (filter === "all" ? true : s.status === filter));
  const visible = compact ? items.slice(0, 3) : items;

  return (
    <div className="bg-card border border-hairline rounded-2xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Skill Gap Analyzer</h3>
          <p className="text-sm text-foreground/80 mt-1">Your stack vs. industry baseline for <span className="text-electric font-semibold">SDE-1, Product Companies</span></p>
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

      <button className="mt-6 w-full py-3 bg-gradient-brand rounded-xl text-xs font-bold text-white tracking-widest uppercase hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-[var(--shadow-glow-blue)]">
        <Sparkles className="size-3.5" />
        Generate Learning Path
        <ArrowUpRight className="size-3.5" />
      </button>
    </div>
  );
}
