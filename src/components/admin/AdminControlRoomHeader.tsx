"use client";

import { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";

interface HeaderStats {
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

const DEFAULT_STATS: HeaderStats = {
  ideasCount: 0,
  groupsCount: 0,
  shortlistCount: 0,
  categoriesCount: 8,
  activeDistrictsCount: 0,
  totalDistricts: 38,
  adminsCount: 1,
};

function safeNumber(val: unknown, fallback: number = 0): number {
  if (typeof val === "number" && isFinite(val)) return val;
  return fallback;
}

function safeFormatNumber(val: unknown, fallback: string = "0"): string {
  const n = safeNumber(val);
  const [whole, fraction] = String(n).split(".");
  if (!whole) return fallback;

  const formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return fraction ? `${formattedWhole}.${fraction}` : formattedWhole;
}

export default function AdminControlRoomHeader({
  adminEmail,
  adminRole,
  initialStats,
}: {
  adminEmail?: string;
  adminRole?: string;
  initialStats?: HeaderStats;
}) {
  const [stats, setStats] = useState<HeaderStats>(() => ({
    ...DEFAULT_STATS,
    ...(initialStats || {}),
  }));

  useEffect(() => {
    fetch("/api/admin/sidebar-stats")
      .then((r) => r.json())
      .then((data) => {
        if (data && typeof data.ideasCount === "number") {
          setStats((prev) => ({ ...prev, ...data }));
        }
      })
      .catch(() => {});
  }, []);

  const count = safeNumber(stats?.ideasCount);
  const activeDistricts = safeNumber(stats?.activeDistrictsCount);
  const totalDistricts = safeNumber(stats?.totalDistricts, 38);
  const badge = stats?.votingBadge;
  const badgeText = typeof badge === "string" && badge.trim() ? "POLL " + badge.trim() : "PLATFORM LIVE";

  return (
    <header className="bg-white border-b border-[#e2e8f0] px-6 lg:px-8 py-3 sticky top-0 z-40 shadow-xs flex flex-wrap items-center justify-between gap-4">
      {/* Left: Campaign Banner & Live Phase */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider hidden sm:inline">
            Campaign:
          </span>
          <span className="font-jakarta font-extrabold text-[14.5px] text-[#0a0e1a]">
            Build Tamil Nadu <span className="text-[#e85d26]">2026</span>
          </span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 text-[11px] font-bold">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>{badgeText}</span>
        </div>
      </div>

      {/* Right: Live Vital Metrics & Public Site Link */}
      <div className="flex items-center gap-4 text-xs font-semibold text-[#64748b]">
        <div className="hidden md:flex items-center gap-3 text-[12.5px]">
          <span className="text-[#0a0e1a] font-bold font-mono">
            {safeFormatNumber(count)}
          </span>
          <span>{count === 1 ? "idea" : "ideas"}</span>
          <span>•</span>
          <span className="text-[#0a0e1a] font-bold font-mono">
            {String(activeDistricts)}/{String(totalDistricts)}
          </span>
          <span>districts</span>
        </div>

        <div className="h-4 w-px bg-[#e2e8f0] hidden md:block" />

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary btn-sm flex items-center gap-1.5 text-xs font-bold text-[#0a0e1a] hover:text-[#e85d26]"
        >
          <ExternalLink size={13} />
          <span>View Public Site</span>
        </a>
      </div>
    </header>
  );
}
