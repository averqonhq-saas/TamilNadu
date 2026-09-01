import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { signAdminToken, AdminRole } from "@/lib/auth/admin-auth";

const MASTER_ADMIN_EMAIL = "muneeswaranmd2004@gmail.com";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { authorized: false, message: "A valid email address is required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    let isAuthorized = false;
    let role: AdminRole = "REVIEWER";
    let isMaster = false;

    // 1. Master Super Admin Check
    if (normalizedEmail === MASTER_ADMIN_EMAIL.toLowerCase()) {
      isAuthorized = true;
      role = "SUPER_ADMIN";
      isMaster = true;
    } else if (isSupabaseConfigured()) {
      // 2. Check Supabase admin_users table
      const supabase = createServiceClient();
      const { data: adminUser, error } = await supabase
        .from("admin_users")
        .select("id, email, role, is_active")
        .eq("email", normalizedEmail)
        .single();

      if (adminUser && !error) {
        if (adminUser.is_active === false) {
          return NextResponse.json(
            {
              authorized: false,
              message: `Access Denied: Administrator account ${normalizedEmail} has been deactivated.`,
            },
            { status: 403 }
          );
        }

        isAuthorized = true;
        role = (adminUser.role as AdminRole) || "REVIEWER";
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        {
          authorized: false,
          message: "Your account does not have access to the Build Tamil Nadu Admin.",
        },
        { status: 403 }
      );
    }

    // Check if 2FA is enrolled and enabled
    let is2FAEnrolled = false;
    if (isSupabaseConfigured()) {
      try {
        const supabase = createServiceClient();
        const { data: record2fa } = await supabase
          .from("admin_2fa")
          .select("enabled")
          .eq("admin_email", normalizedEmail)
          .single();

        if (record2fa && record2fa.enabled) {
          is2FAEnrolled = true;
        }
      } catch {
        // Fallback
      }
    }

    // Issue Step 1 Session Token (is2FAVerified: false)
    const token = signAdminToken({
      email: normalizedEmail,
      role,
      is2FAVerified: false,
      is2FAEnrolled,
      timestamp: Date.now(),
    });

    const response = NextResponse.json({
      authorized: true,
      role,
      email: normalizedEmail,
      isMaster,
      is2FAEnrolled,
      token,
      message: is2FAEnrolled
        ? "Step 1 completed. 2FA verification required."
        : "Step 1 completed. 2FA setup required.",
    });

    // Set unverified step 1 session cookie
    response.cookies.set("btn_admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 15, // 15 minutes to complete 2FA
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Admin auth verification error:", error);
    return NextResponse.json(
      { authorized: false, message: "Authentication validation error." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: "Admin session terminated successfully.",
  });

  response.cookies.delete("btn_admin_session");
  return response;
}
