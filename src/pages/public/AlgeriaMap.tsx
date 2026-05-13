import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Search,
  MapPin,
  Star,
  ShieldCheck,
  Clock,
  MessageCircle,
  Sparkles,
  TrendingUp,
  Users,
  HelpCircle,
  Bell,
  Languages,
  Wallet,
  Bus,
  ShieldAlert,
  GraduationCap,
  Briefcase,
  Utensils,
  Moon,
  CalendarDays,
  Compass,
  Globe2,
} from "lucide-react";

import { PageWrapper } from "@/components/layout/PageWrapper";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { Avatar } from "@/components/shared/Avatar";
import { getLanguageFlag } from "@/lib/algeriaData";
import {
  ALGERIA_CITIES,
  FILTER_LABELS,
  LIVE_INSIGHTS,
  SAMPLE_GUIDES,
  getGuideById,
  type AudienceType,
  type CityNode,
  type FilterCategory,
} from "@/lib/algeriaMapData";

const FILTER_ICONS: Record<FilterCategory, React.ComponentType<{ className?: string }>> = {
  tourism: Compass,
  study: GraduationCap,
  business: Briefcase,
  safety: ShieldAlert,
  food: Utensils,
  transport: Bus,
  nightlife: Moon,
  events: CalendarDays,
};

const AUDIENCE_LABELS: Record<AudienceType, string> = {
  tourist: "Tourist",
  student: "Student",
  investor: "Investor",
};

const UI_STRINGS = {
  en: {
    eyebrow: "Algeria Live Guide Map",
    title: "Discover Algeria, one verified local at a time",
    subtitle: "Explore cities, hidden gems, study & business hubs — and book a verified local guide in one tap.",
    searchPlaceholder: "Search city, attraction, university, district, or guide…",
    filtersTitle: "What are you looking for?",
    featuredFor: "Featured for",
    talkToGuide: "Talk to a Local Guide",
    viewCity: "Explore",
    liveInsights: "Live insights from Algeria",
    liveSub: "Updated daily so you always have a reason to come back.",
    verifiedGuides: "Verified Guides",
    chooseAudience: "I'm a…",
  },
  fr: {
    eyebrow: "Carte Live des Guides — Algérie",
    title: "Découvrez l'Algérie avec un local vérifié",
    subtitle: "Explorez les villes, joyaux cachés, pôles d'études & d'affaires — et réservez un guide local en un clic.",
    searchPlaceholder: "Rechercher ville, site, université, quartier ou guide…",
    filtersTitle: "Que cherchez-vous ?",
    featuredFor: "Sélection pour",
    talkToGuide: "Parler à un guide local",
    viewCity: "Explorer",
    liveInsights: "Infos live d'Algérie",
    liveSub: "Mises à jour chaque jour — une raison de revenir.",
    verifiedGuides: "Guides vérifiés",
    chooseAudience: "Je suis…",
  },
  ar: {
    eyebrow: "خريطة الأدلة المحليين — الجزائر",
    title: "اكتشف الجزائر مع دليل محلي موثوق",
    subtitle: "تصفّح المدن والمعالم وفرص الدراسة والأعمال — واحجز دليلاً محلياً بنقرة واحدة.",
    searchPlaceholder: "ابحث عن مدينة، معلم، جامعة، حي أو دليل…",
    filtersTitle: "ماذا تبحث عنه؟",
    featuredFor: "مختار لـ",
    talkToGuide: "تواصل مع دليل محلي",
    viewCity: "استكشاف",
    liveInsights: "آخر المستجدات من الجزائر",
    liveSub: "تحديثات يومية لتعود دائماً.",
    verifiedGuides: "أدلة موثوقون",
    chooseAudience: "أنا…",
  },
} as const;

type Lang = keyof typeof UI_STRINGS;

import AlgeriaLeafletMap from "@/components/map/AlgeriaLeafletMap";


