import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Upload, Check, ChevronRight, ChevronLeft, Plus, Trash2, X,
  Shield, FileText, Languages, Briefcase, Calendar, DollarSign,
  User, BadgeCheck, Clock, AlertCircle, ScrollText,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Avatar } from "@/components/shared/Avatar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { WILAYAS, LANGUAGES } from "@/lib/algeriaData";
import {
  GUIDE_CATEGORY_LABELS, GUIDE_SUBCATEGORIES, normalizeCategory,
  type GuideCategory,
} from "@/lib/guideCategories";
import { cn } from "@/lib/utils";

type Status = "draft" | "submitted" | "under_review" | "verified" | "rejected";
type Proficiency = "basic" | "intermediate" | "fluent" | "native";
type DocType =
  | "id_front" | "id_back" | "passport" | "selfie"
  | "diploma" | "training_cert" | "language_cert" | "work_proof" | "other";

interface LangRow { language: string; proficiency: Proficiency }
interface DocRow {
  id?: string;
  doc_type: DocType;
  file_path: string;
  file_name: string;
}

const STEPS = [
  { id: 1, label: "Basic Info", icon: User },
  { id: 2, label: "Consent", icon: ScrollText },
  { id: 3, label: "Identity (KYC)", icon: Shield },
  { id: 4, label: "Languages", icon: Languages },
  { id: 5, label: "Specialization", icon: BadgeCheck },
  { id: 6, label: "Proof Documents", icon: FileText },
  { id: 7, label: "Experience", icon: Briefcase },
  { id: 8, label: "Availability & Price", icon: DollarSign },
] as const;

