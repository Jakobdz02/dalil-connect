import type { GuideCategory } from "./guideCategories";

export interface SpecGroup {
  label?: string;
  items: string[];
}

export const SPECIALIZATIONS: Record<GuideCategory, SpecGroup[]> = {
  tourist: [
    {
      items: [
        "City tours",
        "Historical sites",
        "Museums",
        "Beaches",
        "Desert trips",
        "Food tours",
        "Cultural experiences",
        "Airport pickup",
        "Transport assistance",
        "Nightlife & entertainment",
        "Family trips",
        "Luxury travel",
        "Budget travel",
      ],
    },
  ],
  investor: [
    {
      items: [
        "Business setup",
        "Market entry",
        "Real estate",
        "Legal procedures",
        "Tax & administrative guidance",
        "Networking",
        "Commercial districts",
        "Industrial zones",
        "Company registration",
        "Local partnerships",
        "Import / Export",
        "Investment opportunities",
      ],
    },
  ],
  student: [
    {
      label: "General Student Support",
      items: [
        "University admission",
        "Specialty choice",
        "Faculty guidance",
        "Campus life",
        "Accommodation",
        "Visa support",
        "Registration procedures",
        "Scholarship help",
        "Language support",
        "Transportation",
        "Student neighborhoods",
        "Academic orientation",
      ],
    },
    {
      label: "Medicine & Health",
      items: [
        "General Medicine",
        "Dentistry",
        "Pharmacy",
        "Veterinary Medicine",
        "Nursing",
        "Public Health",
      ],
    },
    {
      label: "Engineering",
      items: [
        "Civil Engineering",
        "Mechanical Engineering",
        "Electrical Engineering",
        "Electronics & Telecommunications",
        "Industrial Engineering",
        "Petroleum Engineering",
        "Chemical Engineering",
      ],
    },
    {
      label: "Computer Science",
      items: [
        "Software Engineering",
        "Information Systems",
        "Artificial Intelligence",
        "Cybersecurity",
        "Networks & Systems",
        "Data Science",
      ],
    },
    {
      label: "Law",
      items: [
        "Public Law",
        "Private Law",
        "Business Law",
        "International Law",
        "Criminal Law",
      ],
    },
    {
      label: "Economics & Management",
      items: [
        "Economics",
        "Management",
        "Finance & Banking",
        "Accounting",
        "Marketing",
        "Commercial Sciences",
      ],
    },
    {
      label: "Literature & Languages",
      items: [
        "Arabic Literature",
        "French Language",
        "English Language",
        "Spanish Language",
        "German Language",
        "Translation & Interpretation",
        "Amazigh Language & Culture",
      ],
    },
    {
      label: "Social Sciences",
      items: [
        "Sociology",
        "Psychology",
        "Philosophy",
        "History",
        "Geography",
        "Political Science",
        "Communication & Journalism",
      ],
    },
    {
      label: "Natural & Life Sciences",
      items: [
        "Biology",
        "Biochemistry",
        "Chemistry",
        "Physics",
        "Mathematics",
        "Earth Sciences",
        "Environmental Sciences",
      ],
    },
    {
      label: "Architecture & Urbanism",
      items: ["Architecture", "Urban Planning", "Interior Design"],
    },
    {
      label: "Arts",
      items: [
        "Fine Arts",
        "Music",
        "Cinema & Audiovisual",
        "Theatre & Performing Arts",
        "Design",
      ],
    },
  ],
  general: [],
};

export const SPECIALIZATION_HELPER: Record<GuideCategory, string> = {
  tourist: "Choose the type of tourist help you need",
  investor: "Choose the business expertise you need",
  student: "Choose the academic guidance you need",
  general: "",
};

export function flattenSpecializations(category: GuideCategory): string[] {
  return SPECIALIZATIONS[category].flatMap((g) => g.items);
}
