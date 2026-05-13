import { useEffect, useState } from "react";
import { Inbox, FileText, ExternalLink } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/shared/Button";
import { Badge } from "@/components/shared/Badge";
import { Avatar } from "@/components/shared/Avatar";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { getGuideDocumentsForAdmin } from "@/lib/guideDocuments.functions";
import type { GuideProfile, VerificationStatus } from "@/types";

type Tab = "submitted" | "under_review" | "verified" | "rejected" | "all";

const TAB_LABELS: Record<Tab, string> = {
  submitted: "Submitted",
  under_review: "Under Review",
  verified: "Verified",
  rejected: "Rejected",
  all: "All",
};

interface DocItem {
  id: string;
  doc_type: string;
  file_name: string;
  uploaded_at: string;
  url: string | null;
}

export default function AdminGuides() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("submitted");
  const [rows, setRows] = useState<GuideProfile[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [reviewing, setReviewing] = useState<GuideProfile | null>(null);
  const [docs, setDocs] = useState<DocItem[] | null>(null);
  const [langs, setLangs] = useState<{ language: string; proficiency: string }[]>([]);
  const fetchDocs = useServerFn(getGuideDocumentsForAdmin);

  const load = async () => {
    setRows(null);
    let q = supabase.from("guide_profiles").select("*").order("created_at", { ascending: false });
    if (tab !== "all") q = q.eq("verification_status", tab);
    const { data, error } = await q;
    if (error) toast.error(error.message);
    setRows((data as GuideProfile[]) ?? []);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [tab]);

  const openReview = async (g: GuideProfile) => {
    setReviewing(g);
    setDocs(null);
    setLangs([]);
    try {
      const res = await fetchDocs({ data: { guideId: g.id } });
      setDocs(res.documents);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load documents");
      setDocs([]);
    }
    const { data } = await supabase
      .from("guide_languages")
      .select("language, proficiency")
      .eq("guide_id", g.id);
    setLangs((data as { language: string; proficiency: string }[]) ?? []);
  };

  const update = async (
    id: string, status: VerificationStatus, extra: Record<string, unknown> = {},
  ) => {
    setBusyId(id);
    const { error } = await supabase
      .from("guide_profiles")
      .update({ verification_status: status, ...extra })
      .eq("id", id);
    setBusyId(null);
    if (error) return toast.error(error.message);
    toast.success(`Marked ${status}`);
    setReviewing(null);
    load();
  };

  const verify = (id: string) => update(id, "verified", {
    is_approved: true,
    approved_by: user?.id ?? null,
    approved_at: new Date().toISOString(),
    verified_at: new Date().toISOString(),
    rejection_reason: null,
  });

  const reject = (id: string) => {
    const reason = window.prompt("Reason for rejection?");
    if (!reason) return;
    update(id, "rejected", {
      is_approved: false,
      rejected_at: new Date().toISOString(),
      rejection_reason: reason,
    });
  };

  return (
    <PageWrapper>
      <div className="py-10 space-y-6">
        <div>
          <h1 className="font-display text-4xl text-primary">Guide Verification</h1>
          <p className="text-muted-foreground mt-1">Review KYC, documents and approve guides.</p>
        </div>

        <div className="flex gap-2 border-b border-border overflow-x-auto">
          {(Object.keys(TAB_LABELS) as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${
                tab === t ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {TAB_LABELS[t]}
            </button>
          ))}
        </div>

        {!rows ? <LoadingSpinner fullPage />
          : rows.length === 0 ? <EmptyState icon={Inbox} title={`No ${TAB_LABELS[tab]} guides`} />
          : (
            <div className="space-y-4">
              {rows.map((g) => (
                <div key={g.id} className="bg-card border border-border rounded-2xl p-5 flex flex-col sm:flex-row gap-4">
                  <Avatar src={g.photo_url} name={g.full_name} size="xl" />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-xl text-foreground">{g.full_name}</h3>
                      <Badge variant="default">{g.category}</Badge>
                      <StatusPill status={g.verification_status} />
                      <span className="text-sm text-muted-foreground">· {g.city}</span>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {g.phone && <>📞 {g.phone} · </>}
                      Languages: {g.languages.join(", ") || "—"}
                      {g.price_per_hour != null && <> · {g.price_per_hour} DZD/h</>}
                    </div>
                    {g.subcategory && (
                      <div className="text-sm mt-1"><span className="font-medium">Specialization:</span> {g.subcategory}</div>
                    )}
                    {g.bio && <p className="mt-2 text-sm text-foreground/80 line-clamp-2">{g.bio}</p>}
                    {g.rejection_reason && (
                      <p className="mt-2 text-xs text-red-700">Rejected: {g.rejection_reason}</p>
                    )}
                  </div>
                  <div className="flex sm:flex-col gap-2 sm:w-44">
                    <Button size="sm" variant="ghost" onClick={() => openReview(g)}>Review docs</Button>
                    {g.verification_status !== "verified" && (
                      <Button size="sm" onClick={() => verify(g.id)} loading={busyId === g.id}>Verify & approve</Button>
                    )}
                    {g.verification_status === "submitted" && (
                      <Button size="sm" variant="ghost"
                        onClick={() => update(g.id, "under_review")} loading={busyId === g.id}>
                        Mark under review
                      </Button>
                    )}
                    {g.verification_status !== "rejected" && (
                      <Button size="sm" variant="danger" onClick={() => reject(g.id)} loading={busyId === g.id}>
                        Reject
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>

      {/* Review dialog */}
      <Dialog open={!!reviewing} onOpenChange={(o) => !o && setReviewing(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {reviewing && (
            <>
              <DialogHeader>
                <DialogTitle>{reviewing.full_name}</DialogTitle>
                <DialogDescription>
                  {reviewing.category} · {reviewing.subcategory ?? "—"} · {reviewing.city}
                </DialogDescription>
              </DialogHeader>

              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <Info label="Phone" value={reviewing.phone} />
                <Info label="Wilaya" value={reviewing.wilaya} />
                <Info label="Years experience" value={reviewing.years_experience?.toString() ?? null} />
                <Info label="Price / hour" value={reviewing.price_per_hour ? `${reviewing.price_per_hour} DZD` : null} />
                <Info label="Session type" value={reviewing.session_type} />
                <Info label="Available days" value={(reviewing.available_days ?? []).join(", ") || null} />
              </div>

              {reviewing.bio && (
                <div className="mt-3">
                  <div className="text-xs font-medium text-muted-foreground">Bio</div>
                  <p className="text-sm mt-1 whitespace-pre-line">{reviewing.bio}</p>
                </div>
              )}
              {reviewing.expertise && (
                <div className="mt-3">
                  <div className="text-xs font-medium text-muted-foreground">Expertise</div>
                  <p className="text-sm mt-1 whitespace-pre-line">{reviewing.expertise}</p>
                </div>
              )}

              {langs.length > 0 && (
                <div className="mt-3">
                  <div className="text-xs font-medium text-muted-foreground">Languages</div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {langs.map((l) => (
                      <Badge key={l.language} variant="default">
                        {l.language} · <span className="capitalize ms-1">{l.proficiency}</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4">
                <h3 className="text-sm font-semibold mb-2">Documents (admin-only)</h3>
                {docs === null ? <LoadingSpinner />
                  : docs.length === 0 ? <p className="text-sm text-muted-foreground">No documents uploaded.</p>
                  : (
                    <ul className="space-y-2">
                      {docs.map((d) => (
                        <li key={d.id} className="flex items-center justify-between gap-2 border rounded-lg px-3 py-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                            <div className="min-w-0">
                              <div className="text-sm truncate">{d.file_name}</div>
                              <div className="text-xs text-muted-foreground capitalize">{d.doc_type.replace(/_/g, " ")}</div>
                            </div>
                          </div>
                          {d.url && (
                            <a href={d.url} target="_blank" rel="noopener noreferrer"
                              className="text-primary text-sm flex items-center gap-1 hover:underline">
                              Open <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
              </div>

              <div className="mt-6 flex flex-wrap gap-2 justify-end pt-4 border-t">
                {reviewing.verification_status === "submitted" && (
                  <Button variant="ghost" onClick={() => update(reviewing.id, "under_review")}>
                    Mark under review
                  </Button>
                )}
                <Button variant="danger" onClick={() => reject(reviewing.id)}>Reject</Button>
                <Button onClick={() => verify(reviewing.id)}>Verify & approve</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
}

function Info({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="rounded-lg border bg-background px-3 py-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-sm font-medium">{value ?? "—"}</div>
    </div>
  );
}

function StatusPill({ status }: { status: VerificationStatus }) {
  const cls = {
    draft: "bg-muted text-muted-foreground",
    submitted: "bg-blue-100 text-blue-800",
    under_review: "bg-amber-100 text-amber-800",
    verified: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  }[status];
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cls}`}>{status.replace("_", " ")}</span>;
}
