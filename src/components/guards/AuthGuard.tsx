import { Navigate, useLocation } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="p-8 text-muted">Loading…</div>;
  if (!user) {
    return <Navigate to="/login" search={{ redirect: location.href }} />;
  }
  return <>{children}</>;
}
