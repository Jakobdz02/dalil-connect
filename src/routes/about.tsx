import { createFileRoute, Link } from "@tanstack/react-router";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Compass, Heart, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About DALIL — Verified local guides across Algeria" },
      { name: "description", content: "DALIL is the trusted marketplace connecting tourists, students and investors with verified local guides across every wilaya of Algeria." },
      { property: "og:title", content: "About DALIL" },
      { property: "og:description", content: "Our mission: make Algeria accessible to everyone, through people who actually live it." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { t } = useI18n();
  const items = [
    { icon: ShieldCheck, title: t("about.trustTitle"), body: t("about.trustBody") },
    { icon: Heart, title: t("about.localTitle"), body: t("about.localBody") },
    { icon: Users, title: t("about.everyoneTitle"), body: t("about.everyoneBody") },
  ];

  return (
    <PageWrapper showFooter>
      <div className="max-w-3xl mx-auto px-4 py-16">
        <span className="text-xs uppercase tracking-widest text-accent font-semibold">{t("about.kicker")}</span>
        <h1 className="font-display text-4xl sm:text-5xl text-primary mt-2">{t("about.title")}</h1>
        <p className="text-muted-foreground text-lg mt-6 leading-relaxed">{t("about.intro")}</p>

        <div className="grid sm:grid-cols-3 gap-5 mt-12">
          {items.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl border bg-card p-5">
              <Icon className="h-6 w-6 text-primary" />
              <h3 className="font-display text-lg mt-3">{title}</h3>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        <h2 className="font-display text-2xl text-primary mt-14">{t("about.missionTitle")}</h2>
        <p className="text-muted-foreground mt-3 leading-relaxed">{t("about.missionBody")}</p>

        <div className="mt-12 flex flex-wrap gap-3">
          <Button asChild size="lg" className="rounded-full px-6 h-11">
            <Link to="/guides"><Compass className="h-4 w-4" /> {t("about.browseGuides")}</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full px-6 h-11">
            <Link to="/contact">{t("about.contactUs")}</Link>
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
}
