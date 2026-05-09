import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { Avatar } from "@/components/shared/Avatar";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { getLanguageFlag, getLanguageName } from "@/lib/algeriaData";
import { GUIDE_CATEGORY_LABELS, normalizeCategory } from "@/lib/guideCategories";
import type { GuideProfile } from "@/types";

export type GuideCardData = Pick<
  GuideProfile,
  "id" | "full_name" | "city" | "languages" | "category" | "subcategory" | "description" | "price_per_day" | "photo_url"
>;

export function GuideCard({ guide }: { guide: GuideCardData }) {
  const visibleLangs = guide.languages.slice(0, 3);
  const extra = guide.languages.length - visibleLangs.length;
  const categoryLabel = GUIDE_CATEGORY_LABELS[normalizeCategory(guide.category)];

  return (
    <Link
      to="/guides/$id"
      params={{ id: guide.id }}
      className="group rounded-2xl border bg-card p-5 shadow-card flex flex-col gap-4 transition-all hover:-translate-y-0.5 hover:border-primary/40"
    >
      <div className="flex items-start gap-4">
        <Avatar src={guide.photo_url ?? undefined} name={guide.full_name} size="xl" />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-base truncate">
            {guide.full_name}
          </h3>
          <div className="flex items-center gap-1 text-muted-foreground text-sm mt-0.5">
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate">{guide.city}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <Badge variant="approved">{categoryLabel}</Badge>
            {visibleLangs.map((l) => (
              <Badge key={l} variant="default">
                <span className="me-1">{getLanguageFlag(l)}</span>{getLanguageName(l).split(" — ")[0]}
              </Badge>
            ))}
            {extra > 0 && <Badge variant="default">+{extra} more</Badge>}
          </div>
          {guide.subcategory && (
            <p className="text-xs text-muted-foreground mt-1.5 truncate">
              {guide.subcategory}
            </p>
          )}
        </div>
      </div>

      {guide.description && (
        <p className="text-sm text-muted-foreground line-clamp-2">{guide.description}</p>
      )}

      <div className="flex items-center justify-between mt-auto">
        <div className="text-sm font-semibold text-accent">
          {guide.price_per_day != null
            ? `From ${guide.price_per_day.toLocaleString()} DZD / day`
            : "Price on request"}
        </div>
      </div>

      <Button variant="ghost" className="w-full" type="button" tabIndex={-1}>
        View Profile
      </Button>
    </Link>
  );
}
