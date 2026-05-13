// Algeria Live Guide Map - sample data (mode-aware)
// All map content is partitioned by AudienceType: tourist | student | investor.
// Each place, guide, insight, and per-mode filter set is tagged so the UI can
// strictly show ONLY content for the active mode.

export type AudienceType = "tourist" | "student" | "investor";

// Mode-specific filter categories (no cross-mode mixing).
export type TouristFilter =
  | "attractions"
  | "museums"
  | "beaches"
  | "historical"
  | "experiences"
  | "food";

export type StudentFilter =
  | "universities"
  | "dorms"
  | "neighborhoods"
  | "libraries"
  | "visa"
  | "transport";

export type InvestorFilter =
  | "business-districts"
  | "coworking"
  | "commercial"
  | "legal"
  | "networking"
  | "free-zones";

export type ModeFilter = TouristFilter | StudentFilter | InvestorFilter;

export const MODE_FILTERS: Record<AudienceType, { id: ModeFilter; label: string }[]> = {
  tourist: [
    { id: "attractions", label: "Attractions" },
    { id: "museums", label: "Museums" },
    { id: "beaches", label: "Beaches" },
    { id: "historical", label: "Historical" },
    { id: "experiences", label: "Local experiences" },
    { id: "food", label: "Food" },
  ],
  student: [
    { id: "universities", label: "Universities" },
    { id: "dorms", label: "Dorms / Accommodation" },
    { id: "neighborhoods", label: "Student neighborhoods" },
    { id: "libraries", label: "Libraries" },
    { id: "visa", label: "Visa & help" },
    { id: "transport", label: "Student transport" },
  ],
  investor: [
    { id: "business-districts", label: "Business districts" },
    { id: "coworking", label: "Coworking spaces" },
    { id: "commercial", label: "Commercial zones" },
    { id: "free-zones", label: "Free / economic zones" },
    { id: "legal", label: "Legal & business support" },
    { id: "networking", label: "Networking spots" },
  ],
};

export const MODE_LABELS: Record<AudienceType, string> = {
  tourist: "Tourist",
  student: "Student",
  investor: "Investor",
};

export const MODE_TAGLINES: Record<AudienceType, string> = {
  tourist: "Discover attractions, heritage, food and unforgettable experiences.",
  student: "Find universities, accommodation, libraries and visa support.",
  investor: "Explore business districts, free zones, coworking and legal support.",
};

export const MODE_CTA: Record<AudienceType, string> = {
  tourist: "View details",
  student: "Book a session",
  investor: "Talk to a guide",
};

export const MODE_EMPTY: Record<AudienceType, string> = {
  tourist: "No tourist locations available in this area yet.",
  student: "No student locations available in this area yet.",
  investor: "No investor locations available in this area yet.",
};

export interface MapPlace {
  id: string;
  name: string;
  mode: AudienceType;          // strict mode ownership — no cross-mode reuse
  filter: ModeFilter;          // belongs to one mode-specific filter
  description: string;
  rating: number;
  reviews: number;
}

export interface CityNode {
  id: string;
  name: string;
  nameAr: string;
  region: "north" | "center" | "south" | "east" | "west";
  // Real-world coordinates for the Leaflet map
  lat: number;
  lng: number;
  // Per-mode content. Each array holds ONLY content for that mode.
  places: Record<AudienceType, MapPlace[]>;
  guideIds: Record<AudienceType, string[]>;
  highlights: Record<AudienceType, string[]>;
  tips: Record<AudienceType, { transport: string; safety: string; cost: string }>;
  rating: number;
  reviews: number;
}

export interface SampleGuide {
  id: string;
  name: string;
  city: string;
  mode: AudienceType;
  languages: string[];
  rating: number;
  sessions: number;
  responseTimeMin: number;
  verified: boolean;
  pricePerDay: number;
  specialty: string;
}

export interface LiveInsight {
  id: string;
  mode: AudienceType;
  type: "trending" | "new-guide" | "question" | "recommended" | "update";
  title: string;
  body: string;
  city?: string;
}

