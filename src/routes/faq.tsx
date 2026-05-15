import { createFileRoute, Link } from "@tanstack/react-router";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ChevronDown } from "lucide-react";

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

const ITEMS = [
  { q: "How are guides verified?", a: "Each guide submits government-issued ID, references and any relevant certifications. Our team manually reviews every application before approval. Approved guides display a verification badge." },
  { q: "How does booking work?", a: "Pick a guide, choose a date and submit your request. The guide accepts or proposes alternatives. Once confirmed, you receive booking details and chat access." },
  { q: "How does payment work?", a: "Payments are processed securely on the platform. Funds are held until your session is confirmed completed, protecting both you and your guide." },
  { q: "Can I cancel?", a: "Yes. Each guide sets a cancellation policy displayed on their profile. Most allow free cancellation up to 24 hours before the session." },
  { q: "What languages are supported?", a: "Our guides collectively speak Arabic, French, English, Tamazight, Spanish, Italian, German and more. You can filter by language on the guides page." },
  { q: "Is DALIL safe?", a: "Yes. We verify every guide, secure payments, host your conversations on-platform, and provide support if anything goes wrong." },
  { q: "How do I become a guide?", a: "Sign up, choose the guide role, and complete onboarding. Our team reviews your profile and gets back within 3–5 business days." },
  { q: "What does it cost a guide?", a: "Listing is free. We take a small service fee on confirmed bookings — no upfront costs, no monthly fees." },
];

function FAQPage() {
  return (
    <PageWrapper showFooter>
      <div className="max-w-3xl mx-auto px-4 py-16">
        <span className="text-xs uppercase tracking-widest text-accent font-semibold">Help center</span>
        <h1 className="font-display text-4xl sm:text-5xl text-primary mt-2">Frequently asked questions</h1>
        <p className="text-muted-foreground mt-4">Everything you need to know before your first booking.</p>

        <div className="mt-10 space-y-3">
          {ITEMS.map((item, i) => (
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
          Didn't find what you need?{" "}
          <Link to="/contact" className="text-primary font-medium hover:underline">Contact us</Link>.
        </p>
      </div>
    </PageWrapper>
  );
}
