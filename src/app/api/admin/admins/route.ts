import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { verifyAdminSession, AdminRole } from "@/lib/auth/admin-auth";

const MASTER_ADMIN_EMAIL = "muneeswaranmd2004@gmail.com";

export async function GET(req: NextRequest) {
  // Authorize Admin Session (Strictly SUPER_ADMIN required to list admin users)
  const auth = await verifyAdminSession(req, "SUPER_ADMIN");
  if (!auth.authorized) return auth.response;

  try {
    let admins: Array<{ id: string; email: string; role: string; created_at: string; isMaster?: boolean; is_active?: boolean }> = [
      {
        id: "master-1",
        email: MASTER_ADMIN_EMAIL,
        role: "SUPER_ADMIN",
        created_at: new Date().toISOString(),
        isMaster: true,
        is_active: true,
      },
    ];

    if (isSupabaseConfigured()) {
      const supabase = createServiceClient();
      const { data, error } = await supabase
        .from("admin_users")
        .select("*")
        .order("created_at", { ascending: true });

      if (data && !error) {
        admins = (data as Array<{ id: string; email: string; role: string; created_at: string; is_active?: boolean }>).map((adm) => ({
          ...adm,
          isMaster: adm.email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase(),
          is_active: adm.is_active ?? true,
        }));

        // Ensure master admin is always present
        if (!admins.some((a) => a.email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase())) {
          admins.unshift({
            id: "master-1",
            email: MASTER_ADMIN_EMAIL,
            role: "SUPER_ADMIN",
            created_at: new Date().toISOString(),
            isMaster: true,
            is_active: true,
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
          is_active: true,
        },
      ],
    });
  }
}

export async function POST(req: NextRequest) {
  // Authorize Admin Session (Strictly SUPER_ADMIN required)
  const auth = await verifyAdminSession(req, "SUPER_ADMIN");
  if (!auth.authorized) return auth.response;

  try {
    const { email, role = "REVIEWER" } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ message: "A valid email address is required." }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const validRoles: AdminRole[] = ["SUPER_ADMIN", "ADMIN", "REVIEWER", "EDITOR"];
    const validRole = validRoles.includes(role as AdminRole) ? role : "REVIEWER";

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        {
          success: true,
          admin: {
            id: `adm-${Date.now()}`,
            email: normalizedEmail,
            role: validRole,
            created_at: new Date().toISOString(),
          },
          message: "Admin access granted.",
        },
        { status: 201 }
      );
    }

    const supabase = createServiceClient();

    // Check if already exists
    const { data: existing } = await supabase
      .from("admin_users")
      .select("id, role, is_active")
      .eq("email", normalizedEmail)
      .single();

    if (existing) {
      // Update role and activate
      const { data: updated, error } = await supabase
        .from("admin_users")
        .update({ role: validRole, is_active: true })
        .eq("email", normalizedEmail)
        .select()
        .single();

      if (error) throw error;

      // Audit log
      try {
        await supabase.from("audit_logs").insert({
          admin_id: auth.admin.id || auth.admin.email,
          action: "ROLE_CHANGED",
          entity_type: "ADMIN_USER",
          entity_id: existing.id,
          metadata: { target_email: normalizedEmail, new_role: validRole, updated_by: auth.admin.email },
        });
      } catch (logErr) {
        console.warn("Audit log insert warning:", logErr);
      }

      return NextResponse.json({ success: true, admin: updated, message: "Admin role updated successfully." });
    }

    // Insert new admin
    const { data: created, error: insertError } = await supabase
      .from("admin_users")
      .insert({
        email: normalizedEmail,
        role: validRole,
        is_active: true,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Failed to add admin:", insertError);
      return NextResponse.json({ message: insertError.message || "Failed to grant admin access" }, { status: 400 });
    }

    // Audit log
    try {
      await supabase.from("audit_logs").insert({
        admin_id: auth.admin.id || auth.admin.email,
        action: "ADMIN_ADDED",
        entity_type: "ADMIN_USER",
        entity_id: created?.id || normalizedEmail,
        metadata: { target_email: normalizedEmail, role: validRole, created_by: auth.admin.email },
      });
    } catch (logErr) {
      console.warn("Audit log insert warning:", logErr);
    }

    return NextResponse.json({ success: true, admin: created, message: "Admin access granted successfully." }, { status: 201 });
  } catch (error: any) {
    console.error("Add admin error:", error);
    return NextResponse.json({ message: error?.message || "Failed to save admin user." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  // Authorize Admin Session (Strictly SUPER_ADMIN required)
  const auth = await verifyAdminSession(req, "SUPER_ADMIN");
  if (!auth.authorized) return auth.response;

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

      // Check if target is master admin
      if (id) {
        const { data: target } = await supabase.from("admin_users").select("email").eq("id", id).single();
        if (target && target.email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase()) {
          return NextResponse.json({ message: "Cannot revoke access for the Master Super Administrator." }, { status: 403 });
        }
      }

      let query = supabase.from("admin_users").delete();
      if (id) query = query.eq("id", id);
      else if (email) query = query.eq("email", email.toLowerCase());

      const { error } = await query;
      if (error) throw error;

      // Audit log
      try {
        await supabase.from("audit_logs").insert({
          admin_id: auth.admin.id || auth.admin.email,
          action: "ADMIN_REMOVED",
          entity_type: "ADMIN_USER",
          entity_id: id || email,
          metadata: { revoked_target: id || email, revoked_by: auth.admin.email },
        });
      } catch (logErr) {
        console.warn("Audit log insert warning:", logErr);
      }
    }

    return NextResponse.json({ success: true, message: "Admin access revoked." });
  } catch (error: any) {
    console.error("Delete admin error:", error);
    return NextResponse.json({ message: error?.message || "Failed to revoke admin access." }, { status: 500 });
  }
}