export default function AlgeriaMap() {
  const [lang, setLang] = useState<Lang>("en");
  const [audience, setAudience] = useState<AudienceType>("tourist");
  const [filters, setFilters] = useState<Set<FilterCategory>>(new Set());
  const [query, setQuery] = useState("");
  const [selectedCityId, setSelectedCityId] = useState<string>("alger");

  const t = UI_STRINGS[lang];

  const visibleCities = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALGERIA_CITIES.filter((c) => {
      const matchesFilters =
        filters.size === 0 || [...filters].every((f) => c.categories.includes(f));
      if (!matchesFilters) return false;
      if (!q) return true;
      const guideMatch = c.guideIds.some((id) =>
        getGuideById(id)?.name.toLowerCase().includes(q),
      );
      return (
        c.name.toLowerCase().includes(q) ||
        c.nameAr.includes(q) ||
        c.places.some((p) => p.name.toLowerCase().includes(q)) ||
        guideMatch
      );
    });
  }, [filters, query]);

  const selectedCity =
    visibleCities.find((c) => c.id === selectedCityId) ?? visibleCities[0] ?? ALGERIA_CITIES[0];

  const featuredCities = useMemo(
    () => ALGERIA_CITIES.filter((c) => c.audience.includes(audience)).slice(0, 4),
    [audience],
  );

  const toggleFilter = (f: FilterCategory) => {
    setFilters((prev) => {
      const next = new Set(prev);
      if (next.has(f)) next.delete(f);
      else next.add(f);
      return next;
    });
  };

  const isRtl = lang === "ar";

  return (
    <PageWrapper showFooter fullWidth>
      <div dir={isRtl ? "rtl" : "ltr"} className="bg-gradient-to-b from-primary/5 via-background to-background">
        {/* Hero */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium">
                  <Sparkles className="h-3.5 w-3.5" /> {t.eyebrow}
                </div>
                <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-display tracking-tight text-foreground">
                  {t.title}
                </h1>
                <p className="mt-3 text-muted-foreground text-base sm:text-lg">{t.subtitle}</p>
              </div>

              {/* Language switcher */}
              <div className="flex items-center gap-2">
                <Globe2 className="h-4 w-4 text-muted-foreground" />
                {(["en", "fr", "ar"] as Lang[]).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLang(l)}
                    className={
                      "px-3 py-1.5 rounded-full text-xs font-medium transition-colors " +
                      (lang === l
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/70")
                    }
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Search */}
            <div className="mt-6 relative">
              <Search className="absolute top-1/2 -translate-y-1/2 start-4 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full h-14 ps-12 pe-4 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Audience selector */}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground me-1">{t.chooseAudience}</span>
              {(Object.keys(AUDIENCE_LABELS) as AudienceType[]).map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAudience(a)}
                  className={
                    "px-4 py-2 rounded-full text-sm font-medium border transition-colors " +
                    (audience === a
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-foreground border-border hover:border-primary/40")
                  }
                >
                  {AUDIENCE_LABELS[a]}
                </button>
              ))}
            </div>

            {/* Filters */}
            <div className="mt-5">
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                {t.filtersTitle}
              </p>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(FILTER_LABELS) as FilterCategory[]).map((f) => {
                  const Icon = FILTER_ICONS[f];
                  const active = filters.has(f);
                  return (
                    <button
                      key={f}
                      type="button"
                      onClick={() => toggleFilter(f)}
                      className={
                        "inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm border transition-colors " +
                        (active
                          ? "bg-accent text-accent-foreground border-accent"
                          : "bg-card text-foreground border-border hover:border-accent/40")
                      }
                    >
                      <Icon className="h-4 w-4" />
                      {FILTER_LABELS[f]}
                    </button>
                  );
                })}
                {filters.size > 0 && (
                  <button
                    type="button"
                    onClick={() => setFilters(new Set())}
                    className="text-xs text-muted-foreground underline self-center px-2"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Map + city detail */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
          <div className="grid lg:grid-cols-5 gap-6">
            {/* Map */}
            <div className="lg:col-span-3 rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" /> Interactive map of Algeria
                </h2>
                <span className="text-xs text-muted-foreground">
                  {visibleCities.length} / {ALGERIA_CITIES.length} cities
                </span>
              </div>
              <div className="aspect-[4/5] sm:aspect-[5/4] w-full rounded-2xl bg-gradient-to-br from-accent/5 via-primary/5 to-background overflow-hidden">
                <svg viewBox="0 0 800 900" className="w-full h-full">
                  {/* Stylized Algeria silhouette */}
                  <path
                    d="M180 160 L350 110 L520 130 L640 175 L700 250 L680 360 L720 460 L640 600 L580 760 L470 830 L360 800 L260 700 L200 560 L160 420 L150 280 Z"
                    className="fill-primary/10 stroke-primary/40"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  {/* Mediterranean label */}
                  <text x="400" y="80" textAnchor="middle" className="fill-muted-foreground text-[16px]">
                    Mediterranean Sea
                  </text>
                  <text x="120" y="450" textAnchor="middle" className="fill-muted-foreground text-[14px]" transform="rotate(-90 120 450)">
                    Atlantic
                  </text>
                  <text x="470" y="880" textAnchor="middle" className="fill-muted-foreground text-[14px]">
                    Sahara
                  </text>

                  {/* City markers (filtered list visually de-emphasizes hidden ones) */}
                  {ALGERIA_CITIES.map((c) => {
                    const visible = visibleCities.some((v) => v.id === c.id);
                    if (!visible) return null;
                    return (
                      <CityMarker
                        key={c.id}
                        city={c}
                        active={selectedCity?.id === c.id}
                        onClick={() => setSelectedCityId(c.id)}
                      />
                    );
                  })}
                </svg>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Tap a city to see local guides, highlights, and travel tips.
              </p>
            </div>

            {/* City detail */}
            <div className="lg:col-span-2 space-y-4">
              {selectedCity && <CityDetailCard city={selectedCity} talkLabel={t.talkToGuide} />}
            </div>
          </div>
        </section>

        {/* Featured for audience */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-10">
          <div className="flex items-end justify-between mb-4">
            <div>
              <h2 className="text-2xl font-display text-foreground">
                {t.featuredFor} <span className="text-primary">{AUDIENCE_LABELS[audience]}s</span>
              </h2>
              <p className="text-sm text-muted-foreground">
                Personalized picks based on what you're here for.
              </p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredCities.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setSelectedCityId(c.id);
                  if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="text-start rounded-2xl border border-border bg-card p-4 hover:border-primary/40 hover:-translate-y-0.5 transition-all shadow-sm"
              >
                <div className="text-3xl">{c.heroEmoji}</div>
                <div className="mt-2 font-semibold text-foreground">{c.name}</div>
                <div className="text-xs text-muted-foreground">{c.highlights[0]}</div>
                <div className="mt-3 flex items-center gap-1 text-xs text-foreground">
                  <Star className="h-3.5 w-3.5 text-accent fill-accent" /> {c.rating} · {c.reviews.toLocaleString()} reviews
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Live insights */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-16">
          <div className="mb-4">
            <h2 className="text-2xl font-display text-foreground">{t.liveInsights}</h2>
            <p className="text-sm text-muted-foreground">{t.liveSub}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {LIVE_INSIGHTS.map((i) => {
              const Icon =
                i.type === "trending"
                  ? TrendingUp
                  : i.type === "new-guide"
                    ? Users
                    : i.type === "question"
                      ? HelpCircle
                      : i.type === "recommended"
                        ? Sparkles
                        : Bell;
              return (
                <div
                  key={i.id}
                  className="rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide">
                    <Icon className="h-3.5 w-3.5" /> {i.type.replace("-", " ")}
                  </div>
                  <h3 className="mt-3 font-semibold text-foreground">{i.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{i.body}</p>
                  {i.city && (
                    <div className="mt-3 text-xs text-muted-foreground inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {i.city}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Verified guides strip */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-20">
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-2xl font-display text-foreground">{t.verifiedGuides}</h2>
            <Link to="/guides" className="text-sm text-primary hover:underline">
              See all guides →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SAMPLE_GUIDES.slice(0, 4).map((g) => (
              <div
                key={g.id}
                className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-3 shadow-sm hover:border-primary/40 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <Avatar name={g.name} size="lg" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-foreground truncate">{g.name}</span>
                      {g.verified && (
                        <ShieldCheck className="h-4 w-4 text-primary" aria-label="Verified" />
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {g.city}
                    </div>
                    <div className="mt-1 text-xs text-foreground inline-flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-accent fill-accent" /> {g.rating} · {g.sessions} sessions
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{g.specialty}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" /> ~{g.responseTimeMin} min reply
                  </span>
                  <span className="inline-flex gap-1">
                    {g.languages.slice(0, 3).map((l) => (
                      <span key={l}>{getLanguageFlag(l)}</span>
                    ))}
                  </span>
                </div>
                <Link to="/guides" className="w-full">
                  <Button className="w-full" size="sm">
                    <MessageCircle className="h-4 w-4" /> {t.talkToGuide}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}

function CityDetailCard({ city, talkLabel }: { city: CityNode; talkLabel: string }) {
  return (
    <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
      <div className="bg-gradient-to-br from-primary/15 via-accent/10 to-transparent p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-4xl">{city.heroEmoji}</div>
            <h3 className="mt-2 text-2xl font-display text-foreground">
              {city.name} <span className="text-base text-muted-foreground">· {city.nameAr}</span>
            </h3>
            <div className="mt-1 flex items-center gap-1 text-sm text-foreground">
              <Star className="h-4 w-4 text-accent fill-accent" /> {city.rating} ·{" "}
              <span className="text-muted-foreground">{city.reviews.toLocaleString()} reviews</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1 justify-end max-w-[55%]">
            {city.categories.slice(0, 4).map((c) => (
              <Badge key={c} variant="default">
                {FILTER_LABELS[c]}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Highlights */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
            Highlights
          </p>
          <ul className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm text-foreground">
            {city.highlights.map((h) => (
              <li key={h} className="flex items-start gap-1.5">
                <span className="text-primary">•</span> {h}
              </li>
            ))}
          </ul>
        </div>

        {/* Tips grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <InfoRow icon={Bus} label="Transport" value={city.transportTip} />
          <InfoRow icon={ShieldAlert} label="Safety" value={city.safetyTip} />
          <InfoRow icon={Wallet} label="Cost / day" value={city.costEstimate} />
          <InfoRow
            icon={Languages}
            label="Languages"
            value={city.languages.map((l) => getLanguageFlag(l) || l).join("  ")}
          />
        </div>

        {/* Places */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
            Notable places
          </p>
          <div className="space-y-2">
            {city.places.map((p) => (
              <div
                key={p.id}
                className="rounded-xl border border-border p-3 flex items-start justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="font-medium text-foreground text-sm">{p.name}</div>
                  <div className="text-xs text-muted-foreground line-clamp-2">{p.description}</div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {p.categories.map((c) => (
                      <Badge key={c} variant="default">
                        {FILTER_LABELS[c]}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="text-xs text-foreground inline-flex items-center gap-1 whitespace-nowrap">
                  <Star className="h-3 w-3 text-accent fill-accent" /> {p.rating}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Local guides */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
            Local guides in {city.name}
          </p>
          <div className="space-y-2">
            {city.guideIds.map((gid) => {
              const g = getGuideById(gid);
              if (!g) return null;
              return (
                <div
                  key={g.id}
                  className="rounded-xl border border-border p-3 flex items-center gap-3"
                >
                  <Avatar name={g.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-foreground text-sm truncate">{g.name}</span>
                      {g.verified && <ShieldCheck className="h-3.5 w-3.5 text-primary" />}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">{g.specialty}</div>
                    <div className="mt-0.5 text-[11px] text-muted-foreground inline-flex items-center gap-2">
                      <span className="inline-flex items-center gap-0.5">
                        <Star className="h-3 w-3 text-accent fill-accent" />
                        {g.rating}
                      </span>
                      <span>· {g.sessions} sessions</span>
                      <span className="inline-flex items-center gap-0.5">
                        · <Clock className="h-3 w-3" /> ~{g.responseTimeMin}m
                      </span>
                    </div>
                  </div>
                  <Link to="/guides">
                    <Button size="sm">
                      <MessageCircle className="h-4 w-4" />
                      Talk
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        <Link to="/guides" className="block">
          <Button className="w-full" size="lg">
            <MessageCircle className="h-4 w-4" /> {talkLabel}
          </Button>
        </Link>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border p-3">
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground inline-flex items-center gap-1">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <div className="mt-1 text-foreground text-sm">{value}</div>
    </div>
  );
}