export const SAMPLE_GUIDES: SampleGuide[] = [
  // Tourist
  { id: "g-amine", name: "Amine B.", city: "Alger", mode: "tourist", languages: ["en", "fr", "ar"], rating: 4.9, sessions: 184, responseTimeMin: 12, verified: true, pricePerDay: 6500, specialty: "Casbah heritage walks" },
  { id: "g-yasmine", name: "Yasmine K.", city: "Oran", mode: "tourist", languages: ["en", "fr", "ar", "es"], rating: 4.8, sessions: 121, responseTimeMin: 18, verified: true, pricePerDay: 5800, specialty: "Coast & Spanish heritage" },
  { id: "g-karim", name: "Karim T.", city: "Constantine", mode: "tourist", languages: ["en", "fr", "ar"], rating: 4.95, sessions: 96, responseTimeMin: 9, verified: true, pricePerDay: 5500, specialty: "Bridges & old medina" },
  { id: "g-nadia", name: "Nadia S.", city: "Tamanrasset", mode: "tourist", languages: ["en", "fr", "ar"], rating: 5.0, sessions: 64, responseTimeMin: 22, verified: true, pricePerDay: 12000, specialty: "Hoggar desert expeditions" },
  { id: "g-omar", name: "Omar R.", city: "Annaba", mode: "tourist", languages: ["en", "fr", "ar", "it"], rating: 4.7, sessions: 73, responseTimeMin: 15, verified: true, pricePerDay: 5200, specialty: "Hippo Regius & beaches" },
  { id: "g-sami", name: "Sami D.", city: "Ghardaïa", mode: "tourist", languages: ["en", "fr", "ar"], rating: 4.9, sessions: 81, responseTimeMin: 14, verified: true, pricePerDay: 7000, specialty: "M'Zab valley culture" },

  // Student
  { id: "g-leila", name: "Leïla A.", city: "Alger", mode: "student", languages: ["en", "fr", "ar"], rating: 4.85, sessions: 92, responseTimeMin: 14, verified: true, pricePerDay: 3500, specialty: "Student visa & USTHB onboarding" },
  { id: "g-yacine", name: "Yacine M.", city: "Oran", mode: "student", languages: ["en", "fr", "ar"], rating: 4.7, sessions: 61, responseTimeMin: 20, verified: true, pricePerDay: 3200, specialty: "Housing for foreign students" },
  { id: "g-imane", name: "Imane B.", city: "Constantine", mode: "student", languages: ["en", "fr", "ar"], rating: 4.8, sessions: 48, responseTimeMin: 18, verified: true, pricePerDay: 3000, specialty: "Mentouri University guidance" },
  { id: "g-malik", name: "Malik R.", city: "Tlemcen", mode: "student", languages: ["en", "fr", "ar"], rating: 4.75, sessions: 35, responseTimeMin: 25, verified: true, pricePerDay: 2800, specialty: "Campus life & libraries" },

  // Investor
  { id: "g-tarek", name: "Tarek H.", city: "Alger", mode: "investor", languages: ["en", "fr", "ar"], rating: 4.95, sessions: 73, responseTimeMin: 10, verified: true, pricePerDay: 18000, specialty: "Company setup in Algiers" },
  { id: "g-sofia", name: "Sofia L.", city: "Oran", mode: "investor", languages: ["en", "fr", "ar", "es"], rating: 4.85, sessions: 52, responseTimeMin: 15, verified: true, pricePerDay: 16000, specialty: "Port logistics & trade" },
  { id: "g-bilal", name: "Bilal Z.", city: "Annaba", mode: "investor", languages: ["en", "fr", "ar"], rating: 4.8, sessions: 41, responseTimeMin: 18, verified: true, pricePerDay: 15000, specialty: "Industrial & port investment" },
  { id: "g-ines", name: "Inès D.", city: "Constantine", mode: "investor", languages: ["en", "fr", "ar"], rating: 4.7, sessions: 28, responseTimeMin: 22, verified: true, pricePerDay: 14000, specialty: "Eastern region commercial setup" },
];

export function getGuideById(id: string): SampleGuide | undefined {
  return SAMPLE_GUIDES.find((g) => g.id === id);
}

const empty = { tourist: [], student: [], investor: [] } as const;

