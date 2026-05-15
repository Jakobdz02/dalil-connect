import { createFileRoute, Link } from "@tanstack/react-router";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ChevronDown } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — DALIL local guides" },
      { name: "description", content: "Answers about how DALIL verifies guides, handles bookings, payments, cancellations and supported languages." },
      { property: "og:title", content: "DALIL — Frequently asked questions" },
      { property: "og:description", content: "Verification, payments, cancellations, languages and more." },
    ],
  }),
  component: FAQPage,
});

function FAQPage() {
  const { t } = useI18n();
  const items = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({
    q: t(`faqp.q${n}`),
    a: t(`faqp.a${n}`),
  }));

  return (
    <PageWrapper showFooter>
      <div className="max-w-3xl mx-auto px-4 py-16">
        <span className="text-xs uppercase tracking-widest text-accent font-semibold">{t("faqp.kicker")}</span>
        <h1 className="font-display text-4xl sm:text-5xl text-primary mt-2">{t("faqp.title")}</h1>
        <p className="text-muted-foreground mt-4">{t("faqp.intro")}</p>

        <div className="mt-10 space-y-3">
          {items.map((item, i) => (
            <details key={i} className="group rounded-xl border bg-card p-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between gap-4 font-medium text-foreground">
                {item.q}
                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-10">
          {t("faqp.didnt")}{" "}
          <Link to="/contact" className="text-primary font-medium hover:underline">{t("faqp.contactUs")}</Link>.
        </p>
      </div>
    </PageWrapper>
  );
}
