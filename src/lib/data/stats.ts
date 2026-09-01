/**
 * lib/data/stats.ts
 *
 * Shared stats query used by both:
 * - The homepage server component (direct call — no HTTP overhead)
 * - /api/stats route (for client-side freshness checks)
 *
 * This avoids the anti-pattern of `fetch(baseUrl/api/stats)` inside a
 * server component, which adds a full HTTP round-trip during SSR.
 */

import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getCampaignStateAsync } from "@/lib/data/campaign";
import { getStoredIdeas } from "@/lib/data/groups";
import { getDaysRemaining } from "@/lib/utils";

export interface SiteStats {
  totalIdeas: number;
  districtsRepresented: number;
  categoriesActive: number;
  daysRemaining: number | null;
  campaignStatus: string;
}

const EXCLUDED_DISTRICTS = [
  "my-locality",
  "my-district",
  "multiple-districts",
  "all-of-tn",
  "not-sure",
];

export async function getSiteStats(): Promise<SiteStats> {
  const currentCampaign = await getCampaignStateAsync();

  let totalIdeas = getStoredIdeas().length;
  let districtsRepresented = 38;
  let categoriesActive = 8;
  let campaignStatus = currentCampaign.status;
  let daysRemaining: number | null = null;

  if (isSupabaseConfigured()) {
    try {
      const supabase = createServiceClient();

      // Use COUNT aggregates — never fetch full rows for counting
      const [
        { count: ideasCount },
        { data: districtRows },
        { count: activeCategories },
        { data: campaign },
      ] = await Promise.all([
        supabase.from("ideas").select("*", { count: "exact", head: true }),
        // Only fetch district column — minimal payload for distinct count
        supabase
          .from("ideas")
          .select("district")
          .not("district", "in", `(${EXCLUDED_DISTRICTS.map((d) => `"${d}"`).join(",")})`)
          .not("district", "is", null),
        supabase
          .from("categories")
          .select("*", { count: "exact", head: true })
          .eq("active", true),
        supabase.from("campaigns").select("status, collection_end").limit(1).single(),
      ]);

      if (ideasCount && ideasCount > 0) totalIdeas = ideasCount;
      if (activeCategories) categoriesActive = activeCategories;
      if (campaign?.status) campaignStatus = campaign.status;
      if (campaign?.collection_end) {
        daysRemaining = getDaysRemaining(campaign.collection_end);
      }

      if (districtRows && districtRows.length > 0) {
        const unique = new Set(
          districtRows.map((d: any) => d.district).filter(Boolean)
        );
        if (unique.size > 0) districtsRepresented = unique.size;
      }
    } catch (err) {
      console.warn("[stats] DB fallback:", err);
    }
  }

  if (!daysRemaining && currentCampaign.collection_end) {
    daysRemaining = getDaysRemaining(currentCampaign.collection_end);
  }

  return {
    totalIdeas,
    districtsRepresented,
    categoriesActive,
    daysRemaining,
    campaignStatus,
  };
}
