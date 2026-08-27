"use client";

import Link from "next/link";
import {
  Trophy,
  Sparkles,
  ArrowRight,
  MapPin,
  Flame,
  CheckCircle2,
  Users,
  Code2,
  Share2,
} from "lucide-react";
import { ShortlistedIdea } from "@/lib/constants/campaign";

interface VotingResultsProps {
  ideas: ShortlistedIdea[];
}

export default function VotingResults({ ideas }: VotingResultsProps) {
  // Sort ideas by vote count / percentage
  const sorted = [...ideas].sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0));
  const winner = sorted[0] || ideas[0];
  const runnersUp = sorted.slice(1);

  const winnerProductName = winner.product_name || winner.title;
  const winnerEmoji = winner.emoji || "🚀";

  return (
    <div className="pt-24 pb-28 min-h-[85vh] bg-[#f8f7f4]">
      {/* Header */}
      <div className="container max-w-4xl text-center space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f59e0b]/15 border border-[#f59e0b]/30 text-[#d97706] text-xs font-bold uppercase tracking-wider">
          <Trophy size={14} />
          <span>OFFICIAL DEMOCRATIC OUTCOME</span>
        </div>

        <h1 className="font-jakarta font-extrabold text-[36px] sm:text-[50px] text-[#0a0e1a] tracking-tight leading-tight">
          Tamil Nadu Has Decided. 🏆
        </h1>

        <p className="text-[#e85d26] font-semibold text-[16px] sm:text-[18px] font-tamil">
          மக்கள் வாக்கெடுப்பின் இறுதி முடிவு — முதல் மென்பொருள் தயாரிப்பு.
        </p>

        <div className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-xs max-w-xl mx-auto space-y-1">
          <p className="text-[#0a0e1a] font-jakarta font-bold text-[18px] sm:text-[20px]">
            &ldquo;18,742 people voted. And this is what Tamil Nadu chose us to build.&rdquo;
          </p>
          <p className="text-[#64748b] text-[14px]">
            Verified citizens across all 38 districts cast their vote for the first public product.
          </p>
        </div>
      </div>

      <div className="container max-w-4xl space-y-8">
        {/* ================= WINNING PRODUCT HERO CARD ================= */}
        {winner && (
          <div className="relative bg-gradient-to-br from-[#0a0e1a] to-[#1e293b] text-white rounded-3xl p-8 sm:p-12 border-2 border-[#f59e0b] shadow-2xl overflow-hidden animate-scale-in">
            {/* Ambient gold glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#f59e0b]/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#f59e0b] text-[#0a0e1a] text-xs font-extrabold uppercase tracking-wider">
                  <Trophy size={14} />
                  <span>Tamil Nadu&apos;s #1 Choice</span>
                </span>
                <span className="text-[#f59e0b] font-mono text-sm font-bold bg-[#f59e0b]/10 px-3 py-1 rounded-lg border border-[#f59e0b]/30">
                  {winner.percentage || 42}% of Total Votes
                </span>
              </div>

              <div>
                <span
                  className="inline-block px-3 py-1 rounded-lg text-xs font-bold mb-2.5"
                  style={{ backgroundColor: winner.category_bg, color: winner.category_color }}
                >
                  {winner.category_name}
                </span>
                <h2 className="font-jakarta font-extrabold text-[28px] sm:text-[38px] text-white leading-tight flex items-center gap-3">
                  <span>{winnerProductName}</span>
                  <span className="text-[32px] sm:text-[40px]">{winnerEmoji}</span>
                </h2>
                {winner.title_tamil && (
                  <p className="text-[#fb923c] font-semibold text-[16px] font-tamil mt-1">
                    {winner.title_tamil}
                  </p>
                )}
              </div>

              <p className="text-[#fb923c] text-[16px] sm:text-[17.5px] font-medium leading-relaxed italic border-l-2 border-[#fb923c] pl-4">
                &ldquo;{winner.tagline || winner.problem_description}&rdquo;
              </p>

              <p className="text-white/80 text-[15px] leading-relaxed">
                {winner.problem_description}
              </p>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
                <Code2 size={22} className="text-[#fb923c] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-white uppercase tracking-wider block mb-0.5">
                    Episode 3: The Open-Source Build Has Begun
                  </span>
                  <p className="text-sm text-white/80 font-medium">
                    &ldquo;Okay. Tamil Nadu chose it. Now let&apos;s build it.&rdquo;
                  </p>
                  <p className="text-xs text-white/60 mt-1">
                    Sprint planning, architecture diagrams, and GitHub repository commits are underway.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/how-it-works"
                  className="btn btn-primary btn-lg flex items-center gap-2 font-bold px-7 h-12 rounded-2xl shadow-lg shadow-[#e85d26]/30"
                >
                  <span>Track the Open Build</span>
                  <ArrowRight size={17} />
                </Link>
                <Link
                  href="/ideas"
                  className="btn bg-white/10 hover:bg-white/20 text-white border border-white/10 flex items-center gap-2 font-bold px-6 h-12 rounded-2xl text-xs"
                >
                  <span>Explore Other Submissions</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ================= RUNNERS-UP LEADERBOARD ================= */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="font-jakarta font-bold text-[18px] text-[#0a0e1a]">
              Ranked Finalist Standings
            </h3>
            <span className="text-xs text-[#64748b] font-medium">
              Ranked by verified citizen votes
            </span>
          </div>

          <div className="space-y-3">
            {runnersUp.map((idea, idx) => (
              <div
                key={idea.id}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-[#e2e8f0] shadow-xs flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#f1f5f9] text-[#64748b] font-mono font-bold flex items-center justify-center text-sm flex-shrink-0">
                    #{idx + 2}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="inline-block px-2 py-0.5 rounded text-[10.5px] font-bold"
                        style={{ backgroundColor: idea.category_bg, color: idea.category_color }}
                      >
                        {idea.category_name}
                      </span>
                      <span className="text-xs text-[#64748b] font-mono">#{idea.public_id}</span>
                    </div>
                    <h4 className="font-jakarta font-bold text-[16px] sm:text-[17px] text-[#0a0e1a] flex items-center gap-2">
                      <span>{idea.product_name || idea.title}</span>
                      <span>{idea.emoji || "🚀"}</span>
                    </h4>
                    <p className="text-xs text-[#64748b] mt-0.5 italic line-clamp-1">
                      &ldquo;{idea.tagline || idea.problem_description}&rdquo;
                    </p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 font-mono text-sm font-bold text-[#0a0e1a]">
                  {idea.percentage ? `${idea.percentage}%` : "—"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
