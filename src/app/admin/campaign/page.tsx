"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Megaphone,
  Calendar,
  Save,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Rocket,
  Trophy,
  ExternalLink,
  Sparkles,
  Loader2,
} from "lucide-react";
import { CampaignStatus, CAMPAIGN_STATUS_LABELS } from "@/lib/constants/campaign";
import { toast } from "sonner";

const PHASES: { status: CampaignStatus; label: string; desc: string; color: string }[] = [
  {
    status: "PRE_LAUNCH",
    label: "Pre-Launch (Coming Soon)",
    desc: "Teaser screen active. Submissions and voting are disabled.",
    color: "#64748b",
  },
  {
    status: "COLLECTING",
    label: "Idea Collection (Live)",
    desc: "Citizens submit problems across 38 districts. Voice + text enabled.",
    color: "#10b981",
  },
  {
    status: "REVIEWING",
    label: "Under Review & Clustering",
    desc: "Submissions closed. Team groups ideas and curates top 5 finalists.",
    color: "#3b82f6",
  },
  {
    status: "VOTING",
    label: "Public Voting (Live Poll)",
    desc: "5 finalists open for state-wide public vote. 1 person = 1 vote.",
    color: "#e85d26",
  },
  {
    status: "RESULTS",
    label: "Results & Winner Announced",
    desc: "Podium view active. Reveals Tamil Nadu's choice and vote share.",
    color: "#d97706",
  },
  {
    status: "BUILDING",
    label: "Episode 3: Building in Public",
    desc: "Engineering team builds the winning product open-source.",
    color: "#8b5cf6",
  },
  {
    status: "COMPLETED",
    label: "Completed & Deployed",
    desc: "Software delivered to citizens and municipal stakeholders.",
    color: "#059669",
  },
];

