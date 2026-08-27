"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  Vote,
  MapPin,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  Lightbulb,
  CheckCircle2,
} from "lucide-react";

export default function AdminAnalyticsPage() {
  const [ideasCount, setIdeasCount] = useState(0);
  const [districtsCount, setDistrictsCount] = useState(0);
  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    fetch("/api/admin/sidebar-stats")
      .then((r) => r.json())
      .then((data) => {
        if (data) {
          setIdeasCount(data.ideasCount || 0);
          setDistrictsCount(data.activeDistrictsCount || 0);
        }
      })
      .catch(() => {});

    fetch("/api/admin/voting")
      .then((r) => r.json())
      .then((data) => {
        if (data && data.total_votes !== undefined) {
          setTotalVotes(data.total_votes);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="p-6 lg:p-8 max-w-6xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge badge-accent text-xs">Deep Metrics</span>
            <span className="text-xs text-[#64748b]">• Real-Time Analytics</span>
          </div>
          <h1 className="font-jakarta font-extrabold text-[28px] text-[#0a0e1a]">
            Campaign Analytics &amp; Participation
          </h1>
          <p className="text-[#64748b] text-[15px]">
            In-depth engagement metrics across all phases of Build Tamil Nadu.
          </p>
        </div>
      </div>

      {/* 4 Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold text-[#64748b] block mb-1">IDEAS INGESTED</span>
          <div className="text-[28px] font-jakarta font-extrabold text-[#e85d26]">
            {ideasCount.toLocaleString()}
          </div>
          <span className="text-[11.5px] text-[#64748b] font-medium block mt-0.5">
            Total citizen submissions
          </span>
        </div>

        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold text-[#64748b] block mb-1">DISTRICT REACH</span>
          <div className="text-[28px] font-jakarta font-extrabold text-[#3b82f6]">
            {districtsCount} / 38
          </div>
          <span className="text-[11.5px] text-[#3b82f6] font-semibold block mt-0.5">
            Active districts with ideas
          </span>
        </div>

        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold text-[#64748b] block mb-1">PUBLIC VOTES</span>
          <div className="text-[28px] font-jakarta font-extrabold text-emerald-600">
            {totalVotes.toLocaleString()}
          </div>
          <span className="text-[11.5px] text-emerald-600 font-semibold block mt-0.5">
            Verified votes recorded
          </span>
        </div>

        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold text-[#64748b] block mb-1">TELEMETRY STATUS</span>
          <div className="text-[28px] font-jakarta font-extrabold text-[#10b981] flex items-center gap-2">
            <CheckCircle2 size={24} className="text-[#10b981]" />
            <span className="text-xl">Active</span>
          </div>
          <span className="text-[11.5px] text-[#10b981] font-semibold block mt-0.5">
            Connected to Supabase DB
          </span>
        </div>
      </div>
    </div>
  );
}
