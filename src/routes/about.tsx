import { createFileRoute, Link } from "@tanstack/react-router";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Compass, Heart, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  return (
    <PageWrapper showFooter>
      <div className="max-w-3xl mx-auto px-4 py-16">
        <span className="text-xs uppercase tracking-widest text-accent font-semibold">About</span>
        <h1 className="font-display text-4xl sm:text-5xl text-primary mt-2">Algeria, made accessible.</h1>
        <p className="text-muted-foreground text-lg mt-6 leading-relaxed">
          DALIL was born from a simple idea: the best way to discover a country is through someone who lives it.
          We connect travelers, students, investors and newcomers with verified local guides across all 48 wilayas of Algeria —
          from the casbah of Algiers to the dunes of Tamanrasset.
        </p>

        <div className="grid sm:grid-cols-3 gap-5 mt-12">
          {[
            { icon: ShieldCheck, title: "Trust first", body: "Every guide is ID-verified and reviewed before going live." },
            { icon: Heart, title: "Local at heart", body: "We pay guides fairly and put community before commission." },
            { icon: Users, title: "Built for everyone", body: "Tourism, study, business, relocation — one trusted platform." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl border bg-card p-5">
              <Icon className="h-6 w-6 text-primary" />
              <h3 className="font-display text-lg mt-3">{title}</h3>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        <h2 className="font-display text-2xl text-primary mt-14">Our mission</h2>
        <p className="text-muted-foreground mt-3 leading-relaxed">
          Algeria is one of the most diverse and underrated destinations in the world. Yet visitors often struggle
          to find trustworthy local help. DALIL fixes that — by giving locals a platform to share what they know,
          and giving visitors a safer, richer way to experience the country.
        </p>

        <div className="mt-12 flex flex-wrap gap-3">
          <Button asChild size="lg" className="rounded-full px-6 h-11">
            <Link to="/guides"><Compass className="h-4 w-4" /> Browse guides</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full px-6 h-11">
            <Link to="/contact">Contact us</Link>
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
}
