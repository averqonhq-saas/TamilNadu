"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Sparkles,
  Share2,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Layers,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  RotateCcw,
  Loader2,
  Lightbulb,
} from "lucide-react";
import { ShortlistedIdea, SITE_URL } from "@/lib/constants/campaign";
import { toast } from "sonner";

interface VotingSuccessProps {
  votedIdea: ShortlistedIdea;
  maskedEmail?: string;
  votedAt?: string;
  votingEnd?: string | Date | null;
  onResetVote?: () => void;
}

export default function VotingSuccess({
  votedIdea,
  maskedEmail,
  votedAt,
  votingEnd,
  onResetVote,
}: VotingSuccessProps) {
  const [copied, setCopied] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const formattedDate = votingEnd
    ? new Date(votingEnd).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "5 September 2026";

  const productName = votedIdea.product_name || votedIdea.title;
  const productEmoji = votedIdea.emoji || "🚀";

  const effectiveSiteUrl = typeof window !== "undefined" && window.location.origin
    ? window.location.origin
    : SITE_URL;

  const shareText = `Tamil Nadu is choosing the first product we should build! I chose "${productName}" ${productEmoji}. What would you choose? Cast your vote here: ${effectiveSiteUrl}/vote`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${effectiveSiteUrl}/vote`);
      setCopied(true);
      toast.success("Voting link copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Could not copy link");
    }
  };

  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank");
  };

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank");
  };

  const handleResetVote = async () => {
    setIsResetting(true);
    try {
      await fetch("/api/vote/reset", { method: "POST" });
      toast.success("Ready to submit another vote!");
      if (onResetVote) {
        onResetVote();
      } else {
        window.location.reload();
      }
    } catch (err) {
      toast.error("Failed to reset voting session.");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="pt-24 pb-28 min-h-[85vh] bg-[#f8f7f4] flex items-center justify-center">
      <div className="container max-w-2xl">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#e2e8f0] shadow-xl text-center space-y-8 animate-scale-in">
          {/* Celebratory Badge */}
          <div className="inline-flex flex-col items-center">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#16a34a] to-[#22c55e] text-white flex items-center justify-center shadow-lg shadow-[#16a34a]/30 mb-4 animate-scale-in">
              <CheckCircle2 size={42} strokeWidth={2.5} />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#16a34a]/10 text-[#16a34a] text-xs font-bold uppercase tracking-wider">
              <ShieldCheck size={14} />
              <span>Official Choice Recorded</span>
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="font-jakarta font-extrabold text-[32px] sm:text-[42px] text-[#0a0e1a] tracking-tight leading-tight">
              Your voice has been counted. 🇮🇳
            </h1>
            <p className="text-[#e85d26] font-semibold text-[15px] font-tamil">
              உங்கள் வாக்கு வெற்றிகரமாக பதிவு செய்யப்பட்டது.
            </p>
            <p className="text-[#334155] text-[16px] sm:text-[17px] font-medium max-w-lg mx-auto leading-relaxed">
              You just helped decide what we build next for Tamil Nadu.
            </p>
          </div>

          {/* Voted Receipt Card */}
          <div className="bg-[#f8f7f4] rounded-2xl p-6 border border-[#e2e8f0] text-left space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[#64748b] border-b border-[#e2e8f0] pb-2.5">
              <span>YOU CHOSE</span>
              <span className="font-mono text-[#0a0e1a]">#{votedIdea.public_id}</span>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className="px-2.5 py-0.5 rounded text-[11px] font-bold"
                  style={{ backgroundColor: votedIdea.category_bg, color: votedIdea.category_color }}
                >
                  {votedIdea.category_name}
                </span>
              </div>
              <h2 className="font-jakarta font-extrabold text-[20px] sm:text-[22px] text-[#0a0e1a] leading-snug flex items-center gap-2">
                <span>{productName}</span>
                <span className="text-[22px]">{productEmoji}</span>
              </h2>
              <p className="text-[14px] text-[#475569] font-medium italic mt-1">
                &ldquo;{votedIdea.tagline || votedIdea.problem_description}&rdquo;
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-[#e2e8f0] text-xs text-[#64748b]">
              <span className="flex items-center gap-1 font-medium">
                <MapPin size={12} className="text-[#e85d26]" />
                {votedIdea.district}
              </span>
              {maskedEmail && (
                <span className="font-mono text-[11px] text-[#94a3b8]">
                  Verified for {maskedEmail}
                </span>
              )}
            </div>
          </div>

          {/* Voting Timeline / Reveal Banner */}
          <div className="bg-gradient-to-br from-[#060913] to-[#0f172a] text-white p-5 rounded-2xl border border-white/10 space-y-1.5 text-center">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#fb923c] uppercase">
              <Clock size={13} />
              <span>Voting Closes: {formattedDate}</span>
            </div>
            <p className="text-[14.5px] font-bold text-white leading-snug">
              We&apos;ll reveal Tamil Nadu&apos;s choice when voting closes.
            </p>
            <p className="text-xs text-white/60">
              Then Episode 3 begins: engineering & building the winning software 100% in public.
            </p>
          </div>

          {/* Viral Social Share Section */}
          <div className="space-y-3.5 pt-2">
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#0a0e1a] uppercase tracking-wider">
              <Sparkles size={14} className="text-[#e85d26]" />
              <span>Ask your friends what they would choose →</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleWhatsAppShare}
                className="btn bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center gap-2 h-12 px-6 rounded-2xl font-bold text-xs shadow-md shadow-[#25D366]/20 transition-all hover:scale-105"
              >
                <MessageCircle size={16} />
                <span>Share on WhatsApp</span>
              </button>
              <button
                onClick={handleTwitterShare}
                className="btn bg-[#000000] hover:bg-[#1a1a1a] text-white flex items-center gap-2 h-12 px-6 rounded-2xl font-bold text-xs shadow-sm transition-all hover:scale-105"
              >
                <span>Share on X</span>
              </button>
              <button
                onClick={handleCopyLink}
                className="btn btn-secondary flex items-center gap-2 h-12 px-5 rounded-2xl font-bold text-xs"
              >
                {copied ? <Check size={15} className="text-[#16a34a]" /> : <Copy size={15} />}
                <span>{copied ? "Link Copied!" : "Copy Link"}</span>
              </button>
            </div>
          </div>

          {/* Idea Submission Callout for Next Episode */}
          <div className="bg-gradient-to-br from-[#fff7ed] via-[#fffaf5] to-white rounded-2xl p-5 sm:p-6 border border-[#fed7aa] text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#ea580c] uppercase tracking-wider">
                <Lightbulb size={13} />
                <span>Have an idea of your own?</span>
              </div>
              <h3 className="font-jakarta font-bold text-[15.5px] sm:text-[17px] text-[#0a0e1a]">
                Submit a problem from your district for Episode 2
              </h3>
              <p className="text-[12.5px] text-[#64748b] leading-relaxed">
                Problem submissions remain active year-round across all 38 districts. Tell us what else Tamil Nadu needs built.
              </p>
            </div>
            <Link
              href="/submit"
              className="btn btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs flex-shrink-0 shadow-md shadow-[#e85d26]/20 w-full sm:w-auto justify-center"
              id="success-submit-idea-btn"
            >
              <span>Submit Idea</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Action Ribbon: Submit Idea, Vote Again, & Follow Build */}
          <div className="pt-5 border-t border-[#f1f5f9] flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/submit"
              className="btn btn-secondary flex items-center justify-center gap-2 h-12 px-5 rounded-2xl font-bold text-xs w-full sm:w-auto hover:border-[#e85d26] hover:text-[#e85d26] transition-all"
            >
              <Lightbulb size={15} className="text-[#e85d26]" />
              <span>Submit Another Idea</span>
            </Link>

            <button
              onClick={handleResetVote}
              disabled={isResetting}
              className="btn btn-secondary flex items-center justify-center gap-2 h-12 px-5 rounded-2xl font-bold text-xs w-full sm:w-auto hover:border-[#e85d26] hover:text-[#e85d26] transition-all"
            >
              {isResetting ? (
                <Loader2 size={15} className="animate-spin text-[#e85d26]" />
              ) : (
                <RotateCcw size={15} className="text-[#e85d26]" />
              )}
              <span>Vote Again with Another Email</span>
            </button>

            <Link
              href="/about"
              className="btn btn-primary flex items-center justify-center gap-2 h-12 px-6 rounded-2xl font-bold shadow-lg shadow-[#e85d26]/20 w-full sm:w-auto text-xs"
            >
              <span>Follow Build Journey</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <div>
            <Link href="/ideas" className="text-xs font-bold text-[#64748b] hover:text-[#0a0e1a] hover:underline">
              Browse All Submitted Ideas →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
