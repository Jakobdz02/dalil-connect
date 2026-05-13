import alger from "@/assets/cities/alger.jpg";
import oran from "@/assets/cities/oran.jpg";
import constantine from "@/assets/cities/constantine.jpg";
import tamanrasset from "@/assets/cities/tamanrasset.jpg";
import annaba from "@/assets/cities/annaba.jpg";
import tlemcen from "@/assets/cities/tlemcen.jpg";
import ghardaia from "@/assets/cities/ghardaia.jpg";
import bejaia from "@/assets/cities/bejaia.jpg";

import studentAlger from "@/assets/cities/student-alger.jpg";
import studentOran from "@/assets/cities/student-oran.jpg";
import studentConstantine from "@/assets/cities/student-constantine.jpg";
import studentTlemcen from "@/assets/cities/student-tlemcen.jpg";

import investorAlger from "@/assets/cities/investor-alger.jpg";
import investorOran from "@/assets/cities/investor-oran.jpg";
import investorConstantine from "@/assets/cities/investor-constantine.jpg";
import investorAnnaba from "@/assets/cities/investor-annaba.jpg";

import type { AudienceType } from "@/lib/algeriaMapData";

// Default (tourist-flavored) imagery used as fallback.
export const CITY_IMAGES: Record<string, string> = {
  alger,
  oran,
  constantine,
  tamanrasset,
  annaba,
  tlemcen,
  ghardaia,
  bejaia,
};

// Mode-specific imagery. Falls back to CITY_IMAGES (tourist) when no
// dedicated photo exists for that city in the chosen mode.
const STUDENT_IMAGES: Record<string, string> = {
  alger: studentAlger,
  oran: studentOran,
  constantine: studentConstantine,
  tlemcen: studentTlemcen,
};

const INVESTOR_IMAGES: Record<string, string> = {
  alger: investorAlger,
  oran: investorOran,
  constantine: investorConstantine,
  annaba: investorAnnaba,
};

export const CITY_IMAGES_BY_MODE: Record<AudienceType, Record<string, string>> = {
  tourist: CITY_IMAGES,
  student: STUDENT_IMAGES,
  investor: INVESTOR_IMAGES,
};

export function getCityImage(cityId: string, mode: AudienceType): string {
  return CITY_IMAGES_BY_MODE[mode][cityId] ?? CITY_IMAGES[cityId] ?? "";
}
