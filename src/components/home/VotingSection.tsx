"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Lock,
  Vote,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  ChevronRight,
  X,
  Layers,
  MapPin,
  Flame,
  Info,
  ShieldAlert,
  Trophy,
} from "lucide-react";
import { CampaignStatus, DEFAULT_CAMPAIGN } from "@/lib/constants/campaign";

interface VotingSectionProps {
  status?: CampaignStatus;
  id?: string;
  className?: string;
}

const LOCKED_EXAMPLES = [
  {
    id: "ex-1",
    category: "Transport",
    categoryColor: "#F59E0B",
    categoryBg: "rgba(245, 158, 11, 0.15)",
    title: "01 — Smart Bus TN 🚌 : Real-time bus tracking & crowd occupancy alerts",
    district: "Across 28 Districts",
    tag: "Citizen Shortlisted Finalist",
  },
  {
    id: "ex-2",
    category: "Healthcare",
    categoryColor: "#EF4444",
    categoryBg: "rgba(239, 68, 68, 0.15)",
    title: "02 — HealthAccess TN 🏥 : PHC medicine stock & doctor availability tracker",
    district: "Across 19 Districts",
    tag: "Citizen Shortlisted Finalist",
  },
  {
    id: "ex-3",
    category: "Education",
    categoryColor: "#3B82F6",
    categoryBg: "rgba(59, 130, 246, 0.15)",
    title: "03 — Scholarship Finder 🎓 : TN student scholarship & benefits engine",
    district: "Across 31 Districts",
    tag: "Citizen Shortlisted Finalist",
  },
];

