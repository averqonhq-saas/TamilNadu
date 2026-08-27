import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import {
  getStoredCategories,
  addStoredCategory,
  deleteStoredCategory,
  AdminCategory,
} from "@/lib/data/categories";

export async function GET(req: NextRequest) {
  try {
    let categories = getStoredCategories();

    if (isSupabaseConfigured()) {
      try {
        const supabase = createServiceClient();
        const { data: dbCats, error } = await supabase
          .from("categories")
          .select("*")
          .order("sort_order", { ascending: true });

        if (dbCats && !error && dbCats.length > 0) {
          // Get counts from ideas
          const { data: ideasData } = await supabase.from("ideas").select("category_id");
          const countsMap: Record<string, number> = {};
          ideasData?.forEach((i: any) => {
            if (i.category_id) {
              countsMap[i.category_id] = (countsMap[i.category_id] || 0) + 1;
            }
          });

          const total = ideasData?.length || 1;

          categories = dbCats.map((c: any) => {
            const count = countsMap[c.id] || countsMap[c.slug] || 0;
            return {
              id: c.id,
              name: c.name,
              nameTamil: c.description || c.name,
              slug: c.slug,
              icon: c.icon || "📁",
              color: c.color || "#64748b",
              count,
              percentage: total > 0 ? Math.round((count / total) * 100) : 0,
              topProblem: c.description || "Sector-wide citizen submissions",
              description: c.description,
              created_at: c.created_at,
            };
          });
        }
      } catch (dbErr) {
        console.warn("Supabase categories GET fallback:", dbErr);
      }
    }

    return NextResponse.json({
      categories,
      total: categories.length,
    });
  } catch (error: any) {
    console.error("Categories fetch error:", error);
    return NextResponse.json({ error: error?.message || "Failed to load categories" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, nameTamil, slug, icon, color, description, topProblem } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Category name is required." }, { status: 400 });
    }

    const created = addStoredCategory({
      name: name.trim(),
      nameTamil: nameTamil?.trim(),
      slug: slug?.trim(),
      icon: icon?.trim() || "📁",
      color: color?.trim() || "#e85d26",
      description: description?.trim(),
      topProblem: topProblem?.trim(),
    });

    if (isSupabaseConfigured()) {
      try {
        const supabase = createServiceClient();
        await supabase.from("categories").insert({
          name: created.name,
          slug: created.slug,
          icon: created.icon,
          color: created.color,
          description: created.topProblem || created.description,
          active: true,
          sort_order: 10,
        });
      } catch (dbErr) {
        console.warn("Supabase category insert warning:", dbErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        category: created,
        message: `Category "${created.name}" created successfully.`,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create category error:", error);
    return NextResponse.json({ error: error?.message || "Failed to create category" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Category ID is required for deletion." }, { status: 400 });
    }

    const success = deleteStoredCategory(id);
    if (!success) {
      return NextResponse.json({ error: "Category not found." }, { status: 404 });
    }

    if (isSupabaseConfigured()) {
      try {
        const supabase = createServiceClient();
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        let query = supabase.from("categories").delete();
        if (isUuid) {
          query = query.eq("id", id);
        } else {
          query = query.or(`id.eq.${id},slug.eq.${id}`);
        }
        await query;
      } catch (dbErr) {
        console.warn("Supabase category delete warning:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Category removed successfully.",
    });
  } catch (error: any) {
    console.error("Delete category error:", error);
    return NextResponse.json({ error: error?.message || "Failed to delete category" }, { status: 500 });
  }
}
