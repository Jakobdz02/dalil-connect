import { createFileRoute } from "@tanstack/react-router";
import { RoleGuard } from "@/components/guards/RoleGuard";
import SeekerMessages from "@/pages/seeker/Messages";

export const Route = createFileRoute("/messages")({
  component: () => (
    <RoleGuard allow={["seeker"]}>
      <SeekerMessages />
    </RoleGuard>
  ),
});
