import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { getCampaignStateAsync, updateCampaignStateAsync } from "@/lib/data/campaign";
import {
  getVotingCandidates,
  addVotingCandidate,
  removeVotingCandidate,
  setVotingCandidates,
} from "@/lib/data/voting";
import { verifyAdminSession } from "@/lib/auth/admin-auth";

export async function GET(req: NextRequest) {
  // Authorize Admin Session (Requires ADMIN role or above)
  const auth = await verifyAdminSession(req, "ADMIN");
  if (!auth.authorized) return auth.response;

  try {
    let votes: any[] = [];
    let totalVotes = 0;
    const districtBreakdown: Record<string, number> = {};

    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      try {
        const service = createServiceClient();
        const { data: dbVotes } = await service.from("public_votes").select("idea_id, district");
        votes = dbVotes || [];
        totalVotes = votes.length;

        votes.forEach((v) => {
          const d = v.district || "Unspecified";
          districtBreakdown[d] = (districtBreakdown[d] || 0) + 1;
        });
      } catch (err) {
        console.error("Admin votes fetch error:", err);
      }
    }

    const currentCandidates = getVotingCandidates();
    const campaign = await getCampaignStateAsync();

    // Calculate counts per candidate
    const candidateStats = currentCandidates.map((idea) => {
      const count = votes.filter((v) => v.idea_id === idea.id || v.idea_id === idea.public_id).length;
      return {
        ...idea,
        vote_count: count,
        percentage: totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0,
      };
    });

    return NextResponse.json({
      status: campaign.status,
      voting_start: campaign.voting_start,
      voting_end: campaign.voting_end,
      total_votes: totalVotes,
      candidates: candidateStats,
      districts: districtBreakdown,
      allow_results: campaign.allow_results_before_close,
    });
  } catch (error) {
    console.error("Admin voting fetch error:", error);
    return NextResponse.json({ error: "Failed to load admin voting metrics" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  // Authorize Admin Session (Requires ADMIN role or above)
  const auth = await verifyAdminSession(req, "ADMIN", false);
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json();
    const { action, candidate, candidateId, candidates, status, voting_start, voting_end, allow_results } = body;

    if (action === "ADD_FINALIST" && candidate) {
      const created = addVotingCandidate(candidate);
      return NextResponse.json({
        success: true,
        candidate: created,
        candidates: getVotingCandidates(),
        message: `Finalist "${created.product_name}" added to voting ballot.`,
      });
    }

    if (action === "REMOVE_FINALIST" && candidateId) {
      const success = removeVotingCandidate(candidateId);
      if (!success) {
        return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        candidates: getVotingCandidates(),
        message: "Finalist removed from voting ballot.",
      });
    }

    if (action === "SET_CANDIDATES" && Array.isArray(candidates)) {
      const updated = setVotingCandidates(candidates);
      return NextResponse.json({
        success: true,
        candidates: updated,
        message: "Voting ballot candidates updated.",
      });
    }

    // Update campaign phase using async persistent updater
    const updatedCampaign = await updateCampaignStateAsync({
      ...(status && { status }),
      ...(voting_start && { voting_start }),
      ...(voting_end && { voting_end }),
      ...(allow_results !== undefined && { allow_results_before_close: allow_results }),
    });

    // Record audit log if Supabase is connected
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      try {
        const service = createServiceClient();
        await service.from("audit_logs").insert({
          admin_id: auth.admin.id || auth.admin.email,
          action: `VOTING_CONFIG_${action || "UPDATE"}`,
          entity_type: "CAMPAIGN_VOTING",
          metadata: { status, voting_start, voting_end, allow_results, updated_by: auth.admin.email },
        });
      } catch (logErr) {
        console.error("Audit log error:", logErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Platform phase updated to ${updatedCampaign.status}`,
      status: updatedCampaign.status,
      voting_start: updatedCampaign.voting_start,
      voting_end: updatedCampaign.voting_end,
    });
  } catch (error: any) {
    console.error("Voting config error:", error);
    return NextResponse.json({ error: error?.message || "Failed to update voting configuration" }, { status: 500 });
  }
}
