import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";

const MASTER_ADMIN_EMAIL = "muneeswaranmd2004@gmail.com";

export async function GET(req: NextRequest) {
  try {
    let admins: Array<{ id: string; email: string; role: string; created_at: string; isMaster?: boolean }> = [
      {
        id: "master-1",
        email: MASTER_ADMIN_EMAIL,
        role: "SUPER_ADMIN",
        created_at: new Date().toISOString(),
        isMaster: true,
      },
    ];

    if (isSupabaseConfigured()) {
      const supabase = createServiceClient();
      const { data, error } = await supabase
        .from("admin_users")
        .select("*")
        .order("created_at", { ascending: true });

      if (data && !error) {
        admins = (data as Array<{ id: string; email: string; role: string; created_at: string }>).map((adm) => ({
          ...adm,
          isMaster: adm.email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase(),
        }));

        // Ensure master admin is always present
        if (!admins.some((a) => a.email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase())) {
          admins.unshift({
            id: "master-1",
            email: MASTER_ADMIN_EMAIL,
            role: "SUPER_ADMIN",
            created_at: new Date().toISOString(),
            isMaster: true,
          });
        }
      }
    }

    return NextResponse.json({ admins });
  } catch (error) {
    console.error("Admin list API error:", error);
    return NextResponse.json({
      admins: [
        {
          id: "master-1",
          email: MASTER_ADMIN_EMAIL,
          role: "SUPER_ADMIN",
          created_at: new Date().toISOString(),
          isMaster: true,
        },
      ],
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email, role = "REVIEWER" } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ message: "A valid email address is required." }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const validRole = ["ADMIN", "REVIEWER", "EDITOR"].includes(role) ? role : "REVIEWER";

    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        success: true,
        admin: {
          id: `adm-${Date.now()}`,
          email: normalizedEmail,
          role: validRole,
          created_at: new Date().toISOString(),
        },
        message: "Admin access granted.",
      }, { status: 201 });
    }

    const supabase = createServiceClient();

    // Check if already exists
    const { data: existing } = await supabase
      .from("admin_users")
      .select("id")
      .eq("email", normalizedEmail)
      .single();

    if (existing) {
      // Update role
      const { data: updated, error } = await supabase
        .from("admin_users")
        .update({ role: validRole })
        .eq("email", normalizedEmail)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, admin: updated, message: "Admin role updated." });
    }

    // Insert new admin
    const { data: created, error: insertError } = await supabase
      .from("admin_users")
      .insert({
        email: normalizedEmail,
        role: validRole,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Failed to add admin:", insertError);
      return NextResponse.json({ message: insertError.message || "Failed to grant admin access" }, { status: 400 });
    }

    return NextResponse.json({ success: true, admin: created, message: "Admin access granted successfully." }, { status: 201 });
  } catch (error: any) {
    console.error("Add admin error:", error);
    return NextResponse.json({ message: error?.message || "Failed to save admin user." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const email = searchParams.get("email");

    if (!id && !email) {
      return NextResponse.json({ message: "Admin ID or email required." }, { status: 400 });
    }

    if (email && email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase()) {
      return NextResponse.json({ message: "Cannot revoke access for the Master Super Administrator." }, { status: 403 });
    }

    if (isSupabaseConfigured()) {
      const supabase = createServiceClient();
      let query = supabase.from("admin_users").delete();
      if (id) query = query.eq("id", id);
      else if (email) query = query.eq("email", email.toLowerCase());

      const { error } = await query;
      if (error) throw error;
    }

    return NextResponse.json({ success: true, message: "Admin access revoked." });
  } catch (error: any) {
    console.error("Delete admin error:", error);
    return NextResponse.json({ message: error?.message || "Failed to revoke admin access." }, { status: 500 });
  }
}
