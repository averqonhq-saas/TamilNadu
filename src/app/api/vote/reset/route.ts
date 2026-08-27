import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
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
