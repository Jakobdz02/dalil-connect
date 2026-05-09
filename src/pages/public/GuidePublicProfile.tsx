import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { MapPin, MessageCircle, Calendar, UserX } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Avatar } from "@/components/shared/Avatar";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { supabase } from "@/integrations/supabase/client";
import { BookingModal } from "@/components/BookingModal";
import { getLanguageFlag, getLanguageName } from "@/lib/algeriaData";
import { GUIDE_CATEGORY_LABELS, normalizeCategory } from "@/lib/guideCategories";
import type { GuideProfile } from "@/types";

export default function GuidePublicProfile({ id }: { id: string }) {
  const { user } = useAuth();
  const { role } = useRole();
  const navigate = useNavigate();
  const [guide, setGuide] = useState<GuideProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);

  const handleMessage = async () => {
    if (!user || !guide) return;
    const { data } = await supabase
      .from("bookings")
      .select("id")
      .eq("seeker_id", user.id)
      .eq("guide_id", guide.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (data?.id) {
      navigate({ to: "/messages/$bookingId", params: { bookingId: data.id } });
    } else {
      toast.info("Book this guide first to start a conversation.");
    }
  };

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("guide_profiles")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      setGuide((data as GuideProfile) ?? null);
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return <PageWrapper showFooter><LoadingSpinner fullPage /></PageWrapper>;
  }

  if (!guide) {
    return (
      <PageWrapper showFooter>
        <div className="py-16">
          <EmptyState
            icon={UserX}
            title="Guide not found"
            description="This guide profile doesn't exist or has been removed."
          />
        </div>
      </PageWrapper>
    );
  }

  const isSeeker = !!user && role === "seeker";

  return (
    <PageWrapper showFooter>
      <div className="max-w-3xl mx-auto py-10 space-y-6">
        {!guide.is_approved && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 text-amber-900 text-sm px-4 py-2">
            This guide is pending approval.
          </div>
        )}

        <div className="rounded-2xl border bg-card p-6 shadow-card">
          <div className="flex items-start gap-5 flex-wrap">
            <Avatar src={guide.photo_url ?? undefined} name={guide.full_name} size="xl" />
            <div className="flex-1 min-w-0">
              <h1 className="font-display text-3xl text-primary">{guide.full_name}</h1>
              <div className="flex items-center gap-1.5 text-muted-foreground mt-1 text-sm">
                <MapPin className="h-4 w-4" />
                {guide.city}
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="approved">{GUIDE_CATEGORY_LABELS[normalizeCategory(guide.category)]}</Badge>
                {guide.languages.map((l) => (
                  <Badge key={l} variant="default">
                    <span className="me-1">{getLanguageFlag(l)}</span>{getLanguageName(l)}
                  </Badge>
                ))}
              </div>
              {guide.subcategory && (
                <p className="text-sm text-muted-foreground mt-3">
                  <span className="font-medium text-foreground">Specialization:</span> {guide.subcategory}
                </p>
              )}
            </div>
          </div>

          {guide.description && (
            <p className="mt-6 text-foreground/90 whitespace-pre-line leading-relaxed">
              {guide.description}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-sm">
            <InfoRow
              label="Price per day"
              value={
                guide.price_per_day != null
                  ? `${guide.price_per_day.toLocaleString()} DZD`
                  : "—"
              }
            />
            <InfoRow label="Availability" value={guide.availability ?? "—"} />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {isSeeker ? (
              <>
                <Button onClick={() => setBookingOpen(true)}>
                  <Calendar className="h-4 w-4 me-2" /> Book This Guide
                </Button>
                <Button variant="ghost" onClick={handleMessage}>
                  <MessageCircle className="h-4 w-4 me-2" /> Message
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button>Sign in to book</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
      <BookingModal
        open={bookingOpen}
        onOpenChange={setBookingOpen}
        guideId={guide.id}
        guideName={guide.full_name}
      />
    </PageWrapper>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-background px-4 py-3">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-medium text-foreground">{value}</div>
    </div>
  );
}
