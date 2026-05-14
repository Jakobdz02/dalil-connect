import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { BadgeCheck } from "lucide-react";
import { Avatar } from "@/components/shared/Avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { MatchResult } from "@/lib/matchingEngine";

function ringColor(score: number): string {
  if (score > 80) return "var(--color-success)";
  if (score > 60) return "var(--color-primary)";
  if (score > 40) return "var(--color-accent)";
  return "var(--color-muted-foreground)";
}

function ScoreRing({ score, size = 72 }: { score: number; size?: number }) {
  const stroke = 6;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setProgress(score), 50);
    return () => clearTimeout(t);
  }, [score]);

  const offset = c - (progress / 100) * c;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--color-border)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={ringColor(score)}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold" style={{ color: ringColor(score) }}>
          {score}%
        </span>
      </div>
    </div>
  );
}

function ScoreBar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium tabular-nums">{Math.round(value)}/{max}</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

interface Props {
  match: MatchResult;
  highlight?: boolean;
}

export function MatchScoreCard({ match, highlight }: Props) {
  const { guide, matchScore, matchReasons, scoreBreakdown } = match;

  return (
    <div
      className={cn(
        "rounded-2xl border bg-card p-5 shadow-card flex flex-col gap-4 transition-all hover:-translate-y-0.5",
        highlight ? "border-accent border-2 ring-1 ring-accent/30" : "border-border",
      )}
    >
      {highlight && (
        <div className="self-start inline-flex items-center gap-1 text-xs font-semibold bg-accent text-accent-foreground px-2.5 py-1 rounded-full">
          ✨ Best Match
        </div>
      )}

      <div className="flex items-start gap-4">
        <Avatar src={guide.avatar || undefined} name={guide.name} size="xl" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-semibold truncate">{guide.name}</h3>
            {guide.isVerified && <BadgeCheck className="h-4 w-4 text-primary shrink-0" />}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {guide.rating.toFixed(1)}★ · {guide.totalSessions} sessions
          </p>
          {guide.specialties[0] && (
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{guide.specialties[0]}</p>
          )}
        </div>
        <ScoreRing score={matchScore} size={highlight ? 84 : 64} />
      </div>

      {matchReasons.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1.5">Why this match?</p>
          <div className="flex flex-wrap gap-1.5">
            {matchReasons.map((r, i) => (
              <span
                key={i}
                className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
              >
                {r}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <ScoreBar label="Language" value={scoreBreakdown.languageScore} max={30} />
        <ScoreBar label="Sector" value={scoreBreakdown.sectorScore} max={25} />
        <ScoreBar label="Rating" value={scoreBreakdown.ratingScore} max={20} />
        <ScoreBar label="Sessions" value={scoreBreakdown.experienceScore} max={15} />
        <ScoreBar label="Timing" value={scoreBreakdown.availabilityScore} max={10} />
      </div>

      <Button asChild className="w-full mt-auto">
        <Link to="/guides/$id" params={{ id: guide.id }}>Book Now</Link>
      </Button>
    </div>
  );
}
