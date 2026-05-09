import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  token: z.string().min(10).max(4000),
  action: z.string().min(1).max(64).optional(),
});

export const verifyRecaptcha = createServerFn({ method: "POST" })
  .inputValidator((input) => inputSchema.parse(input))
  .handler(async ({ data }) => {
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    if (!secret) {
      console.warn("[recaptcha] RECAPTCHA_SECRET_KEY missing — failing open");
      return { passed: true, score: null as number | null, reason: "no-secret" };
    }

    try {
      const params = new URLSearchParams({ secret, response: data.token });
      const res = await fetch(
        "https://www.google.com/recaptcha/api/siteverify",
        { method: "POST", body: params },
      );
      const body = (await res.json()) as {
        success?: boolean;
        score?: number;
        action?: string;
        "error-codes"?: string[];
      };
      const score = typeof body.score === "number" ? body.score : null;
      const passed = !!body.success && (score ?? 0) >= 0.5;
      return { passed, score, reason: passed ? "ok" : "low-score" };
    } catch (err) {
      console.error("[recaptcha] verify request failed — failing open", err);
      return { passed: true, score: null, reason: "network-error" };
    }
  });
