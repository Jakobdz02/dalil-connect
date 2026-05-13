import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, Clock, Info } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/shared/Button";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import type { GuideProfile } from "@/types";

export default function GuideDashboard() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [guide, setGuide] = useState<GuideProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({ total: 0, pending: 0, confirmed: 0 });

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("guide_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      const g = (data as GuideProfile) ?? null;
      setGuide(g);
      if (g) {
        const { data: bookings } = await supabase
          .from("bookings")
          .select("status")
          .eq("guide_id", g.id);
        const list = bookings ?? [];
        setCounts({
          total: list.length,
          pending: list.filter((b) => b.status === "pending").length,
          confirmed: list.filter((b) => b.status === "confirmed").length,
        });
      }
      setLoading(false);
    })();
  }, [user]);

  if (loading) return <PageWrapper><LoadingSpinner fullPage /></PageWrapper>;

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto py-10 space-y-6">
        <div>
          <h1 className="font-display text-3xl text-primary">
            Hello, {profile?.name ?? "guide"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your profile, bookings and messages.
          </p>
        </div>

        {/* Verification status banner */}
        {!guide ? (
          <Banner tone="info" icon={<Info className="h-5 w-5" />}>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <span>Start your onboarding to apply as a verified guide.</span>
              <Link to="/guide/onboarding">
                <Button size="sm">Start onboarding</Button>
              </Link>
            </div>
          </Banner>
        ) : guide.verification_status === "verified" && guide.is_approved ? (
          <Banner tone="success" icon={<CheckCircle2 className="h-5 w-5" />}>
            Verified ✓ Your profile is live and visible to clients.
          </Banner>
        ) : guide.verification_status === "rejected" ? (
          <Banner tone="warning" icon={<Info className="h-5 w-5" />}>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                Your application was rejected.
                {guide.rejection_reason && (
                  <span className="block mt-1 text-sm opacity-90">Reason: {guide.rejection_reason}</span>
                )}
              </div>
              <Link to="/guide/onboarding"><Button size="sm">Edit & resubmit</Button></Link>
            </div>
          </Banner>
        ) : guide.verification_status === "draft" ? (
          <Banner tone="info" icon={<Info className="h-5 w-5" />}>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <span>Your onboarding is incomplete. Finish it to submit for verification.</span>
              <Link to="/guide/onboarding"><Button size="sm">Continue onboarding</Button></Link>
            </div>
          </Banner>
        ) : (
          <Banner tone="warning" icon={<Clock className="h-5 w-5" />}>
            Your application is {guide.verification_status === "under_review" ? "under review" : "submitted"} — admins are checking your documents.
          </Banner>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Stat label="Bookings received" value={counts.total} />
          <Stat label="Pending requests" value={counts.pending} />
          <Stat label="Confirmed bookings" value={counts.confirmed} />
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <NavCard to="/guide/onboarding" label="Onboarding" />
          <NavCard to="/guide/bookings" label="View Bookings" />
          <NavCard to="/guide/messages" label="View Messages" />
        </div>
      </div>
    </PageWrapper>
  );
}

function Banner({
  tone, icon, children,
}: { tone: "success" | "warning" | "info"; icon: React.ReactNode; children: React.ReactNode }) {
  const styles =
    tone === "success"
      ? "bg-green-50 text-green-900 border-green-200"
      : tone === "warning"
      ? "bg-amber-50 text-amber-900 border-amber-200"
      : "bg-blue-50 text-blue-900 border-blue-200";
  return (
    <div className={`flex items-start gap-3 rounded-xl border p-4 ${styles}`}>
      <span className="mt-0.5">{icon}</span>
      <div className="flex-1 text-sm">{children}</div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-card">
      <div className="text-3xl font-display text-primary">{value}</div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function NavCard({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to as "/guide/profile"}
      className="rounded-xl border bg-card p-5 shadow-card hover:border-primary/40 transition-colors text-foreground font-medium"
    >
      {label}
    </Link>
  );
}
