import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SkillGapPanel } from "@/components/SkillGapPanel";
import { CompanyCheatSheet } from "@/components/CompanyCheatSheet";
import { MarketHeatmap } from "@/components/MarketHeatmap";
import {
  generateRoadmap,
  analyzeResume,
  generateMockInterview,
  type RoadmapResult,
  type ResumeAnalysis,
  type MockInterview,
} from "@/lib/ai.functions";
import { Loader2, Sparkles } from "lucide-react";

export type FeatureKey =
  | "skill-gap"
  | "roadmap"
  | "resume"
  | "mock-interview"
  | "companies"
  | "market";

const titles: Record<FeatureKey, { title: string; desc: string }> = {
  "skill-gap": {
    title: "AI Skill Gap Analyzer",
    desc: "Drop your stack. We compare it against industry baselines for your target persona.",
  },
  roadmap: {
    title: "Dynamic Roadmap",
    desc: "Tell us your goal. We'll sequence the next ~8 weeks for you.",
  },
  resume: {
    title: "AI Resume Optimizer",
    desc: "Paste your resume text. Get an ATS score and rewritten bullets.",
  },
  "mock-interview": {
    title: "Mock Interview Simulation",
    desc: "Pick a role and persona. We'll run a 3-question round in character.",
  },
  companies: {
    title: "Company Cheat Sheets",
    desc: "Patterns, GPA cutoffs, DSA difficulty, and questions students actually saw.",
  },
  market: {
    title: "Market Heatmap",
    desc: "What's actually hiring this week, with growth signals.",
  },
};

