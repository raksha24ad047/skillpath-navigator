import { Link } from "@tanstack/react-router";
import { Brand } from "./Brand";

export function SiteNav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-hairline/60 bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Brand />
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "text-foreground" }} className="hover:text-foreground transition-colors">Home</Link>
          <Link to="/dashboard" activeProps={{ className: "text-foreground" }} className="hover:text-foreground transition-colors">Dashboard</Link>
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#companies" className="hover:text-foreground transition-colors">Cheat Sheets</a>
          <div className="h-4 w-px bg-hairline" />
          <Link
            to="/dashboard"
            className="px-4 py-2 bg-foreground text-background rounded-full text-xs font-bold tracking-wide hover:bg-foreground/90 transition-colors"
          >
            LAUNCH
          </Link>
        </div>
      </div>
    </nav>
  );
}
