"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { subscribeToAdminAuth, signOutAdmin } from "@/lib/firebase/auth";
import AdminSidebar, { SidebarStats } from "@/components/admin/AdminSidebar";
import AdminControlRoomHeader from "@/components/admin/AdminControlRoomHeader";
import { AppIconBadge } from "@/components/brand/Logo";
import { ShieldCheck, Loader2, Lock } from "lucide-react";

interface AdminUserSession {
  email: string;
  role: string;
  name?: string;
  photo?: string;
}

export default function AdminLayoutShell({
  children,
  userEmail: serverUserEmail = "admin@buildtamilnadu.in",
  userRole: serverUserRole = "SUPER_ADMIN",
  initialStats,
}: {
  children: React.ReactNode;
  userEmail?: string;
  userRole?: string;
  initialStats?: SidebarStats;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";

  const [isCheckingAuth, setIsCheckingAuth] = useState(!isLoginPage);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminSession, setAdminSession] = useState<AdminUserSession | null>(null);

  useEffect(() => {
    // Login page manages its own view
    if (isLoginPage) {
      setIsCheckingAuth(false);
      return;
    }

    // Strict Client-Side Route Protection Guard
    const unsubscribe = subscribeToAdminAuth(async (firebaseUser) => {
      if (!firebaseUser || !firebaseUser.email) {
        // No active Firebase session -> Redirect to login
        setIsAuthenticated(false);
        setAdminSession(null);
        setIsCheckingAuth(false);
        router.replace("/admin/login");
        return;
      }

      try {
        // Verify against backend authorized admin registry
        const verifyRes = await fetch("/api/admin/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: firebaseUser.email }),
        });

        const authData = await verifyRes.json();

        if (verifyRes.ok && authData.authorized) {
          // Authorized Admin Session
          const session: AdminUserSession = {
            email: firebaseUser.email,
            role: authData.role || "ADMIN",
            name: firebaseUser.displayName || "Administrator",
            photo: firebaseUser.photoURL || undefined,
          };
          setAdminSession(session);
          setIsAuthenticated(true);
          setIsCheckingAuth(false);
        } else {
          // Unauthorized email: revoke Firebase session and redirect
          await signOutAdmin();
          if (typeof window !== "undefined") {
            localStorage.removeItem("admin_email");
            localStorage.removeItem("admin_name");
            localStorage.removeItem("admin_photo");
            localStorage.removeItem("admin_role");
          }
          setIsAuthenticated(false);
          setAdminSession(null);
          setIsCheckingAuth(false);
          router.replace("/admin/login?error=unauthorized");
        }
      } catch (err) {
        console.error("Admin route verification error:", err);
        setIsAuthenticated(false);
        setIsCheckingAuth(false);
        router.replace("/admin/login");
      }
    });

    return () => unsubscribe();
  }, [isLoginPage, router]);

  // If on login page, render full width
  if (isLoginPage) {
    return <main className="min-h-screen w-full bg-[#06080f]">{children}</main>;
  }

  // Security Verification Guard: Do not display any dashboard UI while validating credentials
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen w-full bg-[#06080f] text-white flex flex-col items-center justify-center p-6 select-none relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_-10%,rgba(232,93,38,0.15),transparent)] pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center max-w-sm text-center space-y-5">
          <AppIconBadge size={48} />
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold font-mono">
              <Lock size={12} />
              <span>SECURE OPERATIONS ACCESS</span>
            </div>
            <h2 className="font-jakarta font-bold text-xl text-white">
              Verifying Authorization
            </h2>
            <p className="text-white/50 text-xs leading-relaxed">
              Validating administrator credentials and security permissions...
            </p>
          </div>
          <div className="flex items-center gap-2 text-white/60 text-xs font-mono pt-2">
            <Loader2 size={16} className="animate-spin text-[#e85d26]" />
            <span>Establishing secure session</span>
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated after check, show redirect screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-[#06080f] text-white flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <Loader2 size={24} className="animate-spin text-[#e85d26] mx-auto" />
          <p className="text-sm text-white/60">Redirecting to administrator login...</p>
        </div>
      </div>
    );
  }

  const effectiveEmail = adminSession?.email || serverUserEmail;
  const effectiveRole = adminSession?.role || serverUserRole;

  return (
    <div className="flex min-h-screen bg-[#f8f7f4]">
      <AdminSidebar role={effectiveRole} userEmail={effectiveEmail} initialStats={initialStats} />
      <div className="flex-1 ml-64 min-h-screen flex flex-col">
        <AdminControlRoomHeader adminEmail={effectiveEmail} adminRole={effectiveRole} initialStats={initialStats} />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
