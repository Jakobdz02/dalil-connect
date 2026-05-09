import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useRecaptcha } from "@/hooks/useRecaptcha";
import { verifyRecaptcha } from "@/lib/recaptcha.functions";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { getToken } = useRecaptcha();
  const verifyFn = useServerFn(verifyRecaptcha);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const USERNAME_TO_EMAIL: Record<string, string> = {
    "dalil admin": "dalil.admin@dalil.app",
  };
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    const token = await getToken("admin_login");
    if (token) {
      try {
        const result = await verifyFn({ data: { token, action: "admin_login" } });
        if (!result.passed) {
          setErrorMsg("Security check failed. Please try again.");
          setSubmitting(false);
          return;
        }
      } catch (err) {
        console.warn("[admin-login] recaptcha verify failed — continuing", err);
      }
    }

    const lookup = USERNAME_TO_EMAIL[username.trim().toLowerCase()];
    const emailToUse = lookup ?? username.trim();

    const { data: signIn, error } = await supabase.auth.signInWithPassword({
      email: emailToUse,
      password,
    });

    if (error || !signIn.user) {
      setSubmitting(false);
      setErrorMsg("Invalid credentials");
      return;
    }

    // Verify the account has admin role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", signIn.user.id)
      .maybeSingle();

    if (profile?.role !== "admin") {
      await supabase.auth.signOut();
      setSubmitting(false);
      setErrorMsg("This account does not have administrator access.");
      return;
    }

    setSubmitting(false);
    navigate({ to: "/admin" });
  };

  return (
    <div className="min-h-screen grid place-items-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <span className="font-display text-2xl text-primary">Admin Console</span>
        </div>

        <div className="rounded-2xl border bg-card p-7 shadow-card">
          <h1 className="font-display text-3xl text-foreground">Restricted access</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sign in with your administrator credentials.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {errorMsg && (
              <p className="text-sm text-destructive" role="alert">
                {errorMsg}
              </p>
            )}
            <Button
              type="submit"
              className="w-full h-11 rounded-full"
              disabled={submitting}
            >
              {submitting ? "Verifying…" : "Enter Admin Console"}
            </Button>
          </form>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-6">
          Unauthorized access attempts are logged.
        </p>
      </div>
    </div>
  );
}
