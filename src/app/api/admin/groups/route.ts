import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import {
  getStoredGroups,
  createStoredGroup,
  ManualGroup,
  GroupStatus,
} from "@/lib/data/groups";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") as GroupStatus | null;
    const search = searchParams.get("search")?.toLowerCase().trim() || "";
    const category = searchParams.get("category") || "";

    let groups = getStoredGroups();

    if (isSupabaseConfigured()) {
      try {
        const supabase = createServiceClient();
        const { data: dbGroups, error } = await supabase
          .from("idea_groups")
          .select(`
            id,
            title,
            description,
            category_id,
            status,
            created_at,
            categories (name, slug, color)
          `)
          .order("created_at", { ascending: false });

        if (dbGroups && !error && dbGroups.length > 0) {
          // Fetch members for counts
          const { data: members } = await supabase
            .from("idea_group_members")
            .select("group_id, idea_id, ideas(district)");

          const groupMembersMap: Record<string, { ideaIds: string[]; districts: Set<string> }> = {};

          members?.forEach((m: any) => {
            if (!groupMembersMap[m.group_id]) {
              groupMembersMap[m.group_id] = { ideaIds: [], districts: new Set() };
            }
            groupMembersMap[m.group_id].ideaIds.push(m.idea_id);
            if (m.ideas?.district) {
              groupMembersMap[m.group_id].districts.add(m.ideas.district);
            }
          });

          groups = dbGroups.map((g: any) => {
            const mem = groupMembersMap[g.id] || { ideaIds: [], districts: new Set() };
            const districtList = Array.from(mem.districts);
            return {
              id: g.id,
              title: g.title,
              description: g.description || "",
              category_id: g.category_id || "general",
              category_name: g.categories?.name || "General",
              category_color: g.categories?.color || "#64748b",
              category_bg: `${g.categories?.color || "#64748b"}15`,
              status: (g.status as GroupStatus) || "DRAFT",
              product_concept: g.title,
              tagline: "",
              created_at: g.created_at,
              updated_at: g.created_at,
              member_idea_ids: mem.ideaIds,
              submissions_count: mem.ideaIds.length,
              districts_count: districtList.length,
              top_districts: districtList.slice(0, 5),
            };
          });
        }
      } catch (dbErr) {
        console.warn("Falling back to in-memory groups store:", dbErr);
      }
    }

    // Apply filters
    if (status) {
      groups = groups.filter((g) => g.status === status);
    }

    if (category) {
      groups = groups.filter((g) => g.category_id === category);
    }

    if (search) {
      groups = groups.filter(
        (g) =>
          g.title.toLowerCase().includes(search) ||
          g.description.toLowerCase().includes(search) ||
          g.category_name.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({
      groups,
      total: groups.length,
    });
  } catch (error: any) {
    console.error("Fetch groups error:", error);
    return NextResponse.json({ error: error?.message || "Failed to load groups" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      description = "",
      category_id = "general",
      status = "DRAFT",
      product_concept = "",
      tagline = "",
      emoji = "💡",
      initial_idea_ids = [],
    } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Group title is required." }, { status: 400 });
    }

    // Create in store
    const newGroup = createStoredGroup({
      title: title.trim(),
      description: description.trim(),
      category_id,
      status: status as GroupStatus,
      product_concept: product_concept.trim() || title.trim(),
      tagline: tagline.trim(),
      emoji,
      initial_idea_ids,
    });

    // Sync to Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        const supabase = createServiceClient();
        const { data: dbGroup, error } = await supabase
          .from("idea_groups")
          .insert({
            title: title.trim(),
            description: description.trim(),
            status: status,
          })
          .select()
          .single();

        if (dbGroup && !error && initial_idea_ids.length > 0) {
          // Link initial members
          const memberRows = initial_idea_ids.map((ideaId: string) => ({
            group_id: dbGroup.id,
            idea_id: ideaId,
          }));
          await supabase.from("idea_group_members").insert(memberRows);
        }
      } catch (dbErr) {
        console.warn("Supabase group insert warning:", dbErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        group: newGroup,
        message: "Idea Group created successfully.",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create group error:", error);
    return NextResponse.json({ error: error?.message || "Failed to create group" }, { status: 500 });
  }
}
