import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { GuideCard, type GuideCardData } from "@/components/GuideCard";
import { Button } from "@/components/shared/Button";
import { Badge } from "@/components/shared/Badge";
import { Avatar } from "@/components/shared/Avatar";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import type { Booking, BookingStatus, GuideProfile } from "@/types";

type RecentBooking = Booking & {
  guide: Pick<GuideProfile, "full_name" | "photo_url"> | null;
};

const statusVariant: Record<BookingStatus, "pending" | "confirmed" | "completed" | "cancelled"> = {
  pending: "pending",
  confirmed: "confirmed",
  completed: "completed",
  cancelled: "cancelled",
};

export default function SeekerDashboard() {
  const { profile } = useProfile();
  const { user } = useAuth();
  const { t, dir } = useI18n();
  const [guides, setGuides] = useState<GuideCardData[]>([]);
  const [recent, setRecent] = useState<RecentBooking[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("guide_profiles")
        .select("id, full_name, city, languages, category, description, price_per_day, photo_url")
        .eq("is_approved", true)
        .order("created_at", { ascending: false })
        .limit(3);
      setGuides((data ?? []) as GuideCardData[]);
    })();
  }, []);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: bookings } = await supabase
        .from("bookings")
        .select("*")
        .eq("seeker_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3);
      const list = (bookings ?? []) as Booking[];
      const ids = Array.from(new Set(list.map((b) => b.guide_id)));
      const map = new Map<string, RecentBooking["guide"]>();
      if (ids.length) {
        const { data: gs } = await supabase
          .from("guide_profiles")
          .select("id, full_name, photo_url")
          .in("id", ids);
        (gs ?? []).forEach((g) => map.set(g.id, { full_name: g.full_name, photo_url: g.photo_url }));
      }
      setRecent(list.map((b) => ({ ...b, guide: map.get(b.guide_id) ?? null })));
    })();
  }, [user]);

  return (
    <PageWrapper>
      <div dir={dir} className="max-w-6xl mx-auto py-10 space-y-10">
        <div>
          <h1 className="font-display text-3xl text-primary">
            {t("seeker.dash.welcome")}{profile?.name ? `, ${profile.name}` : ""}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("seeker.dash.subtitle")}
          </p>
        </div>

        {recent.length > 0 && (
          <section>
            <div className="flex items-end justify-between mb-4">
              <h2 className="font-display text-2xl text-foreground">{t("seeker.dash.recent")}</h2>
              <Link to="/bookings" className="text-sm text-primary hover:underline">
                {t("seeker.dash.viewAll")}
              </Link>
            </div>
            <div className="space-y-3">
              {recent.map((b) => (
                <div key={b.id} className="rounded-xl border bg-card p-4 shadow-card flex items-center gap-4">
                  <Avatar src={b.guide?.photo_url ?? undefined} name={b.guide?.full_name ?? t("seeker.bookings.guideFallback")} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground truncate">{b.guide?.full_name ?? t("seeker.bookings.guideFallback")}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(b.date).toLocaleDateString()}
                    </div>
                  </div>
                  <Badge variant={statusVariant[b.status]}>{t(`status.${b.status}`)}</Badge>
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="flex items-end justify-between mb-4">
            <h2 className="font-display text-2xl text-foreground">{t("seeker.dash.browse")}</h2>
            <Link to="/guides" className="text-sm text-primary hover:underline">
              {t("seeker.dash.seeAll")}
            </Link>
          </div>
          {guides.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("seeker.dash.noGuides")}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {guides.map((g) => <GuideCard key={g.id} guide={g} />)}
            </div>
          )}
          <div className="mt-6">
            <Link to="/guides">
              <Button variant="ghost">{t("seeker.dash.browseAll")}</Button>
            </Link>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}
