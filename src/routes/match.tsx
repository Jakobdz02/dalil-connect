import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { MatchingWizard } from "@/components/matching/MatchingWizard";
import { MatchingResultsPage } from "@/components/matching/MatchingResultsPage";
import type { SeekerProfile } from "@/lib/matchingEngine";

export const Route = createFileRoute("/match")({
  head: () => ({
    meta: [
      { title: "Smart Match — AI Guide Recommendations | DALIL" },
      { name: "description", content: "Let AI find your perfect verified guide in Algeria based on language, expertise, rating and availability." },
      { property: "og:title", content: "Smart Match — AI Guide Recommendations | DALIL" },
      { property: "og:description", content: "Let AI find your perfect verified guide in Algeria based on language, expertise, rating and availability." },
    ],
  }),
  component: MatchPage,
});

function MatchPage() {
  const [profile, setProfile] = useState<SeekerProfile | null>(null);

  return (
    <PageWrapper showFooter>
      <div className="py-10">
        {profile ? (
          <MatchingResultsPage seekerProfile={profile} onRefine={() => setProfile(null)} />
        ) : (
          <MatchingWizard onComplete={setProfile} />
        )}
      </div>
    </PageWrapper>
  );
}
