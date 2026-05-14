import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Brain, Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MatchScoreCard } from "./MatchScoreCard";
import { useAIMatching } from "@/hooks/useAIMatching";
import type { SeekerProfile } from "@/lib/matchingEngine";

interface Props {
  seekerProfile: SeekerProfile;
  onRefine: () => void;
}

export function MatchingResultsPage({ seekerProfile, onRefine }: Props) {
  const { matches, isLoading, totalGuides } = useAIMatching(seekerProfile);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    if (!isLoading) return;
    const target = totalGuides || 47;
    const step = Math.max(1, Math.floor(target / 30));
    setCounter(0);
    const id = setInterval(() => {
      setCounter((c) => {
        const next = c + step;
        return next >= target ? target : next;
      });
    }, 50);
    return () => clearInterval(id);
  }, [isLoading, totalGuides]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6">
        <div className="relative">
          <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <div className="h-24 w-24 flex items-center justify-center">
            <Brain className="h-10 w-10 text-primary animate-pulse" />
          </div>
          <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-accent animate-pulse" />
        </div>
        <div className="text-center space-y-1">
          <p className="font-display text-xl text-primary">Analyzing {counter} guides...</p>
          <p className="text-sm text-muted-foreground">Scoring language, expertise, rating & availability</p>
        </div>
      </div>
    );
  }

  const [top, ...rest] = matches;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl text-primary">Your Smart Matches</h1>
          <p className="text-sm text-muted-foreground">
            {matches.length} guide{matches.length !== 1 && "s"} ranked by AI compatibility
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onRefine}>
            <ArrowLeft className="h-4 w-4 me-1" /> Refine Search
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/guides">Browse All Guides</Link>
          </Button>
        </div>
      </div>

      {matches.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          No verified guides found yet. Try refining your search.
        </div>
      ) : (
        <>
          {top && (
            <div className="max-w-2xl mx-auto">
              <MatchScoreCard match={top} highlight />
            </div>
          )}

          {rest.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {rest.map((m) => (
                <MatchScoreCard key={m.guide.id} match={m} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
