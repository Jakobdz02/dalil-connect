// Algeria Live Guide Map - sample data
// Easily editable to keep guides, places, alerts, and insights up to date.

export type FilterCategory =
  | "tourism"
  | "study"
  | "business"
  | "safety"
  | "food"
  | "transport"
  | "nightlife"
  | "events";

export type AudienceType = "tourist" | "student" | "investor";

export const FILTER_LABELS: Record<FilterCategory, string> = {
  tourism: "Tourism",
  study: "Study",
  business: "Business / Investment",
  safety: "Safety",
  food: "Food",
  transport: "Transport",
  nightlife: "Nightlife",
  events: "Events",
};

export interface MapPlace {
  id: string;
  name: string;
  type: "attraction" | "university" | "business" | "restaurant" | "venue";
  description: string;
  categories: FilterCategory[];
  rating: number;
  reviews: number;
}

export interface CityNode {
  id: string;
  name: string;
  nameAr: string;
  region: "north" | "center" | "south" | "east" | "west";
  // SVG coordinates on a 1000x1000 stylized Algeria map (approximate, legacy)
  x: number;
  y: number;
  // Real-world coordinates used by the interactive Leaflet map
  lat: number;
  lng: number;
  highlights: string[];
  places: MapPlace[];
  guideIds: string[];
  transportTip: string;
  safetyTip: string;
  costEstimate: string; // per day
  languages: string[]; // codes
  rating: number;
  reviews: number;
  categories: FilterCategory[];
  audience: AudienceType[];
  heroEmoji: string;
}

export interface SampleGuide {
  id: string;
  name: string;
  city: string;
  languages: string[];
  rating: number;
  sessions: number;
  responseTimeMin: number;
  verified: boolean;
  pricePerDay: number;
  specialty: string;
  avatarSeed: string;
}

export interface LiveInsight {
  id: string;
  type: "trending" | "new-guide" | "question" | "recommended" | "update";
  title: string;
  body: string;
  city?: string;
}

export const SAMPLE_GUIDES: SampleGuide[] = [
  { id: "g-amine", name: "Amine B.", city: "Alger", languages: ["en", "fr", "ar"], rating: 4.9, sessions: 184, responseTimeMin: 12, verified: true, pricePerDay: 6500, specialty: "Casbah heritage walks", avatarSeed: "amine" },
  { id: "g-yasmine", name: "Yasmine K.", city: "Oran", languages: ["en", "fr", "ar", "es"], rating: 4.8, sessions: 121, responseTimeMin: 18, verified: true, pricePerDay: 5800, specialty: "Coast & Spanish heritage", avatarSeed: "yasmine" },
  { id: "g-karim", name: "Karim T.", city: "Constantine", languages: ["en", "fr", "ar"], rating: 4.95, sessions: 96, responseTimeMin: 9, verified: true, pricePerDay: 5500, specialty: "Bridges & old medina", avatarSeed: "karim" },
  { id: "g-nadia", name: "Nadia S.", city: "Tamanrasset", languages: ["en", "fr", "ar"], rating: 5.0, sessions: 64, responseTimeMin: 22, verified: true, pricePerDay: 12000, specialty: "Hoggar desert expeditions", avatarSeed: "nadia" },
  { id: "g-omar", name: "Omar R.", city: "Annaba", languages: ["en", "fr", "ar", "it"], rating: 4.7, sessions: 73, responseTimeMin: 15, verified: true, pricePerDay: 5200, specialty: "Hippo Regius & beaches", avatarSeed: "omar" },
  { id: "g-lina", name: "Lina M.", city: "Tlemcen", languages: ["en", "fr", "ar"], rating: 4.85, sessions: 58, responseTimeMin: 20, verified: true, pricePerDay: 5000, specialty: "Andalusian art & cuisine", avatarSeed: "lina" },
  { id: "g-sami", name: "Sami D.", city: "Ghardaïa", languages: ["en", "fr", "ar"], rating: 4.9, sessions: 81, responseTimeMin: 14, verified: true, pricePerDay: 7000, specialty: "M'Zab valley culture", avatarSeed: "sami" },
  { id: "g-rania", name: "Rania H.", city: "Béjaïa", languages: ["en", "fr", "ar"], rating: 4.75, sessions: 47, responseTimeMin: 25, verified: true, pricePerDay: 4800, specialty: "Kabylie nature & hikes", avatarSeed: "rania" },
];

