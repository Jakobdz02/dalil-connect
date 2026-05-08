import { createFileRoute } from "@tanstack/react-router";
import { AuthGuard } from "@/components/guards/AuthGuard";
import SeekerProfile from "@/pages/seeker/Profile";

export const Route = createFileRoute("/profile")({
  component: () => (
    <AuthGuard>
      <SeekerProfile />
    </AuthGuard>
  ),
});
