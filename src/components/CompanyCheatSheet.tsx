import { useState } from "react";
import { companies } from "@/lib/mock-data";
import { Building2, ChevronRight } from "lucide-react";

export function CompanyCheatSheet() {
  const [activeId, setActiveId] = useState(companies[0].id);
  const company = companies.find((c) => c.id === activeId)!;
  const accentText = company.accent === "purple" ? "text-purple" : "text-electric";
  const accentBg = company.accent === "purple" ? "bg-purple/5 border-purple/20" : "bg-electric/5 border-electric/20";

  return (
    <div className="bg-card border border-hairline rounded-2xl p-6 md:p-8 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
          <Building2 className="size-3.5 text-purple" />
          Company Intel
        </h3>
        <div className="flex gap-1 p-1 bg-surface-2 rounded-full border border-hairline">
          {companies.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveId(c.id)}
              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                activeId === c.id ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className={`p-4 rounded-xl border ${accentBg}`}>
          <p className={`text-[10px] font-bold uppercase mb-2 tracking-widest ${accentText}`}>Hiring Pattern</p>
          <p className="text-sm text-foreground/90 leading-relaxed">{company.pattern}</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Stat label="Focus" value={company.focus} />
          <Stat label="Min. GPA" value={company.minGpa} />
          <Stat label="DSA Level" value={company.dsaLevel} />
        </div>

        <div className="pt-2">
          <p className="text-[10px] text-muted-foreground uppercase mb-3 tracking-widest font-bold">Recent Questions</p>
          <ul className="space-y-2">
            {company.questions.map((q) => (
              <li key={q} className="text-xs text-foreground/80 flex items-start gap-2">
                <ChevronRight className="size-3 mt-0.5 text-electric shrink-0" />
                {q}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 bg-surface-2/60 rounded-lg text-center border border-hairline">
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
      <p className="text-xs font-bold text-foreground">{value}</p>
    </div>
  );
}
