import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminSession } from "@/lib/auth/admin-auth";

export async function POST(req: NextRequest) {
  try {
    // In production, voting reset MUST require administrator privileges
    if (process.env.NODE_ENV === "production") {
      const auth = await verifyAdminSession(req, "ADMIN");
      if (!auth.authorized) {
        return NextResponse.json(
          { error: "Forbidden: Resetting voting sessions is restricted to administrators." },
          { status: 403 }
        );
      }
    }

    const cookieStore = await cookies();
    cookieStore.delete("btn_voted_token");

    return NextResponse.json({
      success: true,
      message: "Voting session reset. Ready to submit another poll response.",
    });
  } catch (error) {
    console.error("Vote reset error:", error);
    return NextResponse.json(
      { error: "Failed to reset voting session." },
      { status: 500 }
    );
  }
}
