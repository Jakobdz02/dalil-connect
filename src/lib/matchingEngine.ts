// Pure AI matching logic. No UI, no React.

export type LanguageLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type SeekerSector = "academic" | "tourism" | "investment" | "general";
export type SessionType = "video" | "chat" | "inperson";

export interface SeekerProfile {
  sector: SeekerSector;
  preferredLanguage: string;
  languageLevelNeeded: LanguageLevel;
  preferredDate?: Date;
  sessionType: SessionType;
  budget?: number;
  description: string;
}

export interface GuideProfile {
  id: string;
  name: string;
  avatar: string;
  sector: string[];
  languages: { language: string; level: LanguageLevel }[];
  rating: number;
  totalSessions: number;
  totalReviews: number;
  availableDates: Date[];
  sessionTypes: SessionType[];
  pricePerHour: number;
  isVerified: boolean;
  bio: string;
  specialties: string[];
}

export interface ScoreBreakdown {
  languageScore: number;
  sectorScore: number;
  ratingScore: number;
  experienceScore: number;
  availabilityScore: number;
}

export interface MatchResult {
  guide: GuideProfile;
  matchScore: number;
  matchReasons: string[];
  scoreBreakdown: ScoreBreakdown;
}

const LEVEL_RANK: Record<LanguageLevel, number> = {
  A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6,
};

function compareLevels(guideLevel: LanguageLevel, needed: LanguageLevel): boolean {
  return LEVEL_RANK[guideLevel] >= LEVEL_RANK[needed];
}

const RELATED: Record<string, string[]> = {
  academic: ["general"],
  tourism: ["general"],
  investment: ["general"],
  general: ["academic", "tourism", "investment"],
};

function isRelatedSector(a: string, b: string): boolean {
  return (RELATED[b] ?? []).includes(a);
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

interface ReasonParams extends ScoreBreakdown {
  seeker: SeekerProfile;
  guide: GuideProfile;
}

export function getMatchReasons(params: ReasonParams): string[] {
  const reasons: string[] = [];
  if (params.languageScore === 30)
    reasons.push(`Speaks ${params.seeker.preferredLanguage} at required level`);
  else if (params.languageScore === 15)
    reasons.push(`Speaks ${params.seeker.preferredLanguage}`);
  if (params.sectorScore === 25)
    reasons.push(`Specialized in ${params.seeker.sector}`);
  else if (params.sectorScore === 12)
    reasons.push(`Related expertise to ${params.seeker.sector}`);
  if (params.ratingScore >= 18)
    reasons.push(`Highly rated (${params.guide.rating.toFixed(1)}★)`);
  if (params.experienceScore >= 12)
    reasons.push(`${params.guide.totalSessions}+ sessions completed`);
  if (params.availabilityScore === 10)
    reasons.push(`Available on your preferred date`);
  if (params.guide.sessionTypes.includes(params.seeker.sessionType))
    reasons.push(`Offers ${params.seeker.sessionType} sessions`);
  return reasons;
}

export function calculateMatchScore(
  seeker: SeekerProfile,
  guide: GuideProfile,
): MatchResult {
  const langMatch = guide.languages.find(
    (l) => l.language.toLowerCase() === seeker.preferredLanguage.toLowerCase(),
  );
  const languageScore = langMatch
    ? compareLevels(langMatch.level, seeker.languageLevelNeeded) ? 30 : 15
    : 0;

  const sectorScore = guide.sector.includes(seeker.sector)
    ? 25
    : guide.sector.some((s) => isRelatedSector(s, seeker.sector))
    ? 12
    : 0;

  const ratingScore = (guide.rating / 5) * 20;
  const experienceScore = Math.min(guide.totalSessions / 10, 15);

  const availabilityScore = seeker.preferredDate
    ? guide.availableDates.some((d) => isSameDay(d, seeker.preferredDate!))
      ? 10 : 0
    : 5;

  const breakdown: ScoreBreakdown = {
    languageScore,
    sectorScore,
    ratingScore,
    experienceScore,
    availabilityScore,
  };

  const matchScore = Math.round(
    languageScore + sectorScore + ratingScore + experienceScore + availabilityScore,
  );

  const matchReasons = getMatchReasons({ ...breakdown, seeker, guide });

  return { guide, matchScore, matchReasons, scoreBreakdown: breakdown };
}

export function rankGuides(
  seeker: SeekerProfile,
  guides: GuideProfile[],
): MatchResult[] {
  return guides
    .filter((g) => g.isVerified)
    .map((g) => calculateMatchScore(seeker, g))
    .sort((a, b) => b.matchScore - a.matchScore);
}
