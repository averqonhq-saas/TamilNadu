import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { TAMIL_NADU_DISTRICTS } from "@/lib/constants/districts";
import { getCampaignState } from "@/lib/data/campaign";
import { getStoredGroups, getStoredIdeas } from "@/lib/data/groups";
import { getStoredInquiries } from "@/lib/data/inquiries";
import { verifyAdminSession } from "@/lib/auth/admin-auth";

export async function GET(req: NextRequest) {
  const auth = await verifyAdminSession(req, "REVIEWER");
  if (!auth.authorized) return auth.response;

  try {
    const storedGroups = getStoredGroups();
    const storedIdeas = getStoredIdeas();
    const storedInquiries = getStoredInquiries();
    const currentCampaign = getCampaignState();

    let ideasCount = storedIdeas.length;
    let groupsCount = storedGroups.length;
    let shortlistCount = storedGroups.filter((g) => g.status === "SHORTLISTED").length;
    let votingBadge: string | undefined = currentCampaign.status === "VOTING" ? "LIVE" : currentCampaign.status;
    let categoriesCount = 8;
    let activeDistrictsCount = 12;
    let adminsCount = 1;
    let inquiriesCount = storedInquiries.filter((i) => i.status === "NEW").length;

    if (isSupabaseConfigured()) {
      try {
        const supabase = createServiceClient();

        const [
          { count: ideasTotal },
          { count: groupsTotal },
          { count: shortlistedTotal },
          { count: activeCategories },
          { data: districtData },
          { count: adminUsersTotal },
          { data: campaignData },
          { count: dbNewInquiries },
        ] = await Promise.all([
          supabase.from("ideas").select("*", { count: "exact", head: true }),
          supabase.from("idea_groups").select("*", { count: "exact", head: true }),
          supabase.from("idea_groups").select("*", { count: "exact", head: true }).eq("status", "SHORTLISTED"),
          supabase.from("categories").select("*", { count: "exact", head: true }).eq("active", true),
          supabase.from("ideas").select("district"),
          supabase.from("admin_users").select("*", { count: "exact", head: true }),
          supabase.from("campaigns").select("status").limit(1).single(),
          supabase.from("inquiries").select("*", { count: "exact", head: true }).eq("status", "NEW"),
        ]);

        if (ideasTotal && ideasTotal > 0) ideasCount = ideasTotal;
        if (groupsTotal && groupsTotal > 0) groupsCount = groupsTotal;
        if (shortlistedTotal !== null && shortlistedTotal !== undefined && shortlistedTotal > 0) {
          shortlistCount = shortlistedTotal;
        }
        categoriesCount = activeCategories ?? 8;
        adminsCount = adminUsersTotal && adminUsersTotal > 0 ? adminUsersTotal : 1;
        if (dbNewInquiries !== null && dbNewInquiries !== undefined) {
          inquiriesCount = dbNewInquiries;
        }

        if (campaignData?.status) {
          votingBadge = campaignData.status === "VOTING" ? "LIVE" : campaignData.status;
        }
      } catch (dbErr) {
        console.warn("Sidebar stats DB fallback:", dbErr);
      }
    }

    return NextResponse.json({
      ideasCount,
      groupsCount,
      shortlistCount,
      votingBadge,
      categoriesCount,
      activeDistrictsCount,
      totalDistricts: TAMIL_NADU_DISTRICTS.length,
      adminsCount,
      inquiriesCount,
    });
  } catch (error) {
    console.error("Sidebar stats API error:", error);
    const storedGroups = getStoredGroups();
    const storedIdeas = getStoredIdeas();
    const storedInquiries = getStoredInquiries();
    const currentCampaign = getCampaignState();

    return NextResponse.json({
      ideasCount: storedIdeas.length,
      groupsCount: storedGroups.length,
      shortlistCount: storedGroups.filter((g) => g.status === "SHORTLISTED").length,
      votingBadge: currentCampaign.status === "VOTING" ? "LIVE" : currentCampaign.status,
      categoriesCount: 8,
      activeDistrictsCount: 12,
      totalDistricts: TAMIL_NADU_DISTRICTS.length,
      adminsCount: 1,
      inquiriesCount: storedInquiries.filter((i) => i.status === "NEW").length,
    });
  }
}
