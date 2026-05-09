import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Users, UserCheck, Clock, CalendarCheck } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/shared/Button";
import { supabase } from "@/integrations/supabase/client";

type Stats = {
  users: number;
  guides: number;
  pendingGuides: number;
  bookings: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    (async () => {
      const [u, g, p, b] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase
          .from("guide_profiles")
          .select("id", { count: "exact", head: true })
          .eq("is_approved", true),
        supabase
          .from("guide_profiles")
          .select("id", { count: "exact", head: true })
          .eq("is_approved", false),
        supabase.from("bookings").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        users: u.count ?? 0,
        guides: g.count ?? 0,
        pendingGuides: p.count ?? 0,
        bookings: b.count ?? 0,
      });
    })();
  }, []);

  return (
    <PageWrapper>
      <div className="py-10 space-y-8">
        <div>
          <h1 className="font-display text-4xl text-primary">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Platform overview and moderation</p>
        </div>

        {!stats ? (
          <LoadingSpinner fullPage />
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={Users} label="Total users" value={stats.users} />
              <StatCard icon={UserCheck} label="Approved guides" value={stats.guides} />
              <StatCard
                icon={Clock}
                label="Pending guides"
                value={stats.pendingGuides}
                highlight={stats.pendingGuides > 0}
              />
              <StatCard icon={CalendarCheck} label="Total bookings" value={stats.bookings} />
            </div>

            <div className="flex flex-wrap gap-3">
              <Link to="/admin/guides">
                <Button>Review guides ({stats.pendingGuides})</Button>
              </Link>
              <Link to="/admin/users">
                <Button variant="ghost">Manage users</Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </PageWrapper>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: typeof Users;
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-center gap-3">
        <span
          className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${
            highlight ? "bg-amber-100 text-amber-800" : "bg-primary/10 text-primary"
          }`}
        >
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <div className="text-2xl font-display text-foreground">{value}</div>
          <div className="text-xs text-muted-foreground">{label}</div>
        </div>
      </div>
    </div>
  );
}
