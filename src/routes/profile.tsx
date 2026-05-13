import { createFileRoute, Navigate } from "@tanstack/react-router";
import { AuthGuard } from "@/components/guards/AuthGuard";
import { useRole } from "@/hooks/useRole";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { PageWrapper } from "@/components/layout/PageWrapper";
import SeekerProfile from "@/pages/seeker/Profile";
import GuideProfile from "@/pages/guide/Profile";

function ProfileRouter() {
  const { role, loading } = useRole();
  if (loading) {
    return <PageWrapper><LoadingSpinner fullPage /></PageWrapper>;
  }
  if (role === "guide") return <GuideProfile />;
  if (role === "admin") return <Navigate to="/admin" />;
  return <SeekerProfile />;
}

export const Route = createFileRoute("/profile")({
  component: () => (
    <AuthGuard>
      <ProfileRouter />
    </AuthGuard>
  ),
});
