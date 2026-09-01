import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth/admin-auth";
import {
  verifyTOTP,
  decryptSecret,
  generateRecoveryCodes,
} from "@/lib/auth/totp";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, code, targetEmail, reason } = body;

    // 1. Action: SUPER_ADMIN_RESET (Super Admin resets another admin's 2FA)
    if (action === "SUPER_ADMIN_RESET") {
      const auth = await verifyAdminSession(req, "SUPER_ADMIN", true);
      if (!auth.authorized) return auth.response;

      if (!targetEmail || typeof targetEmail !== "string") {
        return NextResponse.json(
          { error: "Target administrator email is required." },
          { status: 400 }
        );
      }

      const normalizedTarget = targetEmail.trim().toLowerCase();

      if (isSupabaseConfigured()) {
        const supabase = createServiceClient();
        await supabase
          .from("admin_2fa")
          .update({ enabled: false })
          .eq("admin_email", normalizedTarget);

        // Audit log (NEVER log TOTP secret)
        await supabase.from("audit_logs").insert({
          admin_id: auth.admin.id || auth.admin.email,
          action: "2FA_RESET",
          entity_type: "ADMIN_2FA",
          entity_id: normalizedTarget,
          metadata: {
            target_admin: normalizedTarget,
            performed_by: auth.admin.email,
            reason: reason?.trim() || "Lost authenticator device",
            timestamp: new Date().toISOString(),
          },
        });
      }

      return NextResponse.json({
        success: true,
        message: `Two-factor authentication reset for ${normalizedTarget}. They will be prompted to setup 2FA on their next login.`,
      });
    }

    // 2. Self Management Actions: Requires active 2FA-verified admin session
    const auth = await verifyAdminSession(req, "REVIEWER", true);
    if (!auth.authorized) return auth.response;

    const adminEmail = auth.admin.email;

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { error: "Current 6-digit authenticator code is required to confirm security actions." },
        { status: 400 }
      );
    }

    // Retrieve encrypted secret from database
    let plainSecret = "";
    if (isSupabaseConfigured()) {
      const supabase = createServiceClient();
      const { data: record2fa } = await supabase
        .from("admin_2fa")
        .select("secret_encrypted, enabled")
        .eq("admin_email", adminEmail)
        .single();

      if (!record2fa || !record2fa.enabled) {
        return NextResponse.json(
          { error: "Two-factor authentication is not currently active on this account." },
          { status: 400 }
        );
      }

      plainSecret = decryptSecret(record2fa.secret_encrypted);
    }

    // Verify current TOTP code
    const isCodeValid = plainSecret ? verifyTOTP(plainSecret, code) : false;
    if (!isCodeValid) {
      return NextResponse.json(
        { error: "Invalid 6-digit verification code. Confirmation failed." },
        { status: 400 }
      );
    }

    // Action: REGENERATE_RECOVERY_CODES
    if (action === "REGENERATE_RECOVERY_CODES") {
      const { formattedCodes, hashedCodes } = generateRecoveryCodes(8);

      if (isSupabaseConfigured()) {
        const supabase = createServiceClient();
        await supabase
          .from("admin_2fa")
          .update({ recovery_codes: hashedCodes as any })
          .eq("admin_email", adminEmail);

        await supabase.from("audit_logs").insert({
          admin_id: auth.admin.id || adminEmail,
          action: "RECOVERY_CODES_REGENERATED",
          entity_type: "ADMIN_2FA",
          metadata: { admin_email: adminEmail },
        });
      }

      return NextResponse.json({
        success: true,
        recoveryCodes: formattedCodes,
        message: "New recovery codes generated. Old recovery codes are now invalid.",
      });
    }

    // Action: DISABLE_2FA
    if (action === "DISABLE_2FA") {
      if (isSupabaseConfigured()) {
        const supabase = createServiceClient();
        await supabase
          .from("admin_2fa")
          .update({ enabled: false })
          .eq("admin_email", adminEmail);

        await supabase.from("audit_logs").insert({
          admin_id: auth.admin.id || adminEmail,
          action: "2FA_DISABLED",
          entity_type: "ADMIN_2FA",
          metadata: { admin_email: adminEmail },
        });
      }

      return NextResponse.json({
        success: true,
        message: "Two-factor authentication has been disabled.",
      });
    }

    return NextResponse.json({ error: "Invalid management action." }, { status: 400 });
  } catch (error: any) {
    console.error("2FA management error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process 2FA management request." },
      { status: 500 }
    );
  }
}
