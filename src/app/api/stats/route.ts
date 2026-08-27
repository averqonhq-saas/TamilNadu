import { NextResponse } from "next/server";
import { getSiteStats } from "@/lib/data/stats";

/**
 * GET /api/stats
 *
 * Public endpoint for client-side freshness checks.
 * The homepage server component calls getSiteStats() directly (no HTTP),
 * so this route is only needed for client-initiated refreshes.
 */
export async function GET() {
  try {
    const stats = await getSiteStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("[/api/stats] Error:", error);
    return NextResponse.json(
      {
        totalIdeas: 0,
        districtsRepresented: 38,
        categoriesActive: 8,
        daysRemaining: null,
        campaignStatus: "COLLECTING",
      },
      { status: 200 }
    );
  }
}
