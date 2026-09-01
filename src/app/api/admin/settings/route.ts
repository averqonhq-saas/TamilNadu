import { NextRequest, NextResponse } from "next/server";
import { getPlatformSettings, updatePlatformSettings } from "@/lib/data/settings";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { verifyAdminSession } from "@/lib/auth/admin-auth";

export async function GET(req: NextRequest) {
  const auth = await verifyAdminSession(req, "ADMIN");
  if (!auth.authorized) return auth.response;

  try {
    return NextResponse.json(getPlatformSettings());
  } catch (error) {
    console.error("Admin settings GET error:", error);
    return NextResponse.json(getPlatformSettings());
  }
}

export async function POST(req: NextRequest) {
  // Authorize Admin Session (Strictly SUPER_ADMIN required to change platform settings)
  const auth = await verifyAdminSession(req, "SUPER_ADMIN");
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json();
    const updated = updatePlatformSettings(body);

    if (isSupabaseConfigured()) {
      try {
        const supabase = createServiceClient();
        await supabase.from("audit_logs").insert({
          admin_id: auth.admin.id || auth.admin.email,
          action: "UPDATE_PLATFORM_SETTINGS",
          entity_type: "SYSTEM_CONFIG",
          metadata: { updated_by: auth.admin.email, settings: updated },
        });
      } catch (err) {
        console.warn("Audit log for settings error:", err);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Platform settings and infrastructure configuration updated successfully.",
      settings: updated,
    });
  } catch (error: any) {
    console.error("Admin settings POST error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update platform settings" },
      { status: 500 }
    );
  }
}
