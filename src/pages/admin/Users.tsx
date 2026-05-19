import { useEffect, useMemo, useState } from "react";
import { Users as UsersIcon } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { Avatar } from "@/components/shared/Avatar";
import { Badge } from "@/components/shared/Badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";

interface ProfileRow {
  id: string;
  name: string;
  email: string;
  role: "seeker" | "guide" | "admin";
  avatar_url: string | null;
  created_at: string;
}

const ROLES: ProfileRow["role"][] = ["seeker", "guide", "admin"];

export default function AdminUsers() {
  const { user } = useAuth();
  const { t, dir } = useI18n();
  const [rows, setRows] = useState<ProfileRow[] | null>(null);
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    setRows(null);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, name, email, role, avatar_url, created_at")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setRows((data as ProfileRow[]) ?? []);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!rows) return null;
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.name?.toLowerCase().includes(q) || r.email?.toLowerCase().includes(q),
    );
  }, [rows, search]);

  const changeRole = async (id: string, role: ProfileRow["role"]) => {
    setBusyId(id);
    const { error } = await supabase.from("profiles").update({ role }).eq("id", id);
    setBusyId(null);
    if (error) return toast.error(error.message);
    toast.success(t("admin.users.roleUpdated"));
    setRows((prev) => prev?.map((r) => (r.id === id ? { ...r, role } : r)) ?? null);
  };

  return (
    <PageWrapper>
      <div dir={dir} className="py-10 space-y-6">
        <div>
          <h1 className="font-display text-4xl text-primary">{t("admin.users.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("admin.users.subtitle")}</p>
        </div>

        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("admin.users.searchPh")}
          className="w-full sm:max-w-md h-11 rounded-full border border-border bg-card px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />

        {!filtered ? (
          <LoadingSpinner fullPage />
        ) : filtered.length === 0 ? (
          <EmptyState icon={UsersIcon} title={t("admin.users.empty")} />
        ) : (
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <ul className="divide-y divide-border">
              {filtered.map((r) => {
                const isSelf = r.id === user?.id;
                return (
                  <li
                    key={r.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center gap-3"
                  >
                    <Avatar src={r.avatar_url} name={r.name || r.email} size="lg" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground truncate">
                        {r.name || "—"}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">{r.email}</div>
                    </div>
                    <Badge
                      variant={
                        r.role === "admin"
                          ? "approved"
                          : r.role === "guide"
                            ? "confirmed"
                            : "default"
                      }
                    >
                      {t(`admin.role.${r.role}`)}
                    </Badge>
                    <select
                      value={r.role}
                      disabled={isSelf || busyId === r.id}
                      onChange={(e) =>
                        changeRole(r.id, e.target.value as ProfileRow["role"])
                      }
                      className="h-9 rounded-full border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                      title={isSelf ? t("admin.users.cantSelf") : t("admin.users.changeRole")}
                    >
                      {ROLES.map((role) => (
                        <option key={role} value={role}>
                          {t(`admin.role.${role}`)}
                        </option>
                      ))}
                    </select>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
