import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth/admin-auth";
import {
  generateTOTPSecret,
  generateOtpauthUri,
  generateSVGQRCode,
  encryptSecret,
  generateRecoveryCodes,
} from "@/lib/auth/totp";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  // Authorize Step-1 Admin Session (require2FA = false)
  const auth = await verifyAdminSession(req, "REVIEWER", false);
  if (!auth.authorized) return auth.response;

  try {
    const adminEmail = auth.admin.email;

    // Generate new TOTP secret & recovery codes
    const secret = generateTOTPSecret();
    const otpauthUri = generateOtpauthUri(adminEmail, secret);
    const qrCodeSvg = await generateSVGQRCode(otpauthUri);
    const encryptedSecret = encryptSecret(secret);
    const { formattedCodes, hashedCodes } = generateRecoveryCodes(8);

    // Save temporary 2FA setup in database if configured
    if (isSupabaseConfigured()) {
      const supabase = createServiceClient();

      // Check if existing record
      const { data: existing } = await supabase
        .from("admin_2fa")
        .select("id, enabled")
        .eq("admin_email", adminEmail)
        .single();

      if (existing) {
        if (existing.enabled) {
          return NextResponse.json(
            { error: "Two-factor authentication is already enabled for this account." },
            { status: 400 }
          );
        }
        await supabase
          .from("admin_2fa")
          .update({
            secret_encrypted: encryptedSecret,
            recovery_codes: hashedCodes as any,
          })
          .eq("admin_email", adminEmail);
      } else {
        await supabase.from("admin_2fa").insert({
          admin_email: adminEmail,
          enabled: false,
          secret_encrypted: encryptedSecret,
          recovery_codes: hashedCodes as any,
        });
      }

      // Log 2FA Setup Started audit log
      try {
        await supabase.from("audit_logs").insert({
          admin_id: auth.admin.id || adminEmail,
          action: "2FA_SETUP_STARTED",
          entity_type: "ADMIN_2FA",
          metadata: { admin_email: adminEmail },
        });
      } catch {
        // Non-critical audit log
      }
    }

    return NextResponse.json({
      success: true,
      qrCodeSvg,
      setupKey: secret,
      recoveryCodes: formattedCodes,
      secretEncrypted: encryptedSecret, // sent to client ONLY during setup phase for local mode
      message: "Scan the QR code with your authenticator app (Google Authenticator, Authy, 1Password).",
    });
  } catch (error: any) {
    console.error("2FA Setup error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to initialize 2FA setup." },
      { status: 500 }
    );
  }
}
