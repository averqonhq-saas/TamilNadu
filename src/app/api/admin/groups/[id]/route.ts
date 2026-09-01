import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import {
  getStoredGroupById,
  updateStoredGroup,
  deleteStoredGroup,
  getStoredIdeas,
  GroupMemberIdea,
} from "@/lib/data/groups";
import { verifyAdminSession } from "@/lib/auth/admin-auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const auth = await verifyAdminSession(req, "REVIEWER");
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await params;

    const group = getStoredGroupById(id);
    if (!group) {
      return NextResponse.json({ error: "Idea group not found" }, { status: 404 });
    }

    const allIdeas = getStoredIdeas();
    const memberIdeas: GroupMemberIdea[] = allIdeas
      .filter((i) => group.member_idea_ids.includes(i.id))
      .map((i) => ({
        id: i.id,
        public_id: i.public_id,
        title: i.title,
        description: i.description,
        district: i.district,
        status: i.status,
        category_id: i.category_id,
        category_name: i.category_name,
        submitter_email: i.submitter_email,
        created_at: i.created_at,
      }));

    if (isSupabaseConfigured()) {
      try {
        const supabase = createServiceClient();
        const { data: dbGroup } = await supabase
          .from("idea_groups")
          .select(`*, categories(name, slug, color)`)
          .eq("id", id)
          .single();

        if (dbGroup) {
          const { data: dbMembers } = await supabase
            .from("idea_group_members")
            .select(`
              idea_id,
              ideas (
                id,
                public_id,
                title,
                description,
                district,
                status,
                category_id,
                created_at,
                users (email)
              )
            `)
            .eq("group_id", id);

          if (dbMembers && dbMembers.length > 0) {
            const mappedDbIdeas: GroupMemberIdea[] = dbMembers
              .map((m: any) => m.ideas)
              .filter(Boolean)
              .map((i: any) => ({
                id: i.id,
                public_id: i.public_id,
                title: i.title,
                description: i.description,
                district: i.district,
                status: i.status,
                category_id: i.category_id,
                submitter_email: i.users?.email,
                created_at: i.created_at,
              }));

            return NextResponse.json({
              group: {
                ...group,
                id: dbGroup.id,
                title: dbGroup.title,
                description: dbGroup.description || "",
                status: dbGroup.status,
                member_idea_ids: mappedDbIdeas.map((i) => i.id),
                submissions_count: mappedDbIdeas.length,
              },
              ideas: mappedDbIdeas,
            });
          }
        }
      } catch (dbErr) {
        console.warn("Supabase group get fallback:", dbErr);
      }
    }

    return NextResponse.json({
      group,
      ideas: memberIdeas,
    });
  } catch (error: any) {
    console.error("Group fetch error:", error);
    return NextResponse.json({ error: error?.message || "Failed to load group" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const auth = await verifyAdminSession(req, "ADMIN");
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await params;
    const body = await req.json();

    const updated = updateStoredGroup(id, body);
    if (!updated) {
      return NextResponse.json({ error: "Idea group not found" }, { status: 404 });
    }

    if (isSupabaseConfigured()) {
      try {
        const supabase = createServiceClient();
        const updatePayload: Record<string, any> = {};
        if (body.title !== undefined) updatePayload.title = body.title;
        if (body.description !== undefined) updatePayload.description = body.description;
        if (body.status !== undefined) updatePayload.status = body.status;

        await supabase.from("idea_groups").update(updatePayload).eq("id", id);

        await supabase.from("audit_logs").insert({
          admin_id: auth.admin.id || auth.admin.email,
          action: "IDEA_GROUP_CHANGED",
          entity_type: "IDEA_GROUP",
          entity_id: id,
          metadata: { updated_by: auth.admin.email, updates: updatePayload },
        });
      } catch (dbErr) {
        console.warn("Supabase group update warning:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      group: updated,
      message: "Group updated successfully.",
    });
  } catch (error: any) {
    console.error("Group update error:", error);
    return NextResponse.json({ error: error?.message || "Failed to update group" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const auth = await verifyAdminSession(req, "ADMIN");
  if (!auth.authorized) return auth.response;

  try {
    const { id } = await params;

    const success = deleteStoredGroup(id);
    if (!success) {
      return NextResponse.json({ error: "Idea group not found" }, { status: 404 });
    }

    if (isSupabaseConfigured()) {
      try {
        const supabase = createServiceClient();
        await supabase.from("idea_group_members").delete().eq("group_id", id);
        await supabase.from("idea_groups").delete().eq("id", id);

        await supabase.from("audit_logs").insert({
          admin_id: auth.admin.id || auth.admin.email,
          action: "IDEA_GROUP_DELETED",
          entity_type: "IDEA_GROUP",
          entity_id: id,
          metadata: { deleted_by: auth.admin.email },
        });
      } catch (dbErr) {
        console.warn("Supabase group delete warning:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Idea group removed successfully.",
    });
  } catch (error: any) {
    console.error("Group delete error:", error);
    return NextResponse.json({ error: error?.message || "Failed to delete group" }, { status: 500 });
  }
}
