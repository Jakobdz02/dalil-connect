import { createFileRoute } from "@tanstack/react-router";
import { RoleGuard } from "@/components/guards/RoleGuard";
import GuideDashboard from "@/pages/guide/Dashboard";

export const Route = createFileRoute("/guide/dashboard")({
  component: () => (
    <RoleGuard allow={["guide"]}>
      <GuideDashboard />
    </RoleGuard>
  ),
});
