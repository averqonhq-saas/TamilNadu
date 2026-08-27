"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Lightbulb,
  GitMerge,
  Star,
  Vote,
  Megaphone,
  Tag,
  MapPin,
  Mail,
  BarChart3,
  Rocket,
  Users,
  ShieldAlert,
  Settings,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { subscribeToAdminAuth, signOutAdmin } from "@/lib/firebase/auth";
import { AppIconBadge } from "@/components/brand/Logo";

export interface SidebarStats {
  ideasCount: number;
  groupsCount: number;
  shortlistCount: number;
  votingBadge?: string;
  categoriesCount: number;
  activeDistrictsCount: number;
  totalDistricts: number;
  adminsCount: number;
  inquiriesCount?: number;
}

export default function AdminSidebar({
  role = "SUPER_ADMIN",
  userEmail = "admin@buildtamilnadu.in",
  initialStats,
}: {
  role?: string;
  userEmail?: string;
  initialStats?: SidebarStats;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [activeEmail, setActiveEmail] = useState(userEmail);
  const [activeName, setActiveName] = useState("Administrator");
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  const [stats, setStats] = useState<SidebarStats>(
    initialStats || {
      ideasCount: 0,
      groupsCount: 0,
      shortlistCount: 0,
      votingBadge: undefined,
      categoriesCount: 8,
      activeDistrictsCount: 0,
      totalDistricts: 38,
      adminsCount: 1,
    }
  );

  useEffect(() => {
    // Check localStorage fallback
    if (typeof window !== "undefined") {
      const storedEmail = localStorage.getItem("admin_email");
      const storedName = localStorage.getItem("admin_name");
      const storedPhoto = localStorage.getItem("admin_photo");
      if (storedEmail) setActiveEmail(storedEmail);
      if (storedName) setActiveName(storedName);
      if (storedPhoto) setActivePhoto(storedPhoto);
    }

    // Subscribe to Firebase Auth state
    const unsubscribe = subscribeToAdminAuth((user) => {
      if (user?.email) {
        setActiveEmail(user.email);
        setActiveName(user.displayName || "Admin");
        if (user.photoURL) setActivePhoto(user.photoURL);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchSidebarStats = async () => {
    try {
      const res = await fetch("/api/admin/sidebar-stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch {
      // Keep existing stats
    }
  };

  useEffect(() => {
    fetchSidebarStats();
  }, [pathname]);

  const navItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard", badge: undefined },
    {
      href: "/admin/ideas",
      icon: Lightbulb,
      label: "Ideas",
      badge: stats.ideasCount > 0 ? stats.ideasCount.toLocaleString() : undefined,
    },
    {
      href: "/admin/groups",
      icon: GitMerge,
      label: "Idea Groups",
      badge: stats.groupsCount > 0 ? String(stats.groupsCount) : undefined,
    },
    {
      href: "/admin/shortlist",
      icon: Star,
      label: "Shortlist",
      badge: stats.shortlistCount > 0 ? `${stats.shortlistCount} Finalists` : undefined,
    },
    {
      href: "/admin/voting",
      icon: Vote,
      label: "Voting",
      badge: stats.votingBadge,
    },
    { href: "/admin/campaign", icon: Megaphone, label: "Campaign", badge: undefined },
    {
      href: "/admin/categories",
      icon: Tag,
      label: "Categories",
      badge: stats.categoriesCount > 0 ? String(stats.categoriesCount) : undefined,
    },
    {
      href: "/admin/districts",
      icon: MapPin,
      label: "Districts",
      badge: `${stats.activeDistrictsCount}/${stats.totalDistricts}`,
    },
    {
      href: "/admin/communications",
      icon: Mail,
      label: "Communications",
      badge: stats.inquiriesCount && stats.inquiriesCount > 0 ? `${stats.inquiriesCount} New` : undefined,
    },
    { href: "/admin/analytics", icon: BarChart3, label: "Analytics", badge: undefined },
    { href: "/admin/product", icon: Rocket, label: "Product", badge: "Episode 3" },
    {
      href: "/admin/admins",
      icon: Users,
      label: "Admin Access",
      badge: stats.adminsCount > 0 ? String(stats.adminsCount) : undefined,
    },
    { href: "/admin/audit-logs", icon: ShieldAlert, label: "Audit Logs", badge: undefined },
    { href: "/admin/settings", icon: Settings, label: "Settings", badge: undefined },
  ];

  const handleSignOut = async () => {
    try {
      await signOutAdmin();
      await supabase.auth.signOut();
      if (typeof window !== "undefined") {
        localStorage.removeItem("admin_email");
        localStorage.removeItem("admin_name");
        localStorage.removeItem("admin_photo");
        localStorage.removeItem("admin_role");
      }
    } catch {
      // Ignore
    }
    router.push("/admin/login");
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#0a0e1a] text-white flex flex-col z-50 border-r border-white/10 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2.5 group">
          <AppIconBadge size={34} />
          <div>
            <span className="font-jakarta font-bold text-[14.5px] text-white block leading-none">
              Build Tamil Nadu
            </span>
            <span className="text-[10px] text-white/50 block font-mono mt-1">
              Operations Control
            </span>
          </div>
        </Link>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="System Online" />
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto custom-scrollbar" aria-label="Admin Navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isDashboard = item.href === "/admin";
          const isActive = isDashboard
            ? pathname === "/admin" || pathname === "/admin/dashboard"
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-[13px] font-medium transition-all ${
                isActive
                  ? "bg-[#e85d26] text-white font-bold shadow-md shadow-[#e85d26]/20"
                  : "text-white/65 hover:text-white hover:bg-white/[0.08]"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon size={16} className={`flex-shrink-0 ${isActive ? "text-white" : "text-white/50"}`} />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-md ${
                    item.badge === "LIVE"
                      ? "bg-emerald-500 text-white animate-pulse"
                      : isActive
                      ? "bg-white/20 text-white"
                      : "bg-white/10 text-white/60"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Google User Profile & Sign Out */}
      <div className="p-3.5 border-t border-white/10 bg-[#070b14]/80">
        <div className="bg-white/[0.04] border border-white/10 rounded-xl p-2.5 mb-2.5 flex items-center gap-2.5">
          {activePhoto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={activePhoto}
              alt="Admin Profile"
              className="w-8 h-8 rounded-lg object-cover flex-shrink-0 border border-white/20"
            />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#3b82f6] to-[#10b981] flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
              {activeEmail[0]?.toUpperCase() || "A"}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-bold text-white/40 block leading-tight uppercase tracking-wider">
              {activeName}
            </span>
            <span className="text-[12px] font-semibold text-white/90 truncate block font-mono">
              {activeEmail}
            </span>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="flex items-center justify-center gap-2 px-3 py-2 w-full text-[12.5px] font-bold text-white/60 hover:text-rose-400 transition-colors rounded-xl hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20"
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
