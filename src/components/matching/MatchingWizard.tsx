import { useState } from "react";
import { format } from "date-fns";
import {
  GraduationCap, MapPin, Briefcase, Sparkles,
  Video, MessageSquare, Users, ArrowLeft, ArrowRight, Wand2, CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { LANGUAGES } from "@/lib/algeriaData";
import { cn } from "@/lib/utils";
import type {
  LanguageLevel, SeekerProfile, SeekerSector, SessionType,
} from "@/lib/matchingEngine";

const SECTORS: { id: SeekerSector; label: string; icon: typeof Sparkles; desc: string }[] = [
  { id: "academic", label: "Academic", icon: GraduationCap, desc: "University, scholarships, study" },
  { id: "tourism", label: "Tourism", icon: MapPin, desc: "Travel, sightseeing, culture" },
  { id: "investment", label: "Investment", icon: Briefcase, desc: "Business, real estate, trade" },
  { id: "general", label: "General", icon: Sparkles, desc: "Everyday help & orientation" },
];

const LEVELS: LanguageLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

const SESSION_TYPES: { id: SessionType; label: string; icon: typeof Video }[] = [
  { id: "video", label: "Video", icon: Video },
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "inperson", label: "In-person", icon: Users },
];

interface Props {
  onComplete: (profile: SeekerProfile) => void;
}

export function MatchingWizard({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [sector, setSector] = useState<SeekerSector | null>(null);
  const [language, setLanguage] = useState<string>("");
  const [level, setLevel] = useState<LanguageLevel>("B1");
  const [sessionType, setSessionType] = useState<SessionType>("video");
  const [date, setDate] = useState<Date | undefined>();
  const [budget, setBudget] = useState<number>(5000);
  const [description, setDescription] = useState("");

  const total = 3;
  const progress = ((step + 1) / total) * 100;

  const canNext =
    (step === 0 && sector) ||
    (step === 1 && language) ||
    step === 2;

  const submit = () => {
    if (!sector || !language) return;
    onComplete({
      sector,
      preferredLanguage: language,
      languageLevelNeeded: level,
      sessionType,
      preferredDate: date,
      budget,
      description,
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-card border rounded-2xl shadow-card p-6 sm:p-8 space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Step {step + 1} of {total}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step 1 */}
      {step === 0 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
          <div>
            <h2 className="font-display text-2xl text-primary">What do you need help with?</h2>
            <p className="text-sm text-muted-foreground mt-1">Pick the area where you need a guide.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {SECTORS.map((s) => {
              const Icon = s.icon;
              const active = sector === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSector(s.id)}
                  className={cn(
                    "text-start rounded-xl border-2 p-4 transition-all hover:border-primary/60",
                    active ? "border-primary bg-primary/5" : "border-border",
                  )}
                >
                  <Icon className={cn("h-6 w-6 mb-2", active ? "text-primary" : "text-muted-foreground")} />
                  <div className="font-semibold text-sm">{s.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{s.desc}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step === 1 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
          <div>
            <h2 className="font-display text-2xl text-primary">Your language preference</h2>
            <p className="text-sm text-muted-foreground mt-1">We'll match guides who speak your language.</p>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Language</label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger><SelectValue placeholder="Choose a language" /></SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((l) => (
                  <SelectItem key={l.code} value={l.code}>
                    {l.flag} {l.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Proficiency level needed</label>
            <div className="grid grid-cols-6 gap-2">
              {LEVELS.map((lv) => (
                <button
                  key={lv}
                  type="button"
                  onClick={() => setLevel(lv)}
                  className={cn(
                    "h-10 rounded-md border text-sm font-medium transition-colors",
                    level === lv ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/40",
                  )}
                >
                  {lv}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Session type</label>
            <div className="grid grid-cols-3 gap-2">
              {SESSION_TYPES.map((s) => {
                const Icon = s.icon;
                const active = sessionType === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSessionType(s.id)}
                    className={cn(
                      "h-12 rounded-md border flex items-center justify-center gap-2 text-sm font-medium transition-colors",
                      active ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/40",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 2 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
          <div>
            <h2 className="font-display text-2xl text-primary">When are you available?</h2>
            <p className="text-sm text-muted-foreground mt-1">All optional — helps us refine the match.</p>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Preferred date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="me-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date (optional)"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-xs font-medium text-muted-foreground">Budget per hour (DZD)</label>
              <span className="text-xs font-semibold text-primary">{budget.toLocaleString()} DZD</span>
            </div>
            <Slider
              value={[budget]}
              onValueChange={(v) => setBudget(v[0])}
              min={500}
              max={20000}
              step={500}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Describe your situation briefly
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. I'm moving to Algiers next month and need help with university enrollment..."
              rows={4}
            />
          </div>
        </div>
      )}

      {/* Footer buttons */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="ghost"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          <ArrowLeft className="h-4 w-4 me-1" /> Back
        </Button>

        {step < total - 1 ? (
          <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext}>
            Next <ArrowRight className="h-4 w-4 ms-1" />
          </Button>
        ) : (
          <Button onClick={submit} disabled={!sector || !language}>
            <Wand2 className="h-4 w-4 me-1" /> Find My Guide
          </Button>
        )}
      </div>
    </div>
  );
}
