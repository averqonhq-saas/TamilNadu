"use client";

import Link from "next/link";
import {
  Lock,
  Sparkles,
  ArrowRight,
  Vote,
  Clock,
  Layers,
  ChevronRight,
  CheckCircle2,
  Users,
} from "lucide-react";
import { ShortlistedIdea } from "@/lib/constants/campaign";

interface VotingNotStartedProps {
  shortlistedIdeas: ShortlistedIdea[];
  votingStart?: string | Date | null;
}

export default function VotingNotStarted({
  shortlistedIdeas,
  votingStart,
}: VotingNotStartedProps) {
  const formattedStart = votingStart
    ? new Date(votingStart).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "September 1, 2026";

  return (
    <div className="pt-24 pb-28 min-h-[85vh] bg-[#f8f7f4]">
      <div className="container max-w-4xl space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e85d26]/10 text-[#e85d26] text-xs font-bold uppercase tracking-wider">
            <Clock size={14} />
            <span>Phase 1 • Idea Collection Active</span>
          </div>

          <h1 className="font-jakarta font-extrabold text-[36px] sm:text-[50px] text-[#0a0e1a] tracking-tight leading-tight uppercase">
            TAMIL NADU,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e85d26] to-[#f97316]">
              YOU DECIDE.
            </span>
          </h1>

          <p className="text-[#e85d26] font-semibold text-[15px] sm:text-[17px] font-tamil">
            முதலில் கேட்கிறோம். பின்னர் தமிழ்நாடு முதல் தயாரிப்பை தேர்வு செய்கிறது.
          </p>

          <p className="text-[#64748b] text-[15px] sm:text-[16px] leading-relaxed">
            We’re currently collecting problems and ideas from citizens across all 38 districts of Tamil Nadu. Once submissions close, 5 curated product finalists will go live for a state-wide public vote.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/submit"
              className="btn btn-primary btn-lg flex items-center gap-2 font-bold px-7 h-12 rounded-2xl shadow-lg shadow-[#e85d26]/20 w-full sm:w-auto justify-center"
            >
              <span>Submit Your Problem Now</span>
              <ArrowRight size={17} />
            </Link>
            <Link
              href="/ideas"
              className="btn btn-secondary flex items-center gap-2 font-bold px-6 h-12 rounded-2xl w-full sm:w-auto justify-center"
            >
              <span>Browse All Submissions</span>
            </Link>
          </div>
        </div>

        {/* Voting Process Card */}
        <div className="bg-white rounded-3xl p-7 sm:p-10 border border-[#e2e8f0] shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#e2e8f0]">
            <div>
              <span className="text-xs font-bold text-[#e85d26] uppercase tracking-wider block">
                Democratic Funnel
              </span>
              <h3 className="font-jakarta font-bold text-[20px] text-[#0a0e1a]">
                How Tamil Nadu Chooses What We Build
              </h3>
            </div>
            <span className="text-xs font-bold text-[#64748b] bg-[#f8f7f4] px-3 py-1.5 rounded-lg border border-[#e2e8f0]">
              Voting Opens: {formattedStart}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2 p-4.5 rounded-2xl bg-[#f8f7f4] border border-[#e2e8f0]">
              <span className="w-8 h-8 rounded-xl bg-[#e85d26] text-white font-bold flex items-center justify-center text-sm mb-2">
                1
              </span>
              <h4 className="font-jakarta font-bold text-[15px] text-[#0a0e1a]">
                Thousands of Submissions
              </h4>
              <p className="text-xs text-[#64748b] leading-relaxed">
                Problems voiced by citizens across 38 districts are clustered into 20–30 problem groups.
              </p>
            </div>

            <div className="space-y-2 p-4.5 rounded-2xl bg-[#f8f7f4] border border-[#e2e8f0]">
              <span className="w-8 h-8 rounded-xl bg-[#3b82f6] text-white font-bold flex items-center justify-center text-sm mb-2">
                2
              </span>
              <h4 className="font-jakarta font-bold text-[15px] text-[#0a0e1a]">
                5 Product Finalists
              </h4>
              <p className="text-xs text-[#64748b] leading-relaxed">
                Clustered problems become 5 crisp, feasible product concepts for a state-wide public poll.
              </p>
            </div>

            <div className="space-y-2 p-4.5 rounded-2xl bg-[#f8f7f4] border border-[#e2e8f0]">
              <span className="w-8 h-8 rounded-xl bg-[#16a34a] text-white font-bold flex items-center justify-center text-sm mb-2">
                3
              </span>
              <h4 className="font-jakarta font-bold text-[15px] text-[#0a0e1a]">
                Tamil Nadu Chooses ONE
              </h4>
              <p className="text-xs text-[#64748b] leading-relaxed">
                Citizens vote. The winning product is engineered 100% in public as open-source software.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
