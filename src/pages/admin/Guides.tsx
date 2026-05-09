import { useEffect, useState } from "react";
import { Inbox } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/shared/Button";
import { Badge } from "@/components/shared/Badge";
import { Avatar } from "@/components/shared/Avatar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

type Tab = "pending" | "approved" | "rejected";

interface GuideRow {
  id: string;
  full_name: string;
  city: string;
  category: string;
  languages: string[];
  description: string | null;
  price_per_day: number | null;
  photo_url: string | null;
  is_approved: boolean;
  rejection_reason: string | null;
  created_at: string;
}

export default function AdminGuides() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("pending");
  const [rows, setRows] = useState<GuideRow[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    setRows(null);
    let q = supabase.from("guide_profiles").select("*").order("created_at", { ascending: false });
    if (tab === "pending") q = q.eq("is_approved", false).is("rejection_reason", null);
    if (tab === "approved") q = q.eq("is_approved", true);
    if (tab === "rejected") q = q.eq("is_approved", false).not("rejection_reason", "is", null);
    const { data, error } = await q;
    if (error) toast.error(error.message);
    setRows((data as GuideRow[]) ?? []);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const approve = async (id: string) => {
    setBusyId(id);
    const { error } = await supabase
      .from("guide_profiles")
      .update({
        is_approved: true,
        approved_by: user?.id ?? null,
        approved_at: new Date().toISOString(),
        rejection_reason: null,
      })
      .eq("id", id);
    setBusyId(null);
    if (error) return toast.error(error.message);
    toast.success("Guide approved");
    load();
  };

  const reject = async (id: string) => {
    const reason = window.prompt("Reason for rejection?");
    if (!reason) return;
    setBusyId(id);
    const { error } = await supabase
      .from("guide_profiles")
      .update({ is_approved: false, rejection_reason: reason })
      .eq("id", id);
    setBusyId(null);
    if (error) return toast.error(error.message);
    toast.success("Guide rejected");
    load();
  };

  return (
    <PageWrapper>
      <div className="py-10 space-y-6">
        <div>
          <h1 className="font-display text-4xl text-primary">Guide Moderation</h1>
          <p className="text-muted-foreground mt-1">Approve or reject guide applications</p>
        </div>

        <div className="flex gap-2 border-b border-border">
          {(["pending", "approved", "rejected"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium capitalize border-b-2 -mb-px transition-colors ${
                tab === t
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {!rows ? (
          <LoadingSpinner fullPage />
        ) : rows.length === 0 ? (
          <EmptyState icon={Inbox} title={`No ${tab} guides`} />
        ) : (
          <div className="space-y-4">
            {rows.map((g) => (
              <div
                key={g.id}
                className="bg-card border border-border rounded-2xl p-5 flex flex-col sm:flex-row gap-4"
              >
                <Avatar src={g.photo_url} name={g.full_name} size="xl" />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-xl text-foreground">{g.full_name}</h3>
                    <Badge variant="default">{g.category}</Badge>
                    <span className="text-sm text-muted-foreground">· {g.city}</span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Languages: {g.languages.join(", ")}
                    {g.price_per_day != null && <> · ${g.price_per_day}/day</>}
                  </div>
                  {g.description && (
                    <p className="mt-2 text-sm text-foreground/80 line-clamp-3">{g.description}</p>
                  )}
                  {g.rejection_reason && (
                    <p className="mt-2 text-xs text-red-700">
                      Rejected: {g.rejection_reason}
                    </p>
                  )}
                </div>
                <div className="flex sm:flex-col gap-2 sm:w-40">
                  {tab !== "approved" && (
                    <Button
                      size="sm"
                      onClick={() => approve(g.id)}
                      loading={busyId === g.id}
                    >
                      Approve
                    </Button>
                  )}
                  {tab !== "rejected" && (
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => reject(g.id)}
                      loading={busyId === g.id}
                    >
                      Reject
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
