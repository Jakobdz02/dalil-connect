import { createFileRoute } from "@tanstack/react-router";
import { RoleGuard } from "@/components/guards/RoleGuard";
import AdminGuides from "@/pages/admin/Guides";

export const Route = createFileRoute("/admin/guides")({
  component: () => (
    <RoleGuard allow={["admin"]}>
      <AdminGuides />
    </RoleGuard>
  ),
});
