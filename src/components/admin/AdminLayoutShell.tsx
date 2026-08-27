"use client";

import { usePathname } from "next/navigation";
import AdminSidebar, { SidebarStats } from "@/components/admin/AdminSidebar";
import AdminControlRoomHeader from "@/components/admin/AdminControlRoomHeader";

export default function AdminLayoutShell({
  children,
  userEmail = "admin@buildtamilnadu.in",
  userRole = "SUPER_ADMIN",
  initialStats,
}: {
  children: React.ReactNode;
  userEmail?: string;
  userRole?: string;
  initialStats?: SidebarStats;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <main className="min-h-screen w-full bg-[#06080f]">{children}</main>;
  }

  return (
    <div className="flex min-h-screen bg-[#f8f7f4]">
      <AdminSidebar role={userRole} userEmail={userEmail} initialStats={initialStats} />
      <div className="flex-1 ml-64 min-h-screen flex flex-col">
        <AdminControlRoomHeader adminEmail={userEmail} adminRole={userRole} initialStats={initialStats} />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
