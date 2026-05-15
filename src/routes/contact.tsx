import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Mail, MapPin, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact DALIL — Get in touch" },
      { name: "description", content: "Questions, partnerships, support — reach the DALIL team. We typically reply within 24 hours." },
      { property: "og:title", content: "Contact DALIL" },
      { property: "og:description", content: "We typically reply within 24 hours." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sending, setSending] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      (e.target as HTMLFormElement).reset();
      toast.success("Message sent — we'll get back to you within 24 hours.");
    }, 600);
  };

  return (
    <PageWrapper showFooter>
      <div className="max-w-5xl mx-auto px-4 py-16 grid lg:grid-cols-2 gap-12">
        <div>
          <span className="text-xs uppercase tracking-widest text-accent font-semibold">Contact</span>
          <h1 className="font-display text-4xl sm:text-5xl text-primary mt-2">Let's talk.</h1>
          <p className="text-muted-foreground mt-5 leading-relaxed">
            Whether you're a traveler with a question, a guide ready to join, or a partner — we'd love to hear from you.
          </p>

          <div className="mt-10 space-y-5">
            {[
              { icon: Mail, label: "Email", value: "hello@dalil-connect.com" },
              { icon: MessageSquare, label: "Support", value: "support@dalil-connect.com" },
              { icon: MapPin, label: "Based in", value: "Algiers, Algeria" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
                  <div className="font-medium">{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={onSubmit} className="rounded-2xl border bg-card p-6 sm:p-8 shadow-card space-y-4">
          <h2 className="font-display text-xl text-primary">Send us a message</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input required name="name" placeholder="Your name" className="mt-1.5" />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input required type="email" name="email" placeholder="you@email.com" className="mt-1.5" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Subject</label>
            <Input required name="subject" placeholder="How can we help?" className="mt-1.5" />
          </div>
          <div>
            <label className="text-sm font-medium">Message</label>
            <Textarea required name="message" rows={5} placeholder="Tell us more…" className="mt-1.5" />
          </div>
          <Button type="submit" disabled={sending} size="lg" className="w-full rounded-full h-11">
            <Send className="h-4 w-4" /> {sending ? "Sending…" : "Send message"}
          </Button>
        </form>
      </div>
    </PageWrapper>
  );
}
