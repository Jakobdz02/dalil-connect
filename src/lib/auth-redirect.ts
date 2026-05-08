import type { UserRole } from "@/types";

export const HOME_FOR_ROLE: Record<UserRole, string> = {
  seeker: "/dashboard",
  guide: "/guide/dashboard",
  admin: "/admin",
};
