import { cookies, headers } from "next/headers";
import { NextRequest } from "next/server";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import AdminLayoutShell from "@/components/admin/AdminLayoutShell";
import { verifyAdminToken, AuthenticatedAdmin } from "@/lib/auth/admin-auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Operations Dashboard — Build Tamil Nadu Admin",
  robots: { index: false, follow: false },
};

const MASTER_ADMIN_EMAIL = "muneeswaranmd2004@gmail.com";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userEmail: string | null = null;
  let userRole: string | null = null;

  let initialStats = {
    ideasCount: 0,
    groupsCount: 0,
    shortlistCount: 0,
    votingBadge: undefined as string | undefined,
    categoriesCount: 8,
    activeDistrictsCount: 0,
    totalDistricts: 38,
    adminsCount: 1,
    inquiriesCount: 0,
  };

  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("btn_admin_session")?.value;

    if (sessionToken) {
      const payload = verifyAdminToken(sessionToken);
      if (payload?.email) {
        userEmail = payload.email.trim().toLowerCase();
        userRole = payload.role || "REVIEWER";
      }
    }

    if (isSupabaseConfigured()) {
      const supabase = createServiceClient();

      const [
        { count: ideasTotal },
        { count: groupsTotal },
        { count: shortlistedTotal },
        { count: activeCategories },
        { data: districtData },
        { count: adminUsersTotal },
        { count: newInquiriesTotal },
      ] = await Promise.all([
        supabase.from("ideas").select("*", { count: "exact", head: true }),
        supabase.from("idea_groups").select("*", { count: "exact", head: true }),
        supabase.from("ideas").select("*", { count: "exact", head: true }).eq("status", "SHORTLISTED"),
        supabase.from("categories").select("*", { count: "exact", head: true }).eq("active", true),
        supabase.from("ideas").select("district"),
        supabase.from("admin_users").select("*", { count: "exact", head: true }),
        supabase.from("inquiries").select("*", { count: "exact", head: true }).eq("status", "NEW"),
      ]);

      initialStats.ideasCount = ideasTotal ?? 0;
      initialStats.groupsCount = groupsTotal ?? 0;
      initialStats.shortlistCount = shortlistedTotal ?? 0;
      initialStats.categoriesCount = activeCategories ?? 8;
      initialStats.adminsCount = adminUsersTotal && adminUsersTotal > 0 ? adminUsersTotal : 1;
      initialStats.inquiriesCount = newInquiriesTotal ?? 0;

      if (districtData) {
        const unique = new Set(
          (districtData as Array<{ district: string }>).map((d) => d.district).filter(Boolean)
        );
        initialStats.activeDistrictsCount = unique.size;
      }
    }
  } catch {
    // Session fallback
  }

  return (
    <AdminLayoutShell
      userEmail={userEmail || undefined}
      userRole={userRole || undefined}
      initialStats={initialStats}
    >
      {children}
    </AdminLayoutShell>
  );
}
