"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ArrowRight, ShieldCheck, RefreshCw } from "lucide-react";
import { TAMIL_NADU_DISTRICTS } from "@/lib/constants/districts";

interface DistrictStat {
  name: string;
  nameTamil?: string;
  count: number;
  topCategory: string;
  voterTurnout: number;
}

export default function AdminDistrictsPage() {
  const [search, setSearch] = useState("");
  const [districts, setDistricts] = useState<DistrictStat[]>(() =>
    TAMIL_NADU_DISTRICTS.map((d) => ({
      name: d.name,
      nameTamil: d.nameTamil,
      count: 0,
      topCategory: "General",
      voterTurnout: 0,
    }))
  );
  const [activeCount, setActiveCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const loadDistrictsData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/districts");
      if (res.ok) {
        const data = await res.json();
        if (data.districts) {
          setDistricts(data.districts);
          setActiveCount(data.activeCount || 0);
        }
      }
    } catch (err) {
      console.error("Failed to fetch districts stats:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDistrictsData();
  }, []);

  const filtered = districts.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      (d.nameTamil && d.nameTamil.includes(search))
  );

  return (
    <div className="p-6 lg:p-8 max-w-6xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge badge-accent text-xs">Geographic Intelligence</span>
            <span className="text-xs text-[#64748b]">
              • {activeCount} of 38 Districts with Submissions
            </span>
          </div>
          <h1 className="font-jakarta font-extrabold text-[28px] text-[#0a0e1a]">
            Tamil Nadu District Coverage
          </h1>
          <p className="text-[#64748b] text-[15px]">
            Real-time citizen submission volumes and voting participation across all 38 districts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadDistrictsData}
            disabled={isLoading}
            className="btn btn-secondary text-xs flex items-center gap-1.5"
          >
            <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} />
            <span>Refresh Data</span>
          </button>
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200">
            <ShieldCheck size={14} />
            <span>{activeCount} Active Districts</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#e2e8f0]">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input
            type="text"
            placeholder="Search district in English or தமிழ்..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10 h-10 text-sm bg-[#f8f7f4]"
          />
        </div>
        <span className="text-xs font-bold text-[#64748b]">
          Showing {filtered.length} districts
        </span>
      </div>

      {/* Districts Table */}
      <div className="bg-white rounded-3xl border border-[#e2e8f0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13.5px]">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8f7f4] text-xs font-bold text-[#64748b]">
                <th className="text-left px-5 py-3.5">Rank</th>
                <th className="text-left px-5 py-3.5">District</th>
                <th className="text-left px-5 py-3.5">Submissions</th>
                <th className="text-left px-5 py-3.5">Top Bottleneck Category</th>
                <th className="text-right px-5 py-3.5">Public Votes Cast</th>
                <th className="text-right px-5 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {filtered.map((district, idx) => (
                <tr key={district.name} className="hover:bg-[#f8f7f4]/80 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs font-bold text-[#94a3b8]">
                    {String(idx + 1).padStart(2, "0")}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="font-jakarta font-bold text-[#0a0e1a]">
                      {district.name}
                    </div>
                    {district.nameTamil && (
                      <span className="text-xs font-tamil text-[#e85d26]">
                        {district.nameTamil}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-mono font-bold text-[#0a0e1a]">
                      {district.count}
                    </span>
                    <span className="text-xs text-[#94a3b8] ml-1">ideas</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#f1f5f9] text-[#475569]">
                      {district.topCategory}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono font-bold text-[#10b981]">
                    {district.voterTurnout.toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href={`/admin/ideas?district=${encodeURIComponent(district.name)}`}
                      className="text-xs font-bold text-[#e85d26] hover:underline inline-flex items-center gap-1"
                    >
                      <span>Filter Ideas</span>
                      <ArrowRight size={12} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
