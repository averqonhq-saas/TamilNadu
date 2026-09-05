import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";

export type AdminRole = "SUPER_ADMIN" | "ADMIN" | "REVIEWER" | "EDITOR";

export interface AuthenticatedAdmin {
  email: string;
  role: AdminRole;
  isMaster: boolean;
  id?: string;
  is2FAVerified: boolean;
  is2FAEnrolled: boolean;
}

export interface AdminTokenPayload {
  email: string;
  role: AdminRole;
  is2FAVerified: boolean;
  is2FAEnrolled: boolean;
  timestamp: number;
}

const MASTER_ADMIN_EMAIL = "muneeswaranmd2004@gmail.com";
const ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "btn-admin-secure-session-salt-2026-auth";

const ROLE_RANK: Record<AdminRole, number> = {
  SUPER_ADMIN: 4,
  ADMIN: 3,
  REVIEWER: 2,
  EDITOR: 1,
};

export function hasRolePermission(userRole: AdminRole, requiredRole: AdminRole): boolean {
  const userRank = ROLE_RANK[userRole] || 0;
  const requiredRank = ROLE_RANK[requiredRole] || 0;
  return userRank >= requiredRank;
}

export function signAdminToken(payload: AdminTokenPayload): string {
  const data = JSON.stringify(payload);
  const hmac = crypto.createHmac("sha256", ADMIN_SESSION_SECRET).update(data).digest("hex");
  return `${Buffer.from(data).toString("base64url")}.${hmac}`;
}

export function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [encodedData, hmac] = parts;
    const data = Buffer.from(encodedData, "base64url").toString("utf-8");

    const expectedHmac = crypto
      .createHmac("sha256", ADMIN_SESSION_SECRET)
      .update(data)
      .digest("hex");

    if (!crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expectedHmac))) {
      return null;
    }

    const parsed = JSON.parse(data) as AdminTokenPayload;
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    if (Date.now() - parsed.timestamp > maxAge) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export async function verifyAdminSession(
  req: NextRequest,
  requiredRole: AdminRole = "REVIEWER",
  require2FA = true
): Promise<
  | { authorized: true; admin: AuthenticatedAdmin }
  | { authorized: false; response: NextResponse }
> {
  try {
    // 1. Extract session token from cookie or Authorization header
    const cookieToken = req.cookies.get("btn_admin_session")?.value;
    const authHeader = req.headers.get("authorization");
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    const token = cookieToken || bearerToken;

    if (!token) {
      if (process.env.NODE_ENV === "development") {
        return {
          authorized: true,
          admin: {
            email: MASTER_ADMIN_EMAIL,
            role: "SUPER_ADMIN",
            isMaster: true,
            id: "master-superadmin",
            is2FAVerified: true,
            is2FAEnrolled: false,
          },
        };
      }

      return {
        authorized: false,
        response: NextResponse.json(
          { error: "Unauthorized: Missing administrator session token." },
          { status: 401 }
        ),
      };
    }

    // 2. Verify token signature and age
    const payload = verifyAdminToken(token);
    if (!payload || !payload.email) {
      return {
        authorized: false,
        response: NextResponse.json(
          { error: "Unauthorized: Invalid or expired administrator session." },
          { status: 401 }
        ),
      };
    }

    const normalizedEmail = payload.email.trim().toLowerCase();
    const isMaster = normalizedEmail === MASTER_ADMIN_EMAIL.toLowerCase();

    let verifiedRole: AdminRole = isMaster ? "SUPER_ADMIN" : payload.role;
    let adminId: string | undefined = isMaster ? "master-superadmin" : undefined;

    // 3. Verify against database registry if Supabase is configured
    if (!isMaster && isSupabaseConfigured()) {
      const supabase = createServiceClient();
      const { data: adminUser, error } = await supabase
        .from("admin_users")
        .select("id, email, role, is_active")
        .eq("email", normalizedEmail)
        .single();

      if (error || !adminUser) {
        return {
          authorized: false,
          response: NextResponse.json(
            { error: `Access Denied: ${normalizedEmail} is not registered as an administrator.` },
            { status: 403 }
          ),
        };
      }

      if (adminUser.is_active === false) {
        return {
          authorized: false,
          response: NextResponse.json(
            { error: `Access Revoked: Administrator account ${normalizedEmail} has been deactivated.` },
            { status: 403 }
          ),
        };
      }

      verifiedRole = (adminUser.role as AdminRole) || "REVIEWER";
      adminId = adminUser.id;
    }

    // 4. Verify Role-based Access Control (RBAC) Matrix
    if (!hasRolePermission(verifiedRole, requiredRole)) {
      return {
        authorized: false,
        response: NextResponse.json(
          {
            error: `Forbidden: Action requires ${requiredRole} permission. Your current role is ${verifiedRole}.`,
          },
          { status: 403 }
        ),
      };
    }

    // 5. Mandatory Two-Factor Authentication (2FA) Check
    if (require2FA && !payload.is2FAVerified) {
      return {
        authorized: false,
        response: NextResponse.json(
          {
            error: "Forbidden: Two-factor authentication (2FA) verification is required before accessing admin operations.",
            code: "2FA_REQUIRED",
          },
          { status: 403 }
        ),
      };
    }

    return {
      authorized: true,
      admin: {
        email: normalizedEmail,
        role: verifiedRole,
        isMaster,
        id: adminId,
        is2FAVerified: payload.is2FAVerified,
        is2FAEnrolled: payload.is2FAEnrolled,
      },
    };
  } catch (error) {
    console.error("Server admin authorization error:", error);
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Internal authorization verification error." },
        { status: 500 }
      ),
    };
  }
}
