import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUpRight, Loader2, Mail, Lock, User as UserIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Brand } from "@/components/Brand";

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>) => ({
    mode: (s.mode as "login" | "register") ?? "login",
  }),
  head: () => ({
    meta: [
      { title: "Sign in — SkillMapper" },
      { name: "description", content: "Sign in or create your SkillMapper account to track placement readiness." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { mode } = Route.useSearch();
  const navigate = useNavigate();
  const isRegister = mode === "register";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isRegister) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { display_name: name },
          },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/dashboard" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}/dashboard`,
    });
    if (result.error) {
      setError(result.error instanceof Error ? result.error.message : "Google sign-in failed");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-grid opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 size-[600px] bg-electric/15 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 size-[400px] bg-purple/15 blur-[160px] rounded-full pointer-events-none" />

      <header className="relative z-10 px-6 h-16 flex items-center justify-between border-b border-hairline/60">
        <Link to="/"><Brand /></Link>
        <Link to="/" className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
          ← Back
        </Link>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="absolute -inset-px bg-gradient-brand rounded-2xl opacity-20 blur-xl" />
          <div className="relative bg-card/90 backdrop-blur-xl border border-hairline rounded-2xl p-8">
            <p className="text-[10px] font-bold uppercase tracking-widest text-electric mb-3">
              {isRegister ? "Create account" : "Welcome back"}
            </p>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              {isRegister ? "Start your readiness journey" : "Sign in to SkillMapper"}
            </h1>
            <p className="text-sm text-muted-foreground mb-6">
              {isRegister
                ? "Track your skill gaps, roadmap, and mock interviews in one place."
                : "Pick up where you left off."}
            </p>

            <button
              onClick={handleGoogle}
              type="button"
              className="w-full flex items-center justify-center gap-2 bg-surface-2 hover:bg-surface border border-hairline text-foreground text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
            >
              <GoogleIcon />
              Continue with Google
            </button>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-hairline" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">or email</span>
              <div className="h-px flex-1 bg-hairline" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {isRegister && (
                <Field icon={<UserIcon className="size-4" />} label="Name">
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Riya Sharma"
                    className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground/60"
                  />
                </Field>
              )}
              <Field icon={<Mail className="size-4" />} label="Email">
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@college.edu"
                  className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground/60"
                />
              </Field>
              <Field icon={<Lock className="size-4" />} label="Password">
                <input
                  required
                  minLength={6}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground/60"
                />
              </Field>

              {error && (
                <p className="text-xs text-danger bg-danger/10 border border-danger/20 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-gradient-brand text-white text-sm font-bold tracking-wide uppercase px-4 py-2.5 rounded-xl shadow-[var(--shadow-glow-blue)] hover:opacity-95 disabled:opacity-60 transition-opacity"
              >
                {loading ? <Loader2 className="size-4 animate-spin" /> : <ArrowUpRight className="size-4" />}
                {isRegister ? "Create account" : "Sign in"}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              {isRegister ? "Already have an account?" : "New to SkillMapper?"}{" "}
              <Link
                to="/auth"
                search={{ mode: isRegister ? "login" : "register" }}
                className="text-electric font-semibold hover:underline"
              >
                {isRegister ? "Sign in" : "Create one"}
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="mt-1 flex items-center gap-2 bg-surface-2 border border-hairline rounded-xl px-3 py-2.5 focus-within:border-electric/60 transition-colors">
        <span className="text-muted-foreground">{icon}</span>
        {children}
      </div>
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A10.99 10.99 0 0 0 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18A10.99 10.99 0 0 0 1 12c0 1.77.42 3.45 1.18 4.94l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
    </svg>
  );
}
