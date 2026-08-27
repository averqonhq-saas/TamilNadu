import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import {
  addIdeasToStoredGroup,
  removeIdeasFromStoredGroup,
  getStoredGroupById,
} from "@/lib/data/groups";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { idea_ids } = body;

    if (!Array.isArray(idea_ids) || idea_ids.length === 0) {
      return NextResponse.json({ error: "Please select at least one idea to add." }, { status: 400 });
    }

    const result = addIdeasToStoredGroup(id, idea_ids);
    if (!result) {
      return NextResponse.json({ error: "Idea group not found." }, { status: 404 });
    }

    if (isSupabaseConfigured()) {
      try {
        const supabase = createServiceClient();
        // Remove from any prior group membership to enforce 1-to-1 rule
        await supabase
          .from("idea_group_members")
          .delete()
          .in("idea_id", idea_ids);

        // Insert into current group
        const memberRows = idea_ids.map((ideaId: string) => ({
          group_id: id,
          idea_id: ideaId,
        }));
        await supabase.from("idea_group_members").insert(memberRows);
      } catch (dbErr) {
        console.warn("Supabase group member add warning:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      added_count: result.addedCount,
      group: result.group,
      message: `Added ${result.addedCount} ${result.addedCount === 1 ? "idea" : "ideas"} to group.`,
    });
  } catch (error: any) {
    console.error("Add ideas to group error:", error);
    return NextResponse.json({ error: error?.message || "Failed to add ideas" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { idea_ids } = body;

    if (!Array.isArray(idea_ids) || idea_ids.length === 0) {
      return NextResponse.json({ error: "Please select at least one idea to remove." }, { status: 400 });
    }

    const result = removeIdeasFromStoredGroup(id, idea_ids);
    if (!result) {
      return NextResponse.json({ error: "Idea group not found." }, { status: 404 });
    }

    if (isSupabaseConfigured()) {
      try {
        const supabase = createServiceClient();
        await supabase
          .from("idea_group_members")
          .delete()
          .eq("group_id", id)
          .in("idea_id", idea_ids);
      } catch (dbErr) {
        console.warn("Supabase group member remove warning:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      removed_count: result.removedCount,
      group: result.group,
      message: `Removed ${result.removedCount} ${result.removedCount === 1 ? "idea" : "ideas"} from group.`,
    });
  } catch (error: any) {
    console.error("Remove ideas from group error:", error);
    return NextResponse.json({ error: error?.message || "Failed to remove ideas" }, { status: 500 });
  }
}
