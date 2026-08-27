import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";

const MASTER_ADMIN_EMAIL = "muneeswaranmd2004@gmail.com";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ authorized: false, message: "Email is required." }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 1. Check if master super admin
    if (normalizedEmail === MASTER_ADMIN_EMAIL.toLowerCase()) {
      return NextResponse.json({
        authorized: true,
        role: "SUPER_ADMIN",
        email: normalizedEmail,
        isMaster: true,
      });
    }

    // 2. Check Supabase admin_users table
    if (isSupabaseConfigured()) {
      const supabase = createServiceClient();
      const { data: adminUser, error } = await supabase
        .from("admin_users")
        .select("id, email, role")
        .eq("email", normalizedEmail)
        .single();

      if (adminUser && !error) {
        return NextResponse.json({
          authorized: true,
          role: adminUser.role,
          email: adminUser.email,
          isMaster: false,
        });
      }
    }

    return NextResponse.json({
      authorized: false,
      message: `Access Denied: ${normalizedEmail} is not registered as an authorized administrator. Please log in with an authorized administrator account or contact the platform administrator.`,
    }, { status: 403 });
  } catch (error) {
    console.error("Admin auth verification error:", error);
    return NextResponse.json({ authorized: false, message: "Authentication validation error." }, { status: 500 });
  }
}
