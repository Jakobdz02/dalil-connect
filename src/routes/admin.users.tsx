import { createFileRoute } from "@tanstack/react-router";
import { RoleGuard } from "@/components/guards/RoleGuard";
import AdminUsers from "@/pages/admin/Users";

export const Route = createFileRoute("/admin/users")({
  component: () => (
    <RoleGuard allow={["admin"]}>
      <AdminUsers />
    </RoleGuard>
  ),
});
