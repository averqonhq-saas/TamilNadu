import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { AdminIdeaUpdateSchema } from "@/lib/validations/idea";
import { updateStoredIdea, getStoredIdeas, deleteStoredIdea } from "@/lib/data/groups";
import { verifyAdminSession } from "@/lib/auth/admin-auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  // Authorize Admin Session (Reviewer role or above, no mandatory 2FA block)
  const auth = await verifyAdminSession(req, "REVIEWER", false);
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await params;
    const cleanId = decodeURIComponent(id).trim();

    // 1. Delete from in-memory / local shared store
    deleteStoredIdea(cleanId);

    // 2. Delete from Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        const supabase = createServiceClient();
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanId);

        let targetUuid = isUuid ? cleanId : null;
        if (!targetUuid) {
          const { data: record } = await supabase
            .from("ideas")
            .select("id")
            .or(`id.eq.${cleanId},public_id.eq.${cleanId}`)
            .maybeSingle();
          if (record?.id) {
            targetUuid = record.id;
          }
        }

        if (targetUuid) {
          // Clean up child tables to avoid FK constraint blocks
          try {
            await supabase.from("idea_group_members").delete().eq("idea_id", targetUuid);
            await supabase.from("votes").delete().eq("idea_id", targetUuid);
          } catch (relErr) {
            console.warn("Non-fatal relation cleanup error:", relErr);
          }

          const { error } = await supabase.from("ideas").delete().eq("id", targetUuid);
          if (error) console.warn("Supabase idea delete warning:", error);
        } else {
          const { error } = await supabase.from("ideas").delete().or(`id.eq.${cleanId},public_id.eq.${cleanId}`);
          if (error) console.warn("Supabase idea delete warning:", error);
        }

        // Log audit action with authenticated admin ID/Email
        try {
          await supabase.from("audit_logs").insert({
            admin_id: auth.admin.id || auth.admin.email,
            action: "IDEA_DELETE",
            entity_type: "idea",
            entity_id: cleanId,
            metadata: {
              deleter: auth.admin.email,
              role: auth.admin.role,
            },
          });
        } catch (auditErr) {
          console.warn("Non-critical audit log insert error on delete:", auditErr);
        }
      } catch (dbErr) {
        console.warn("Database cleanup error:", dbErr);
      }
    }

    return NextResponse.json({ success: true, message: "Idea deleted successfully" });
  } catch (error: any) {
    console.error("Admin idea delete error:", error);
    return NextResponse.json(
      { message: error?.message || "Failed to delete idea" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  // Authorize Admin Session (Reviewer role or above, no mandatory 2FA block)
  const auth = await verifyAdminSession(req, "REVIEWER", false);
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await params;
    const cleanId = decodeURIComponent(id).trim();
    const body = await req.json();

    // Update in-memory / local shared store
    updateStoredIdea(cleanId, {
      ...(body.status && { status: body.status }),
      ...(body.title && { title: body.title }),
      ...(body.description && { description: body.description }),
      ...(body.district && { district: body.district }),
    });

    if (isSupabaseConfigured()) {
      try {
        const validation = AdminIdeaUpdateSchema.safeParse(body);
        const updatePayload: Record<string, any> = validation.success ? { ...validation.data } : {};
        if (body.internal_notes !== undefined) {
          updatePayload.admin_notes = body.internal_notes;
        }
        if (body.status) updatePayload.status = body.status;
        if (body.visibility) updatePayload.visibility = body.visibility;

        if (Object.keys(updatePayload).length > 0) {
          const supabase = createServiceClient();
          const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanId);
          if (isUuid) {
            await supabase.from("ideas").update(updatePayload).eq("id", cleanId);
          } else {
            await supabase.from("ideas").update(updatePayload).or(`id.eq.${cleanId},public_id.eq.${cleanId}`);
          }
        }

        // Log audit action with authenticated admin ID/Email
        try {
          const supabase = createServiceClient();
          await supabase.from("audit_logs").insert({
            admin_id: auth.admin.id || auth.admin.email,
            action: "IDEA_UPDATE",
            entity_type: "idea",
            entity_id: cleanId,
            metadata: {
              updater: auth.admin.email,
              role: auth.admin.role,
              changes: body,
            },
          });
        } catch (auditErr) {
          console.warn("Non-critical audit log insert error:", auditErr);
        }
      } catch (dbErr) {
        console.warn("Supabase update error:", dbErr);
      }
    }

    return NextResponse.json({ success: true, message: "Idea updated successfully" });
  } catch (error) {
    console.error("Admin idea update error:", error);
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  // Authorize Admin Session (Reviewer role or above, no mandatory 2FA block)
  const auth = await verifyAdminSession(req, "REVIEWER", false);
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await params;
    const cleanId = decodeURIComponent(id).trim();

    const target = cleanId.toLowerCase();
    const localIdea = getStoredIdeas().find(
      (i) =>
        i.id === cleanId ||
        i.public_id === cleanId ||
        i.id.toLowerCase() === target ||
        i.public_id.toLowerCase() === target
    );

    if (isSupabaseConfigured()) {
      try {
        const supabase = createServiceClient();
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanId);

        let query = supabase
          .from("ideas")
          .select(`
            *,
            categories (name, slug, icon, color),
            users (email, name, district)
          `);

        if (isUuid) {
          query = query.eq("id", cleanId);
        } else {
          query = query.or(`id.eq.${cleanId},public_id.eq.${cleanId}`);
        }

        const { data: idea, error } = await query.maybeSingle();

        if (idea && !error) {
          return NextResponse.json({
            id: idea.id,
            public_id: idea.public_id || `TN-2026-${idea.id.slice(0, 5)}`,
            title: idea.title,
            problem_description: idea.description || "No additional problem description provided.",
            solution_idea: idea.solution_description || undefined,
            category_id: idea.category_id || "general",
            category_name: idea.categories?.name || "General",
            district: idea.district || idea.users?.district || "Tamil Nadu",
            scope: idea.scope || "State-wide",
            status: idea.status,
            visibility: idea.visibility || (idea.status === "PUBLIC" ? "PUBLIC" : "PRIVATE"),
            internal_notes: idea.admin_notes || "",
            submitter_email: idea.users?.email || "anonymous@tamilnadu.in",
            submitter_name: idea.users?.name || "Resident Contributor",
            created_at: idea.created_at,
          });
        }
      } catch (dbErr) {
        console.warn("Database lookup error:", dbErr);
      }
    }

    if (localIdea) {
      return NextResponse.json({
        id: localIdea.id,
        public_id: localIdea.public_id,
        title: localIdea.title,
        problem_description: localIdea.description || "No additional problem description provided.",
        solution_idea: undefined,
        category_id: localIdea.category_id,
        category_name: localIdea.category_name,
        district: localIdea.district,
        scope: "State-wide",
        status: localIdea.status,
        visibility: localIdea.status === "PUBLIC" ? "PUBLIC" : "PRIVATE",
        internal_notes: "",
        submitter_email: localIdea.submitter_email || "citizen@tamilnadu.in",
        submitter_name: "Citizen Contributor",
        created_at: localIdea.created_at,
      });
    }

    return NextResponse.json({ message: "Idea not found" }, { status: 404 });
  } catch (error) {
    console.error("Failed to load idea detail:", error);
    return NextResponse.json({ message: "Failed to load idea" }, { status: 500 });
  }
}
