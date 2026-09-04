import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { AdminIdeaUpdateSchema } from "@/lib/validations/idea";
import { updateStoredIdea, getStoredIdeas, deleteStoredIdea } from "@/lib/data/groups";
import { verifyAdminSession } from "@/lib/auth/admin-auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  // Authorize Admin Session (Requires REVIEWER role or above)
  const auth = await verifyAdminSession(req, "REVIEWER");
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await params;

    // Delete from in-memory / local shared store
    deleteStoredIdea(id);

    if (!isSupabaseConfigured()) {
      return NextResponse.json({ success: true, message: "Deleted in local mode" });
    }

    const supabase = createServiceClient();

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    let deleteQuery = supabase.from("ideas").delete();

    if (isUuid) {
      deleteQuery = deleteQuery.eq("id", id);
    } else {
      deleteQuery = deleteQuery.or(`id.eq.${id},public_id.eq.${id}`);
    }

    const { error } = await deleteQuery;

    if (error) {
      throw error;
    }

    // Log audit action with authenticated admin ID/Email
    try {
      await supabase.from("audit_logs").insert({
        admin_id: auth.admin.id || auth.admin.email,
        action: "IDEA_DELETE",
        entity_type: "idea",
        entity_id: id,
        metadata: {
          deleter: auth.admin.email,
          role: auth.admin.role,
        },
      });
    } catch (auditErr) {
      console.warn("Non-critical audit log insert error on delete:", auditErr);
    }

    return NextResponse.json({ success: true, message: "Idea deleted successfully" });
  } catch (error) {
    console.error("Admin idea delete error:", error);
    return NextResponse.json({ message: "Failed to delete idea" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  // Authorize Admin Session (Requires REVIEWER role or above)
  const auth = await verifyAdminSession(req, "REVIEWER");
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await params;
    const body = await req.json();

    // Update in-memory / local shared store
    updateStoredIdea(id, {
      ...(body.status && { status: body.status }),
      ...(body.title && { title: body.title }),
      ...(body.description && { description: body.description }),
      ...(body.district && { district: body.district }),
    });

    if (!isSupabaseConfigured()) {
      return NextResponse.json({ success: true, message: "Updated in local mode" });
    }

    const validation = AdminIdeaUpdateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid update data", errors: validation.error.flatten() },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    const updatePayload: Record<string, any> = { ...validation.data };
    if (body.internal_notes !== undefined) {
      updatePayload.admin_notes = body.internal_notes;
    }

    const { error } = await supabase
      .from("ideas")
      .update(updatePayload)
      .eq("id", id);

    if (error) {
      throw error;
    }

    // Log audit action with authenticated admin ID/Email
    try {
      await supabase.from("audit_logs").insert({
        admin_id: auth.admin.id || auth.admin.email,
        action: "IDEA_UPDATE",
        entity_type: "idea",
        entity_id: id,
        metadata: {
          updater: auth.admin.email,
          role: auth.admin.role,
          changes: validation.data,
        },
      });
    } catch (auditErr) {
      console.warn("Non-critical audit log insert error:", auditErr);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin idea update error:", error);
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  // Authorize Admin Session (Requires REVIEWER role or above)
  const auth = await verifyAdminSession(req, "REVIEWER");
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await params;

    const localIdea = getStoredIdeas().find((i) => i.id === id || i.public_id === id);

    if (!isSupabaseConfigured()) {
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
    }

    const supabase = createServiceClient();

    let query = supabase
      .from("ideas")
      .select(`
        *,
        categories (name, slug, icon, color),
        users (email, name, district)
      `);

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    if (isUuid) {
      query = query.eq("id", id);
    } else {
      query = query.or(`id.eq.${id},public_id.eq.${id}`);
    }

    const { data: idea, error } = await query.single();

    if (error || !idea) {
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
    }

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
      visibility: idea.visibility,
      internal_notes: idea.admin_notes || "",
      submitter_email: idea.users?.email || "anonymous@tamilnadu.in",
      submitter_name: idea.users?.name || "Resident Contributor",
      created_at: idea.created_at,
    });
  } catch (error) {
    console.error("Failed to load idea detail:", error);
    return NextResponse.json({ message: "Failed to load idea" }, { status: 500 });
  }
}
