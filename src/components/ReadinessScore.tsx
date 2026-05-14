interface ScoreRingProps {
  score: number;
  label?: string;
}

export function ReadinessScore({ score = 74, label = "Top 12% of Peers" }: ScoreRingProps) {
  const radius = 86;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-card border border-hairline rounded-2xl p-6 md:p-8 relative overflow-hidden group h-full">
      <div className="absolute -top-24 -right-24 size-64 bg-electric/15 blur-[100px] group-hover:bg-electric/25 transition-all pointer-events-none" />
      <div className="absolute -bottom-32 -left-16 size-64 bg-purple/10 blur-[100px] pointer-events-none" />

      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6 relative">
        Career Readiness
      </h3>

      <div className="flex flex-col items-center justify-center py-2 relative">
        <div className="relative size-48 grid place-items-center">
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 200 200">
            <defs>
              <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="oklch(0.68 0.20 255)" />
                <stop offset="100%" stopColor="oklch(0.66 0.22 295)" />
              </linearGradient>
            </defs>
            <circle cx="100" cy="100" r={radius} stroke="var(--surface-2)" strokeWidth="12" fill="none" />
            <circle
              cx="100"
              cy="100"
              r={radius}
              stroke="url(#scoreGrad)"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.2,.8,.2,1)" }}
            />
          </svg>
          <div className="text-center">
            <span className="text-5xl font-black text-foreground tracking-tight">
              {score}
              <span className="text-2xl text-muted-foreground">%</span>
            </span>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest font-bold">{label}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3 relative">
        <Bar label="Technical Proficiency" value={82} color="electric" />
        <Bar label="Communication" value={68} color="purple" />
        <Bar label="Project Depth" value={71} color="electric" />
      </div>
    </div>
  );
}

function Bar({ label, value, color }: { label: string; value: number; color: "electric" | "purple" }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-muted-foreground">{label}</span>
        <span className="text-foreground font-mono">{value}/100</span>
      </div>
      <div className="h-1.5 w-full bg-surface-2 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color === "electric" ? "bg-electric" : "bg-purple"}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
