import { NextResponse } from "next/server";
import { getStoredIdeas, getStoredGroups } from "@/lib/data/groups";
import { getVotingCandidates } from "@/lib/data/voting";
import { getCampaignState } from "@/lib/data/campaign";
import { getPlatformSettings } from "@/lib/data/settings";
import { getStoredCategories } from "@/lib/data/categories";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function GET() {
  try {
    let ideas = getStoredIdeas();
    let groups = getStoredGroups();
    let candidates = getVotingCandidates();
    let campaign = getCampaignState();
    let settings = getPlatformSettings();
    let categories = getStoredCategories();
    let publicVotes: any[] = [];
    let auditLogs: any[] = [];

    if (isSupabaseConfigured()) {
      try {
        const supabase = createServiceClient();
        const [
          { data: dbIdeas },
          { data: dbGroups },
          { data: dbVotes },
          { data: dbLogs },
        ] = await Promise.all([
          supabase.from("ideas").select("*"),
          supabase.from("idea_groups").select("*"),
          supabase.from("public_votes").select("*"),
          supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(100),
        ]);

        if (dbIdeas && dbIdeas.length > 0) ideas = dbIdeas;
        if (dbGroups && dbGroups.length > 0) groups = dbGroups;
        if (dbVotes) publicVotes = dbVotes;
        if (dbLogs) auditLogs = dbLogs;
      } catch (err) {
        console.warn("DB snapshot backup fallback:", err);
      }
    }

    const snapshot = {
      exported_at: new Date().toISOString(),
      platform: settings.siteName,
      version: "2026.1",
      environment: process.env.NODE_ENV,
      campaign,
      settings,
      summary: {
        total_ideas: ideas.length,
        total_groups: groups.length,
        total_finalists: candidates.length,
        total_votes: publicVotes.length,
        categories_count: categories.length,
      },
      data: {
        categories,
        ideas,
        idea_groups: groups,
        voting_candidates: candidates,
        public_votes: publicVotes,
        audit_logs: auditLogs,
      },
    };

    return new NextResponse(JSON.stringify(snapshot, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="build_tamil_nadu_backup_${new Date().toISOString().slice(0, 10)}.json"`,
      },
    });
  } catch (error: any) {
    console.error("Backup snapshot error:", error);
    return NextResponse.json({ error: "Failed to generate database backup" }, { status: 500 });
  }
}
