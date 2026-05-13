import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const inputSchema = z.object({
  guideId: z.string().uuid(),
});

/**
 * Admin-only: returns signed URLs (1h) for every KYC/proof document
 * uploaded by a guide. Clients can never call this successfully.
 */
export const getGuideDocumentsForAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => inputSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // Verify caller is an admin via RLS-respecting profile lookup
    const { data: prof, error: profErr } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .maybeSingle();
    if (profErr || prof?.role !== "admin") {
      throw new Response("Forbidden", { status: 403 });
    }

    // Use admin client to read docs + sign URLs
    const { data: docs, error } = await supabaseAdmin
      .from("guide_documents")
      .select("*")
      .eq("guide_id", data.guideId)
      .order("uploaded_at", { ascending: true });
    if (error) throw new Response(error.message, { status: 500 });

    const signed = await Promise.all(
      (docs ?? []).map(async (d) => {
        const { data: s } = await supabaseAdmin.storage
          .from("guide-documents")
          .createSignedUrl(d.file_path, 60 * 60);
        return {
          id: d.id,
          doc_type: d.doc_type,
          file_name: d.file_name,
          uploaded_at: d.uploaded_at,
          url: s?.signedUrl ?? null,
        };
      }),
    );

    return { documents: signed };
  });
