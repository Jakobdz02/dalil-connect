import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { CalendarX, MapPin } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Avatar } from "@/components/shared/Avatar";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import type { Booking, BookingStatus, GuideProfile } from "@/types";

type Row = Booking & {
  guide: Pick<GuideProfile, "id" | "full_name" | "city" | "photo_url"> | null;
};

const statusVariant: Record<BookingStatus, "pending" | "confirmed" | "completed" | "cancelled"> = {
  pending: "pending",
  confirmed: "confirmed",
  completed: "completed",
  cancelled: "cancelled",
};

export default function SeekerBookings() {
  const { user } = useAuth();
  const { t, dir } = useI18n();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) return;
    const { data: bookings } = await supabase
      .from("bookings")
      .select("*")
      .eq("seeker_id", user.id)
      .order("created_at", { ascending: false });
    const list = (bookings ?? []) as Booking[];
    const guideIds = Array.from(new Set(list.map((b) => b.guide_id)));
    let guidesMap = new Map<string, Row["guide"]>();
    if (guideIds.length) {
      const { data: guides } = await supabase
        .from("guide_profiles")
        .select("id, full_name, city, photo_url")
        .in("id", guideIds);
      (guides ?? []).forEach((g) => guidesMap.set(g.id, g as Row["guide"]));
    }
    setRows(list.map((b) => ({ ...b, guide: guidesMap.get(b.guide_id) ?? null })));
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  const cancel = async (id: string) => {
    const { error } = await supabase.from("bookings").update({ status: "cancelled" }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(t("seeker.bookings.toast.cancelled"));
    load();
  };

  return (
    <PageWrapper>
      <div dir={dir} className="max-w-3xl mx-auto py-10">
        <h1 className="font-display text-3xl text-primary mb-6">{t("seeker.bookings.title")}</h1>

        {loading ? (
          <LoadingSpinner fullPage />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={CalendarX}
            title={t("seeker.bookings.empty.title")}
            description={t("seeker.bookings.empty.desc")}
            action={
              <Link to="/guides">
                <Button>{t("seeker.bookings.browseBtn")}</Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-3">
            {rows.map((b) => (
              <div key={b.id} className="rounded-xl border bg-card p-4 shadow-card">
                <div className="flex items-start gap-4">
                  <Avatar src={b.guide?.photo_url ?? undefined} name={b.guide?.full_name ?? t("seeker.bookings.guideFallback")} size="lg" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <Link
                        to="/guides/$id"
                        params={{ id: b.guide_id }}
                        className="font-semibold text-foreground hover:text-primary"
                      >
                        {b.guide?.full_name ?? t("seeker.bookings.guideFallback")}
                      </Link>
                      <Badge variant={statusVariant[b.status]}>{t(`status.${b.status}`)}</Badge>
                    </div>
                    {b.guide?.city && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {b.guide.city}
                      </div>
                    )}
                    <div className="text-sm text-foreground mt-2">
                      <span className="text-muted-foreground">{t("seeker.bookings.date")}</span>{" "}
                      {new Date(b.date).toLocaleDateString()}
                    </div>
                    {b.notes && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{b.notes}</p>
                    )}
                  </div>
                </div>
                {b.status === "pending" && (
                  <div className="flex justify-end mt-3">
                    <Button variant="ghost" size="sm" onClick={() => cancel(b.id)}>
                      {t("common.cancel")}
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