export const ALGERIA_CITIES: CityNode[] = [
  {
    id: "alger",
    name: "Alger",
    nameAr: "الجزائر",
    region: "north",
    x: 470, y: 180,
    lat: 36.7538, lng: 3.0588,
    heroEmoji: "🏛️",
    highlights: ["Casbah (UNESCO)", "Notre Dame d'Afrique", "Bardo Museum", "Martyrs' Memorial"],
    places: [
      { id: "p-casbah", name: "Casbah of Algiers", type: "attraction", description: "Ottoman-era medina, UNESCO World Heritage site.", categories: ["tourism"], rating: 4.7, reviews: 2103 },
      { id: "p-usthb", name: "USTHB University", type: "university", description: "Top science & tech university in Algeria.", categories: ["study"], rating: 4.3, reviews: 412 },
      { id: "p-bab-ezzouar", name: "Bab Ezzouar Business District", type: "business", description: "Main business hub with multinational HQs.", categories: ["business"], rating: 4.4, reviews: 287 },
      { id: "p-dar-soltane", name: "Dar Soltane", type: "restaurant", description: "Authentic Algerian cuisine in a heritage setting.", categories: ["food"], rating: 4.6, reviews: 658 },
    ],
    guideIds: ["g-amine"],
    transportTip: "Use the metro + tram combo. Yassir / Heetch apps work well for taxis.",
    safetyTip: "Generally safe. Avoid unlit alleys in the lower Casbah at night.",
    costEstimate: "5,000 – 10,000 DZD / day",
    languages: ["ar", "fr", "en"],
    rating: 4.7,
    reviews: 3460,
    categories: ["tourism", "study", "business", "food", "transport", "events"],
    audience: ["tourist", "student", "investor"],
  },
  {
    id: "oran",
    name: "Oran",
    nameAr: "وهران",
    region: "west",
    x: 280, y: 220,
    lat: 35.6971, lng: -0.6308,
    heroEmoji: "🌊",
    highlights: ["Santa Cruz Fortress", "Place du 1er Novembre", "Corniche", "Raï music scene"],
    places: [
      { id: "p-santa-cruz", name: "Santa Cruz Fortress", type: "attraction", description: "Spanish fort overlooking the bay.", categories: ["tourism"], rating: 4.8, reviews: 1542 },
      { id: "p-univ-oran", name: "University of Oran 1", type: "university", description: "Oldest university in western Algeria.", categories: ["study"], rating: 4.2, reviews: 318 },
      { id: "p-le-perroquet", name: "Le Perroquet", type: "restaurant", description: "Iconic seafood on the corniche.", categories: ["food", "nightlife"], rating: 4.5, reviews: 891 },
    ],
    guideIds: ["g-yasmine"],
    transportTip: "Tramway covers the city center. Train to Algiers takes ~4h.",
    safetyTip: "Coastal areas are very tourist-friendly day and night.",
    costEstimate: "4,000 – 8,000 DZD / day",
    languages: ["ar", "fr", "en", "es"],
    rating: 4.6,
    reviews: 2733,
    categories: ["tourism", "food", "nightlife", "study", "events"],
    audience: ["tourist", "student"],
  },
  {
    id: "constantine",
    name: "Constantine",
    nameAr: "قسنطينة",
    region: "east",
    x: 600, y: 200,
    lat: 36.365, lng: 6.6147,
    heroEmoji: "🌉",
    highlights: ["Sidi M'Cid Bridge", "Palace of Ahmed Bey", "Emir Abdelkader Mosque"],
    places: [
      { id: "p-bridges", name: "City of Bridges", type: "attraction", description: "Spectacular suspension bridges over Rhumel gorge.", categories: ["tourism"], rating: 4.9, reviews: 1876 },
      { id: "p-univ-mentouri", name: "Mentouri University", type: "university", description: "Major eastern Algeria university.", categories: ["study"], rating: 4.1, reviews: 245 },
    ],
    guideIds: ["g-karim"],
    transportTip: "Cable car connects key viewpoints. Walking tours recommended.",
    safetyTip: "Very safe for foreigners. Mind the steep streets and bridges.",
    costEstimate: "3,500 – 7,000 DZD / day",
    languages: ["ar", "fr", "en"],
    rating: 4.8,
    reviews: 2104,
    categories: ["tourism", "study", "food", "events"],
    audience: ["tourist", "student"],
  },
  {
    id: "tamanrasset",
    name: "Tamanrasset",
    nameAr: "تمنراست",
    region: "south",
    x: 470, y: 720,
    lat: 22.785, lng: 5.5228,
    heroEmoji: "🏜️",
    highlights: ["Hoggar Mountains", "Assekrem Plateau", "Tuareg culture"],
    places: [
      { id: "p-hoggar", name: "Hoggar Mountains", type: "attraction", description: "Otherworldly volcanic peaks at the heart of the Sahara.", categories: ["tourism"], rating: 5.0, reviews: 932 },
      { id: "p-assekrem", name: "Assekrem Sunset", type: "venue", description: "Sunset viewpoint at 2,728m, unforgettable.", categories: ["tourism", "events"], rating: 5.0, reviews: 612 },
    ],
    guideIds: ["g-nadia"],
    transportTip: "Fly from Algiers (~2h). Inside the desert use 4x4 with a licensed guide only.",
    safetyTip: "Desert excursions require a licensed guide. Bring sun protection & water.",
    costEstimate: "10,000 – 20,000 DZD / day",
    languages: ["ar", "fr", "en"],
    rating: 4.95,
    reviews: 1544,
    categories: ["tourism", "events", "safety"],
    audience: ["tourist"],
  },
  {
    id: "annaba",
    name: "Annaba",
    nameAr: "عنابة",
    region: "east",
    x: 660, y: 160,
    lat: 36.9, lng: 7.7667,
    heroEmoji: "🏖️",
    highlights: ["Hippo Regius ruins", "Basilica of St Augustine", "Seraïdi beaches"],
    places: [
      { id: "p-hippo", name: "Hippo Regius", type: "attraction", description: "Ancient Roman city where St. Augustine was bishop.", categories: ["tourism"], rating: 4.7, reviews: 754 },
      { id: "p-port-annaba", name: "Port of Annaba", type: "business", description: "Major Mediterranean trade port.", categories: ["business", "transport"], rating: 4.3, reviews: 192 },
    ],
    guideIds: ["g-omar"],
    transportTip: "Train and bus links to Constantine. Local taxis are cheap.",
    safetyTip: "Family-friendly beaches. Standard urban precautions apply.",
    costEstimate: "3,500 – 7,500 DZD / day",
    languages: ["ar", "fr", "en", "it"],
    rating: 4.6,
    reviews: 1276,
    categories: ["tourism", "food", "business", "transport"],
    audience: ["tourist", "investor"],
  },
  {
    id: "tlemcen",
    name: "Tlemcen",
    nameAr: "تلمسان",
    region: "west",
    x: 220, y: 260,
    lat: 34.8826, lng: -1.315,
    heroEmoji: "🕌",
    highlights: ["Great Mosque of Tlemcen", "El Mechouar Palace", "Lalla Setti plateau"],
    places: [
      { id: "p-great-mosque", name: "Great Mosque of Tlemcen", type: "attraction", description: "12th-century Almoravid masterpiece.", categories: ["tourism"], rating: 4.8, reviews: 612 },
    ],
    guideIds: ["g-lina"],
    transportTip: "Cable car to Lalla Setti. Buses to Oran every hour.",
    safetyTip: "Quiet and very safe city. Ideal for solo travelers.",
    costEstimate: "3,000 – 6,500 DZD / day",
    languages: ["ar", "fr", "en"],
    rating: 4.7,
    reviews: 894,
    categories: ["tourism", "food", "events", "study"],
    audience: ["tourist", "student"],
  },
  {
    id: "ghardaia",
    name: "Ghardaïa",
    nameAr: "غرداية",
    region: "south",
    x: 460, y: 460,
    lat: 32.49, lng: 3.67,
    heroEmoji: "🏘️",
    highlights: ["M'Zab Valley (UNESCO)", "Pentapolis old towns", "Mozabite craftsmanship"],
    places: [
      { id: "p-mzab", name: "M'Zab Valley", type: "attraction", description: "UNESCO site of five fortified cities.", categories: ["tourism"], rating: 4.9, reviews: 887 },
    ],
    guideIds: ["g-sami"],
    transportTip: "Daily flights from Algiers. Local guide strongly recommended.",
    safetyTip: "Respect local customs and dress modestly when visiting old towns.",
    costEstimate: "5,000 – 10,000 DZD / day",
    languages: ["ar", "fr", "en"],
    rating: 4.85,
    reviews: 1003,
    categories: ["tourism", "events", "safety"],
    audience: ["tourist"],
  },
  {
    id: "bejaia",
    name: "Béjaïa",
    nameAr: "بجاية",
    region: "north",
    x: 540, y: 200,
    lat: 36.7515, lng: 5.0843,
    heroEmoji: "⛰️",
    highlights: ["Cap Carbon", "Yemma Gouraya National Park", "Aiguades beach"],
    places: [
      { id: "p-cap-carbon", name: "Cap Carbon Lighthouse", type: "attraction", description: "Highest natural lighthouse in the Mediterranean.", categories: ["tourism"], rating: 4.9, reviews: 612 },
    ],
    guideIds: ["g-rania"],
    transportTip: "Coastal road from Algiers is scenic (~4h). Local taxis & buses.",
    safetyTip: "Hiking trails are best done with a local guide.",
    costEstimate: "3,500 – 7,000 DZD / day",
    languages: ["ar", "fr", "en"],
    rating: 4.7,
    reviews: 743,
    categories: ["tourism", "food", "events"],
    audience: ["tourist"],
  },
];

export const LIVE_INSIGHTS: LiveInsight[] = [
  { id: "i1", type: "trending", title: "Trending: Casbah of Algiers", body: "Up 38% in bookings this week — heritage walks are booking out fast.", city: "Alger" },
  { id: "i2", type: "new-guide", title: "New guide: Sami D. in Ghardaïa", body: "Specializes in M'Zab valley culture & Mozabite craftsmanship.", city: "Ghardaïa" },
  { id: "i3", type: "question", title: "Top question from foreigners", body: "“Do I need a special permit to visit the Hoggar?” Yes — your guide arranges it.", city: "Tamanrasset" },
  { id: "i4", type: "recommended", title: "Recommended this week", body: "Sunset at Assekrem plateau — 2-day expedition with Nadia S.", city: "Tamanrasset" },
  { id: "i5", type: "update", title: "Update: Oran tram extension", body: "New tram line now connects USTO campus to the city center.", city: "Oran" },
  { id: "i6", type: "trending", title: "Trending dish", body: "Couscous with lamb shoulder — most ordered dish by visitors this month." },
];

export function getGuideById(id: string): SampleGuide | undefined {
  return SAMPLE_GUIDES.find((g) => g.id === id);
}