export default function VotingSection({
  status: propStatus = DEFAULT_CAMPAIGN.status,
  id = "voting",
  className = "",
}: VotingSectionProps) {
  // campaignStatus is passed from the server — no client fetch needed
  const [status] = useState<CampaignStatus>(propStatus);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Close modal on escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        setIsModalOpen(false);
      }
    },
    [isModalOpen]
  );

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen, handleKeyDown]);

  const isCollecting = status === "COLLECTING";
  const isReviewing = status === "REVIEWING";
  const isVotingOpen = status === "VOTING";
  const isResultsOrWinner = status === "RESULTS" || status === "WINNER";
  const isBuilding = status === "BUILDING";

  const getPhaseRoadmap = () => [
    {
      step: "01",
      label: "Collect Ideas",
      labelTamil: "கருத்து சேகரிப்பு",
      isCurrent: isCollecting,
      isDone: !isCollecting,
    },
    {
      step: "02",
      label: "Shortlist & Cluster",
      labelTamil: "ஆய்வு & தொகுத்தல்",
      isCurrent: isReviewing,
      isDone: isVotingOpen || isResultsOrWinner || isBuilding,
    },
    {
      step: "03",
      label: "Public Vote",
      labelTamil: "பொது வாக்கெடுப்பு",
      isCurrent: isVotingOpen,
      isDone: isResultsOrWinner || isBuilding,
    },
    {
      step: "04",
      label: "Build & Deploy",
      labelTamil: "மென்பொருள் உருவாக்கம்",
      isCurrent: isBuilding || isResultsOrWinner,
      isDone: status === "COMPLETED",
    },
  ];

  const phases = getPhaseRoadmap();

  return (
    <section
      id={id}
      aria-label="Public Voting Information"
      className={`py-20 lg:py-28 bg-[#060913] text-white relative overflow-hidden ${className}`}
    >
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#e85d26]/12 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-[#3b82f6]/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* ================= LEFT COLUMN ================= */}
          <div className="lg:col-span-6 space-y-8">
            {/* Status Badges */}
            <div className="flex flex-wrap items-center gap-3">
              {isVotingOpen ? (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span>PUBLIC VOTING POLL IS LIVE</span>
                </div>
              ) : isResultsOrWinner ? (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f59e0b]/20 border border-[#f59e0b]/40 text-[#fbbf24] text-xs font-bold uppercase tracking-wider">
                  <Trophy size={14} className="text-[#f59e0b]" />
                  <span>Final Results &amp; Winner Announced</span>
                </div>
              ) : isReviewing ? (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3b82f6]/20 border border-[#3b82f6]/40 text-[#60a5fa] text-xs font-bold uppercase tracking-wider">
                  <Clock size={13} />
                  <span>Phase 2: Review &amp; Shortlisting</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider shadow-xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span>Phase 1: Idea Collection Live</span>
                </div>
              )}

              <span className="text-white/50 text-xs font-medium hidden sm:inline">
                {isVotingOpen
                  ? "Every verified citizen gets 1 vote."
                  : isResultsOrWinner
                  ? "Winner selected by Tamil Nadu citizens."
                  : "Democratic civic prioritization across 38 districts."}
              </span>
            </div>

            {/* Main Headline & Primary Message */}
            <div>
              <p className="text-[#fb923c] font-semibold text-[15px] sm:text-[17px] mb-2 tracking-wide font-tamil">
                First, we listen. Then, Tamil Nadu decides.
              </p>
              <h2 className="font-jakarta font-extrabold text-[32px] sm:text-[44px] lg:text-[48px] text-white tracking-tight leading-[1.1] mb-4">
                {isVotingOpen ? (
                  <>
                    Tamil Nadu Decides:{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7a45] via-[#fb923c] to-[#f59e0b]">
                      Cast Your Vote
                    </span>
                  </>
                ) : isResultsOrWinner ? (
                  <>
                    Tamil Nadu Has Decided:{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7a45] via-[#fb923c] to-[#f59e0b]">
                      Winning Product
                    </span>
                  </>
                ) : (
                  <>
                    Tamil Nadu Decides:{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7a45] via-[#fb923c] to-[#f59e0b]">
                      Choose What We Build
                    </span>
                  </>
                )}
              </h2>

              <p className="text-white/70 text-[16px] sm:text-[17px] leading-relaxed max-w-xl">
                {isVotingOpen
                  ? "Shortlisted finalists are live on the ballot. Review candidate features and vote for the solution Tamil Nadu needs most."
                  : isResultsOrWinner
                  ? "The democratic vote has concluded. View the winner podium and vote distributions across all 38 districts."
                  : "We’re collecting citizen problems across Tamil Nadu first. Once submissions close, shortlisted ideas will be put to a state-wide public vote."}
              </p>
            </div>

            {/* 4-Stage Civic Flow Roadmap */}
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-bold text-white/50 uppercase tracking-wider">
                  Live Civic Roadmap
                </span>
                <span className="text-[11px] font-bold text-[#fb923c] uppercase font-mono">
                  Phase: {status}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {phases.map((p) => {
                  return (
                    <div
                      key={p.step}
                      className={`p-3 rounded-xl border transition-all ${
                        p.isCurrent
                          ? "bg-[#e85d26]/20 border-[#e85d26] ring-2 ring-[#e85d26]/40 shadow-sm"
                          : p.isDone
                          ? "bg-white/[0.06] border-emerald-500/40 text-white"
                          : "bg-white/[0.02] border-white/5 opacity-60"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono text-[11px] font-bold text-white/60">
                          {p.step}
                        </span>
                        {p.isCurrent ? (
                          <span className="text-[10px] font-bold text-[#fb923c] bg-[#fb923c]/15 px-1.5 py-0.2 rounded">
                            Active ●
                          </span>
                        ) : p.isDone ? (
                          <span className="text-[10px] font-bold text-emerald-400">
                            ✓ Done
                          </span>
                        ) : null}
                      </div>
                      <div className="font-jakarta font-bold text-[13px] text-white leading-tight">
                        {p.label}
                      </div>
                      <div className="text-[10.5px] text-[#fb923c] font-tamil font-semibold mt-0.5 opacity-80 truncate">
                        {p.labelTamil}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
              {isVotingOpen ? (
                <Link
                  href="/vote"
                  className="btn btn-primary btn-lg flex items-center gap-2.5 shadow-xl shadow-[#e85d26]/25 hover:shadow-[#e85d26]/40 text-[15px] font-bold w-full sm:w-auto justify-center"
                  id="voting-cta-btn"
                >
                  <Vote size={18} />
                  <span>Cast Your Vote in Public Poll</span>
                  <ArrowRight size={17} />
                </Link>
              ) : isResultsOrWinner ? (
                <Link
                  href="/vote"
                  className="btn btn-primary btn-lg flex items-center gap-2.5 shadow-xl shadow-[#e85d26]/25 hover:shadow-[#e85d26]/40 text-[15px] font-bold w-full sm:w-auto justify-center"
                  id="voting-cta-btn"
                >
                  <Trophy size={18} />
                  <span>View Winner Podium</span>
                  <ArrowRight size={17} />
                </Link>
              ) : (
                <Link
                  href="/submit"
                  className="btn btn-primary btn-lg flex items-center gap-2.5 shadow-xl shadow-[#e85d26]/25 hover:shadow-[#e85d26]/40 text-[15px] font-bold w-full sm:w-auto justify-center"
                  id="voting-cta-btn"
                >
                  <span>Submit Your Idea</span>
                  <ArrowRight size={17} />
                </Link>
              )}
              <Link
                href="/vote"
                className="text-white/70 hover:text-white text-[13.5px] font-semibold underline underline-offset-4 flex items-center gap-1"
              >
                <span>{isVotingOpen ? "Inspect Ballot & Candidates" : "Preview Ballot & Timeline"}</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: VOTING PREVIEW ================= */}
          <div className="lg:col-span-6">
            <div className="relative">
              {/* Decorative Header Label */}
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/50">
                  <Vote size={14} className="text-[#fb923c]" />
                  <span>{isVotingOpen ? "Live Ballot Candidates" : "Ballot Candidate Preview"}</span>
                </div>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                  isVotingOpen
                    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
                    : "text-[#fb923c] bg-[#fb923c]/10 border-[#fb923c]/20"
                }`}>
                  {isVotingOpen ? "🗳️ Voting Open" : "🔒 Stage 03 Preview"}
                </span>
              </div>

              {/* Card Container */}
              <Link
                href="/vote"
                className="relative block bg-white/[0.03] border border-white/15 rounded-3xl p-6 sm:p-8 backdrop-blur-md group hover:border-[#fb923c]/50 transition-all duration-300 shadow-2xl focus:outline-none focus:ring-2 focus:ring-[#fb923c]"
              >
                <div className="space-y-3.5 select-none">
                  {LOCKED_EXAMPLES.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white/[0.06] border border-white/10 rounded-2xl p-4 sm:p-5 relative hover:bg-white/[0.09] transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span
                          className="text-[11.5px] font-bold px-2.5 py-0.5 rounded-lg"
                          style={{ backgroundColor: item.categoryBg, color: item.categoryColor }}
                        >
                          {item.category}
                        </span>
                        <span className="text-[11px] text-white/50 font-medium">
                          {item.tag}
                        </span>
                      </div>

                      <h4 className="font-jakarta font-bold text-[15px] text-white leading-snug mb-3">
                        {item.title}
                      </h4>

                      <div className="flex items-center justify-between text-[12px] text-white/50 pt-2 border-t border-white/5">
                        <span className="flex items-center gap-1">
                          <MapPin size={12} className="text-[#fb923c]" />
                          {item.district}
                        </span>
                        <div className="flex items-center gap-1.5 text-[#fb923c] font-bold text-xs">
                          <span>{isVotingOpen ? "Vote for this option →" : "View option →"}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {!isVotingOpen && (
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/70">
                    <span>Democratic SHA-256 voting</span>
                    <span className="text-[#fb923c] font-bold flex items-center gap-1">
                      <span>Explore candidates</span>
                      <ChevronRight size={13} />
                    </span>
                  </div>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
