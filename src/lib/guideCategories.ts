export type GuideCategory = "student" | "tourist" | "investor" | "general";

export const GUIDE_CATEGORIES: GuideCategory[] = [
  "student",
  "tourist",
  "investor",
  "general",
];

export const GUIDE_CATEGORY_LABELS: Record<GuideCategory, string> = {
  student: "Student Guide",
  tourist: "Tourist Guide",
  investor: "Investor Guide",
  general: "General Guide",
};

export const GUIDE_SUBCATEGORIES: Record<GuideCategory, string[]> = {
  student: [
    "University Admission Guidance",
    "Scholarship & Grant Navigation",
    "Campus Life & Student Housing",
    "Public University Systems (MESRS)",
    "Private University & Grande École Guidance",
    "Language Institute & CEFL Enrollment",
    "Vocational Training & INFPE Centers",
    "Academic Document Authentication & Legalization",
    "Student Visa & Residence Permit Assistance",
    "City Orientation for New Students",
    "Transportation & Daily Logistics for Students",
    "Health Insurance & CNAS for Students",
    "Part-Time Work & Internship Guidance",
    "Cultural Integration & Social Life",
    "Engineering & Technology Programs",
    "Medicine & Health Sciences Programs",
    "Law & Political Science Programs",
    "Economics & Business Programs",
    "Arts, Literature & Humanities Programs",
    "Architecture & Urban Planning Programs",
    "Agricultural Sciences Programs",
    "Islamic Sciences Programs",
    "Postgraduate (Master / PhD) Guidance",
    "Foreign Student Orientation (specific to non-Arabic speakers)",
    "Erasmus+ & Exchange Program Support",
    "Student Association & Extracurricular Activities",
  ],
  tourist: [
    "Historical & Archeological Sites (Roman ruins, Byzantine, Ottoman)",
    "Sahara Desert Expeditions & Dune Tours",
    "Ahaggar & Tassili N'Ajjer National Park",
    "Coastal & Mediterranean Tours (Oran, Annaba, Béjaïa)",
    "Casbah of Algiers (UNESCO Heritage) Tour",
    "Religious & Cultural Heritage Sites",
    "Berber & Amazigh Cultural Immersion",
    "Traditional Souk & Craft Market Tours",
    "Algerian Cuisine & Food Tours",
    "Desert Camping & Bivouac Experiences",
    "4x4 Off-Road & Adventure Tours",
    "Photography & Landscape Tours",
    "Oasis & Date Palm Village Visits",
    "Mountain Trekking (Djurdjura, Chélia, Atlas)",
    "Spa & Hammam Traditional Wellness Tours",
    "Guided City Walks (Algiers, Oran, Constantine)",
    "Museum & Gallery Tours",
    "Festival & Cultural Event Guidance",
    "Wildlife & Nature Tours (Chréa, Taza, El Kala)",
    "Constantine & Its Bridges (Suspended Bridges) Tour",
    "Tlemcen Heritage & Islamic Architecture",
    "Ghardaïa & M'Zab Valley (UNESCO) Tour",
    "Timgad (Thamugadi) Roman Ruins Tour",
    "Family-Friendly & Kid-Safe Tours",
    "Luxury & Premium Guided Experiences",
    "Budget Backpacker Tour Guidance",
    "Solo Traveler Safety & Orientation",
    "Airport & Border Entry Assistance",
    "Visa on Arrival & Entry Formalities Support",
  ],
  investor: [
    "Real Estate Investment Guidance",
    "Industrial Zone & Free Zone Navigation",
    "Tourism & Hospitality Investment",
    "Agricultural Land & Agri-Business",
    "Startup Ecosystem & Tech Investment",
    "Renewable Energy (Solar, Wind) Projects",
    "Mining & Natural Resources Sector",
    "Import / Export & Trade Facilitation",
    "Franchise & Retail Business Setup",
    "Banking, Finance & Local Currency Guidance",
    "Company Registration & Legal Entity Setup (ANADE, ANDI)",
    "Tax & Customs Regulations Advisory",
    "Government Incentives & Investment Schemes",
    "Joint Venture & Partnership Structuring",
    "Halal Industry & Certification Guidance",
    "Healthcare & Pharmaceutical Investment",
    "Education & Private School Investment",
    "Media, Advertising & Digital Sector",
    "Construction & Infrastructure Projects",
    "Logistics, Ports & Transport Sector",
    "Local Supplier & Procurement Networking",
    "Land Acquisition & Property Law Guidance",
    "Foreign Direct Investment (FDI) Procedures",
    "Algeria-Africa Trade Corridor Opportunities",
    "Algeria-Europe Trade & Export",
    "OPEC & Energy Policy Context Briefing",
  ],
  general: [],
};

// Map legacy/free-text category labels to the new normalized keys.
export function normalizeCategory(value: string | null | undefined): GuideCategory {
  if (!value) return "general";
  const v = value.toLowerCase();
  if (v.includes("student")) return "student";
  if (v.includes("tourist")) return "tourist";
  if (v.includes("investor")) return "investor";
  return "general";
}
