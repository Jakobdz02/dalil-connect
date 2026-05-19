import { useEffect, useState } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { HOME_FOR_ROLE } from "@/lib/auth-redirect";
import { useI18n } from "@/lib/i18n";
import type { UserRole } from "@/types";

export default function Login() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { user } = useAuth();
  const search = useSearch({ from: "/login" }) as { redirect?: string };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // If already signed in, route by role
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();
      const role = (data?.role ?? "seeker") as UserRole;
      navigate({ to: search.redirect ?? HOME_FOR_ROLE[role] });
    })();
  }, [user, navigate, search.redirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (error) {
      setErrorMsg(
        error.code === "email_not_confirmed"
          ? t("login.emailNotConfirmed")
          : t("login.invalid"),
      );
      return;
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Compass className="h-5 w-5" />
          </span>
          <span className="font-display text-2xl text-primary">
            DALIL <span className="text-accent text-base">دليل</span>
          </span>
        </Link>

        <div className="rounded-2xl border bg-card p-7 shadow-card">
          <h1 className="font-display text-3xl text-foreground">{t("login.title")}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("login.subtitle")}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">{t("login.email")}</Label>
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t("login.password")}</Label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  {t("login.forgot")}
                </Link>
              </div>
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
              <p className="text-sm text-destructive" role="alert">{errorMsg}</p>
            )}
            <Button
              type="submit"
              className="w-full h-11 rounded-full"
              disabled={submitting}
            >
              {submitting ? t("login.submitting") : t("login.submit")}
            </Button>
          </form>

          <p className="text-sm text-muted-foreground text-center mt-6">
            {t("login.new")}{" "}
            <Link to="/signup" className="text-primary font-medium hover:underline">
              {t("login.create")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
