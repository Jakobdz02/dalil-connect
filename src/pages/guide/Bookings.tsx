import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CalendarX } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Avatar } from "@/components/shared/Avatar";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import type { Booking, BookingStatus, Profile } from "@/types";

type Row = Booking & {
  seeker: Pick<Profile, "id" | "name" | "avatar_url"> | null;
};

const statusVariant: Record<BookingStatus, "pending" | "confirmed" | "completed" | "cancelled"> = {
  pending: "pending",
  confirmed: "confirmed",
  completed: "completed",
  cancelled: "cancelled",
};

export default function GuideBookings() {
  const { user } = useAuth();
  const { t, dir } = useI18n();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const { data: gp } = await supabase
      .from("guide_profiles")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!gp) { setRows([]); setLoading(false); return; }

    const { data: bookings } = await supabase
      .from("bookings")
      .select("*")
      .eq("guide_id", gp.id)
      .order("created_at", { ascending: false });
    const list = (bookings ?? []) as Booking[];

    const seekerIds = Array.from(new Set(list.map((b) => b.seeker_id)));
    const map = new Map<string, Row["seeker"]>();
    if (seekerIds.length) {
      const { data: seekers } = await supabase
        .from("profiles")
        .select("id, name, avatar_url")
        .in("id", seekerIds);
      (seekers ?? []).forEach((s) => map.set(s.id, s as Row["seeker"]));
    }
    setRows(list.map((b) => ({ ...b, seeker: map.get(b.seeker_id) ?? null })));
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  const update = async (id: string, status: BookingStatus) => {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    const toastKey =
      status === "cancelled" ? "guide.bookings.toast.cancelled"
      : status === "confirmed" ? "guide.bookings.toast.confirmed"
      : status === "completed" ? "guide.bookings.toast.completed"
      : "guide.bookings.toast.confirmed";
    toast.success(t(toastKey));
    load();
  };

  return (
    <PageWrapper>
      <div dir={dir} className="max-w-3xl mx-auto py-10">
        <h1 className="font-display text-3xl text-primary mb-6">{t("guide.bookings.title")}</h1>

        {loading ? (
          <LoadingSpinner fullPage />
        ) : rows.length === 0 ? (
          <EmptyState icon={CalendarX} title={t("guide.bookings.empty")} />
        ) : (
          <div className="space-y-3">
            {rows.map((b) => (
              <div key={b.id} className="rounded-xl border bg-card p-4 shadow-card">
                <div className="flex items-start gap-4">
                  <Avatar src={b.seeker?.avatar_url ?? undefined} name={b.seeker?.name ?? t("guide.bookings.seekerFallback")} size="lg" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <span className="font-semibold text-foreground">
                        {b.seeker?.name ?? t("guide.bookings.seekerFallback")}
                      </span>
                      <Badge variant={statusVariant[b.status]}>{t(`status.${b.status}`)}</Badge>
                    </div>
                    <div className="text-sm text-foreground mt-1">
                      <span className="text-muted-foreground">{t("guide.bookings.date")}</span>{" "}
                      {new Date(b.date).toLocaleDateString()}
                    </div>
                    {b.notes && (
                      <p className="text-sm text-muted-foreground mt-2 whitespace-pre-line">
                        {b.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap justify-end gap-2 mt-3">
                  {b.status === "pending" && (
                    <>
                      <Button size="sm" variant="ghost" onClick={() => update(b.id, "cancelled")}>
                        {t("common.cancel")}
                      </Button>
                      <Button size="sm" onClick={() => update(b.id, "confirmed")}>
                        {t("common.confirm")}
                      </Button>
                    </>
                  )}
                  {b.status === "confirmed" && (
                    <Button size="sm" onClick={() => update(b.id, "completed")}>
                      {t("guide.bookings.markComplete")}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