export const ALGERIA_CITIES: CityNode[] = [
  {
    id: "alger",
    name: "Alger",
    nameAr: "الجزائر",
    region: "north",
    lat: 36.7538, lng: 3.0588,
    rating: 4.7, reviews: 3460,
    highlights: {
      tourist: ["Casbah (UNESCO)", "Notre Dame d'Afrique", "Bardo Museum", "Martyrs' Memorial"],
      student: ["USTHB campus", "Bab Ezzouar student district", "National Library", "Student visa center"],
      investor: ["Bab Ezzouar business district", "Algiers Stock Exchange", "Port of Algiers", "Pins Maritimes free zone"],
    },
    tips: {
      tourist: { transport: "Use the metro + tram. Yassir / Heetch for taxis.", safety: "Generally safe. Avoid unlit Casbah alleys at night.", cost: "5,000 – 10,000 DZD / day" },
      student: { transport: "Student metro pass available. Campus shuttles to USTHB.", safety: "Bab Ezzouar & Hydra are safe student areas.", cost: "1,800 – 3,500 DZD / day" },
      investor: { transport: "Direct flights to all EU/MENA hubs. Driver service recommended.", safety: "Business districts secure 24/7.", cost: "20,000 – 45,000 DZD / day" },
    },
    places: {
      tourist: [
        { id: "p-casbah", name: "Casbah of Algiers", mode: "tourist", filter: "historical", description: "Ottoman-era medina, UNESCO World Heritage site.", rating: 4.7, reviews: 2103 },
        { id: "p-bardo", name: "Bardo National Museum", mode: "tourist", filter: "museums", description: "Prehistory and ethnography of Algeria.", rating: 4.5, reviews: 612 },
        { id: "p-notre-dame", name: "Notre Dame d'Afrique", mode: "tourist", filter: "attractions", description: "Iconic basilica overlooking the bay.", rating: 4.8, reviews: 1284 },
        { id: "p-dar-soltane", name: "Dar Soltane", mode: "tourist", filter: "food", description: "Authentic Algerian cuisine in a heritage setting.", rating: 4.6, reviews: 658 },
      ],
      student: [
        { id: "s-usthb", name: "USTHB University", mode: "student", filter: "universities", description: "Top science & tech university in Algeria.", rating: 4.3, reviews: 412 },
        { id: "s-cite-u", name: "Cité Universitaire Bab Ezzouar", mode: "student", filter: "dorms", description: "Largest student residence near USTHB.", rating: 4.0, reviews: 198 },
        { id: "s-bnf", name: "National Library of Algeria", mode: "student", filter: "libraries", description: "Main reference library, study rooms open daily.", rating: 4.6, reviews: 287 },
        { id: "s-visa-alg", name: "Foreign Students Office", mode: "student", filter: "visa", description: "Residence card and student visa renewal support.", rating: 4.2, reviews: 154 },
      ],
      investor: [
        { id: "i-bab-ezzouar", name: "Bab Ezzouar Business District", mode: "investor", filter: "business-districts", description: "Main business hub with multinational HQs.", rating: 4.4, reviews: 287 },
        { id: "i-cowo-alg", name: "Sylabs Coworking Algiers", mode: "investor", filter: "coworking", description: "Premium coworking & startup community.", rating: 4.7, reviews: 132 },
        { id: "i-port-alg", name: "Port of Algiers Commercial Zone", mode: "investor", filter: "commercial", description: "Strategic Mediterranean trade gateway.", rating: 4.3, reviews: 98 },
        { id: "i-legal-alg", name: "Algiers Business Lawyers", mode: "investor", filter: "legal", description: "Bilingual firms specialized in foreign investment.", rating: 4.8, reviews: 76 },
      ],
    },
    guideIds: { tourist: ["g-amine"], student: ["g-leila"], investor: ["g-tarek"] },
  },
  {
    id: "oran",
    name: "Oran",
    nameAr: "وهران",
    region: "west",
    lat: 35.6971, lng: -0.6308,
    rating: 4.6, reviews: 2733,
    highlights: {
      tourist: ["Santa Cruz Fortress", "Place du 1er Novembre", "Corniche", "Raï music scene"],
      student: ["University of Oran 1", "USTO campus", "Es Sénia student district", "Tramway to campuses"],
      investor: ["Port of Oran", "Bethioua industrial zone", "Es Sénia free zone", "Commercial Es Sénia"],
    },
    tips: {
      tourist: { transport: "Tramway covers the city center. Train to Algiers ~4h.", safety: "Coastal areas are very tourist-friendly.", cost: "4,000 – 8,000 DZD / day" },
      student: { transport: "Tram USTO–Es Sénia covers all campuses.", safety: "Es Sénia & USTO areas are safe student hubs.", cost: "1,500 – 3,000 DZD / day" },
      investor: { transport: "Port + airport + Algiers highway = strong logistics.", safety: "Industrial zones have private security.", cost: "15,000 – 35,000 DZD / day" },
    },
    places: {
      tourist: [
        { id: "p-santa-cruz", name: "Santa Cruz Fortress", mode: "tourist", filter: "historical", description: "Spanish fort overlooking the bay.", rating: 4.8, reviews: 1542 },
        { id: "p-corniche", name: "Oran Corniche", mode: "tourist", filter: "beaches", description: "Scenic seafront drive and beaches.", rating: 4.6, reviews: 988 },
        { id: "p-perroquet", name: "Le Perroquet", mode: "tourist", filter: "food", description: "Iconic seafood on the corniche.", rating: 4.5, reviews: 891 },
      ],
      student: [
        { id: "s-univ-oran", name: "University of Oran 1", mode: "student", filter: "universities", description: "Oldest university in western Algeria.", rating: 4.2, reviews: 318 },
        { id: "s-usto", name: "USTO-MB Campus", mode: "student", filter: "universities", description: "Sciences & technology campus.", rating: 4.3, reviews: 241 },
        { id: "s-cite-essenia", name: "Cité U Es Sénia", mode: "student", filter: "dorms", description: "Affordable student housing near campuses.", rating: 3.9, reviews: 142 },
      ],
      investor: [
        { id: "i-port-oran", name: "Port of Oran Logistics Hub", mode: "investor", filter: "commercial", description: "Major Mediterranean cargo port.", rating: 4.4, reviews: 112 },
        { id: "i-bethioua", name: "Bethioua Industrial Zone", mode: "investor", filter: "free-zones", description: "Petrochemical & energy investment area.", rating: 4.5, reviews: 87 },
        { id: "i-cowo-oran", name: "Coworking Oran", mode: "investor", filter: "coworking", description: "Workspace for founders & remote teams.", rating: 4.6, reviews: 54 },
      ],
    },
    guideIds: { tourist: ["g-yasmine"], student: ["g-yacine"], investor: ["g-sofia"] },
  },
  {
    id: "constantine",
    name: "Constantine",
    nameAr: "قسنطينة",
    region: "east",
    lat: 36.365, lng: 6.6147,
    rating: 4.8, reviews: 2104,
    highlights: {
      tourist: ["Sidi M'Cid Bridge", "Palace of Ahmed Bey", "Emir Abdelkader Mosque"],
      student: ["Mentouri University", "Constantine 2 campus", "Cité U Zouaghi", "Central library"],
      investor: ["Ali Mendjeli new city", "Eastern commercial hub", "Tech park Constantine"],
    },
    tips: {
      tourist: { transport: "Cable car connects key viewpoints.", safety: "Very safe for foreigners.", cost: "3,500 – 7,000 DZD / day" },
      student: { transport: "Tramway links campuses to downtown.", safety: "Quiet, very safe for students.", cost: "1,200 – 2,800 DZD / day" },
      investor: { transport: "Mohamed Boudiaf Airport + east-west highway.", safety: "Business zones secure.", cost: "12,000 – 28,000 DZD / day" },
    },
    places: {
      tourist: [
        { id: "p-bridges", name: "City of Bridges", mode: "tourist", filter: "attractions", description: "Spectacular suspension bridges over Rhumel gorge.", rating: 4.9, reviews: 1876 },
        { id: "p-ahmed-bey", name: "Palace of Ahmed Bey", mode: "tourist", filter: "museums", description: "Ottoman-era palace turned museum.", rating: 4.6, reviews: 521 },
      ],
      student: [
        { id: "s-mentouri", name: "Mentouri University", mode: "student", filter: "universities", description: "Major eastern Algeria university.", rating: 4.1, reviews: 245 },
        { id: "s-zouaghi", name: "Cité U Zouaghi", mode: "student", filter: "dorms", description: "Large student residence with shuttle service.", rating: 3.8, reviews: 121 },
        { id: "s-lib-cne", name: "Constantine Central Library", mode: "student", filter: "libraries", description: "Quiet study spaces and references.", rating: 4.4, reviews: 88 },
      ],
      investor: [
        { id: "i-ali-mendjeli", name: "Ali Mendjeli New City", mode: "investor", filter: "business-districts", description: "Fastest-growing commercial district in the east.", rating: 4.4, reviews: 96 },
        { id: "i-techpark-cne", name: "Constantine Tech Park", mode: "investor", filter: "coworking", description: "Tech-focused workspace and incubator.", rating: 4.3, reviews: 41 },
      ],
    },
    guideIds: { tourist: ["g-karim"], student: ["g-imane"], investor: ["g-ines"] },
  },
  {
    id: "tamanrasset",
    name: "Tamanrasset",
    nameAr: "تمنراست",
    region: "south",
    lat: 22.785, lng: 5.5228,
    rating: 4.95, reviews: 1544,
    highlights: {
      tourist: ["Hoggar Mountains", "Assekrem Plateau", "Tuareg culture"],
      student: [],
      investor: [],
    },
    tips: {
      tourist: { transport: "Fly from Algiers (~2h). 4x4 with licensed guide only.", safety: "Desert excursions require a licensed guide.", cost: "10,000 – 20,000 DZD / day" },
      student: { transport: "—", safety: "—", cost: "—" },
      investor: { transport: "—", safety: "—", cost: "—" },
    },
    places: {
      tourist: [
        { id: "p-hoggar", name: "Hoggar Mountains", mode: "tourist", filter: "experiences", description: "Otherworldly volcanic peaks at the heart of the Sahara.", rating: 5.0, reviews: 932 },
        { id: "p-assekrem", name: "Assekrem Sunset", mode: "tourist", filter: "experiences", description: "Sunset viewpoint at 2,728m, unforgettable.", rating: 5.0, reviews: 612 },
      ],
      student: [],
      investor: [],
    },
    guideIds: { tourist: ["g-nadia"], student: [], investor: [] },
  },
  {
    id: "annaba",
    name: "Annaba",
    nameAr: "عنابة",
    region: "east",
    lat: 36.9, lng: 7.7667,
    rating: 4.6, reviews: 1276,
    highlights: {
      tourist: ["Hippo Regius ruins", "Basilica of St Augustine", "Seraïdi beaches"],
      student: [],
      investor: ["Port of Annaba", "El Hadjar steel complex", "Berrahal industrial zone"],
    },
    tips: {
      tourist: { transport: "Train and bus links to Constantine.", safety: "Family-friendly beaches.", cost: "3,500 – 7,500 DZD / day" },
      student: { transport: "—", safety: "—", cost: "—" },
      investor: { transport: "Major Mediterranean port + rail freight.", safety: "Industrial zones secured.", cost: "12,000 – 25,000 DZD / day" },
    },
    places: {
      tourist: [
        { id: "p-hippo", name: "Hippo Regius", mode: "tourist", filter: "historical", description: "Ancient Roman city where St. Augustine was bishop.", rating: 4.7, reviews: 754 },
        { id: "p-seraidi", name: "Seraïdi Beaches", mode: "tourist", filter: "beaches", description: "Pine-clad cliffs over turquoise Mediterranean.", rating: 4.6, reviews: 442 },
      ],
      student: [],
      investor: [
        { id: "i-port-annaba", name: "Port of Annaba", mode: "investor", filter: "commercial", description: "Major Mediterranean trade port.", rating: 4.3, reviews: 192 },
        { id: "i-elhadjar", name: "El Hadjar Industrial Complex", mode: "investor", filter: "free-zones", description: "Largest steel complex in North Africa.", rating: 4.2, reviews: 71 },
      ],
    },
    guideIds: { tourist: ["g-omar"], student: [], investor: ["g-bilal"] },
  },
  {
    id: "tlemcen",
    name: "Tlemcen",
    nameAr: "تلمسان",
    region: "west",
    lat: 34.8826, lng: -1.315,
    rating: 4.7, reviews: 894,
    highlights: {
      tourist: ["Great Mosque of Tlemcen", "El Mechouar Palace", "Lalla Setti plateau"],
      student: ["University of Tlemcen", "Imama campus", "Student dorms Imama"],
      investor: [],
    },
    tips: {
      tourist: { transport: "Cable car to Lalla Setti.", safety: "Quiet and very safe.", cost: "3,000 – 6,500 DZD / day" },
      student: { transport: "Bus shuttles to Imama campus.", safety: "Calm, ideal for foreign students.", cost: "1,200 – 2,500 DZD / day" },
      investor: { transport: "—", safety: "—", cost: "—" },
    },
    places: {
      tourist: [
        { id: "p-great-mosque", name: "Great Mosque of Tlemcen", mode: "tourist", filter: "historical", description: "12th-century Almoravid masterpiece.", rating: 4.8, reviews: 612 },
      ],
      student: [
        { id: "s-tlemcen-u", name: "University of Tlemcen", mode: "student", filter: "universities", description: "Strong programs in medicine and engineering.", rating: 4.3, reviews: 167 },
        { id: "s-imama", name: "Imama Student Campus", mode: "student", filter: "neighborhoods", description: "Main student neighborhood with dorms and cafés.", rating: 4.1, reviews: 92 },
      ],
      investor: [],
    },
    guideIds: { tourist: ["g-lina"], student: ["g-malik"], investor: [] },
  },
  {
    id: "ghardaia",
    name: "Ghardaïa",
    nameAr: "غرداية",
    region: "south",
    lat: 32.49, lng: 3.67,
    rating: 4.85, reviews: 1003,
    highlights: {
      tourist: ["M'Zab Valley (UNESCO)", "Pentapolis old towns", "Mozabite craftsmanship"],
      student: [],
      investor: [],
    },
    tips: {
      tourist: { transport: "Daily flights from Algiers.", safety: "Respect local customs and dress modestly.", cost: "5,000 – 10,000 DZD / day" },
      student: { transport: "—", safety: "—", cost: "—" },
      investor: { transport: "—", safety: "—", cost: "—" },
    },
    places: {
      tourist: [
        { id: "p-mzab", name: "M'Zab Valley", mode: "tourist", filter: "historical", description: "UNESCO site of five fortified cities.", rating: 4.9, reviews: 887 },
      ],
      student: [],
      investor: [],
    },
    guideIds: { tourist: ["g-sami"], student: [], investor: [] },
  },
  {
    id: "bejaia",
    name: "Béjaïa",
    nameAr: "بجاية",
    region: "north",
    lat: 36.7515, lng: 5.0843,
    rating: 4.7, reviews: 743,
    highlights: {
      tourist: ["Cap Carbon", "Yemma Gouraya National Park", "Aiguades beach"],
      student: [],
      investor: [],
    },
    tips: {
      tourist: { transport: "Coastal road from Algiers (~4h).", safety: "Hike with a local guide.", cost: "3,500 – 7,000 DZD / day" },
      student: { transport: "—", safety: "—", cost: "—" },
      investor: { transport: "—", safety: "—", cost: "—" },
    },
    places: {
      tourist: [
        { id: "p-cap-carbon", name: "Cap Carbon Lighthouse", mode: "tourist", filter: "attractions", description: "Highest natural lighthouse in the Mediterranean.", rating: 4.9, reviews: 612 },
        { id: "p-aiguades", name: "Aiguades Beach", mode: "tourist", filter: "beaches", description: "Hidden cove inside the national park.", rating: 4.7, reviews: 318 },
      ],
      student: [],
      investor: [],
    },
    guideIds: { tourist: [], student: [], investor: [] },
  },
];

