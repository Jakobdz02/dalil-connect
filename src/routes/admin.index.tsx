import { createFileRoute } from "@tanstack/react-router";
import { RoleGuard } from "@/components/guards/RoleGuard";
import AdminDashboard from "@/pages/admin/Dashboard";

export const Route = createFileRoute("/admin/")({
  component: () => (
    <RoleGuard allow={["admin"]}>
      <AdminDashboard />
    </RoleGuard>
  ),
});
