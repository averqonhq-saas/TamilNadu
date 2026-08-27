import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import AdminLayoutShell from "@/components/admin/AdminLayoutShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Operations Dashboard — Build Tamil Nadu Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userEmail = "admin@buildtamilnadu.in";
  let userRole = "SUPER_ADMIN";
  let initialStats = {
    ideasCount: 0,
    groupsCount: 0,
    shortlistCount: 0,
    votingBadge: undefined as string | undefined,
    categoriesCount: 8,
    activeDistrictsCount: 0,
    totalDistricts: 38,
    adminsCount: 1,
  };

  try {
    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user?.email) {
        userEmail = user.email;
        const { data: adminUser } = await supabase
          .from("admin_users")
          .select("role")
          .eq("email", user.email)
          .single();

        if (adminUser?.role) {
          userRole = adminUser.role;
        }
      }

      const [
        { count: ideasTotal },
        { count: groupsTotal },
        { count: shortlistedTotal },
        { count: activeCategories },
        { data: districtData },
        { count: adminUsersTotal },
      ] = await Promise.all([
        supabase.from("ideas").select("*", { count: "exact", head: true }),
        supabase.from("idea_groups").select("*", { count: "exact", head: true }),
        supabase.from("ideas").select("*", { count: "exact", head: true }).eq("status", "SHORTLISTED"),
        supabase.from("categories").select("*", { count: "exact", head: true }).eq("active", true),
        supabase.from("ideas").select("district"),
        supabase.from("admin_users").select("*", { count: "exact", head: true }),
      ]);

      initialStats.ideasCount = ideasTotal ?? 0;
      initialStats.groupsCount = groupsTotal ?? 0;
      initialStats.shortlistCount = shortlistedTotal ?? 0;
      initialStats.categoriesCount = activeCategories ?? 8;
      initialStats.adminsCount = adminUsersTotal && adminUsersTotal > 0 ? adminUsersTotal : 1;

      if (districtData) {
        const unique = new Set(
          (districtData as Array<{ district: string }>).map((d) => d.district).filter(Boolean)
        );
        initialStats.activeDistrictsCount = unique.size;
      }
    }
  } catch {
    // Development or fallback session
  }

  return (
    <AdminLayoutShell
      userEmail={userEmail}
      userRole={userRole}
      initialStats={initialStats}
    >
      {children}
    </AdminLayoutShell>
  );
}