const TOTAL_STEPS = 8;
const TERMS_VERSION = "2026-05-01";
const PRIVACY_VERSION = "2026-05-01";
const APP_VERSION = "1.0.0";
const COUNTRIES = [
  "Algeria","Morocco","Tunisia","Egypt","Libya","France","Germany","United Kingdom",
  "United States","Canada","Spain","Italy","Turkey","Saudi Arabia","United Arab Emirates",
  "Qatar","Kuwait","Jordan","Lebanon","Syria","China","Japan","India","Other",
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const PROFICIENCIES: Proficiency[] = ["native", "fluent", "intermediate"];

const KYC_TYPES: { id: DocType; label: string }[] = [
  { id: "id_front", label: "ID Card / Passport — Front" },
  { id: "id_back", label: "ID Card — Back" },
  { id: "selfie", label: "Selfie holding document" },
];

const PROOF_TYPES: { id: DocType; label: string }[] = [
  { id: "diploma", label: "University Diploma" },
  { id: "training_cert", label: "Training Certificate" },
  { id: "language_cert", label: "Language Certificate" },
  { id: "work_proof", label: "Work Experience Proof" },
  { id: "other", label: "Other Supporting Document" },
];

export default function GuideOnboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [guideId, setGuideId] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("draft");
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);

  // Step 1
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [wilaya, setWilaya] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  // Step 2 (Consent & Personal Info)
  const [consentId, setConsentId] = useState<string | null>(null);
  const [fullLegalName, setFullLegalName] = useState("");
  const [dob, setDob] = useState("");
  const [nationality, setNationality] = useState("");
  const [countryOfResidence, setCountryOfResidence] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("");
  const [agreeAccurate, setAgreeAccurate] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeKyc, setAgreeKyc] = useState(false);
  const [agreeApproval, setAgreeApproval] = useState(false);

  // Step 3 / 6 (docs)
  const [docs, setDocs] = useState<DocRow[]>([]);

  // Step 3
  const [langs, setLangs] = useState<LangRow[]>([]);

  // Step 4
  const [category, setCategory] = useState<GuideCategory>("tourist");
  const [subcategory, setSubcategory] = useState("");

  // Step 6
  const [yearsExperience, setYearsExperience] = useState("");
  const [workHistory, setWorkHistory] = useState("");
  const [expertise, setExpertise] = useState("");
  const [portfolioLinks, setPortfolioLinks] = useState<string[]>([]);

  // Step 7
  const [workingHoursStart, setWorkingHoursStart] = useState("09:00");
  const [workingHoursEnd, setWorkingHoursEnd] = useState("18:00");
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [sessionType, setSessionType] = useState<"online" | "in_person" | "both">("in_person");
  const [pricePerHour, setPricePerHour] = useState("");

  const subOptions = useMemo(() => GUIDE_SUBCATEGORIES[category] ?? [], [category]);
  const isLocked = status !== "draft" && status !== "rejected";

  // ---------- Load existing ----------
  useEffect(() => {
    if (!user) return;
    setEmail(user.email ?? "");
    (async () => {
      const { data: g } = await supabase
        .from("guide_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (g) {
        setGuideId(g.id);
        setStatus((g.verification_status as Status) ?? "draft");
        setRejectionReason(g.rejection_reason);
        setFullName(g.full_name ?? "");
        setPhone(g.phone ?? "");
        setWilaya(g.wilaya ?? "");
        setCity(g.city ?? "");
        setBio(g.bio ?? g.description ?? "");
        setPhotoUrl(g.photo_url);
        setCategory(normalizeCategory(g.category));
        setSubcategory(g.subcategory ?? "");
        setYearsExperience(g.years_experience != null ? String(g.years_experience) : "");
        setWorkHistory(g.work_history ?? "");
        setExpertise(g.expertise ?? "");
        setPortfolioLinks(g.portfolio_links ?? []);
        setAvailableDays(g.available_days ?? []);
        setSessionType((g.session_type as "online" | "in_person" | "both") ?? "in_person");
        setPricePerHour(g.price_per_hour != null ? String(g.price_per_hour) : "");
        if (g.working_hours && typeof g.working_hours === "object") {
          const wh = g.working_hours as { start?: string; end?: string };
          if (wh.start) setWorkingHoursStart(wh.start);
          if (wh.end) setWorkingHoursEnd(wh.end);
        }

        const { data: l } = await supabase
          .from("guide_languages")
          .select("*")
          .eq("guide_id", g.id);
        setLangs(((l as LangRow[]) ?? []));

        const { data: d } = await supabase
          .from("guide_documents")
          .select("*")
          .eq("guide_id", g.id);
        setDocs(((d as DocRow[]) ?? []));

        const { data: c } = await (supabase as any)
          .from("guide_consents")
          .select("*")
          .eq("guide_id", g.id)
          .maybeSingle();
        if (c) {
          setConsentId(c.id);
          setFullLegalName(c.full_legal_name ?? "");
          setDob(c.date_of_birth ?? "");
          setNationality(c.nationality ?? "");
          setCountryOfResidence(c.country_of_residence ?? "");
          setPreferredLanguage(c.preferred_language ?? "");
          setAgreeAccurate(!!c.accepted_accurate_info);
          setAgreeTerms(!!c.accepted_terms);
          setAgreePrivacy(!!c.accepted_privacy);
          setAgreeKyc(!!c.kyc_consent);
          setAgreeApproval(!!c.understood_approval);
        }
      }
      setLoading(false);
    })();
  }, [user]);

  // Reset specialization when category changes
  useEffect(() => {
    if (subcategory && !subOptions.includes(subcategory)) {
      setSubcategory("");
    }
  }, [category, subOptions, subcategory]);

  // ---------- Helpers ----------
  const ensureGuideRow = async (): Promise<string | null> => {
    if (!user) return null;
    if (guideId) return guideId;
    const { data, error } = await supabase
      .from("guide_profiles")
      .insert({
        user_id: user.id,
        full_name: fullName || (user.email ?? "Guide"),
        city: city || "—",
        languages: [],
        category,
        verification_status: "draft",
      })
      .select("id")
      .single();
    if (error) {
      toast.error(error.message);
      return null;
    }
    setGuideId(data.id);
    return data.id;
  };

  const saveStep = async (silent = false): Promise<boolean> => {
    if (!user) return false;
    setSaving(true);
    const gid = await ensureGuideRow();
    if (!gid) { setSaving(false); return false; }

    const payload = {
      full_name: fullName,
      phone: phone || null,
      wilaya: wilaya || null,
      city,
      bio: bio || null,
      description: bio || null,
      photo_url: photoUrl,
      category,
      subcategory: subcategory || null,
      languages: langs.map((l) => l.language),
      years_experience: yearsExperience ? Number(yearsExperience) : null,
      work_history: workHistory || null,
      expertise: expertise || null,
      portfolio_links: portfolioLinks,
      working_hours: { start: workingHoursStart, end: workingHoursEnd },
      available_days: availableDays,
      session_type: sessionType,
      price_per_hour: pricePerHour ? Number(pricePerHour) : null,
    };
    const { error } = await supabase
      .from("guide_profiles")
      .update(payload)
      .eq("id", gid);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return false;
    }
    if (!silent) toast.success("Saved");
    return true;
  };

  // ---------- Photo upload (public bucket) ----------
  const photoInputRef = useRef<HTMLInputElement>(null);
  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${user.id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("guide-photos").upload(path, file, {
      upsert: true, contentType: file.type,
    });
    if (error) return toast.error(error.message);
    const { data } = supabase.storage.from("guide-photos").getPublicUrl(path);
    setPhotoUrl(data.publicUrl);
    toast.success("Photo uploaded");
  };

  // ---------- Document upload (private bucket) ----------
  const uploadDoc = async (file: File, docType: DocType): Promise<void> => {
    if (!user) return;
    const gid = await ensureGuideRow();
    if (!gid) return;
    const ext = file.name.split(".").pop() ?? "bin";
    const safeName = file.name.replace(/[^\w.\-]/g, "_");
    const path = `${user.id}/${docType}-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("guide-documents")
      .upload(path, file, { contentType: file.type, upsert: false });
    if (upErr) { toast.error(upErr.message); return; }

    const { data, error } = await supabase
      .from("guide_documents")
      .insert({
        guide_id: gid,
        doc_type: docType,
        file_path: path,
        file_name: safeName,
      })
      .select("*")
      .single();
    if (error) { toast.error(error.message); return; }
    setDocs((cur) => [...cur, data as DocRow]);
    toast.success("Document uploaded");
  };

  const removeDoc = async (doc: DocRow) => {
    if (!doc.id) return;
    await supabase.storage.from("guide-documents").remove([doc.file_path]);
    await supabase.from("guide_documents").delete().eq("id", doc.id);
    setDocs((cur) => cur.filter((d) => d.id !== doc.id));
  };

  // ---------- Languages ----------
  const addLang = () => setLangs((c) => [...c, { language: "", proficiency: "intermediate" }]);
  const updateLang = (i: number, patch: Partial<LangRow>) =>
    setLangs((c) => c.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
  const removeLang = (i: number) => setLangs((c) => c.filter((_, idx) => idx !== i));

  const persistLanguages = async () => {
    if (!guideId) return false;
    await supabase.from("guide_languages").delete().eq("guide_id", guideId);
    const valid = langs.filter((l) => l.language);
    if (valid.length > 0) {
      const { error } = await supabase
        .from("guide_languages")
        .insert(valid.map((l) => ({ ...l, guide_id: guideId })));
      if (error) { toast.error(error.message); return false; }
    }
    return true;
  };

  // ---------- Consent persistence ----------
  const persistConsent = async (): Promise<boolean> => {
    if (!user) return false;
    const gid = await ensureGuideRow();
    if (!gid) return false;
    let ip: string | null = null;
    try {
      const r = await fetch("https://api.ipify.org?format=json");
      if (r.ok) ip = (await r.json())?.ip ?? null;
    } catch { /* ignore */ }
    const payload = {
      guide_id: gid,
      user_id: user.id,
      full_legal_name: fullLegalName.trim(),
      date_of_birth: dob,
      nationality: nationality.trim(),
      country_of_residence: countryOfResidence.trim(),
      city: city.trim(),
      phone: phone.trim(),
      preferred_language: preferredLanguage.trim(),
      accepted_accurate_info: agreeAccurate,
      accepted_terms: agreeTerms,
      accepted_privacy: agreePrivacy,
      kyc_consent: agreeKyc,
      understood_approval: agreeApproval,
      terms_version: TERMS_VERSION,
      privacy_version: PRIVACY_VERSION,
      consent_ip: ip,
      app_version: APP_VERSION,
      consented_at: new Date().toISOString(),
    };
    const client = supabase as any;
    if (consentId) {
      const { error } = await client.from("guide_consents").update(payload).eq("id", consentId);
      if (error) { toast.error(error.message); return false; }
    } else {
      const { data, error } = await client.from("guide_consents").insert(payload).select("id").single();
      if (error) { toast.error(error.message); return false; }
      setConsentId(data.id);
    }
    return true;
  };

  // ---------- Validation per step ----------
  const validate = (s: number): string | null => {
    if (s === 1) {
      if (!fullName.trim()) return "Full name is required";
      if (!phone.trim()) return "Phone is required";
      if (!wilaya) return "Wilaya is required";
      if (!city.trim()) return "City is required";
      if (!bio.trim() || bio.length < 30) return "Bio must be at least 30 characters";
      if (!photoUrl) return "Profile photo is required";
    }
    if (s === 2) {
      if (!fullLegalName.trim()) return "Full legal name is required";
      if (!dob) return "Date of birth is required";
      if (!nationality.trim()) return "Nationality is required";
      if (!countryOfResidence.trim()) return "Country of residence is required";
      if (!city.trim()) return "City is required";
      if (!phone.trim()) return "Phone number is required";
      if (!preferredLanguage.trim()) return "Preferred language is required";
      if (!agreeAccurate) return "Please confirm your information is accurate";
      if (!agreeTerms) return "You must agree to the Terms of Service";
      if (!agreePrivacy) return "You must confirm you've read the Privacy Policy";
      if (!agreeKyc) return "KYC consent is required to continue";
      if (!agreeApproval) return "Please confirm you understand the verification requirement";
    }
    if (s === 3) {
      const has = (t: DocType) => docs.some((d) => d.doc_type === t);
      if (!has("id_front")) return "ID/passport front is required";
      if (!has("selfie")) return "Selfie verification is required";
    }
    if (s === 4) {
      if (langs.length === 0) return "Add at least one language";
      if (langs.some((l) => !l.language)) return "Pick a language for every row";
    }
    if (s === 5) {
      if (!["tourist", "student", "investor"].includes(category))
        return "Choose Tourist, Student or Investor";
      if (!subcategory) return "Specialization is required";
    }
    if (s === 7) {
      if (!yearsExperience || Number(yearsExperience) < 0) return "Years of experience is required";
      if (!expertise.trim()) return "Expertise description is required";
    }
    if (s === 8) {
      if (availableDays.length === 0) return "Pick at least one available day";
      if (!pricePerHour || Number(pricePerHour) <= 0) return "Price per hour is required";
    }
    return null;
  };

  const goNext = async () => {
    const err = validate(step);
    if (err) return toast.error(err);
    const ok = await saveStep(true);
    if (!ok) return;
    if (step === 2) {
      const cok = await persistConsent();
      if (!cok) return;
    }
    if (step === 4) await persistLanguages();
    setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  };

  const submit = async () => {
    for (let s = 1; s <= TOTAL_STEPS; s++) {
      const err = validate(s);
      if (err) { setStep(s); return toast.error(err); }
    }
    if (!guideId) return;
    setSaving(true);
    await saveStep(true);
    await persistConsent();
    await persistLanguages();
    const { error } = await supabase
      .from("guide_profiles")
      .update({
        verification_status: "submitted",
        submitted_at: new Date().toISOString(),
        rejection_reason: null,
      })
      .eq("id", guideId);
    setSaving(false);
    if (error) return toast.error(error.message);
    setStatus("submitted");
    toast.success("Submitted for review");
    navigate({ to: "/guide/dashboard" });
  };

  if (loading) return <PageWrapper><LoadingSpinner fullPage /></PageWrapper>;

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto py-8 sm:py-10 px-4">
        <header className="mb-6">
          <h1 className="font-display text-3xl sm:text-4xl text-primary">Guide Onboarding</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Complete every step to submit your application for verification.
          </p>
        </header>

        <StatusBanner status={status} reason={rejectionReason} />

        {/* Stepper */}
        <nav className="my-6 -mx-4 px-4 overflow-x-auto">
          <ol className="flex gap-2 min-w-max">
            {STEPS.map((s) => {
              const Icon = s.icon;
              const active = s.id === step;
              const done = s.id < step;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    disabled={isLocked}
                    onClick={() => setStep(s.id)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-full text-xs sm:text-sm border transition-colors",
                      active && "bg-primary text-primary-foreground border-primary",
                      !active && done && "bg-primary/10 text-primary border-primary/30",
                      !active && !done && "bg-card text-muted-foreground border-border",
                      isLocked && "opacity-60 cursor-not-allowed",
                    )}
                  >
                    <span className="grid place-items-center w-5 h-5 rounded-full bg-background/40 text-[10px] font-semibold">
                      {done ? <Check className="h-3 w-3" /> : s.id}
                    </span>
                    <Icon className="h-3.5 w-3.5" />
                    <span className="whitespace-nowrap">{s.label}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="rounded-2xl border bg-card p-5 sm:p-7 shadow-card">
          <fieldset disabled={isLocked} className={cn(isLocked && "opacity-70")}>
            {step === 1 && (
              <Section title="Basic profile information" desc="Tell us who you are.">
                <div className="flex items-center gap-4">
                  <Avatar src={photoUrl ?? undefined} name={fullName || "Guide"} size="lg" />
                  <div>
                    <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
                    <Button type="button" variant="outline" size="sm" onClick={() => photoInputRef.current?.click()}>
                      <Upload className="h-4 w-4 me-2" />
                      {photoUrl ? "Change photo" : "Upload profile photo"}
                    </Button>
                  </div>
                </div>
                <Field label="Full name" required>
                  <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </Field>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Phone number" required>
                    <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+213 ..." />
                  </Field>
                  <Field label="Email">
                    <Input value={email} disabled />
                  </Field>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Wilaya" required>
                    <Select value={wilaya} onValueChange={setWilaya}>
                      <SelectTrigger><SelectValue placeholder="Select wilaya" /></SelectTrigger>
                      <SelectContent className="max-h-72">
                        {WILAYAS.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="City / Commune" required>
                    <Input value={city} onChange={(e) => setCity(e.target.value)} />
                  </Field>
                </div>
                <Field label="Bio" required hint={`${bio.length}/600`}>
                  <Textarea rows={4} maxLength={600} value={bio} onChange={(e) => setBio(e.target.value)}
                    placeholder="Briefly introduce yourself, your background and what makes you a great guide." />
                </Field>
              </Section>
            )}

            {step === 2 && (
              <Section title="Personal information & consent"
                desc="Before uploading any identity document, review your information and accept our legal terms.">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Full legal name" required>
                    <Input value={fullLegalName} onChange={(e) => setFullLegalName(e.target.value)}
                      placeholder="Exactly as shown on your ID" />
                  </Field>
                  <Field label="Date of birth" required>
                    <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)}
                      max={new Date().toISOString().slice(0, 10)} />
                  </Field>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Nationality" required>
                    <Select value={nationality} onValueChange={setNationality}>
                      <SelectTrigger><SelectValue placeholder="Select nationality" /></SelectTrigger>
                      <SelectContent className="max-h-72">
                        {COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Country of residence" required>
                    <Select value={countryOfResidence} onValueChange={setCountryOfResidence}>
                      <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                      <SelectContent className="max-h-72">
                        {COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="City" required>
                    <Input value={city} onChange={(e) => setCity(e.target.value)} />
                  </Field>
                  <Field label="Phone number" required>
                    <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                      placeholder="+213 ..." />
                  </Field>
                </div>
                <Field label="Preferred language" required>
                  <Select value={preferredLanguage} onValueChange={setPreferredLanguage}>
                    <SelectTrigger><SelectValue placeholder="Select preferred language" /></SelectTrigger>
                    <SelectContent className="max-h-72">
                      {LANGUAGES.map((opt) => (
                        <SelectItem key={opt.code} value={opt.code}>{opt.flag} {opt.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <div className="rounded-xl border bg-background/50 p-4 space-y-3">
                  <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                    <ScrollText className="h-4 w-4" /> Required agreements
                  </h3>
                  <ConsentRow checked={agreeAccurate} onChange={setAgreeAccurate}>
                    I confirm that all information I provide is accurate and truthful.
                  </ConsentRow>
                  <ConsentRow checked={agreeTerms} onChange={setAgreeTerms}>
                    I agree to the{" "}
                    <Link to="/terms" target="_blank" className="text-primary underline">
                      Terms of Service
                    </Link>.
                  </ConsentRow>
                  <ConsentRow checked={agreePrivacy} onChange={setAgreePrivacy}>
                    I have read the{" "}
                    <Link to="/privacy" target="_blank" className="text-primary underline">
                      Privacy Policy
                    </Link>.
                  </ConsentRow>
                  <ConsentRow checked={agreeKyc} onChange={setAgreeKyc}>
                    I consent to DALIL processing my personal data and identity documents for
                    identity verification (KYC), fraud prevention, trust &amp; safety, and
                    compliance purposes.
                  </ConsentRow>
                  <ConsentRow checked={agreeApproval} onChange={setAgreeApproval}>
                    I understand that my guide profile cannot be approved until identity
                    verification is completed.
                  </ConsentRow>
                  <p className="text-[11px] text-muted-foreground pt-2 border-t">
                    Terms v{TERMS_VERSION} · Privacy v{PRIVACY_VERSION} · App v{APP_VERSION}.
                    Your acceptance and technical details (timestamp, IP address when available)
                    are recorded for compliance.
                  </p>
                </div>
              </Section>
            )}

            {step === 3 && (
              <Section title="Identity verification (KYC)"
                desc="Upload clear photos of your ID document and a selfie. Documents are private and only visible to verification admins.">
                <div className="space-y-4">
                  {KYC_TYPES.map((k) => (
                    <DocUploader key={k.id} label={k.label} docType={k.id} docs={docs}
                      onUpload={uploadDoc} onRemove={removeDoc} required />
                  ))}
                  <DocUploader label="ID Card — Back (optional for passport)" docType="id_back" docs={docs}
                    onUpload={uploadDoc} onRemove={removeDoc} />
                </div>
                <p className="text-xs text-muted-foreground flex items-start gap-2 mt-2">
                  <Shield className="h-4 w-4 mt-0.5" />
                  Your KYC documents are encrypted at rest and never shown to clients.
                </p>
              </Section>
            )}

            {step === 4 && (
              <Section title="Languages you speak"
                desc="Add every language and your proficiency. This drives client matching.">
                <div className="space-y-3">
                  {langs.length === 0 && (
                    <p className="text-sm text-muted-foreground">No languages added yet.</p>
                  )}
                  {langs.map((l, i) => (
                    <div key={i} className="flex flex-wrap items-end gap-2">
                      <div className="flex-1 min-w-[180px]">
                        <Label className="text-xs">Language</Label>
                        <Select value={l.language} onValueChange={(v) => updateLang(i, { language: v })}>
                          <SelectTrigger><SelectValue placeholder="Select language" /></SelectTrigger>
                          <SelectContent>
                            {LANGUAGES.map((opt) => (
                              <SelectItem key={opt.code} value={opt.code} disabled={langs.some((x, j) => j !== i && x.language === opt.code)}>
                                {opt.flag} {opt.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-40">
                        <Label className="text-xs">Proficiency</Label>
                        <Select value={l.proficiency} onValueChange={(v) => updateLang(i, { proficiency: v as Proficiency })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {PROFICIENCIES.map((p) => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeLang(i)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={addLang}>
                    <Plus className="h-4 w-4 me-1" /> Add language
                  </Button>
                </div>
              </Section>
            )}

            {step === 5 && (
              <Section title="Category & specialization"
                desc="Pick the single category that defines your service. The available specializations depend on it.">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(["tourist", "student", "investor"] as GuideCategory[]).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => { setCategory(c); setSubcategory(""); }}
                      className={cn(
                        "rounded-xl border p-4 text-left transition-all",
                        category === c
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                          : "border-border hover:border-primary/40",
                      )}
                    >
                      <div className="font-display text-lg text-foreground">
                        {GUIDE_CATEGORY_LABELS[c]}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {c === "tourist" && "Heritage, desert, cultural & city tours"}
                        {c === "student" && "Universities, admissions & academic life"}
                        {c === "investor" && "Business setup, real estate & sectors"}
                      </div>
                    </button>
                  ))}
                </div>
                <Field label="Specialization" required>
                  <Select value={subcategory} onValueChange={setSubcategory}>
                    <SelectTrigger><SelectValue placeholder="Select your specialization" /></SelectTrigger>
                    <SelectContent className="max-h-72">
                      {subOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
              </Section>
            )}

            {step === 6 && (
              <Section title="Proof documents"
                desc="Upload diplomas, certificates and any documents that prove your specialization. Optional but strongly recommended.">
                {PROOF_TYPES.map((k) => (
                  <DocUploader key={k.id} label={k.label} docType={k.id} docs={docs}
                    onUpload={uploadDoc} onRemove={removeDoc} multiple />
                ))}
              </Section>
            )}

            {step === 7 && (
              <Section title="Experience" desc="Help admins and clients understand your background.">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Years of experience" required>
                    <Input type="number" min={0} value={yearsExperience}
                      onChange={(e) => setYearsExperience(e.target.value)} />
                  </Field>
                </div>
                <Field label="Previous work history">
                  <Textarea rows={3} value={workHistory} onChange={(e) => setWorkHistory(e.target.value)}
                    placeholder="Companies, agencies or projects you've worked with." />
                </Field>
                <Field label="Expertise description" required>
                  <Textarea rows={3} value={expertise} onChange={(e) => setExpertise(e.target.value)}
                    placeholder="What exactly do you help clients with?" />
                </Field>
                <Field label="Portfolio links (optional)">
                  <DynamicLinks values={portfolioLinks} onChange={setPortfolioLinks} />
                </Field>
              </Section>
            )}

            {step === 8 && (
              <Section title="Availability & pricing" desc="Set when you work and what you charge.">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Working hours — start">
                    <Input type="time" value={workingHoursStart} onChange={(e) => setWorkingHoursStart(e.target.value)} />
                  </Field>
                  <Field label="Working hours — end">
                    <Input type="time" value={workingHoursEnd} onChange={(e) => setWorkingHoursEnd(e.target.value)} />
                  </Field>
                </div>
                <Field label="Available days" required>
                  <div className="flex flex-wrap gap-2">
                    {DAYS.map((d) => {
                      const active = availableDays.includes(d);
                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={() =>
                            setAvailableDays((cur) =>
                              cur.includes(d) ? cur.filter((x) => x !== d) : [...cur, d],
                            )
                          }
                          className={cn(
                            "px-3 py-1.5 rounded-full text-sm border",
                            active
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-card text-foreground border-border hover:border-primary/40",
                          )}
                        >
                          {d}
                        </button>
                      );
                    })}
                  </div>
                </Field>
                <Field label="Session type" required>
                  <Select value={sessionType} onValueChange={(v) => setSessionType(v as "online" | "in_person" | "both")}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in_person">In-person</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Price per hour (DZD)" required>
                  <Input type="number" min={0} value={pricePerHour}
                    onChange={(e) => setPricePerHour(e.target.value)} />
                </Field>
              </Section>
            )}
          </fieldset>

          {/* Footer nav */}
          {!isLocked && (
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 pt-5 border-t">
              <Button
                type="button" variant="outline"
                disabled={step === 1 || saving}
                onClick={() => setStep((s) => Math.max(1, s - 1))}
              >
                <ChevronLeft className="h-4 w-4 me-1" /> Back
              </Button>
              <div className="flex gap-2">
                <Button type="button" variant="ghost" onClick={() => saveStep()} disabled={saving}>
                  Save draft
                </Button>
                {step < TOTAL_STEPS ? (
                  <Button type="button" onClick={goNext} disabled={saving}>
                    Continue <ChevronRight className="h-4 w-4 ms-1" />
                  </Button>
                ) : (
                  <Button type="button" onClick={submit} disabled={saving}>
                    Submit for verification
                  </Button>
                )}
              </div>
            </div>
          )}

          {isLocked && (
            <div className="mt-6 text-center">
              <Link to="/guide/dashboard"><Button variant="outline">Back to dashboard</Button></Link>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}

// ---------- Subcomponents ----------

function StatusBanner({ status, reason }: { status: Status; reason: string | null }) {
  if (status === "draft") return null;
  const cfg = {
    submitted: { tone: "bg-blue-50 text-blue-900 border-blue-200", icon: Clock, label: "Submitted — waiting for review" },
    under_review: { tone: "bg-amber-50 text-amber-900 border-amber-200", icon: Clock, label: "Under review by admin" },
    verified: { tone: "bg-green-50 text-green-900 border-green-200", icon: BadgeCheck, label: "Verified — your profile is live" },
    rejected: { tone: "bg-red-50 text-red-900 border-red-200", icon: AlertCircle, label: "Rejected — please review and resubmit" },
  }[status];
  const Icon = cfg.icon;
  return (
    <div className={cn("rounded-xl border p-4 flex items-start gap-3", cfg.tone)}>
      <Icon className="h-5 w-5 mt-0.5" />
      <div className="text-sm">
        <div className="font-semibold">{cfg.label}</div>
        {reason && status === "rejected" && (
          <p className="mt-1 opacity-90">Reason: {reason}</p>
        )}
      </div>
    </div>
  );
}

function Section({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground mt-0.5">{desc}</p>
      </div>
      {children}
    </div>
  );
}

function Field({
  label, required, hint, children,
}: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function DocUploader({
  label, docType, docs, onUpload, onRemove, required, multiple,
}: {
  label: string;
  docType: DocType;
  docs: DocRow[];
  onUpload: (f: File, t: DocType) => Promise<void>;
  onRemove: (d: DocRow) => Promise<void>;
  required?: boolean;
  multiple?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const items = docs.filter((d) => d.doc_type === docType);

  return (
    <div className="rounded-xl border bg-background/50 p-4 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <Label className="text-sm">
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
        <input
          ref={inputRef} type="file" className="hidden"
          accept="image/*,application/pdf"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onUpload(f, docType);
            if (inputRef.current) inputRef.current.value = "";
          }}
        />
        {(multiple || items.length === 0) && (
          <Button type="button" size="sm" variant="outline" onClick={() => inputRef.current?.click()}>
            <Upload className="h-4 w-4 me-1" /> Upload
          </Button>
        )}
      </div>
      {items.length > 0 && (
        <ul className="space-y-1.5">
          {items.map((d) => (
            <li key={d.id ?? d.file_path} className="flex items-center justify-between gap-2 text-sm bg-card border rounded-lg px-3 py-2">
              <span className="truncate flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                {d.file_name}
              </span>
              <button type="button" onClick={() => onRemove(d)} className="text-muted-foreground hover:text-destructive">
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function DynamicLinks({ values, onChange }: { values: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="space-y-2">
      {values.map((v, i) => (
        <div key={i} className="flex gap-2">
          <Input value={v} onChange={(e) => onChange(values.map((x, j) => (j === i ? e.target.value : x)))} placeholder="https://..." />
          <Button type="button" variant="ghost" size="icon" onClick={() => onChange(values.filter((_, j) => j !== i))}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => onChange([...values, ""])}>
        <Plus className="h-4 w-4 me-1" /> Add link
      </Button>
    </div>
  );
}