export default function AdminCampaignPage() {
  const [currentStatus, setCurrentStatus] = useState<CampaignStatus>("COLLECTING");
  const [collectionStart, setCollectionStart] = useState("2026-08-17");
  const [collectionEnd, setCollectionEnd] = useState("2026-09-01");
  const [votingStart, setVotingStart] = useState("2026-09-01");
  const [votingEnd, setVotingEnd] = useState("2026-09-05");
  const [allowEarlyResults, setAllowEarlyResults] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/campaign")
      .then((res) => res.json())
      .then((data) => {
        if (data.status) setCurrentStatus(data.status);
        if (data.collection_start) setCollectionStart(new Date(data.collection_start).toISOString().split("T")[0]);
        if (data.collection_end) setCollectionEnd(new Date(data.collection_end).toISOString().split("T")[0]);
        if (data.voting_start) setVotingStart(new Date(data.voting_start).toISOString().split("T")[0]);
        if (data.voting_end) setVotingEnd(new Date(data.voting_end).toISOString().split("T")[0]);
        if (data.allow_results_before_close !== undefined) setAllowEarlyResults(data.allow_results_before_close);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        status: currentStatus,
        collection_start: collectionStart,
        collection_end: collectionEnd,
        voting_start: votingStart,
        voting_end: votingEnd,
        allow_results: allowEarlyResults,
        allow_results_before_close: allowEarlyResults,
      };

      const [res1, res2] = await Promise.all([
        fetch("/api/campaign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
        fetch("/api/admin/voting", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "UPDATE_STATUS", ...payload }),
        }),
      ]);

      if (res1.ok || res2.ok) {
        toast.success(`Platform phase switched to ${currentStatus}! Entire website updated.`);
      } else {
        toast.error("Failed to update status.");
      }
    } catch {
      toast.error("Network error updating status.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge badge-accent text-xs">Master Switchboard</span>
            <span className="text-xs text-[#64748b]">• Real-time Platform Control</span>
          </div>
          <h1 className="font-jakarta font-extrabold text-[28px] sm:text-[32px] text-[#0a0e1a]">
            Campaign Phase &amp; Schedule Controller
          </h1>
          <p className="text-[#64748b] text-[15px]">
            Switch active platform modes across the entire website instantly.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="btn btn-primary btn-sm flex items-center gap-2 font-bold px-6 h-11 rounded-xl shadow-lg shadow-[#e85d26]/20"
        >
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={15} />}
          <span>{isSaving ? "Applying..." : "Save & Apply Changes"}</span>
        </button>
      </div>

      {/* Active Phase Selector */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2e8f0] shadow-xs space-y-6">
        <div>
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-jakarta font-bold text-[18px] text-[#0a0e1a]">
              1. Choose Active Platform Phase
            </h2>
            <span className="font-mono text-xs font-bold text-[#e85d26] bg-[#e85d26]/10 px-3 py-1 rounded-full border border-[#e85d26]/20">
              Active: {currentStatus}
            </span>
          </div>
          <p className="text-xs text-[#64748b]">
            Selecting a phase shifts the public website&apos;s primary calls to action, navbars, and voting ballot state.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {PHASES.map((phase) => {
            const isSelected = currentStatus === phase.status;

            return (
              <div
                key={phase.status}
                onClick={() => setCurrentStatus(phase.status)}
                className={`p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                  isSelected
                    ? "border-[#e85d26] bg-[#fffaf7] ring-4 ring-[#e85d26]/15 shadow-sm"
                    : "border-[#e2e8f0] bg-white hover:border-[#cbd5e1] hover:bg-[#f8f7f4]/60"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span
                    className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-md"
                    style={{
                      backgroundColor: `${phase.color}15`,
                      color: phase.color,
                    }}
                  >
                    {phase.status}
                  </span>
                  {isSelected && <CheckCircle2 size={16} className="text-[#e85d26]" />}
                </div>

                <h3 className="font-jakarta font-bold text-[15.5px] text-[#0a0e1a] mb-1">
                  {phase.label}
                </h3>
                <p className="text-xs text-[#64748b] leading-relaxed">{phase.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Campaign Timeline Dates */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2e8f0] shadow-xs space-y-6">
        <div>
          <h2 className="font-jakarta font-bold text-[18px] text-[#0a0e1a] mb-1">
            2. Campaign Lifecycle Milestones
          </h2>
          <p className="text-xs text-[#64748b]">
            Configure the official deadline timestamps shown across the public website.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-4 p-5 rounded-2xl bg-[#f8f7f4] border border-[#e2e8f0]">
            <span className="text-xs font-bold text-[#e85d26] uppercase tracking-wider block">
              Phase 1: Idea Collection
            </span>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#0a0e1a] mb-1">Collection Start:</label>
                <input
                  type="date"
                  value={collectionStart}
                  onChange={(e) => setCollectionStart(e.target.value)}
                  className="input h-10 text-sm bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0a0e1a] mb-1">Collection End:</label>
                <input
                  type="date"
                  value={collectionEnd}
                  onChange={(e) => setCollectionEnd(e.target.value)}
                  className="input h-10 text-sm bg-white"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 p-5 rounded-2xl bg-[#f8f7f4] border border-[#e2e8f0]">
            <span className="text-xs font-bold text-[#3b82f6] uppercase tracking-wider block">
              Phase 3: Public Voting
            </span>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#0a0e1a] mb-1">Voting Opens:</label>
                <input
                  type="date"
                  value={votingStart}
                  onChange={(e) => setVotingStart(e.target.value)}
                  className="input h-10 text-sm bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0a0e1a] mb-1">Voting Closes:</label>
                <input
                  type="date"
                  value={votingEnd}
                  onChange={(e) => setVotingEnd(e.target.value)}
                  className="input h-10 text-sm bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Ribbon */}
      <div className="pt-2 flex items-center justify-between">
        <Link
          href="/vote"
          target="_blank"
          className="text-xs font-bold text-[#e85d26] flex items-center gap-1 hover:underline"
        >
          <span>Verify public ballot (/vote)</span>
          <ExternalLink size={13} />
        </Link>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="btn btn-primary font-bold px-7 h-11 rounded-xl shadow-lg shadow-[#e85d26]/20"
        >
          <span>Save &amp; Apply Changes</span>
        </button>
      </div>
    </div>
  );
}
