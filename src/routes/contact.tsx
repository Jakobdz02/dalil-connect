import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Mail, MapPin, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

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
  const { t } = useI18n();
  const [sending, setSending] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      (e.target as HTMLFormElement).reset();
      toast.success(t("contact.success"));
    }, 600);
  };

  const items = [
    { icon: Mail, label: t("contact.email"), value: "hello@dalil-connect.com" },
    { icon: MessageSquare, label: t("contact.support"), value: "support@dalil-connect.com" },
    { icon: MapPin, label: t("contact.basedIn"), value: t("contact.basedInValue") },
  ];

  return (
    <PageWrapper showFooter>
      <div className="max-w-5xl mx-auto px-4 py-16 grid lg:grid-cols-2 gap-12">
        <div>
          <span className="text-xs uppercase tracking-widest text-accent font-semibold">{t("contact.kicker")}</span>
          <h1 className="font-display text-4xl sm:text-5xl text-primary mt-2">{t("contact.title")}</h1>
          <p className="text-muted-foreground mt-5 leading-relaxed">{t("contact.intro")}</p>

          <div className="mt-10 space-y-5">
            {items.map(({ icon: Icon, label, value }) => (
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
          <h2 className="font-display text-xl text-primary">{t("contact.formTitle")}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">{t("contact.name")}</label>
              <Input required name="name" placeholder={t("contact.namePh")} className="mt-1.5" />
            </div>
            <div>
              <label className="text-sm font-medium">{t("contact.email")}</label>
              <Input required type="email" name="email" placeholder={t("contact.emailPh")} className="mt-1.5" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">{t("contact.subject")}</label>
            <Input required name="subject" placeholder={t("contact.subjectPh")} className="mt-1.5" />
          </div>
          <div>
            <label className="text-sm font-medium">{t("contact.message")}</label>
            <Textarea required name="message" rows={5} placeholder={t("contact.messagePh")} className="mt-1.5" />
          </div>
          <Button type="submit" disabled={sending} size="lg" className="w-full rounded-full h-11">
            <Send className="h-4 w-4" /> {sending ? t("contact.sending") : t("contact.send")}
          </Button>
        </form>
      </div>
    </PageWrapper>
  );
}
