import { createFileRoute } from "@tanstack/react-router";
import Login from "@/pages/public/Login";

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>) => ({
    redirect: typeof s.redirect === "string" ? s.redirect : undefined,
  }),
  component: Login,
});
