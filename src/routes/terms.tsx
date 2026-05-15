import { createFileRoute } from "@tanstack/react-router";
import { PageWrapper } from "@/components/layout/PageWrapper";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — DALIL" },
      { name: "description", content: "The terms governing your use of the DALIL marketplace." },
      { property: "og:title", content: "DALIL Terms of Service" },
      { property: "og:description", content: "Rules of use, bookings, payments and cancellations." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <PageWrapper showFooter>
      <article className="max-w-3xl mx-auto px-4 py-16">
        <span className="text-xs uppercase tracking-widest text-accent font-semibold">Legal</span>
        <h1 className="font-display text-4xl text-primary mt-2 mb-2">Terms of Service</h1>
        <p className="text-sm text-muted-foreground">Last updated: May 2026</p>

        <Section title="1. The service">
          DALIL is a marketplace that connects seekers with independent local guides. We are not a tour operator and do not provide
          guiding services directly.
        </Section>
        <Section title="2. Eligibility">
          You must be 18 or older to use DALIL. Guides must complete verification and accept these terms before listing.
        </Section>
        <Section title="3. Bookings">
          Bookings are agreements between the seeker and the guide. DALIL facilitates communication and payment but is not party to the
          underlying service.
        </Section>
        <Section title="4. Payments & fees">
          Payments are processed via secure third-party providers. DALIL retains a service fee on confirmed bookings, disclosed at checkout.
        </Section>
        <Section title="5. Cancellations">
          Each guide sets a cancellation policy shown on their profile. Refunds follow that policy; abuse or fraud may forfeit refunds.
        </Section>
        <Section title="6. Conduct">
          Users must be respectful and lawful. Discrimination, harassment, illegal activity and off-platform circumvention of fees are prohibited
          and may result in account termination.
        </Section>
        <Section title="7. Liability">
          To the extent permitted by law, DALIL is not liable for the conduct of users, the quality of guide services, or indirect or
          consequential damages.
        </Section>
        <Section title="8. Changes">
          We may update these terms; continued use after changes constitutes acceptance.
        </Section>
        <Section title="9. Governing law">
          These terms are governed by the laws of Algeria.
        </Section>
        <Section title="10. Contact">
          Email legal@dalil-connect.com for any questions.
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
