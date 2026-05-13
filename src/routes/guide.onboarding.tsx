import { createFileRoute } from "@tanstack/react-router";
import { RoleGuard } from "@/components/guards/RoleGuard";
import GuideOnboarding from "@/pages/guide/Onboarding";

export const Route = createFileRoute("/guide/onboarding")({
  component: () => (
    <RoleGuard allow={["guide"]}>
      <GuideOnboarding />
    </RoleGuard>
  ),
});
