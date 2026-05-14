import { Link } from "@tanstack/react-router";
import { Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AIMatchingBanner() {
  return (
    <div className="relative max-w-4xl mx-auto rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 p-5 sm:p-6 overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 animate-pulse pointer-events-none" />
      <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="relative">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-warm">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="absolute -inset-1 rounded-xl bg-primary/30 blur-md animate-pulse" />
          </div>
          <div>
            <h3 className="font-display text-lg text-primary leading-tight">
              Let AI find your perfect guide
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Smart Match analyzes language, expertise, and availability for you.
            </p>
          </div>
        </div>
        <Button asChild size="lg" className="shrink-0">
          <Link to="/match">
            <Wand2 className="h-4 w-4 me-1" /> Try Smart Match
          </Link>
        </Button>
      </div>
    </div>
  );
}
