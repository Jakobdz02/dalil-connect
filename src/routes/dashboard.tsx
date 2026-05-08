import { createFileRoute } from "@tanstack/react-router";
import { RoleGuard } from "@/components/guards/RoleGuard";
import SeekerDashboard from "@/pages/seeker/Dashboard";

export const Route = createFileRoute("/dashboard")({
  component: () => (
    <RoleGuard allow={["seeker"]}>
      <SeekerDashboard />
    </RoleGuard>
  ),
});
