import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Send } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Avatar } from "@/components/shared/Avatar";
import { Badge } from "@/components/shared/Badge";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/shared/Button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import type { Booking, BookingStatus, GuideProfile, Message, Profile } from "@/types";

const statusVariant: Record<BookingStatus, "pending" | "confirmed" | "completed" | "cancelled"> = {
  pending: "pending", confirmed: "confirmed", completed: "completed", cancelled: "cancelled",
};

export default function Conversation({ bookingId }: { bookingId: string }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [other, setOther] = useState<{ name: string; avatar_url: string | null; id: string } | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initial load: booking + other party
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: b } = await supabase
        .from("bookings")
        .select("*")
        .eq("id", bookingId)
        .maybeSingle();
      if (!b) { setLoading(false); return; }
      const booking = b as Booking;
      setBooking(booking);

      // Resolve the "other" party
      let otherUserId: string | null = null;
      let otherName = "";
      let otherPhoto: string | null = null;

      if (booking.seeker_id === user.id) {
        // I'm seeker → other is guide (need guide_profiles.user_id + name)
        const { data: gp } = await supabase
          .from("guide_profiles")
          .select("user_id, full_name, photo_url")
          .eq("id", booking.guide_id)
          .maybeSingle();
        const g = gp as Pick<GuideProfile, "user_id" | "full_name" | "photo_url"> | null;
        if (g) {
          otherUserId = g.user_id;
          otherName = g.full_name;
          otherPhoto = g.photo_url;
        }
      } else {
        // I'm guide → other is seeker (profiles)
        const { data: p } = await supabase
          .from("profiles")
          .select("id, name, avatar_url")
          .eq("id", booking.seeker_id)
          .maybeSingle();
        const s = p as Pick<Profile, "id" | "name" | "avatar_url"> | null;
        if (s) {
          otherUserId = s.id;
          otherName = s.name;
          otherPhoto = s.avatar_url;
        }
      }
      if (otherUserId) setOther({ id: otherUserId, name: otherName, avatar_url: otherPhoto });
      setLoading(false);
    })();
  }, [bookingId, user]);

  // Fetch messages + poll every 5s
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const fetchMsgs = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("booking_id", bookingId)
        .order("created_at", { ascending: true });
      if (cancelled) return;
      setMessages((prev) => {
        const next = (data ?? []) as Message[];
        // preserve only if changed
        if (prev.length === next.length && prev[prev.length - 1]?.id === next[next.length - 1]?.id) {
          return prev;
        }
        return next;
      });
    };
    fetchMsgs();
    const t = setInterval(fetchMsgs, 5000);
    return () => { cancelled = true; clearInterval(t); };
  }, [bookingId, user]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || !user || !other || sending) return;
    setSending(true);
    const optimistic: Message = {
      id: `temp-${Date.now()}`,
      booking_id: bookingId,
      sender_id: user.id,
      receiver_id: other.id,
      content: trimmed,
      created_at: new Date().toISOString(),
    };
    setMessages((m) => [...m, optimistic]);
    setText("");
    const { error } = await supabase.from("messages").insert({
      booking_id: bookingId,
      sender_id: user.id,
      receiver_id: other.id,
      content: trimmed,
    });
    setSending(false);
    if (error) {
      // rollback optimistic
      setMessages((m) => m.filter((x) => x.id !== optimistic.id));
    }
  };

  if (loading) return <PageWrapper><LoadingSpinner fullPage /></PageWrapper>;
  if (!booking || !other) {
    return (
      <PageWrapper>
        <div className="max-w-2xl mx-auto py-10 text-center text-muted-foreground">
          Conversation not found.
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto py-6 flex flex-col h-[calc(100vh-12rem)]">
        {/* Header */}
        <div className="flex items-center gap-3 pb-3 border-b">
          <button
            type="button"
            onClick={() => navigate({ to: booking.seeker_id === user!.id ? "/messages" : "/guide/messages" })}
            className="p-2 -ms-2 rounded-md hover:bg-muted"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <Avatar src={other.avatar_url} name={other.name} size="md" />
          <div className="flex-1 min-w-0">
            <div className="font-semibold truncate">{other.name}</div>
            <div className="text-xs text-muted-foreground">
              Booking · {new Date(booking.date).toLocaleDateString()}
            </div>
          </div>
          <Badge variant={statusVariant[booking.status]}>{booking.status}</Badge>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto py-4 space-y-3">
          {messages.length === 0 ? (
            <div className="h-full grid place-items-center text-sm text-muted-foreground">
              No messages yet. Start the conversation.
            </div>
          ) : (
            messages.map((m) => {
              const own = m.sender_id === user!.id;
              return (
                <div key={m.id} className={`flex ${own ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] ${own ? "items-end" : "items-start"} flex flex-col`}>
                    <div
                      className={`px-3.5 py-2 rounded-2xl text-sm whitespace-pre-line ${
                        own
                          ? "bg-primary text-primary-foreground rounded-br-sm"
                          : "bg-muted text-foreground rounded-bl-sm"
                      }`}
                    >
                      {m.content}
                    </div>
                    <span className="text-[10px] text-muted-foreground mt-1 px-1">
                      {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input */}
        <form onSubmit={send} className="flex items-end gap-2 pt-3 border-t">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a message…"
            rows={1}
            className="resize-none min-h-[44px] max-h-32"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(e as unknown as React.FormEvent);
              }
            }}
          />
          <Button type="submit" disabled={!text.trim() || sending} className="h-11">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </PageWrapper>
  );
}
