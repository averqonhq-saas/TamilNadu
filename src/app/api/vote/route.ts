import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import {
  DEFAULT_CAMPAIGN,
  DEFAULT_SHORTLISTED_IDEAS,
  ShortlistedIdea,
} from "@/lib/constants/campaign";
import { getCampaignState } from "@/lib/data/campaign";
import { getVotingCandidates } from "@/lib/data/voting";
import { getPlatformSettings } from "@/lib/data/settings";
import { createServiceClient } from "@/lib/supabase/server";

const VOTING_SECRET = process.env.VOTING_SECRET_KEY || "build-tamil-nadu-vote-salt-2026";

function hashVoter(email: string): string {
  return crypto
    .createHmac("sha256", VOTING_SECRET)
    .update(email.trim().toLowerCase())
    .digest("hex");
}

function maskEmail(email: string): string {
  const parts = email.trim().toLowerCase().split("@");
  if (parts.length !== 2) return "c***@tamilnadu.in";
  const [user, domain] = parts;
  const maskedUser = user.length <= 2 ? `${user[0]}*` : `${user[0]}***${user[user.length - 1]}`;
  return `${maskedUser}@${domain}`;
}

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const voteCookie = cookieStore.get("btn_voted_token");

    const campaign = getCampaignState();
    const status = campaign.status;
    const votingEnd = campaign.voting_end;
    const votingStart = campaign.voting_start;
    const allowResults = campaign.allow_results_before_close;

    // Check if user has already voted via cookie
    let userVotedIdeaId: string | null = null;
    let userVotedAt: string | null = null;

    if (voteCookie?.value) {
      try {
        const decoded = JSON.parse(Buffer.from(voteCookie.value, "base64").toString("utf-8"));
        userVotedIdeaId = decoded.ideaId || null;
        userVotedAt = decoded.votedAt || null;
      } catch {
        // Cookie parse error, ignore
      }
    }

    // Try fetching live aggregated votes from Supabase if configured and voting results are enabled
    let shortlisted = getVotingCandidates();
    const isClosedOrResults = status === "CLOSED" || status === "RESULTS" || status === "WINNER";

    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
        const supabase = createServiceClient();
        const { data: votesData } = await supabase.from("public_votes").select("idea_id");

        if (votesData && votesData.length > 0) {
          const totalVotes = votesData.length;
          const counts: Record<string, number> = {};
          votesData.forEach((v: { idea_id: string }) => {
            counts[v.idea_id] = (counts[v.idea_id] || 0) + 1;
          });

          shortlisted = shortlisted.map((idea) => {
            const count = counts[idea.id] || counts[idea.public_id] || 0;
            return {
              ...idea,
              vote_count: count,
              percentage: totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0,
            };
          });
        }
      }
    } catch {
      // Fallback to current candidates
    }

    return NextResponse.json({
      status,
      voting_start: votingStart,
      voting_end: votingEnd,
      allow_results: allowResults,
      shortlisted_ideas: shortlisted,
      user_voted: !!userVotedIdeaId,
      voted_idea_id: userVotedIdeaId,
      voted_at: userVotedAt,
      require_email_otp: getPlatformSettings().requireEmailOtp,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load voting status" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ideaId, email, otp, district } = body;

    if (!ideaId) {
      return NextResponse.json(
        { error: "Please select an idea to vote for." },
        { status: 400 }
      );
    }

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required to record your vote." },
        { status: 400 }
      );
    }

    const campaign = getCampaignState();
    const currentStatus = campaign.status;
    
    // Check if voting is open
    if (currentStatus !== "VOTING") {
      return NextResponse.json(
        { error: `Public voting is not currently open. Active phase: ${currentStatus}` },
        { status: 403 }
      );
    }

    // Verify candidate exists
    const candidates = getVotingCandidates();
    const candidate = candidates.find(
      (c) => c.id === ideaId || c.public_id === ideaId
    );
    if (!candidate) {
      return NextResponse.json(
        { error: "Invalid candidate idea selected." },
        { status: 400 }
      );
    }

    const voterHash = hashVoter(email);
    const masked = maskEmail(email);
    const nowIso = new Date().toISOString();

    // Check database for duplicate vote if Supabase is connected
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      try {
        const supabase = createServiceClient();
        const { data: existingVote } = await supabase
          .from("public_votes")
          .select("id, idea_id, created_at")
          .eq("voter_hash", voterHash)
          .single();

        if (existingVote) {
          return NextResponse.json(
            {
              error: "A vote has already been recorded from this email address.",
              already_voted: true,
              voted_idea_id: existingVote.idea_id,
            },
            { status: 409 }
          );
        }

        // Insert new vote
        const { error: insertError } = await supabase.from("public_votes").insert({
          idea_id: candidate.id,
          voter_hash: voterHash,
          voter_email_masked: masked,
          district: district || candidate.district,
        });

        if (insertError) {
          if (insertError.code === "23505") {
            return NextResponse.json(
              { error: "A vote from this email is already recorded.", already_voted: true },
              { status: 409 }
            );
          }
          throw insertError;
        }
      } catch (dbError) {
        console.error("Database vote write failed:", dbError);
      }
    }

    // Prepare client persistence cookie
    const tokenPayload = {
      ideaId: candidate.id,
      voterHash,
      votedAt: nowIso,
    };
    const tokenEncoded = Buffer.from(JSON.stringify(tokenPayload)).toString("base64");

    const cookieStore = await cookies();
    cookieStore.set("btn_voted_token", tokenEncoded, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
    });

    return NextResponse.json({
      success: true,
      message: "Your vote has been recorded successfully. 🇮🇳",
      voted_idea: {
        id: candidate.id,
        public_id: candidate.public_id,
        product_number: candidate.product_number,
        product_name: candidate.product_name,
        emoji: candidate.emoji,
        tagline: candidate.tagline,
        why_is_this_here: candidate.why_is_this_here,
        title: candidate.title,
        title_tamil: candidate.title_tamil,
        category_name: candidate.category_name,
        category_color: candidate.category_color,
        district: candidate.district,
      },
      voted_at: nowIso,
      masked_email: masked,
    });
  } catch (error) {
    console.error("Vote submission error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your vote. Please try again." },
      { status: 500 }
    );
  }
}
