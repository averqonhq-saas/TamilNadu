"use client";

import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";

interface HeaderStats {
  ideasCount?: unknown;
  activeDistrictsCount?: unknown;
  totalDistricts?: unknown;
  votingBadge?: unknown;
}

const DEFAULT_STATS: Required<Pick<HeaderStats, "ideasCount" | "activeDistrictsCount" | "totalDistricts">> = {
  ideasCount: 0,
  activeDistrictsCount: 0,
  totalDistricts: 38,
};

function numberValue(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function formatNumber(value: unknown): string {
  return String(numberValue(value)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function AdminControlRoomHeaderSafe({
  initialStats,
}: {
  adminEmail?: string;
  adminRole?: string;
  initialStats?: HeaderStats;
}) {
  const [stats, setStats] = useState<HeaderStats>({ ...DEFAULT_STATS, ...initialStats });

  useEffect(() => {
    fetch("/api/admin/sidebar-stats")
      .then((response) => (response.ok ? response.json() : null))
      .then((data: HeaderStats | null) => {
        if (data && typeof data === "object") setStats((current) => ({ ...current, ...data }));
      })
      .catch(() => undefined);
  }, []);

  const ideaCount = numberValue(stats.ideasCount);
  const districtCount = numberValue(stats.activeDistrictsCount);
  const districtTotal = numberValue(stats.totalDistricts, 38);
  const badgeText = typeof stats.votingBadge === "string" && stats.votingBadge.trim()
    ? `POLL ${stats.votingBadge.trim()}`
    : "PLATFORM LIVE";

  return (
    <header className="bg-white border-b border-[#e2e8f0] px-6 lg:px-8 py-3 sticky top-0 z-40 shadow-xs flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider hidden sm:inline">Campaign:</span>
          <span className="font-jakarta font-extrabold text-[14.5px] text-[#0a0e1a]">Build Tamil Nadu <span className="text-[#e85d26]">2026</span></span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 text-[11px] font-bold">
          <i className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" aria-hidden="true" />
          <span>{badgeText}</span>
        </div>
      </div>
      <div className="flex items-center gap-4 text-xs font-semibold text-[#64748b]">
        <div className="hidden md:flex items-center gap-3 text-[12.5px]">
          <span className="text-[#0a0e1a] font-bold font-mono">{formatNumber(ideaCount)}</span>
          <span>{ideaCount === 1 ? "idea" : "ideas"}</span><span>•</span>
          <span className="text-[#0a0e1a] font-bold font-mono">{districtCount}/{districtTotal}</span><span>districts</span>
        </div>
        <div className="h-4 w-px bg-[#e2e8f0] hidden md:block" />
        <a href="/" target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm flex items-center gap-1.5 text-xs font-bold text-[#0a0e1a] hover:text-[#e85d26]">
          <ExternalLink size={13} /><span>View Public Site</span>
        </a>
      </div>
    </header>
  );
}
