import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { normalizeCategory } from "@/lib/guideCategories";
import {
  rankGuides,
  type GuideProfile,
  type LanguageLevel,
  type MatchResult,
  type SeekerProfile,
  type SessionType,
} from "@/lib/matchingEngine";

// Map db category → matching sector
const CATEGORY_TO_SECTOR: Record<string, string> = {
  student: "academic",
  tourist: "tourism",
  investor: "investment",
  general: "general",
};

// Stable pseudo-random in [0,1) from string id
function hash01(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}

function adaptToGuideProfile(g: any): GuideProfile {
  const seed = hash01(g.id);
  const sector = CATEGORY_TO_SECTOR[normalizeCategory(g.category)] ?? "general";
  const languages: { language: string; level: LanguageLevel }[] = (g.languages ?? []).map(
    (l: string) => ({ language: l, level: "B2" as LanguageLevel }),
  );
  const sessionTypes: SessionType[] = ["video", "chat", "inperson"];

  // Generate a few "available" dates over next 14 days based on seed for demo
  const availableDates: Date[] = [];
  for (let i = 1; i <= 14; i++) {
    if (((Math.floor(seed * 1000) + i) % 3) === 0) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() + i);
      availableDates.push(d);
    }
  }

  return {
    id: g.id,
    name: g.full_name,
    avatar: g.photo_url ?? "",
    sector: [sector],
    languages,
    rating: 4 + seed,                                  // 4.0–5.0
    totalSessions: Math.floor(20 + seed * 200),        // 20–220
    totalReviews: Math.floor(5 + seed * 80),
    availableDates,
    sessionTypes,
    pricePerHour: g.price_per_hour ?? Math.round((g.price_per_day ?? 6000) / 6),
    isVerified: true,
    bio: g.description ?? g.bio ?? "",
    specialties: g.subcategory ? [g.subcategory] : [],
  };
}

export function useAIMatching(seekerProfile: SeekerProfile | null) {
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [totalGuides, setTotalGuides] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!seekerProfile) return;
    let active = true;
    setIsLoading(true);
    setMatches([]);

    (async () => {
      const { data } = await supabase
        .from("guide_profiles")
        .select(
          "id, full_name, city, languages, category, subcategory, description, bio, price_per_day, price_per_hour, photo_url",
        )
        .eq("is_approved", true)
        .eq("verification_status", "verified");

      const guides = (data ?? []).map(adaptToGuideProfile);
      const ranked = rankGuides(seekerProfile, guides);

      // Simulate AI processing delay
      await new Promise((r) => setTimeout(r, 1500));
      if (!active) return;
      setTotalGuides(guides.length);
      setMatches(ranked);
      setIsLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [seekerProfile]);

  return { matches, isLoading, topMatch: matches[0] ?? null, totalGuides };
}
