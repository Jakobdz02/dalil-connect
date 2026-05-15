import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "fr" | "de" | "ar";

export const LANGUAGES: { code: Lang; label: string; flag: string; native: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧", native: "English" },
  { code: "fr", label: "French", flag: "🇫🇷", native: "Français" },
  { code: "de", label: "German", flag: "🇩🇪", native: "Deutsch" },
  { code: "ar", label: "Arabic", flag: "🇩🇿", native: "العربية" },
];

type Dict = Record<string, string>;

const TRANSLATIONS: Record<Lang, Dict> = {
  en: {
    "nav.exploreMap": "Explore Map",
    "nav.findGuide": "Find a Guide",
    "nav.myBookings": "My Bookings",
    "nav.bookings": "Bookings",
    "nav.adminPanel": "Admin Panel",
    "nav.login": "Login",
    "nav.signup": "Sign Up",
    "nav.profile": "Profile Settings",
    "nav.signout": "Sign out",
    "nav.language": "Language",
    "footer.tagline": "Connecting Algeria, one guide at a time.",
    "footer.product": "Product",
    "footer.company": "Company",
    "footer.legal": "Legal",
    "footer.findGuide": "Find a Guide",
    "footer.becomeGuide": "Become a Guide",
    "footer.howItWorks": "How it works",
    "footer.about": "About",
    "footer.contact": "Contact",
    "footer.faq": "FAQ",
    "footer.privacy": "Privacy",
    "footer.terms": "Terms",
    "footer.rights": "© 2026 DALIL. All rights reserved.",
    "footer.admin": "Admin",
  },
  fr: {
    "nav.exploreMap": "Explorer la carte",
    "nav.findGuide": "Trouver un guide",
    "nav.myBookings": "Mes réservations",
    "nav.bookings": "Réservations",
    "nav.adminPanel": "Panneau admin",
    "nav.login": "Connexion",
    "nav.signup": "S'inscrire",
    "nav.profile": "Paramètres du profil",
    "nav.signout": "Déconnexion",
    "nav.language": "Langue",
    "footer.tagline": "Connecter l'Algérie, un guide à la fois.",
    "footer.product": "Produit",
    "footer.company": "Société",
    "footer.legal": "Mentions légales",
    "footer.findGuide": "Trouver un guide",
    "footer.becomeGuide": "Devenir guide",
    "footer.howItWorks": "Comment ça marche",
    "footer.about": "À propos",
    "footer.contact": "Contact",
    "footer.faq": "FAQ",
    "footer.privacy": "Confidentialité",
    "footer.terms": "Conditions",
    "footer.rights": "© 2026 DALIL. Tous droits réservés.",
    "footer.admin": "Admin",
  },
  de: {
    "nav.exploreMap": "Karte erkunden",
    "nav.findGuide": "Guide finden",
    "nav.myBookings": "Meine Buchungen",
    "nav.bookings": "Buchungen",
    "nav.adminPanel": "Admin-Bereich",
    "nav.login": "Anmelden",
    "nav.signup": "Registrieren",
    "nav.profile": "Profileinstellungen",
    "nav.signout": "Abmelden",
    "nav.language": "Sprache",
    "footer.tagline": "Algerien verbinden, ein Guide nach dem anderen.",
    "footer.product": "Produkt",
    "footer.company": "Unternehmen",
    "footer.legal": "Rechtliches",
    "footer.findGuide": "Guide finden",
    "footer.becomeGuide": "Guide werden",
    "footer.howItWorks": "So funktioniert's",
    "footer.about": "Über uns",
    "footer.contact": "Kontakt",
    "footer.faq": "FAQ",
    "footer.privacy": "Datenschutz",
    "footer.terms": "AGB",
    "footer.rights": "© 2026 DALIL. Alle Rechte vorbehalten.",
    "footer.admin": "Admin",
  },
  ar: {
    "nav.exploreMap": "استكشف الخريطة",
    "nav.findGuide": "ابحث عن مرشد",
    "nav.myBookings": "حجوزاتي",
    "nav.bookings": "الحجوزات",
    "nav.adminPanel": "لوحة الإدارة",
    "nav.login": "تسجيل الدخول",
    "nav.signup": "إنشاء حساب",
    "nav.profile": "إعدادات الملف الشخصي",
    "nav.signout": "تسجيل الخروج",
    "nav.language": "اللغة",
    "footer.tagline": "نربط الجزائر، مرشدًا تلو الآخر.",
    "footer.product": "المنتج",
    "footer.company": "الشركة",
    "footer.legal": "قانوني",
    "footer.findGuide": "ابحث عن مرشد",
    "footer.becomeGuide": "كن مرشدًا",
    "footer.howItWorks": "كيف يعمل",
    "footer.about": "من نحن",
    "footer.contact": "اتصل بنا",
    "footer.faq": "الأسئلة الشائعة",
    "footer.privacy": "الخصوصية",
    "footer.terms": "الشروط",
    "footer.rights": "© 2026 دليل. جميع الحقوق محفوظة.",
    "footer.admin": "المسؤول",
  },
};

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const Ctx = createContext<I18nCtx | null>(null);
const STORAGE_KEY = "dalil_lang";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY)) as Lang | null;
    if (saved && TRANSLATIONS[saved]) setLangState(saved);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {}
  };

  const t = (key: string) => TRANSLATIONS[lang][key] ?? TRANSLATIONS.en[key] ?? key;

  return (
    <Ctx.Provider value={{ lang, setLang, t, dir: lang === "ar" ? "rtl" : "ltr" }}>
      {children}
    </Ctx.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
