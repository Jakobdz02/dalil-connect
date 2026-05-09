import { useEffect, useMemo, useState } from "react";
import { Search, X, UserX } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { GuideCard, type GuideCardData } from "@/components/GuideCard";
import { supabase } from "@/integrations/supabase/client";
import { WILAYAS, LANGUAGES } from "@/lib/algeriaData";
import {
  GUIDE_CATEGORIES,
  GUIDE_CATEGORY_LABELS,
  normalizeCategory,
  type GuideCategory,
} from "@/lib/guideCategories";

const ALL = "__all__";

export default function GuideList() {
  const [guides, setGuides] = useState<GuideCardData[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [city, setCity] = useState<string>(ALL);
  const [language, setLanguage] = useState<string>(ALL);
  const [category, setCategory] = useState<string>(ALL);
  const [subcategory, setSubcategory] = useState<string>(ALL);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("guide_profiles")
        .select("id, full_name, city, languages, category, subcategory, description, price_per_day, photo_url")
        .eq("is_approved", true)
        .order("created_at", { ascending: false });
      setGuides((data ?? []) as GuideCardData[]);
      setLoading(false);
    })();
  }, []);

  // Reset subcategory when category changes
  useEffect(() => {
    setSubcategory(ALL);
  }, [category]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput.trim().toLowerCase()), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const availableSubcategories = useMemo(() => {
    if (category === ALL) return [];
    return Array.from(
      new Set(
        guides
          .filter((g) => normalizeCategory(g.category) === category && g.subcategory)
          .map((g) => g.subcategory as string),
      ),
    ).sort();
  }, [guides, category]);

  const filtered = useMemo(() => {
    return guides.filter((g) => {
      if (search) {
        const hay = `${g.full_name} ${g.city}`.toLowerCase();
        if (!hay.includes(search)) return false;
      }
      if (city !== ALL && g.city !== city) return false;
      if (language !== ALL && !g.languages.includes(language)) return false;
      if (category !== ALL && normalizeCategory(g.category) !== category) return false;
      if (subcategory !== ALL && g.subcategory !== subcategory) return false;
      return true;
    });
  }, [guides, search, city, language, category, subcategory]);

  const hasFilters =
    searchInput || city !== ALL || language !== ALL || category !== ALL || subcategory !== ALL;

  const clearFilters = () => {
    setSearchInput("");
    setCity(ALL);
    setLanguage(ALL);
    setCategory(ALL);
    setSubcategory(ALL);
  };

  return (
    <PageWrapper showFooter>
      <div className="py-10 space-y-6">
        <div className="text-center">
          <h1 className="font-display text-4xl text-primary">
            Find Your Guide in Algeria
          </h1>
          <p className="text-muted-foreground mt-2">
            Browse verified local guides across the country.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-xl mx-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name or wilaya"
            className="ps-9 pe-9 h-11 rounded-full"
          />
          {searchInput && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setSearchInput("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 justify-center items-center">
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="All Wilayas" /></SelectTrigger>
            <SelectContent className="max-h-72">
              <SelectItem value={ALL}>All Wilayas</SelectItem>
              {WILAYAS.map((w) => (
                <SelectItem key={w} value={w}>{w}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="All Languages" /></SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All Languages</SelectItem>
              {LANGUAGES.map((l) => (
                <SelectItem key={l.code} value={l.code}>
                  {l.flag} {l.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="All Categories" /></SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All Categories</SelectItem>
              {GUIDE_CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>{GUIDE_CATEGORY_LABELS[c as GuideCategory]}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {category !== ALL && availableSubcategories.length > 0 && (
            <Select value={subcategory} onValueChange={setSubcategory}>
              <SelectTrigger className="w-[220px]"><SelectValue placeholder="All Specializations" /></SelectTrigger>
              <SelectContent className="max-h-72">
                <SelectItem value={ALL}>All Specializations</SelectItem>
                {availableSubcategories.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm text-primary hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <LoadingSpinner fullPage />
        ) : (
          <>
            <div className="text-sm text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "guide" : "guides"} found
            </div>

            {filtered.length === 0 ? (
              <EmptyState
                icon={UserX}
                title="No guides found"
                description="Try adjusting your filters."
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((g) => (
                  <GuideCard key={g.id} guide={g} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </PageWrapper>
  );
}
