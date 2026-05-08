import { Navigate, useLocation } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import type { UserRole } from "@/types";

interface Props {
  allow: UserRole[];
  children: ReactNode;
}

const HOME_FOR: Record<UserRole, string> = {
  seeker: "/dashboard",
  guide: "/guide/dashboard",
  admin: "/admin",
};

/**
 * Enforces auth + role. Routing rules:
 *  1. Unauthenticated → /login
 *  2. Authenticated but wrong role → redirect to that role's home
 */
export function RoleGuard({ allow, children }: Props) {
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useRole();
  const location = useLocation();

  if (authLoading || roleLoading) {
    return <div className="p-8 text-muted">Loading…</div>;
  }

  if (!user) {
    return <Navigate to="/login" search={{ redirect: location.href }} />;
  }

  if (!role) {
    // Profile not yet provisioned; treat as seeker home fallback
    return <Navigate to="/dashboard" />;
  }

  if (!allow.includes(role)) {
    return <Navigate to={HOME_FOR[role]} />;
  }

  return <>{children}</>;
}
