import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getStoredIdeas, GroupableIdea } from "@/lib/data/groups";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase().trim() || "";
    const category = searchParams.get("category") || "";
    const district = searchParams.get("district")?.toLowerCase().trim() || "";
    const status = searchParams.get("status") || "";
    const unassignedOnly = searchParams.get("unassigned_only") === "true";
    const limit = parseInt(searchParams.get("limit") || "100");

    let ideas = getStoredIdeas();

    if (isSupabaseConfigured()) {
      try {
        const supabase = createServiceClient();
        let query = supabase
          .from("ideas")
          .select(`
            id,
            public_id,
            title,
            description,
            district,
            status,
            category_id,
            created_at,
            categories (name, slug, color),
            users (email),
            idea_group_members (
              group_id,
              idea_groups (title)
            )
          `)
          .order("created_at", { ascending: false })
          .limit(limit);

        if (status) query = query.eq("status", status);
        if (category) query = query.eq("categories.slug", category);
        if (district) query = query.ilike("district", `%${district}%`);
        if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,public_id.ilike.%${search}%`);

        const { data: dbIdeas, error } = await query;

        if (dbIdeas && !error && dbIdeas.length > 0) {
          ideas = dbIdeas.map((i: any) => {
            const memberInfo = i.idea_group_members?.[0];
            return {
              id: i.id,
              public_id: i.public_id,
              title: i.title,
              description: i.description || "",
              district: i.district,
              status: i.status,
              category_id: i.category_id || "general",
              category_name: i.categories?.name || "General",
              category_color: i.categories?.color || "#64748b",
              submitter_email: i.users?.email || "",
              created_at: i.created_at,
              assigned_group_id: memberInfo?.group_id || null,
              assigned_group_title: memberInfo?.idea_groups?.title || null,
            };
          });
        }
      } catch (dbErr) {
        console.warn("Supabase admin ideas search fallback:", dbErr);
      }
    }

    // Filter in-memory
    if (unassignedOnly) {
      ideas = ideas.filter((i) => !i.assigned_group_id);
    }

    if (status) {
      ideas = ideas.filter((i) => i.status.toUpperCase() === status.toUpperCase());
    }

    if (category) {
      ideas = ideas.filter((i) => i.category_id === category);
    }

    if (district) {
      ideas = ideas.filter((i) => i.district.toLowerCase().includes(district));
    }

    if (search) {
      ideas = ideas.filter(
        (i) =>
          i.title.toLowerCase().includes(search) ||
          i.public_id.toLowerCase().includes(search) ||
          (i.description && i.description.toLowerCase().includes(search)) ||
          i.district.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({
      ideas: ideas.slice(0, limit),
      total: ideas.length,
    });
  } catch (error: any) {
    console.error("Admin ideas fetch error:", error);
    return NextResponse.json({ error: error?.message || "Failed to search ideas" }, { status: 500 });
  }
}
