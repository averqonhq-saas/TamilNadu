import { NextRequest, NextResponse } from "next/server";
import { getCampaignStateAsync, updateCampaignStateAsync } from "@/lib/data/campaign";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { verifyAdminSession } from "@/lib/auth/admin-auth";

export async function GET() {
  try {
    const state = await getCampaignStateAsync();
    return NextResponse.json(state);
  } catch (error) {
    console.error("Campaign API GET error:", error);
    return NextResponse.json({ error: "Failed to fetch campaign state" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  // Authorize Admin Session (Strictly ADMIN or SUPER_ADMIN required to change campaign state)
  const auth = await verifyAdminSession(req, "ADMIN", false);
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json();
    const updated = await updateCampaignStateAsync({
      ...(body.status && { status: body.status }),
      ...(body.collection_start && { collection_start: body.collection_start }),
      ...(body.collection_end && { collection_end: body.collection_end }),
      ...(body.voting_start && { voting_start: body.voting_start }),
      ...(body.voting_end && { voting_end: body.voting_end }),
      ...(body.allow_results_before_close !== undefined && {
        allow_results_before_close: body.allow_results_before_close,
      }),
      ...(body.allow_results !== undefined && {
        allow_results_before_close: body.allow_results,
      }),
    });

    if (isSupabaseConfigured()) {
      try {
        const supabase = createServiceClient();
        await supabase.from("audit_logs").insert({
          admin_id: auth.admin.id || auth.admin.email,
          action: "CAMPAIGN_STATUS_CHANGED",
          entity_type: "CAMPAIGN",
          metadata: { updated_by: auth.admin.email, new_state: updated },
        });
      } catch (logErr) {
        console.warn("Audit log record error:", logErr);
      }
    }

    return NextResponse.json({ success: true, state: updated });
  } catch (error: any) {
    console.error("Campaign API POST error:", error);
    return NextResponse.json({ error: error?.message || "Failed to update campaign" }, { status: 500 });
  }
}
