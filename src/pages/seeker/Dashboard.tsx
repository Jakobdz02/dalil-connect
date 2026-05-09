import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { GuideCard, type GuideCardData } from "@/components/GuideCard";
import { Button } from "@/components/shared/Button";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";

export default function SeekerDashboard() {
  const { profile } = useProfile();
  const [guides, setGuides] = useState<GuideCardData[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("guide_profiles")
        .select("id, full_name, city, languages, category, description, price_per_day, photo_url")
        .eq("is_approved", true)
        .order("created_at", { ascending: false })
        .limit(3);
      setGuides((data ?? []) as GuideCardData[]);
    })();
  }, []);

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto py-10 space-y-10">
        <div>
          <h1 className="font-display text-3xl text-primary">
            Welcome{profile?.name ? `, ${profile.name}` : ""}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Discover guides and plan your next experience.
          </p>
        </div>

        <section>
          <div className="flex items-end justify-between mb-4">
            <h2 className="font-display text-2xl text-foreground">Browse Guides</h2>
            <Link to="/guides" className="text-sm text-primary hover:underline">
              See all guides →
            </Link>
          </div>
          {guides.length === 0 ? (
            <p className="text-sm text-muted-foreground">No guides available yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {guides.map((g) => <GuideCard key={g.id} guide={g} />)}
            </div>
          )}
          <div className="mt-6">
            <Link to="/guides">
              <Button variant="ghost">Browse all guides</Button>
            </Link>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}
