import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  MapPin,
  ShieldCheck,
  Star,
  Compass,
  Search,
  CalendarCheck,
  MessageSquare,
  Languages,
  Users,
  Briefcase,
  GraduationCap,
  Plane,
  Building2,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { GuideCard, type GuideCardData } from "@/components/GuideCard";
import { supabase } from "@/integrations/supabase/client";

const CITIES = [
  { name: "Algiers", count: "Capital · Coastal" },
  { name: "Oran", count: "Mediterranean port" },
  { name: "Constantine", count: "City of bridges" },
  { name: "Annaba", count: "Roman heritage" },
  { name: "Tlemcen", count: "Andalusian gem" },
  { name: "Ghardaïa", count: "M'zab valley" },
  { name: "Tamanrasset", count: "Sahara gateway" },
  { name: "Béjaïa", count: "Kabyle coast" },
];

const CATEGORIES = [
  { icon: Plane, title: "Tourism", body: "Cultural tours, heritage walks, desert trips and coastal experiences." },
  { icon: GraduationCap, title: "Academic", body: "Student support, university orientation, research and translation." },
  { icon: Briefcase, title: "Investment", body: "Local market intel, supplier visits, regulatory and admin guidance." },
  { icon: Building2, title: "Relocation", body: "Housing, paperwork, daily-life onboarding for newcomers." },
];

const STEPS = [
  { icon: Search, title: "Search", body: "Filter verified guides by city, language, expertise and price." },
  { icon: MessageSquare, title: "Connect", body: "Message your guide directly and agree on the plan." },
  { icon: CalendarCheck, title: "Book", body: "Confirm your date and meet your guide with confidence." },
];

const TESTIMONIALS = [
  {
    name: "Sara M.",
    role: "Tourist · France",
    body: "My guide in Algiers made the casbah come alive. Felt safe, welcomed, and learned more in one day than a week of guidebooks.",
  },
  {
    name: "Daniel K.",
    role: "Investor · Germany",
    body: "DALIL connected me with a local who understood both the market and the paperwork. Saved me weeks of trial and error.",
  },
  {
    name: "Amira B.",
    role: "Student · Tunisia",
    body: "Moving to Constantine alone was scary. My guide helped with housing, the university, even my SIM card. Five stars.",
  },
];

const FAQ = [
  {
    q: "How are guides verified?",
    a: "Every guide submits ID, proof of experience and language certifications. Our team reviews each application before approval. Verified guides display a badge on their profile.",
  },
  {
    q: "How does payment work?",
    a: "You agree on the price with your guide on the platform. Payments are processed securely — only released once your session is confirmed.",
  },
  {
    q: "Can I cancel a booking?",
    a: "Yes. Cancellation policies are shown on every guide's profile, and most guides offer free cancellation up to 24 hours before the session.",
  },
  {
    q: "What languages are supported?",
    a: "Guides on DALIL collectively speak Arabic, French, English, Tamazight, Spanish, Italian, German and more. Filter by your preferred language.",
  },
  {
    q: "Is DALIL only for tourists?",
    a: "No — we serve tourists, students, investors and newcomers relocating to Algeria. Pick the category that fits your goal.",
  },
];

