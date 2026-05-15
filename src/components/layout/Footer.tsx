import { Link } from "@tanstack/react-router";
import { Compass } from "lucide-react";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="bg-primary text-primary-foreground mt-16">
      <div className="container mx-auto px-4 sm:px-6 py-12 max-w-6xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                <Compass className="h-5 w-5" />
              </span>
              <span className="font-display text-2xl">
                DALIL <span className="text-accent text-lg">دليل</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-white/60 max-w-xs">{t("footer.tagline")}</p>
          </div>

          <FooterCol
            title={t("footer.product")}
            links={[
              { label: t("footer.findGuide"), to: "/guides" },
              { label: t("footer.becomeGuide"), to: "/signup" },
              { label: t("footer.howItWorks"), to: "/faq" },
            ]}
          />
          <FooterCol
            title={t("footer.company")}
            links={[
              { label: t("footer.about"), to: "/about" },
              { label: t("footer.contact"), to: "/contact" },
              { label: t("footer.faq"), to: "/faq" },
            ]}
          />
          <FooterCol
            title={t("footer.legal")}
            links={[
              { label: t("footer.privacy"), to: "/privacy" },
              { label: t("footer.terms"), to: "/terms" },
            ]}
          />
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/60">{t("footer.rights")}</p>
          <div className="rounded-full border border-white/20 bg-white/5 text-white">
            <LanguageSwitcher variant="compact" />
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; to: string }[];
}) {
  return (
    <div>
      <h4 className="font-display text-lg mb-3">{title}</h4>
      <ul className="space-y-2 text-sm text-white/70">
        {links.map((l) => (
          <li key={l.label}>
            <Link to={l.to as "/guides"} className="hover:text-white transition-colors">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
