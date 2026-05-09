import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Avatar } from "@/components/shared/Avatar";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { WILAYAS, LANGUAGES } from "@/lib/algeriaData";
import {
  GUIDE_CATEGORIES,
  GUIDE_CATEGORY_LABELS,
  GUIDE_SUBCATEGORIES,
  normalizeCategory,
  type GuideCategory,
} from "@/lib/guideCategories";
import type { GuideProfile } from "@/types";

export default function GuideProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [existing, setExisting] = useState<GuideProfile | null>(null);

  const [fullName, setFullName] = useState("");
  const [city, setCity] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);
  const [category, setCategory] = useState<GuideCategory>("general");
  const [subcategory, setSubcategory] = useState<string>("");
  const [description, setDescription] = useState("");
  const [pricePerDay, setPricePerDay] = useState<string>("");
  const [availability, setAvailability] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const subOptions = useMemo(() => GUIDE_SUBCATEGORIES[category], [category]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("guide_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data) {
        const g = data as GuideProfile;
        setExisting(g);
        setFullName(g.full_name);
        setCity(g.city);
        setLanguages(g.languages ?? []);
        setCategory(normalizeCategory(g.category));
        setSubcategory(g.subcategory ?? "");
        setDescription(g.description ?? "");
        setPricePerDay(g.price_per_day != null ? String(g.price_per_day) : "");
        setAvailability(g.availability ?? "");
        setPhotoUrl(g.photo_url);
      }
      setLoading(false);
    })();
  }, [user]);

  const toggleLang = (code: string) =>
    setLanguages((cur) =>
      cur.includes(code) ? cur.filter((x) => x !== code) : [...cur, code],
    );

  const handleCategoryChange = (next: GuideCategory) => {
    setCategory(next);
    setSubcategory("");
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${user.id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("guide-photos").upload(path, file, {
      upsert: true,
      contentType: file.type,
    });
    if (error) {
      toast.error(error.message);
    } else {
      const { data } = supabase.storage.from("guide-photos").getPublicUrl(path);
      setPhotoUrl(data.publicUrl);
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setErrorMsg(null);
    if (!city) {
      setErrorMsg("Please select your wilaya.");
      return;
    }
    if (languages.length === 0) {
      setErrorMsg("Please select at least one language you speak.");
      return;
    }
    if (subOptions.length > 0 && !subcategory) {
      setErrorMsg("Please select your specialization.");
      return;
    }
    setSubmitting(true);
    const payload = {
      user_id: user.id,
      full_name: fullName,
      city,
      languages,
      category,
      subcategory: subOptions.length > 0 ? subcategory : null,
      description: description || null,
      price_per_day: pricePerDay ? Number(pricePerDay) : null,
      availability: availability || null,
      photo_url: photoUrl,
    };
    const { error } = await supabase
      .from("guide_profiles")
      .upsert(payload, { onConflict: "user_id" });
    setSubmitting(false);
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    toast.success(existing ? "Profile updated" : "Profile created");
    navigate({ to: "/guide/dashboard" });
  };

  if (loading) {
    return <PageWrapper><LoadingSpinner fullPage /></PageWrapper>;
  }

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto py-10">
        <h1 className="font-display text-3xl text-primary mb-1">
          {existing ? "Edit your profile" : "Create your guide profile"}
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          Tell travelers what makes you the right guide.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border bg-card p-6 shadow-card">
          {/* Photo */}
          <div className="flex items-center gap-4">
            <Avatar src={photoUrl ?? undefined} name={fullName || "Guide"} size="lg" />
            <div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFile}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
              >
                <Upload className="h-4 w-4 me-2" />
                {uploading ? "Uploading…" : photoUrl ? "Change photo" : "Upload photo"}
              </Button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label>Wilaya</Label>
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger><SelectValue placeholder="-- Select your Wilaya --" /></SelectTrigger>
              <SelectContent className="max-h-72">
                {WILAYAS.map((w) => (
                  <SelectItem key={w} value={w}>{w}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Languages spoken</Label>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((lang) => {
                const active = languages.includes(lang.code);
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => toggleLang(lang.code)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      active
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-foreground border-border hover:border-primary/40"
                    }`}
                  >
                    <span className="me-1">{lang.flag}</span>{lang.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select value={category} onValueChange={(v) => handleCategoryChange(v as GuideCategory)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {GUIDE_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>{GUIDE_CATEGORY_LABELS[c]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {subOptions.length > 0 && (
            <div className="space-y-1.5">
              <Label>Specialization</Label>
              <Select value={subcategory} onValueChange={setSubcategory}>
                <SelectTrigger><SelectValue placeholder="-- Select your specialization --" /></SelectTrigger>
                <SelectContent className="max-h-72">
                  {subOptions.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              required
              maxLength={500}
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">{description.length}/500</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="price">Price per day (DZD)</Label>
              <Input
                id="price"
                type="number"
                min={0}
                required
                value={pricePerDay}
                onChange={(e) => setPricePerDay(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="availability">Availability</Label>
              <Input
                id="availability"
                placeholder="e.g. Weekdays only"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
              />
            </div>
          </div>

          {errorMsg && <p className="text-sm text-destructive">{errorMsg}</p>}

          <Button type="submit" className="w-full h-11 rounded-full" disabled={submitting}>
            {submitting ? "Saving…" : existing ? "Save changes" : "Create profile"}
          </Button>
        </form>
      </div>
    </PageWrapper>
  );
}
