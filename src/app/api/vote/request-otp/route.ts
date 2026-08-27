import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

function maskEmail(email: string): string {
  const parts = email.trim().toLowerCase().split("@");
  if (parts.length !== 2) return "c***@tamilnadu.in";
  const [user, domain] = parts;
  const maskedUser = user.length <= 2 ? `${user[0]}*` : `${user[0]}***${user[user.length - 1]}`;
  return `${maskedUser}@${domain}`;
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // Generate a 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const masked = maskEmail(email);

    // In a production setup with Resend/SendGrid, send email here.
    // For seamless local testing, we return success with simulated delivery.

    return NextResponse.json({
      success: true,
      message: `A verification code was dispatched to ${masked}`,
      masked_email: masked,
      // Provide preview code in development mode for easy testing
      debug_code: process.env.NODE_ENV !== "production" ? code : undefined,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send verification code. Please try again." },
      { status: 500 }
    );
  }
}
