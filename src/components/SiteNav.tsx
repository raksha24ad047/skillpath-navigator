import { Link } from "@tanstack/react-router";
import { Brand } from "./Brand";
import { useAuth } from "@/hooks/use-auth";
import { LogOut } from "lucide-react";

export function SiteNav() {
  const { user, signOut } = useAuth();
  return (
    <nav className="sticky top-0 z-50 border-b border-hairline/60 bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-3">
        <Link to="/"><Brand /></Link>
        <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "text-foreground" }} className="hover:text-foreground transition-colors">Home</Link>
          <Link to="/dashboard" activeProps={{ className: "text-foreground" }} className="hover:text-foreground transition-colors">Dashboard</Link>
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#companies" className="hover:text-foreground transition-colors">Cheat Sheets</a>
        </div>
        <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
          {user ? (
            <>
              <span className="text-xs font-mono text-muted-foreground/80 max-w-[140px] truncate">{user.email}</span>
              <button
                onClick={() => signOut()}
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide hover:text-foreground transition-colors"
              >
                <LogOut className="size-3.5" /> Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/auth" search={{ mode: "login" }} className="hover:text-foreground transition-colors">Sign in</Link>
              <Link
                to="/auth"
                search={{ mode: "register" }}
                className="px-4 py-2 bg-foreground text-background rounded-full text-xs font-bold tracking-wide hover:bg-foreground/90 transition-colors"
              >
                GET STARTED
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
