import { createFileRoute } from "@tanstack/react-router";
import { RoleGuard } from "@/components/guards/RoleGuard";
import GuideMessages from "@/pages/guide/Messages";

export const Route = createFileRoute("/guide/messages")({
  component: () => (
    <RoleGuard allow={["guide"]}>
      <GuideMessages />
    </RoleGuard>
  ),
});
