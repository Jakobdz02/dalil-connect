import { createFileRoute } from "@tanstack/react-router";
import { PageWrapper } from "@/components/layout/PageWrapper";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — DALIL" },
      { name: "description", content: "How DALIL collects, uses and protects your personal data." },
      { property: "og:title", content: "DALIL Privacy Policy" },
      { property: "og:description", content: "How we collect, use and protect your data." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <PageWrapper showFooter>
      <article className="max-w-3xl mx-auto px-4 py-16 prose prose-neutral">
        <span className="text-xs uppercase tracking-widest text-accent font-semibold">Legal</span>
        <h1 className="font-display text-4xl text-primary mt-2 mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">Last updated: May 2026</p>

        <Section title="1. Who we are">
          DALIL ("we", "us") operates dalil-connect.com, a marketplace connecting users ("seekers") with local guides in Algeria.
        </Section>
        <Section title="2. Data we collect">
          Account information (name, email, role, language preference), profile data you provide (photo, bio, location for guides),
          booking and messaging activity, and limited technical data (IP, browser) for security and analytics.
        </Section>
        <Section title="3. How we use it">
          To operate the platform, verify guides, process bookings, prevent fraud, send essential service emails, and improve the product.
          We do not sell your personal data.
        </Section>
        <Section title="4. Sharing">
          Profile information you publish is visible to other users. We share data with payment processors and infrastructure providers
          only as needed to deliver the service, and with authorities when legally required.
        </Section>
        <Section title="5. Storage & security">
          Data is stored on secure cloud infrastructure with encryption in transit and at rest. We retain data only as long as necessary
          for the purposes above or as required by law.
        </Section>
        <Section title="6. Your rights">
          You can access, correct, export or delete your personal data from your profile settings, or by emailing privacy@dalil-connect.com.
        </Section>
        <Section title="7. Cookies">
          We use essential cookies for authentication and limited analytics cookies to understand product usage.
        </Section>
        <Section title="8. Changes">
          We may update this policy; material changes will be notified via the platform.
        </Section>
        <Section title="9. Contact">
          Questions? Email privacy@dalil-connect.com.
        </Section>
      </article>
    </PageWrapper>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="font-display text-xl text-primary">{title}</h2>
      <p className="text-muted-foreground leading-relaxed mt-2">{children}</p>
    </section>
  );
}