export default function Home() {
  const [featured, setFeatured] = useState<GuideCardData[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("guide_profiles")
        .select("id, full_name, city, languages, category, description, price_per_day, photo_url")
        .eq("is_approved", true)
        .order("created_at", { ascending: false })
        .limit(3);
      setFeatured((data ?? []) as GuideCardData[]);
    })();
  }, []);

  return (
    <PageWrapper showFooter fullWidth>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(60% 60% at 80% 0%, color-mix(in oklab, var(--accent) 22%, transparent) 0%, transparent 60%), radial-gradient(55% 55% at 0% 100%, color-mix(in oklab, var(--primary) 24%, transparent) 0%, transparent 60%)",
          }}
        />
        <div className="container mx-auto px-4 pt-16 pb-20 sm:pt-24 sm:pb-28 max-w-5xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border bg-card/80 backdrop-blur px-3 py-1 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-accent" />
            Verified guides · Secure bookings · Local expertise
          </span>

          <h1 className="font-display text-5xl sm:text-7xl text-primary mt-6 leading-[1.05]">
            Discover Algeria
            <br />
            with someone <span className="text-accent">who knows it</span>.
          </h1>

          <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto mt-6">
            DALIL is the trusted marketplace connecting tourists, students and
            investors with verified local guides across every wilaya of Algeria.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="rounded-full px-7 h-12 shadow-warm">
              <Link to="/guides">
                <Compass className="h-4 w-4" />
                Find your guide
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-7 h-12">
              <Link to="/signup">Become a guide</Link>
            </Button>
          </div>

          {/* trust strip */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-primary" /> ID-verified guides</span>
            <span className="inline-flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-accent" /> Reviewed by real travelers</span>
            <span className="inline-flex items-center gap-1.5"><Languages className="h-3.5 w-3.5 text-primary" /> Arabic · French · English · Tamazight</span>
            <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-primary" /> 48 wilayas covered</span>
          </div>
        </div>
      </section>

      {/* VALUE PROPS */}
      <section className="container mx-auto px-4 pb-20 grid gap-6 sm:grid-cols-3 max-w-6xl">
        {[
          { icon: ShieldCheck, title: "Verified, not random", body: "Every guide is ID-checked, reference-verified and approved by our team before going live." },
          { icon: Star, title: "Real reviews", body: "Honest ratings from travelers, students and investors who've actually been there." },
          { icon: Languages, title: "Speak your language", body: "Filter by Arabic, French, English, Tamazight and more. No language barriers." },
        ].map(({ icon: Icon, title, body }) => (
          <div key={title} className="rounded-2xl border bg-card p-6 shadow-card hover:shadow-warm transition-shadow">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="font-display text-xl text-foreground mt-4">{title}</h3>
            <p className="text-muted-foreground text-sm mt-2 leading-relaxed">{body}</p>
          </div>
        ))}
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-primary-soft/40 border-y border-border">
        <div className="container mx-auto px-4 py-20 max-w-6xl">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-widest text-accent font-semibold">How it works</span>
            <h2 className="font-display text-3xl sm:text-4xl text-primary mt-2">Three steps to your guide</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, body }, i) => (
              <div key={title} className="relative rounded-2xl bg-card border p-6">
                <span className="absolute -top-3 left-6 inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs font-bold">
                  {i + 1}
                </span>
                <Icon className="h-8 w-8 text-primary" />
                <h3 className="font-display text-xl mt-4">{title}</h3>
                <p className="text-muted-foreground text-sm mt-2 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container mx-auto px-4 py-20 max-w-6xl">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest text-accent font-semibold">For every journey</span>
          <h2 className="font-display text-3xl sm:text-4xl text-primary mt-2">Pick your purpose</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map(({ icon: Icon, title, body }) => (
            <Link
              key={title}
              to="/guides"
              className="group rounded-2xl border bg-card p-6 hover:border-primary hover:shadow-warm transition-all"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="font-display text-xl mt-4 group-hover:text-primary transition-colors">{title}</h3>
              <p className="text-muted-foreground text-sm mt-2 leading-relaxed">{body}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED GUIDES */}
      {featured.length > 0 && (
        <section className="container mx-auto px-4 pb-20 max-w-6xl">
          <div className="text-center mb-10">
            <span className="text-xs uppercase tracking-widest text-accent font-semibold">Meet the locals</span>
            <h2 className="font-display text-3xl sm:text-4xl text-primary mt-2">Featured verified guides</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((g) => <GuideCard key={g.id} guide={g} />)}
          </div>
          <div className="text-center mt-10">
            <Button asChild size="lg" className="rounded-full px-7 h-12">
              <Link to="/guides">Browse all guides</Link>
            </Button>
          </div>
        </section>
      )}

      {/* CITIES */}
      <section className="bg-primary-soft/40 border-y border-border">
        <div className="container mx-auto px-4 py-20 max-w-6xl">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-widest text-accent font-semibold">Where we operate</span>
            <h2 className="font-display text-3xl sm:text-4xl text-primary mt-2">Guides across Algeria</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">From the Mediterranean to the Sahara — local experts in every major destination.</p>
          </div>
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {CITIES.map((c) => (
              <Link
                key={c.name}
                to="/guides"
                className="rounded-xl border bg-card px-4 py-3 hover:border-primary hover:shadow-card transition-all"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-accent" />
                  <span className="font-medium text-foreground">{c.name}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 ms-6">{c.count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container mx-auto px-4 py-20 max-w-6xl">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest text-accent font-semibold">Trusted experiences</span>
          <h2 className="font-display text-3xl sm:text-4xl text-primary mt-2">What travelers say</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="rounded-2xl border bg-card p-6 shadow-card">
              <div className="flex gap-1 text-accent">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="text-foreground/90 text-sm leading-relaxed mt-4">"{t.body}"</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft text-primary font-semibold">
                  {t.name.charAt(0)}
                </span>
                <div>
                  <div className="text-sm font-medium">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-primary-soft/40 border-y border-border">
        <div className="container mx-auto px-4 py-20 max-w-3xl">
          <div className="text-center mb-10">
            <span className="text-xs uppercase tracking-widest text-accent font-semibold">FAQ</span>
            <h2 className="font-display text-3xl sm:text-4xl text-primary mt-2">Common questions</h2>
          </div>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <details
                key={i}
                className="group rounded-xl border bg-card p-5 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm sm:text-base font-medium text-foreground">
                  {item.q}
                  <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-8">
            Still curious?{" "}
            <Link to="/contact" className="text-primary font-medium hover:underline">
              Contact our team
            </Link>
            .
          </p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="container mx-auto px-4 py-20 max-w-5xl">
        <div
          className="relative overflow-hidden rounded-3xl border p-10 sm:p-14 text-center"
          style={{ background: "var(--gradient-prestige)" }}
        >
          <Users className="h-10 w-10 text-accent-foreground/80 mx-auto" />
          <h2 className="font-display text-3xl sm:text-5xl text-primary-foreground mt-4">
            Your Algeria starts with the right guide.
          </h2>
          <p className="text-primary-foreground/80 mt-4 max-w-xl mx-auto">
            Join thousands using DALIL to explore, study, invest and settle — with someone local on their side.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="rounded-full px-7 h-12 bg-card text-primary hover:bg-card/90">
              <Link to="/guides">Find a guide</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full px-7 h-12 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link to="/signup">Become a guide</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
