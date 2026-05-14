import { marketSkills, trendingTags } from "@/lib/mock-data";
import { TrendingUp } from "lucide-react";

const signalStyles = {
  high: "text-success",
  stable: "text-muted-foreground",
  growth: "text-electric",
  critical: "text-purple",
} as const;

export function MarketHeatmap() {
  return (
    <div className="bg-card border border-hairline rounded-2xl p-6 md:p-8 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
          <TrendingUp className="size-3.5 text-electric" />
          Market Heatmap
        </h3>
        <span className="px-2 py-1 bg-electric-soft text-electric text-[10px] font-bold rounded border border-electric/20">
          TRENDING
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {marketSkills.map((s) => (
          <div
            key={s.name}
            className="p-4 bg-surface-2/50 border border-hairline rounded-xl hover:border-electric/40 transition-colors"
          >
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">{s.name}</p>
            <p className="text-xl font-bold text-foreground">{s.growth}</p>
            <p className={`text-[10px] mt-2 font-medium ${signalStyles[s.signal]}`}>
              {s.signal === "high" ? "High Demand" : s.signal === "stable" ? "Stable" : s.signal === "growth" ? "Growth" : "Prerequisite"}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-2 flex-wrap">
        {trendingTags.map((t) => (
          <span
            key={t}
            className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-foreground/80"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
