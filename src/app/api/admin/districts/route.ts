import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { TAMIL_NADU_DISTRICTS } from "@/lib/constants/districts";
import { verifyAdminSession } from "@/lib/auth/admin-auth";
import { getStoredIdeas } from "@/lib/data/groups";

export async function GET(req: NextRequest) {
  // Authorize Admin Session (allow non-production development access)
  const auth = await verifyAdminSession(req, "REVIEWER", false);
  if (!auth.authorized && process.env.NODE_ENV === "production") {
    return auth.response;
  }

  try {
    const districtStats: Record<string, { count: number; topCategory: string; voterTurnout: number }> = {};
    const categoryCounts: Record<string, Record<string, number>> = {};

    TAMIL_NADU_DISTRICTS.forEach((d) => {
      const key = d.name.toLowerCase();
      districtStats[key] = {
        count: 0,
        topCategory: "General",
        voterTurnout: 0,
      };
      categoryCounts[key] = {};
    });

    // 1. Gather all ideas from Supabase (or fallback to getStoredIdeas())
    let allIdeas: Array<{ district: string; category_name: string }> = [];

    if (isSupabaseConfigured()) {
      try {
        const supabase = createServiceClient();
        const { data: dbIdeas } = await supabase
          .from("ideas")
          .select("district, category_id, categories(name)");

        if (dbIdeas && dbIdeas.length > 0) {
          allIdeas = dbIdeas.map((i: any) => ({
            district: i.district || "",
            category_name: i.categories?.name || "General",
          }));
        }
      } catch (err) {
        console.error("Districts ideas DB fetch error:", err);
      }
    }

    // Fallback to stored ideas if DB has no ideas yet
    if (allIdeas.length === 0) {
      const stored = getStoredIdeas();
      allIdeas = stored.map((i) => ({
        district: i.district || "",
        category_name: i.category_name || "General",
      }));
    }

    // Aggregate ideas count and top category per district
    allIdeas.forEach((idea) => {
      const rawDist = (idea.district || "").toLowerCase().trim();
      const matched = TAMIL_NADU_DISTRICTS.find(
        (d) => d.name.toLowerCase() === rawDist || rawDist.includes(d.name.toLowerCase())
      );
      if (matched) {
        const key = matched.name.toLowerCase();
        districtStats[key].count += 1;
        const cat = idea.category_name || "General";
        categoryCounts[key][cat] = (categoryCounts[key][cat] || 0) + 1;
      }
    });

    // Determine top category per district
    Object.keys(categoryCounts).forEach((key) => {
      const cats = categoryCounts[key];
      let topCat = "General";
      let maxCount = 0;
      Object.entries(cats).forEach(([cat, count]) => {
        if (count > maxCount) {
          maxCount = count;
          topCat = cat;
        }
      });
      if (maxCount > 0) {
        districtStats[key].topCategory = topCat;
      }
    });

    // 2. Gather votes from public_votes table
    if (isSupabaseConfigured()) {
      try {
        const supabase = createServiceClient();
        const { data: votesData } = await supabase
          .from("public_votes")
          .select("district");

        if (votesData && votesData.length > 0) {
          votesData.forEach((v: { district: string | null }) => {
            const rawDist = (v.district || "").toLowerCase().trim();
            const matched = TAMIL_NADU_DISTRICTS.find(
              (d) => d.name.toLowerCase() === rawDist || rawDist.includes(d.name.toLowerCase())
            );
            if (matched) {
              const key = matched.name.toLowerCase();
              districtStats[key].voterTurnout += 1;
            }
          });
        }
      } catch (err) {
        console.error("Districts votes DB fetch error:", err);
      }
    }

    const result = TAMIL_NADU_DISTRICTS.map((d) => {
      const stat = districtStats[d.name.toLowerCase()] || { count: 0, topCategory: "General", voterTurnout: 0 };
      return {
        name: d.name,
        nameTamil: d.nameTamil,
        count: stat.count,
        topCategory: stat.topCategory,
        voterTurnout: stat.voterTurnout,
      };
    }).sort((a, b) => b.count - a.count || b.voterTurnout - a.voterTurnout || a.name.localeCompare(b.name));

    const activeCount = result.filter((d) => d.count > 0 || d.voterTurnout > 0).length;

    return NextResponse.json({
      districts: result,
      activeCount,
      totalDistricts: TAMIL_NADU_DISTRICTS.length,
    });
  } catch (error) {
    console.error("Admin districts API error:", error);
    return NextResponse.json({
      districts: TAMIL_NADU_DISTRICTS.map((d) => ({
        name: d.name,
        nameTamil: d.nameTamil,
        count: 0,
        topCategory: "General",
        voterTurnout: 0,
      })),
      activeCount: 0,
      totalDistricts: TAMIL_NADU_DISTRICTS.length,
    });
  }
}
