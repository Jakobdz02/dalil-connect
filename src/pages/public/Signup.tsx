import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Compass, User, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useRecaptcha } from "@/hooks/useRecaptcha";
import { useAgeVerification } from "@/hooks/useAgeVerification";
import { verifyRecaptcha } from "@/lib/recaptcha.functions";
import { HOME_FOR_ROLE } from "@/lib/auth-redirect";

type SignupRole = "seeker" | "guide";

export default function Signup() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getToken } = useRecaptcha();
  const { isAgeValid, minAge, isFutureDate } = useAgeVerification();
  const verifyFn = useServerFn(verifyRecaptcha);

  const [role, setRole] = useState<SignupRole>("seeker");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const dobRef = useRef<HTMLInputElement>(null);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const minDob = useMemo(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 100);
    return d.toISOString().slice(0, 10);
  }, []);

  useEffect(() => {
    if (user) navigate({ to: HOME_FOR_ROLE[role] });
  }, [user, role, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Age checks
    if (!dob) {
      setErrorMsg("Please enter your date of birth.");
      dobRef.current?.focus();
      return;
    }
    if (isFutureDate(dob)) {
      setErrorMsg("Date of birth cannot be in the future.");
      dobRef.current?.focus();
      return;
    }
    if (!isAgeValid(dob, role)) {
      setErrorMsg(
        `You must be at least ${minAge(role)} years old to register as a ${role}.`,
      );
      dobRef.current?.focus();
      return;
    }

    setSubmitting(true);

    // reCAPTCHA v3 — fail open on infra errors, block on low score
    const token = await getToken("signup");
    if (token) {
      try {
        const result = await verifyFn({ data: { token, action: "signup" } });
        if (!result.passed) {
          setErrorMsg("Our system detected unusual activity. Please try again later.");
          setSubmitting(false);
          return;
        }
      } catch (err) {
        console.warn("[signup] recaptcha verify failed — continuing", err);
      }
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { name, role, date_of_birth: dob },
      },
    });
    setSubmitting(false);
    if (error) {
      setErrorMsg(error.message);
      return;
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Compass className="h-5 w-5" />
          </span>
          <span className="font-display text-2xl text-primary">
            DALIL <span className="text-accent text-base">دليل</span>
          </span>
        </Link>

        <div className="rounded-2xl border bg-card p-7 shadow-card">
          <h1 className="font-display text-3xl text-foreground">Join DALIL</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Discover Algeria, or share it with the world.
          </p>

          <div className="grid grid-cols-2 gap-2 mt-6">
            <RoleCard
              active={role === "seeker"}
              onClick={() => setRole("seeker")}
              icon={<User className="h-4 w-4" />}
              title="I'm exploring"
              sub="Find guides"
            />
            <RoleCard
              active={role === "guide"}
              onClick={() => setRole("guide")}
              icon={<MapPin className="h-4 w-4" />}
              title="I'm a guide"
              sub="Welcome travelers"
            />
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dob">Date of birth</Label>
              <Input
                id="dob"
                ref={dobRef}
                type="date"
                required
                min={minDob}
                max={today}
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                minLength={6}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {errorMsg && (
              <p className="text-sm text-destructive" role="alert">{errorMsg}</p>
            )}
            <Button
              type="submit"
              className="w-full h-11 rounded-full"
              disabled={submitting}
            >
              {submitting ? "Creating account…" : "Create account"}
            </Button>
            <p className="text-[11px] text-muted-foreground text-center">
              This site is protected by reCAPTCHA and the Google{" "}
              <a href="https://policies.google.com/privacy" className="underline" target="_blank" rel="noreferrer">Privacy Policy</a>{" "}
              and{" "}
              <a href="https://policies.google.com/terms" className="underline" target="_blank" rel="noreferrer">Terms of Service</a> apply.
            </p>
          </form>

          <p className="text-sm text-muted-foreground text-center mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function RoleCard({
  active,
  onClick,
  icon,
  title,
  sub,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  sub: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left rounded-xl border p-3 transition-all ${
        active
          ? "border-primary bg-primary-soft shadow-card"
          : "border-border bg-card hover:border-primary/40"
      }`}
    >
      <span
        className={`inline-flex h-7 w-7 items-center justify-center rounded-lg ${
          active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        }`}
      >
        {icon}
      </span>
      <div className="mt-2 font-medium text-sm text-foreground">{title}</div>
      <div className="text-xs text-muted-foreground">{sub}</div>
    </button>
  );
}
