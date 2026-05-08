import { Link } from "@tanstack/react-router";
import { MapPin, ShieldCheck, Star, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageWrapper } from "@/components/layout/PageWrapper";

export default function Home() {
  return (
    <PageWrapper showFooter fullWidth>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-60"
          style={{
            background:
              "radial-gradient(60% 60% at 80% 0%, color-mix(in oklab, var(--accent) 28%, transparent) 0%, transparent 60%), radial-gradient(50% 50% at 0% 100%, color-mix(in oklab, var(--primary) 20%, transparent) 0%, transparent 60%)",
          }}
        />
        <div className="container mx-auto px-4 pt-16 pb-20 sm:pt-24 sm:pb-28 max-w-5xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border bg-card/70 px-3 py-1 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-accent" />
            Discover Algeria with verified locals
          </span>

          <h1 className="font-display text-5xl sm:text-7xl text-primary mt-6 leading-[1.05]">
            Algeria, through the eyes
            <br />
            of those who <span className="text-accent">live it</span>.
          </h1>

          <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto mt-6">
            DALIL connects students, tourists, and investors with trusted local guides
            across Algiers, Oran, Constantine, and beyond.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="rounded-full px-7 h-12 shadow-warm">
              <Link to="/guides">
                <Compass className="h-4 w-4" />
                Browse guides
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full px-7 h-12"
            >
              <Link to="/signup">Become a guide</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="container mx-auto px-4 pb-24 grid gap-6 sm:grid-cols-3">
        {[
          {
            icon: ShieldCheck,
            title: "Verified guides",
            body: "Every guide is reviewed and approved by our team before going live.",
          },
          {
            icon: Star,
            title: "Local expertise",
            body: "From medina walks to investor briefings — guides curated for you.",
          },
          {
            icon: MapPin,
            title: "Speak your language",
            body: "Filter by Arabic, French, English, Tamazight and more.",
          },
        ].map(({ icon: Icon, title, body }) => (
          <div
            key={title}
            className="rounded-2xl border bg-card p-6 shadow-card hover:shadow-warm transition-shadow"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="font-display text-xl text-foreground mt-4">{title}</h3>
            <p className="text-muted-foreground text-sm mt-2 leading-relaxed">{body}</p>
          </div>
        ))}
      </section>
    </PageWrapper>
  );
}
