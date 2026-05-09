import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { MessageSquare } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Avatar } from "@/components/shared/Avatar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import type { Booking, GuideProfile, Message, Profile } from "@/types";

interface Convo {
  bookingId: string;
  bookingDate: string;
  otherName: string;
  otherPhoto: string | null;
  lastMessage: Message | null;
  unread: boolean;
}

interface Props {
  /** "seeker" → other party is the guide; "guide" → other party is the seeker */
  viewerRole: "seeker" | "guide";
}

export default function MessageList({ viewerRole }: Props) {
  const { user } = useAuth();
  const [convos, setConvos] = useState<Convo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      // 1. Fetch this user's bookings
      let bookingsQ = supabase.from("bookings").select("*");
      if (viewerRole === "seeker") {
        bookingsQ = bookingsQ.eq("seeker_id", user.id);
      } else {
        const { data: gp } = await supabase
          .from("guide_profiles")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();
        if (!gp) { setConvos([]); setLoading(false); return; }
        bookingsQ = bookingsQ.eq("guide_id", gp.id);
      }
      const { data: bookings } = await bookingsQ;
      const list = (bookings ?? []) as Booking[];
      if (list.length === 0) { setConvos([]); setLoading(false); return; }

      // 2. Resolve the "other party" for each booking
      const otherMap = new Map<string, { name: string; photo: string | null }>();
      if (viewerRole === "seeker") {
        const ids = Array.from(new Set(list.map((b) => b.guide_id)));
        const { data: gs } = await supabase
          .from("guide_profiles")
          .select("id, full_name, photo_url")
          .in("id", ids);
        (gs ?? []).forEach((g) => {
          const x = g as Pick<GuideProfile, "id" | "full_name" | "photo_url">;
          otherMap.set(x.id, { name: x.full_name, photo: x.photo_url });
        });
      } else {
        const ids = Array.from(new Set(list.map((b) => b.seeker_id)));
        const { data: ps } = await supabase
          .from("profiles")
          .select("id, name, avatar_url")
          .in("id", ids);
        (ps ?? []).forEach((p) => {
          const x = p as Pick<Profile, "id" | "name" | "avatar_url">;
          otherMap.set(x.id, { name: x.name, photo: x.avatar_url });
        });
      }

      // 3. Fetch latest message per booking (single batched query)
      const { data: msgs } = await supabase
        .from("messages")
        .select("*")
        .in("booking_id", list.map((b) => b.id))
        .order("created_at", { ascending: false });
      const latest = new Map<string, Message>();
      (msgs ?? []).forEach((m) => {
        const msg = m as Message;
        if (msg.booking_id && !latest.has(msg.booking_id)) latest.set(msg.booking_id, msg);
      });

      // 4. Build conversation list
      const built: Convo[] = list.map((b) => {
        const otherKey = viewerRole === "seeker" ? b.guide_id : b.seeker_id;
        const other = otherMap.get(otherKey) ?? { name: "Unknown", photo: null };
        const last = latest.get(b.id) ?? null;
        return {
          bookingId: b.id,
          bookingDate: b.date,
          otherName: other.name,
          otherPhoto: other.photo,
          lastMessage: last,
          unread: !!last && last.sender_id !== user.id,
        };
      });

      // 5. Sort by latest message desc; bookings with no messages go to bottom
      built.sort((a, b) => {
        const at = a.lastMessage?.created_at ?? "";
        const bt = b.lastMessage?.created_at ?? "";
        return bt.localeCompare(at);
      });

      setConvos(built);
      setLoading(false);
    })();
  }, [user, viewerRole]);

  if (loading) return <PageWrapper><LoadingSpinner fullPage /></PageWrapper>;

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto py-10">
        <h1 className="font-display text-3xl text-primary mb-6">Messages</h1>
        {convos.length === 0 ? (
          <EmptyState icon={MessageSquare} title="No conversations yet" />
        ) : (
          <div className="space-y-2">
            {convos.map((c) => (
              <Link
                key={c.bookingId}
                to="/messages/$bookingId"
                params={{ bookingId: c.bookingId }}
                className="flex items-center gap-3 rounded-xl border bg-card p-3 shadow-card hover:border-primary/40 transition-colors"
              >
                <div className="relative">
                  <Avatar src={c.otherPhoto} name={c.otherName} size="md" />
                  {c.unread && (
                    <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-accent ring-2 ring-card" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`truncate ${c.unread ? "font-semibold" : "font-medium"}`}>
                      {c.otherName}
                    </span>
                    {c.lastMessage && (
                      <span className="text-[11px] text-muted-foreground shrink-0">
                        {new Date(c.lastMessage.created_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Booking · {new Date(c.bookingDate).toLocaleDateString()}
                  </div>
                  <p className="text-sm text-muted-foreground truncate mt-0.5">
                    {c.lastMessage
                      ? c.lastMessage.content.length > 60
                        ? c.lastMessage.content.slice(0, 60) + "…"
                        : c.lastMessage.content
                      : "No messages yet"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
