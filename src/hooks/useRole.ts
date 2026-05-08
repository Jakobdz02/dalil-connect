import { useProfile } from "./useProfile";
import type { UserRole } from "@/types";

export function useRole(): { role: UserRole | null; loading: boolean } {
  const { profile, loading } = useProfile();
  return { role: profile?.role ?? null, loading };
}
