import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { TAMIL_NADU_DISTRICTS } from "@/lib/constants/districts";
import { verifyAdminSession } from "@/lib/auth/admin-auth";

export async function GET(req: NextRequest) {
  const auth = await verifyAdminSession(req, "REVIEWER");
  if (!auth.authorized) return auth.response;

  try {
    const districtStats: Record<string, { count: number; topCategory: string; voterTurnout: number }> = {};

    TAMIL_NADU_DISTRICTS.forEach((d) => {
      districtStats[d.name.toLowerCase()] = {
        count: 0,
        topCategory: "General",
        voterTurnout: 0,
      };
    });

    if (isSupabaseConfigured()) {
      const supabase = createServiceClient();

      // Fetch ideas by district
      const { data: ideasData } = await supabase
        .from("ideas")
        .select("district, category_id, categories(name)");

      if (ideasData) {
        const categoryCounts: Record<string, Record<string, number>> = {};

        ideasData.forEach((idea: any) => {
          const distName = (idea.district || "").toLowerCase();
          if (districtStats[distName]) {
            districtStats[distName].count += 1;

            const catName = idea.categories?.name || "General";
            if (!categoryCounts[distName]) {
              categoryCounts[distName] = {};
            }
            categoryCounts[distName][catName] = (categoryCounts[distName][catName] || 0) + 1;
          }
        });

        // Determine top category per district
        Object.keys(categoryCounts).forEach((dist) => {
          const cats = categoryCounts[dist];
          let topCat = "General";
          let maxCount = 0;
          Object.entries(cats).forEach(([cat, count]) => {
            if (count > maxCount) {
              maxCount = count;
              topCat = cat;
            }
          });
          if (districtStats[dist]) {
            districtStats[dist].topCategory = topCat;
          }
        });
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
    }).sort((a, b) => b.count - a.count);

    const activeCount = result.filter((d) => d.count > 0).length;

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
