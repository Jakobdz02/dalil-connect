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
import { useI18n } from "@/lib/i18n";

const ALL = "__all__";

const SAMPLE_GUIDES: GuideCardData[] = [
  {
    id: "sample-1", full_name: "Yacine Belkacem", city: "Algiers",
    languages: ["ar", "fr", "en"], category: "tourism", subcategory: "Casbah & heritage walks",
    description: "Algiers native and licensed cultural guide. Casbah, Bardo and coastal day-trips.",
    price_per_day: 6500, photo_url: null,
  },
  {
    id: "sample-2", full_name: "Lina Hadj-Said", city: "Oran",
    languages: ["ar", "fr", "es"], category: "tourism", subcategory: "Coastal & gastronomy",
    description: "Born and raised in Oran. Mediterranean coast, Santa Cruz, and the best local food.",
    price_per_day: 5500, photo_url: null,
  },
  {
    id: "sample-3", full_name: "Karim Bensaid", city: "Constantine",
    languages: ["ar", "fr", "en"], category: "academic", subcategory: "University orientation",
    description: "Helps international students with university enrollment, housing and admin.",
    price_per_day: 4500, photo_url: null,
  },
  {
    id: "sample-4", full_name: "Sofiane Amrani", city: "Tamanrasset",
    languages: ["ar", "fr", "en"], category: "tourism", subcategory: "Sahara expeditions",
    description: "Tuareg guide for Hoggar mountains and Sahara overnight expeditions.",
    price_per_day: 12000, photo_url: null,
  },
  {
    id: "sample-5", full_name: "Amina Khelifi", city: "Tlemcen",
    languages: ["ar", "fr", "en"], category: "investment", subcategory: "Local market intel",
    description: "Connects investors with verified suppliers and walks you through paperwork.",
    price_per_day: 9000, photo_url: null,
  },
  {
    id: "sample-6", full_name: "Omar Drici", city: "Béjaïa",
    languages: ["ar", "fr", "kab"], category: "tourism", subcategory: "Kabyle coast & hikes",
    description: "Hiking, Kabyle villages, Yemma Gouraya — local stories included.",
    price_per_day: 5000, photo_url: null,
  },
];

export default function GuideList() {
  const { t } = useI18n();
  const [guides, setGuides] = useState<GuideCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingSamples, setUsingSamples] = useState(false);

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
      const real = (data ?? []) as GuideCardData[];
      if (real.length === 0) {
        setGuides(SAMPLE_GUIDES);
        setUsingSamples(true);
      } else {
        setGuides(real);
      }
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
          <h1 className="font-display text-4xl text-primary">{t("guides.title")}</h1>
          <p className="text-muted-foreground mt-2">{t("guides.subtitle")}</p>
        </div>

        <AIMatchingBanner />

        {usingSamples && (
          <div className="max-w-3xl mx-auto rounded-lg border border-accent/30 bg-accent/10 px-4 py-2 text-xs text-foreground/80 text-center">
            {t("guides.sampleNotice")}
          </div>
        )}

        {/* Search */}
        <div className="max-w-xl mx-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t("guides.searchPh")}
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground ml-1 mb-1 block">
                {t("guides.filter.language")}
              </label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-full"><SelectValue placeholder={t("guides.allLanguages")} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>{t("guides.allLanguages")}</SelectItem>
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
                {t("guides.filter.location")}
              </label>
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger className="w-full"><SelectValue placeholder={t("guides.allWilayas")} /></SelectTrigger>
                <SelectContent className="max-h-72">
                  <SelectItem value={ALL}>{t("guides.allWilayas")}</SelectItem>
                  {WILAYAS.map((w) => (
                    <SelectItem key={w} value={w}>{w}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground ml-1 mb-1 block">
                {t("guides.filter.category")}
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full"><SelectValue placeholder={t("guides.allCategories")} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>{t("guides.allCategories")}</SelectItem>
                  {GUIDE_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{GUIDE_CATEGORY_LABELS[c as GuideCategory]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {activeCategory && specGroups.length > 0 && (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 sm:p-4 animate-in fade-in slide-in-from-top-1">
              <label className="text-xs font-medium text-primary ml-1 mb-1 block">
                4 · {t("guides.filter.specialization")} · {GUIDE_CATEGORY_LABELS[activeCategory]}
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
                      {subcategory === ALL ? t("guides.allSpecs") : subcategory}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                  <Command>
                    <CommandInput placeholder={t("guides.searchSpecs")} />
                    <CommandList className="max-h-72">
                      <CommandEmpty>{t("guides.noSpec")}</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value="all specializations"
                          onSelect={() => { setSubcategory(ALL); setSpecOpen(false); }}
                        >
                          <Check className={cn("mr-2 h-4 w-4", subcategory === ALL ? "opacity-100" : "opacity-0")} />
                          {t("guides.allSpecs")}
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
                {t("guides.clearFilters")}
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <LoadingSpinner fullPage />
        ) : (
          <>
            <div className="text-sm text-muted-foreground text-center">
              {filtered.length} {filtered.length === 1 ? t("guides.guide") : t("guides.guides")} {t("guides.found")}
            </div>

            {filtered.length === 0 ? (
              <EmptyState
                icon={UserX}
                title={t("guides.empty.title")}
                description={
                  subcategory !== ALL
                    ? t("guides.empty.descSpec")
                    : t("guides.empty.desc")
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
