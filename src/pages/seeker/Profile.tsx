import { PageWrapper } from "@/components/layout/PageWrapper";
import { PaymentMethods } from "@/components/seeker/settings/PaymentMethods";
import { User, Bell, ShieldCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function SeekerProfile() {
  const { t, dir } = useI18n();
  return (
    <PageWrapper>
      <div dir={dir} className="mx-auto max-w-3xl space-y-10 py-10">
        <header>
          <h1 className="font-display text-4xl text-primary">{t("settings.title")}</h1>
          <p className="mt-1 text-muted-foreground">{t("settings.subtitle")}</p>
        </header>

        <section className="space-y-4">
          <header className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-2xl">{t("settings.personal.title")}</h2>
              <p className="text-sm text-muted-foreground">{t("settings.personal.subtitle")}</p>
            </div>
          </header>
          <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
            {t("settings.soon")}
          </div>
        </section>

        <PaymentMethods />

        <section className="space-y-4">
          <header className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-2xl">{t("settings.security.title")}</h2>
              <p className="text-sm text-muted-foreground">{t("settings.security.subtitle")}</p>
            </div>
          </header>
          <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
            {t("settings.soon")}
          </div>
        </section>

        <section className="space-y-4">
          <header className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-2xl">{t("settings.notifications.title")}</h2>
              <p className="text-sm text-muted-foreground">{t("settings.notifications.subtitle")}</p>
            </div>
          </header>
          <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
            {t("settings.soon")}
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}
