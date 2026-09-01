import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession, signAdminToken } from "@/lib/auth/admin-auth";
import {
  verifyTOTP,
  decryptSecret,
  hashRecoveryCode,
} from "@/lib/auth/totp";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";

// Simple rate limiter for 2FA verification attempts (5 attempts per 15 minutes)
const failureTracker = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const tracker = failureTracker.get(key);

  if (!tracker || now > tracker.resetAt) {
    failureTracker.set(key, { count: 0, resetAt: now + 15 * 60 * 1000 });
    return false;
  }

  return tracker.count >= 5;
}

function recordFailure(key: string) {
  const now = Date.now();
  const tracker = failureTracker.get(key) || { count: 0, resetAt: now + 15 * 60 * 1000 };
  tracker.count++;
  failureTracker.set(key, tracker);
}

function clearFailures(key: string) {
  failureTracker.delete(key);
}

export async function POST(req: NextRequest) {
  // Authorize Step-1 Admin Session (require2FA = false)
  const auth = await verifyAdminSession(req, "REVIEWER", false);
  if (!auth.authorized) return auth.response;

  const adminEmail = auth.admin.email;
  const rateKey = `2fa-${adminEmail}`;

  if (isRateLimited(rateKey)) {
    return NextResponse.json(
      { error: "Too many failed verification attempts. Please wait 15 minutes before trying again." },
      { status: 429 }
    );
  }

  try {
    const { code, isRecoveryCode = false, secretEncrypted: clientEncryptedSecret } = await req.json();

    if (!code || typeof code !== "string" || !code.trim()) {
      return NextResponse.json(
        { error: "Please enter your 6-digit verification code or recovery code." },
        { status: 400 }
      );
    }

    const cleanCode = code.trim();
    let isVerified = false;
    let isRecoveryUsed = false;
    let encryptedSecret = clientEncryptedSecret;
    let recoveryCodes: Array<{ code_hash: string; used: boolean; used_at: string | null }> = [];
    let isFirstTimeSetup = false;

    if (isSupabaseConfigured()) {
      const supabase = createServiceClient();
      const { data: record2fa } = await supabase
        .from("admin_2fa")
        .select("*")
        .eq("admin_email", adminEmail)
        .single();

      if (record2fa) {
        encryptedSecret = record2fa.secret_encrypted;
        recoveryCodes = (record2fa.recovery_codes as any) || [];
        isFirstTimeSetup = !record2fa.enabled;
      }
    }

    if (!encryptedSecret) {
      return NextResponse.json(
        { error: "Two-factor authentication has not been initialized. Please start setup." },
        { status: 400 }
      );
    }

    // Decrypt TOTP secret
    const plainSecret = decryptSecret(encryptedSecret);

    if (isRecoveryCode) {
      // Verify against recovery code hashes
      const inputHash = hashRecoveryCode(cleanCode);
      const codeIndex = recoveryCodes.findIndex(
        (c) => c.code_hash === inputHash && !c.used
      );

      if (codeIndex !== -1) {
        isVerified = true;
        isRecoveryUsed = true;
        recoveryCodes[codeIndex].used = true;
        recoveryCodes[codeIndex].used_at = new Date().toISOString();
      }
    } else {
      // Verify standard TOTP 6-digit code
      isVerified = verifyTOTP(plainSecret, cleanCode);
    }

    if (!isVerified) {
      recordFailure(rateKey);

      // Log 2FA Verification Failed
      if (isSupabaseConfigured()) {
        try {
          const supabase = createServiceClient();
          await supabase.from("audit_logs").insert({
            admin_id: auth.admin.id || adminEmail,
            action: "2FA_VERIFICATION_FAILED",
            entity_type: "ADMIN_2FA",
            metadata: { admin_email: adminEmail, is_recovery_code: isRecoveryCode },
          });
        } catch {
          // Non-critical audit log
        }
      }

      return NextResponse.json(
        { error: isRecoveryCode ? "Invalid or previously used recovery code." : "Invalid 6-digit verification code. Please check your authenticator app." },
        { status: 400 }
      );
    }

    // Clear failure tracker on success
    clearFailures(rateKey);

    // Save/update 2FA record in database if configured
    if (isSupabaseConfigured()) {
      try {
        const supabase = createServiceClient();
        const nowIso = new Date().toISOString();

        await supabase
          .from("admin_2fa")
          .update({
            enabled: true,
            verified_at: isFirstTimeSetup ? nowIso : undefined,
            last_used_at: nowIso,
            recovery_codes: recoveryCodes as any,
          })
          .eq("admin_email", adminEmail);

        // Audit Log
        const actionType = isFirstTimeSetup
          ? "2FA_ENABLED"
          : isRecoveryUsed
          ? "RECOVERY_CODE_USED"
          : "2FA_VERIFICATION_SUCCESS";

        await supabase.from("audit_logs").insert({
          admin_id: auth.admin.id || adminEmail,
          action: actionType,
          entity_type: "ADMIN_2FA",
          metadata: { admin_email: adminEmail, first_time_enable: isFirstTimeSetup },
        });
      } catch (dbErr) {
        console.warn("2FA verify DB save fallback:", dbErr);
      }
    }

    // Issue Fully Verified 2FA Session Cookie
    const verifiedToken = signAdminToken({
      email: adminEmail,
      role: auth.admin.role,
      is2FAVerified: true,
      is2FAEnrolled: true,
      timestamp: Date.now(),
    });

    const response = NextResponse.json({
      success: true,
      token: verifiedToken,
      message: isFirstTimeSetup
        ? "Two-factor authentication enabled successfully! Welcome to Build Tamil Nadu Control Center."
        : "Identity verified successfully.",
    });

    response.cookies.set("btn_admin_session", verifiedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("2FA verification error:", error);
    return NextResponse.json(
      { error: error?.message || "An error occurred during 2FA verification." },
      { status: 500 }
    );
  }
}
