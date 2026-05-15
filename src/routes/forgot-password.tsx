import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset password — DALIL" },
      { name: "description", content: "Reset your DALIL account password by email." },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/login`
            : undefined,
      });
    } catch {
      // Always show success to avoid email enumeration
    }
    setSubmitting(false);
    setDone(true);
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
          <h1 className="font-display text-3xl text-foreground">{t("forgot.title")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("forgot.subtitle")}</p>

          {done ? (
            <p className="mt-6 text-sm rounded-md bg-primary/10 text-primary p-3">
              {t("forgot.success")}
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">{t("forgot.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full h-11 rounded-full" disabled={submitting}>
                {submitting ? t("forgot.submitting") : t("forgot.submit")}
              </Button>
            </form>
          )}

          <p className="text-sm text-center mt-6">
            <Link to="/login" className="text-primary font-medium hover:underline">
              {t("forgot.back")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
