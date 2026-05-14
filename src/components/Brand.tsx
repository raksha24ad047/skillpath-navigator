import { Link } from "@tanstack/react-router";

export function Brand({ size = "md" }: { size?: "sm" | "md" }) {
  const text = size === "sm" ? "text-base" : "text-xl";
  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <div className="size-8 rounded-lg bg-gradient-brand grid place-items-center shadow-[var(--shadow-glow-blue)]">
        <div className="size-3.5 bg-white/25 rounded-sm rotate-45 group-hover:rotate-[60deg] transition-transform" />
      </div>
      <span className={`font-bold tracking-tight text-foreground ${text}`}>
        SkillMapper
      </span>
    </Link>
  );
}