export const LIVE_INSIGHTS: LiveInsight[] = [
  // Tourist
  { id: "i-t1", mode: "tourist", type: "trending", title: "Trending: Casbah of Algiers", body: "Up 38% in bookings this week — heritage walks are booking out fast.", city: "Alger" },
  { id: "i-t2", mode: "tourist", type: "recommended", title: "Recommended this week", body: "Sunset at Assekrem plateau — 2-day expedition with Nadia S.", city: "Tamanrasset" },
  { id: "i-t3", mode: "tourist", type: "question", title: "Top question from foreigners", body: "“Do I need a permit to visit the Hoggar?” Yes — your guide arranges it.", city: "Tamanrasset" },
  // Student
  { id: "i-s1", mode: "student", type: "update", title: "Student visa update", body: "Online pre-registration now open for non-resident students at USTHB.", city: "Alger" },
  { id: "i-s2", mode: "student", type: "new-guide", title: "New guide: Leïla A.", body: "Helps foreign students with residence cards and campus onboarding.", city: "Alger" },
  { id: "i-s3", mode: "student", type: "trending", title: "Trending: Imama campus", body: "Tlemcen is up 22% in foreign student inquiries this month.", city: "Tlemcen" },
  // Investor
  { id: "i-i1", mode: "investor", type: "update", title: "New investment law", body: "The 2024 framework allows 100% foreign ownership in priority sectors.", city: "Alger" },
  { id: "i-i2", mode: "investor", type: "new-guide", title: "New guide: Tarek H.", body: "Bilingual lawyer specialized in company setup and tax incentives.", city: "Alger" },
  { id: "i-i3", mode: "investor", type: "trending", title: "Trending: Bethioua zone", body: "Energy and petrochemical projects opening to foreign partners.", city: "Oran" },
];
