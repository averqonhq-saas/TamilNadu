import { NextRequest, NextResponse } from "next/server";
import { getCampaignState, updateCampaignState } from "@/lib/data/campaign";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { verifyAdminSession } from "@/lib/auth/admin-auth";

export async function GET() {
  try {
    let state = getCampaignState();

    if (isSupabaseConfigured()) {
      try {
        const supabase = createServiceClient();
        const { data: campaign } = await supabase
          .from("campaigns")
          .select("*")
          .limit(1)
          .single();

        if (campaign) {
          state = updateCampaignState({
            status: campaign.status || state.status,
            collection_start: campaign.collection_start || state.collection_start,
            collection_end: campaign.collection_end || state.collection_end,
            voting_start: campaign.voting_start || state.voting_start,
            voting_end: campaign.voting_end || state.voting_end,
            allow_results_before_close: campaign.allow_results_before_close ?? state.allow_results_before_close,
          });
        }
      } catch (err) {
        console.warn("Supabase campaign fetch fallback:", err);
      }
    }

    return NextResponse.json(state);
  } catch (error) {
    console.error("Campaign API error:", error);
    return NextResponse.json(getCampaignState());
  }
}

export async function POST(req: NextRequest) {
  // Authorize Admin Session (Strictly ADMIN or SUPER_ADMIN required to change campaign state)
  const auth = await verifyAdminSession(req, "ADMIN");
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json();
    const updated = updateCampaignState(body);

    if (isSupabaseConfigured()) {
      try {
        const supabase = createServiceClient();
        await supabase
          .from("campaigns")
          .update({
            ...(body.status && { status: body.status }),
            ...(body.collection_start && { collection_start: body.collection_start }),
            ...(body.collection_end && { collection_end: body.collection_end }),
            ...(body.voting_start && { voting_start: body.voting_start }),
            ...(body.voting_end && { voting_end: body.voting_end }),
            ...(body.allow_results_before_close !== undefined && {
              allow_results_before_close: body.allow_results_before_close,
            }),
          })
          .neq("id", "00000000-0000-0000-0000-000000000000"); // update active campaign

        await supabase.from("audit_logs").insert({
          admin_id: auth.admin.id || auth.admin.email,
          action: "CAMPAIGN_STATUS_CHANGED",
          entity_type: "CAMPAIGN",
          metadata: { updated_by: auth.admin.email, new_state: updated },
        });
      } catch (err) {
        console.warn("Supabase campaign update fallback:", err);
      }
    }

    return NextResponse.json({ success: true, state: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update campaign" }, { status: 500 });
  }
}
