import { useMemo, useState, lazy, Suspense } from "react";
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
  LIVE_INSIGHTS,
  MODE_CTA,
  MODE_EMPTY,
  MODE_FILTERS,
  MODE_LABELS,
  MODE_TAGLINES,
  getGuideById,
  type AudienceType,
  type CityNode,
  type MapPlace,
  type ModeFilter,
} from "@/lib/algeriaMapData";
import { getCityImage } from "@/lib/cityImages";

const MODE_ICONS: Record<AudienceType, React.ComponentType<{ className?: string }>> = {
  tourist: Compass,
  student: GraduationCap,
  investor: Briefcase,
};

const AlgeriaLeafletMap = lazy(() => import("@/components/map/AlgeriaLeafletMap"));

export default function AlgeriaMap() {
  const [mode, setMode] = useState<AudienceType>("tourist");
  const [filters, setFilters] = useState<Set<ModeFilter>>(new Set());
  const [query, setQuery] = useState("");
  const [selectedCityId, setSelectedCityId] = useState<string>("alger");

  // Reset filters whenever mode changes — no leaking filter state across modes
  const setModeStrict = (m: AudienceType) => {
    setMode(m);
    setFilters(new Set());
  };

  // Cities visible on the map: only those with content for the active mode
  // and matching active mode-specific filters + search query.
  const visibleCities = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALGERIA_CITIES.filter((c) => {
      const places = c.places[mode];
      const guides = c.guideIds[mode];
      // Mode gating — strict empty-state: city must have places OR guides for the mode
      if (places.length === 0 && guides.length === 0) return false;

      if (filters.size > 0) {
        const hasAny = places.some((p) => filters.has(p.filter));
        if (!hasAny) return false;
      }

      if (!q) return true;
      const guideMatch = guides.some((id) =>
        getGuideById(id)?.name.toLowerCase().includes(q),
      );
      return (
        c.name.toLowerCase().includes(q) ||
        c.nameAr.includes(q) ||
        places.some((p) => p.name.toLowerCase().includes(q)) ||
        guideMatch
      );
    });
  }, [mode, filters, query]);

  const selectedCity =
    visibleCities.find((c) => c.id === selectedCityId) ?? visibleCities[0] ?? null;

  const featuredCities = useMemo(
    () =>
      ALGERIA_CITIES.filter(
        (c) => c.places[mode].length > 0 || c.guideIds[mode].length > 0,
      ).slice(0, 4),
    [mode],
  );

  const visibleInsights = useMemo(
    () => LIVE_INSIGHTS.filter((i) => i.mode === mode),
    [mode],
  );

  const modeFilters = MODE_FILTERS[mode];
  const ModeIcon = MODE_ICONS[mode];

  const toggleFilter = (f: ModeFilter) => {
    setFilters((prev) => {
      const next = new Set(prev);
      if (next.has(f)) next.delete(f);
      else next.add(f);
      return next;
    });
  };

  const markers = useMemo(
    () =>
      visibleCities.map((c) => ({
        id: c.id,
        name: c.name,
        lat: c.lat,
        lng: c.lng,
        tagline: c.highlights[mode][0],
        image: getCityImage(c.id, mode),
      })),
    [visibleCities, mode],
  );

  return (
    <PageWrapper showFooter fullWidth>
      <div className="bg-gradient-to-b from-primary/5 via-background to-background">
        {/* Hero */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium">
              <Sparkles className="h-3.5 w-3.5" /> Algeria Live Guide Map
            </div>
            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-display tracking-tight text-foreground">
              First, choose how you're discovering Algeria
            </h1>
            <p className="mt-3 text-muted-foreground text-base sm:text-lg max-w-2xl">
              The map, filters, places and guides will all adapt to your choice. One mode at a time — no mixing.
            </p>

            {/* SINGLE mode selector — only place this appears */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(Object.keys(MODE_LABELS) as AudienceType[]).map((m) => {
                const Icon = MODE_ICONS[m];
                const active = mode === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setModeStrict(m)}
                    aria-pressed={active}
                    className={
                      "group text-start rounded-2xl border-2 p-5 transition-all " +
                      (active
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border bg-card hover:border-primary/40")
                    }
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={
                          "h-10 w-10 rounded-xl grid place-items-center transition-colors " +
                          (active
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary")
                        }
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-foreground">{MODE_LABELS[m]}</div>
                        <div className="text-xs text-muted-foreground">I'm here as a {MODE_LABELS[m].toLowerCase()}</div>
                      </div>
                      {active && (
                        <Badge variant="approved">Active</Badge>
                      )}
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">{MODE_TAGLINES[m]}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Active mode header */}
        <section className="border-b border-border bg-card/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground grid place-items-center">
                  <ModeIcon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">Showing</div>
                  <div className="font-semibold text-foreground">
                    {MODE_LABELS[mode]} mode · {visibleCities.length} cities
                  </div>
                </div>
              </div>

              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute top-1/2 -translate-y-1/2 left-4 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={`Search ${MODE_LABELS[mode].toLowerCase()} places, cities or guides…`}
                  className="w-full h-12 pl-12 pr-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Mode-specific filter bar — strictly only this mode's filters */}
            <div className="mt-5">
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                {MODE_LABELS[mode]} filters
              </p>
              <div className="flex flex-wrap gap-2">
                {modeFilters.map((f) => {
                  const active = filters.has(f.id);
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => toggleFilter(f.id)}
                      className={
                        "px-3 py-2 rounded-full text-sm border transition-colors " +
                        (active
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card text-foreground border-border hover:border-primary/40")
                      }
                    >
                      {f.label}
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
            <div className="lg:col-span-3 rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  {MODE_LABELS[mode]} map of Algeria
                </h2>
                <span className="text-xs text-muted-foreground">
                  {visibleCities.length} cities for {MODE_LABELS[mode].toLowerCase()}s
                </span>
              </div>
              <div className="aspect-[4/5] sm:aspect-[5/4] w-full rounded-2xl overflow-hidden border border-border">
                {markers.length === 0 ? (
                  <div className="w-full h-full grid place-items-center text-center p-6">
                    <div>
                      <MapPin className="h-8 w-8 mx-auto text-muted-foreground" />
                      <p className="mt-3 text-sm text-muted-foreground">{MODE_EMPTY[mode]}</p>
                    </div>
                  </div>
                ) : (
                  <Suspense
                    fallback={
                      <div className="w-full h-full grid place-items-center text-sm text-muted-foreground">
                        Loading map…
                      </div>
                    }
                  >
                    <AlgeriaLeafletMap
                      cities={markers}
                      selectedId={selectedCity?.id ?? ""}
                      onSelect={(id) => setSelectedCityId(id)}
                    />
                  </Suspense>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Tap a city to see {MODE_LABELS[mode].toLowerCase()}-relevant places and guides.
              </p>
            </div>

            <div className="lg:col-span-2 space-y-4">
              {selectedCity ? (
                <CityDetailCard city={selectedCity} mode={mode} />
              ) : (
                <div className="rounded-3xl border border-border bg-card p-8 text-center">
                  <MapPin className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="mt-3 text-sm text-muted-foreground">{MODE_EMPTY[mode]}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Featured cities for active mode */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-10">
          <div className="flex items-end justify-between mb-4">
            <div>
              <h2 className="text-2xl font-display text-foreground">
                Top picks for <span className="text-primary">{MODE_LABELS[mode].toLowerCase()}s</span>
              </h2>
              <p className="text-sm text-muted-foreground">{MODE_TAGLINES[mode]}</p>
            </div>
          </div>
          {featuredCities.length === 0 ? (
            <EmptyMode mode={mode} />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredCities.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setSelectedCityId(c.id);
                    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="text-start rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/40 hover:-translate-y-0.5 transition-all shadow-sm"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
                    <img
                      src={getCityImage(c.id, mode)}
                      alt={c.name}
                      loading="lazy"
                      width={512}
                      height={384}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="font-semibold text-foreground">{c.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {c.highlights[mode][0] ?? "—"}
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-xs text-foreground">
                      <Star className="h-3.5 w-3.5 text-accent fill-accent" /> {c.rating} ·{" "}
                      {c.reviews.toLocaleString()} reviews
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Live insights — mode filtered */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-16">
          <div className="mb-4">
            <h2 className="text-2xl font-display text-foreground">
              Live insights for {MODE_LABELS[mode].toLowerCase()}s
            </h2>
            <p className="text-sm text-muted-foreground">Updated daily for your selected mode.</p>
          </div>
          {visibleInsights.length === 0 ? (
            <EmptyMode mode={mode} />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleInsights.map((i) => {
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
          )}
        </section>

        {/* Verified guides — only for active mode */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-20">
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-2xl font-display text-foreground">
              Verified {MODE_LABELS[mode].toLowerCase()} guides
            </h2>
            <Link to="/guides" className="text-sm text-primary hover:underline">
              See all guides →
            </Link>
          </div>
          {(() => {
            const guides = featuredCities
              .flatMap((c) => c.guideIds[mode].map(getGuideById))
              .filter((g): g is NonNullable<typeof g> => Boolean(g))
              .slice(0, 4);
            if (guides.length === 0) return <EmptyMode mode={mode} />;
            return (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {guides.map((g) => (
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
                        <MessageCircle className="h-4 w-4" /> {MODE_CTA[mode]}
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            );
          })()}
        </section>
      </div>
    </PageWrapper>
  );
}

function EmptyMode({ mode }: { mode: AudienceType }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center">
      <p className="text-sm text-muted-foreground">{MODE_EMPTY[mode]}</p>
    </div>
  );
}

function CityDetailCard({ city, mode }: { city: CityNode; mode: AudienceType }) {
  const places = city.places[mode];
  const guideIds = city.guideIds[mode];
  const highlights = city.highlights[mode];
  const tips = city.tips[mode];
  const hasContent = places.length > 0 || guideIds.length > 0 || highlights.length > 0;

  return (
    <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
        <img
          src={getCityImage(city.id, mode)}
          alt={city.name}
          loading="lazy"
          width={1024}
          height={576}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4 text-white">
          <h3 className="text-2xl font-display drop-shadow">
            {city.name} <span className="text-base opacity-80">· {city.nameAr}</span>
          </h3>
          <div className="mt-1 flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 text-accent fill-accent" /> {city.rating} ·{" "}
            <span className="opacity-90">{city.reviews.toLocaleString()} reviews</span>
          </div>
        </div>
        <div className="absolute top-3 left-4">
          <Badge variant="approved">{MODE_LABELS[mode]} view</Badge>
        </div>
      </div>

      {!hasContent ? (
        <div className="p-8 text-center">
          <p className="text-sm text-muted-foreground">{MODE_EMPTY[mode]}</p>
        </div>
      ) : (
        <div className="p-6 space-y-5">
          {highlights.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                {MODE_LABELS[mode]} highlights
              </p>
              <ul className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm text-foreground">
                {highlights.map((h) => (
                  <li key={h} className="flex items-start gap-1.5">
                    <span className="text-primary">•</span> {h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <InfoRow icon={Bus} label="Transport" value={tips.transport} />
            <InfoRow icon={ShieldAlert} label="Safety" value={tips.safety} />
            <InfoRow icon={Wallet} label="Cost / day" value={tips.cost} />
            <InfoRow
              icon={Languages}
              label="Languages"
              value={["ar", "fr", "en"].map((l) => getLanguageFlag(l) || l).join("  ")}
            />
          </div>

          {places.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                {MODE_LABELS[mode]} places
              </p>
              <div className="space-y-2">
                {places.map((p) => (
                  <PlaceRow key={p.id} place={p} mode={mode} />
                ))}
              </div>
            </div>
          )}

          {guideIds.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                {MODE_LABELS[mode]} guides in {city.name}
              </p>
              <div className="space-y-2">
                {guideIds.map((gid) => {
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
                          <span className="font-medium text-foreground text-sm truncate">
                            {g.name}
                          </span>
                          {g.verified && <ShieldCheck className="h-3.5 w-3.5 text-primary" />}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">{g.specialty}</div>
                      </div>
                      <Link to="/guides">
                        <Button size="sm">
                          <MessageCircle className="h-4 w-4" />
                          {MODE_CTA[mode]}
                        </Button>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <Link to="/guides" className="block">
            <Button className="w-full" size="lg">
              <MessageCircle className="h-4 w-4" /> {MODE_CTA[mode]}
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

function PlaceRow({ place, mode }: { place: MapPlace; mode: AudienceType }) {
  return (
    <div className="rounded-xl border border-border p-3 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="font-medium text-foreground text-sm">{place.name}</div>
        <div className="text-xs text-muted-foreground line-clamp-2">{place.description}</div>
        <div className="mt-1 flex flex-wrap gap-1">
          <Badge variant="default">
            {MODE_FILTERS[mode].find((f) => f.id === place.filter)?.label ?? place.filter}
          </Badge>
        </div>
      </div>
      <div className="text-xs text-foreground inline-flex items-center gap-1 whitespace-nowrap">
        <Star className="h-3 w-3 text-accent fill-accent" /> {place.rating}
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
