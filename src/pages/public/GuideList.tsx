import { useEffect, useMemo, useState } from "react";
import { Search, X, UserX, ChevronDown, Check } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { GuideCard, type GuideCardData } from "@/components/GuideCard";
import { AIMatchingBanner } from "@/components/matching/AIMatchingBanner";
import { supabase } from "@/integrations/supabase/client";
import { WILAYAS, LANGUAGES } from "@/lib/algeriaData";
import {
  GUIDE_CATEGORIES,
  GUIDE_CATEGORY_LABELS,
  normalizeCategory,
  type GuideCategory,
} from "@/lib/guideCategories";
import {
  SPECIALIZATIONS,
  SPECIALIZATION_HELPER,
  flattenSpecializations,
} from "@/lib/guideSpecializations";
import { cn } from "@/lib/utils";

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
  const [specOpen, setSpecOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("guide_profiles")
        .select("id, full_name, city, languages, category, subcategory, description, price_per_day, photo_url")
        .eq("is_approved", true)
        .eq("verification_status", "verified")
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

  const activeCategory = category !== ALL ? (category as GuideCategory) : null;

  const specGroups = useMemo(() => {
    if (!activeCategory) return [];
    return SPECIALIZATIONS[activeCategory] ?? [];
  }, [activeCategory]);

  const filtered = useMemo(() => {
    return guides.filter((g) => {
      if (search) {
        const hay = `${g.full_name} ${g.city}`.toLowerCase();
        if (!hay.includes(search)) return false;
      }
      if (city !== ALL && g.city !== city) return false;
      if (language !== ALL && !g.languages.includes(language)) return false;
      if (category !== ALL && normalizeCategory(g.category) !== category) return false;
      if (subcategory !== ALL) {
        const sub = (g.subcategory ?? "").toLowerCase().trim();
        if (sub !== subcategory.toLowerCase().trim()) return false;
      }
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

  const totalSpecCount = activeCategory ? flattenSpecializations(activeCategory).length : 0;

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

        <AIMatchingBanner />

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

        {/* Hierarchical filters */}
        <div className="max-w-4xl mx-auto space-y-3">
          {/* Row 1: language → location → category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground ml-1 mb-1 block">
                1 · Language
              </label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-full"><SelectValue placeholder="All Languages" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All Languages</SelectItem>
                  {LANGUAGES.map((l) => (
                    <SelectItem key={l.code} value={l.code}>
                      {l.flag} {l.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground ml-1 mb-1 block">
                2 · Location
              </label>
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger className="w-full"><SelectValue placeholder="All Wilayas" /></SelectTrigger>
                <SelectContent className="max-h-72">
                  <SelectItem value={ALL}>All Wilayas</SelectItem>
                  {WILAYAS.map((w) => (
                    <SelectItem key={w} value={w}>{w}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground ml-1 mb-1 block">
                3 · Category
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full"><SelectValue placeholder="All Categories" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All Categories</SelectItem>
                  {GUIDE_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{GUIDE_CATEGORY_LABELS[c as GuideCategory]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 2: specialization (only when a category with specs is selected) */}
          {activeCategory && specGroups.length > 0 && (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 sm:p-4 animate-in fade-in slide-in-from-top-1">
              <label className="text-xs font-medium text-primary ml-1 mb-1 block">
                4 · Specialization · {GUIDE_CATEGORY_LABELS[activeCategory]}
              </label>

              <Popover open={specOpen} onOpenChange={setSpecOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={specOpen}
                    className="w-full justify-between bg-background"
                  >
                    <span className={cn("truncate", subcategory === ALL && "text-muted-foreground")}>
                      {subcategory === ALL ? "All specializations" : subcategory}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                  <Command>
                    <CommandInput placeholder={`Search ${totalSpecCount} specializations...`} />
                    <CommandList className="max-h-72">
                      <CommandEmpty>No specialization found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value="all specializations"
                          onSelect={() => { setSubcategory(ALL); setSpecOpen(false); }}
                        >
                          <Check className={cn("mr-2 h-4 w-4", subcategory === ALL ? "opacity-100" : "opacity-0")} />
                          All specializations
                        </CommandItem>
                      </CommandGroup>
                      {specGroups.map((group, idx) => (
                        <CommandGroup key={idx} heading={group.label}>
                          {group.items.map((item) => (
                            <CommandItem
                              key={item}
                              value={item}
                              onSelect={() => { setSubcategory(item); setSpecOpen(false); }}
                            >
                              <Check className={cn("mr-2 h-4 w-4", subcategory === item ? "opacity-100" : "opacity-0")} />
                              {item}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      ))}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              <p className="text-xs text-muted-foreground mt-2 ml-1">
                {SPECIALIZATION_HELPER[activeCategory]}
              </p>
            </div>
          )}

          {hasFilters && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm text-primary hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <LoadingSpinner fullPage />
        ) : (
          <>
            <div className="text-sm text-muted-foreground text-center">
              {filtered.length} {filtered.length === 1 ? "guide" : "guides"} found
            </div>

            {filtered.length === 0 ? (
              <EmptyState
                icon={UserX}
                title="No guides found for these filters"
                description={
                  subcategory !== ALL
                    ? "No guides match this specialization in the selected location. Try a different specialization, location, or language."
                    : "Try adjusting your filters."
                }
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