export function FeatureDialog({
  feature,
  open,
  onOpenChange,
}: {
  feature: FeatureKey;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const meta = titles[feature];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[88vh] overflow-y-auto bg-card border-hairline">
        <DialogHeader>
          <DialogTitle className="text-2xl tracking-tight">{meta.title}</DialogTitle>
          <DialogDescription>{meta.desc}</DialogDescription>
        </DialogHeader>
        <div className="mt-2">
          {feature === "skill-gap" && <SkillGapPanel />}
          {feature === "roadmap" && <RoadmapTool />}
          {feature === "resume" && <ResumeTool />}
          {feature === "mock-interview" && <MockInterviewTool />}
          {feature === "companies" && <CompanyCheatSheet />}
          {feature === "market" && <MarketHeatmap />}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- Roadmap ---------- */
function RoadmapTool() {
  const run = useServerFn(generateRoadmap);
  const [goal, setGoal] = useState("Become interview-ready for SDE-1 at a product company");
  const [mode, setMode] = useState<"video" | "reading">("video");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<RoadmapResult | null>(null);

  async function go() {
    setLoading(true);
    setError(null);
    try {
      setData(await run({ data: { goal, mode, weeks: 8 } }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 p-4 rounded-xl bg-surface-2/40 border border-hairline">
        <input
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Your goal…"
          className="w-full text-sm bg-background border border-hairline rounded-lg px-3 py-2 focus:outline-none focus:border-electric/50"
        />
        <div className="flex items-center gap-1 p-1 bg-surface-2 rounded-full border border-hairline w-fit text-[10px] font-bold tracking-widest">
          {(["video", "reading"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1 rounded-full uppercase transition-colors ${
                mode === m ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <RunButton loading={loading} onClick={go} label={data ? "Regenerate roadmap" : "Generate roadmap"} />
        {error && <p className="text-xs text-danger">{error}</p>}
      </div>

      {data && (
        <ol className="relative space-y-3 pl-6 border-l border-hairline">
          {data.steps.map((s, i) => (
            <li key={i} className="relative">
              <span
                className={`absolute -left-[31px] top-1 size-3 rounded-full ${
                  i === 0 ? "bg-gradient-brand shadow-[var(--shadow-glow-blue)]" : "bg-surface-2 border border-hairline"
                }`}
              />
              <div className="p-4 rounded-xl bg-surface-2/40 border border-hairline">
                <p className="text-[10px] font-bold uppercase tracking-widest text-electric mb-1">{s.stage}</p>
                <p className="text-sm font-semibold">{s.title}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {s.duration} · {s.type} · {s.resource}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

/* ---------- Resume ---------- */
function ResumeTool() {
  const run = useServerFn(analyzeResume);
  const [text, setText] = useState("");
  const [role, setRole] = useState("SDE-1, Product");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ResumeAnalysis | null>(null);

  async function go() {
    setLoading(true);
    setError(null);
    try {
      setData(await run({ data: { resumeText: text, targetRole: role } }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3 p-4 rounded-xl bg-surface-2/40 border border-hairline">
        <input
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Target role"
          className="w-full text-sm bg-background border border-hairline rounded-lg px-3 py-2 focus:outline-none focus:border-electric/50"
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          placeholder="Paste your resume text here (min 50 chars)…"
          className="w-full text-sm bg-background border border-hairline rounded-lg px-3 py-2 focus:outline-none focus:border-electric/50 resize-none font-mono"
        />
        <RunButton loading={loading} onClick={go} label={data ? "Re-analyze" : "Analyze resume"} />
        {error && <p className="text-xs text-danger">{error}</p>}
      </div>

      {data && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-surface-2/40 border border-hairline flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">ATS Score</p>
              <p className="text-3xl font-bold text-gradient-brand">{data.atsScore}/100</p>
            </div>
            <p className="text-xs text-muted-foreground max-w-sm text-right">{data.summary}</p>
          </div>

          <Section title="Strengths">
            <ul className="space-y-1.5">
              {data.strengths.map((s, i) => (
                <li key={i} className="text-sm text-foreground/90">• {s}</li>
              ))}
            </ul>
          </Section>

          <Section title="Improvements">
            <ul className="space-y-3">
              {data.improvements.map((it, i) => (
                <li key={i}>
                  <p className="text-sm font-semibold text-warning">{it.issue}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{it.suggestion}</p>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Rewritten Bullets">
            <ul className="space-y-3">
              {data.rewrittenBullets.map((b, i) => (
                <li key={i} className="space-y-1">
                  <p className="text-xs text-muted-foreground line-through">{b.before}</p>
                  <p className="text-sm text-electric">{b.after}</p>
                </li>
              ))}
            </ul>
          </Section>
        </div>
      )}
    </div>
  );
}

/* ---------- Mock Interview ---------- */
function MockInterviewTool() {
  const run = useServerFn(generateMockInterview);
  const [role, setRole] = useState("Frontend Developer");
  const [persona, setPersona] = useState<"stressed-recruiter" | "friendly-mentor" | "technical-lead">(
    "friendly-mentor"
  );
  const [focus, setFocus] = useState("React internals and state management");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<MockInterview | null>(null);

  async function go() {
    setLoading(true);
    setError(null);
    try {
      setData(await run({ data: { role, persona, focus } }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  const personaLabel: Record<typeof persona, string> = {
    "stressed-recruiter": "Stressed Recruiter",
    "friendly-mentor": "Friendly Mentor",
    "technical-lead": "Technical Lead",
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3 p-4 rounded-xl bg-surface-2/40 border border-hairline">
        <input
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Role (e.g. Backend Developer)"
          className="w-full text-sm bg-background border border-hairline rounded-lg px-3 py-2 focus:outline-none focus:border-electric/50"
        />
        <input
          value={focus}
          onChange={(e) => setFocus(e.target.value)}
          placeholder="Focus area (optional)"
          className="w-full text-sm bg-background border border-hairline rounded-lg px-3 py-2 focus:outline-none focus:border-electric/50"
        />
        <div className="flex flex-wrap items-center gap-1 p-1 bg-surface-2 rounded-full border border-hairline w-fit text-[10px] font-bold tracking-widest">
          {(Object.keys(personaLabel) as (keyof typeof personaLabel)[]).map((p) => (
            <button
              key={p}
              onClick={() => setPersona(p)}
              className={`px-3 py-1 rounded-full uppercase transition-colors ${
                persona === p ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {personaLabel[p]}
            </button>
          ))}
        </div>
        <RunButton loading={loading} onClick={go} label={data ? "New round" : "Start mock interview"} />
        {error && <p className="text-xs text-danger">{error}</p>}
      </div>

      {data && (
        <div className="space-y-4">
          <p className="text-sm italic text-foreground/80 border-l-2 border-purple/40 pl-3">"{data.opener}"</p>
          {data.questions.map((q, i) => (
            <div key={i} className="p-4 rounded-xl bg-surface-2/40 border border-hairline">
              <p className="text-[10px] font-bold uppercase tracking-widest text-purple mb-2">Question {i + 1}</p>
              <p className="text-sm font-semibold mb-3">{q.question}</p>
              <p className="text-xs text-muted-foreground"><span className="text-foreground/80 font-semibold">Why:</span> {q.whyAsked}</p>
              <p className="text-xs text-muted-foreground mt-1"><span className="text-foreground/80 font-semibold">Looking for:</span> {q.whatTheyWant}</p>
            </div>
          ))}
          <div className="p-4 rounded-xl border border-electric/30 bg-electric-soft">
            <p className="text-[10px] font-bold uppercase tracking-widest text-electric mb-1">Closing tip</p>
            <p className="text-sm">{data.closingTip}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- shared ---------- */
function RunButton({ loading, onClick, label }: { loading: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full py-3 bg-gradient-brand rounded-xl text-xs font-bold text-white tracking-widest uppercase hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-[var(--shadow-glow-blue)] disabled:opacity-60"
    >
      {loading ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />}
      {loading ? "Working…" : label}
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-4 rounded-xl bg-surface-2/40 border border-hairline">
      <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">{title}</h4>
      {children}
    </div>
  );
}
