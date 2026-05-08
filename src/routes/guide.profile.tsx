import { createFileRoute } from "@tanstack/react-router";
import { RoleGuard } from "@/components/guards/RoleGuard";
import GuideProfile from "@/pages/guide/Profile";

export const Route = createFileRoute("/guide/profile")({
  component: () => (
    <RoleGuard allow={["guide"]}>
      <GuideProfile />
    </RoleGuard>
  ),
});
