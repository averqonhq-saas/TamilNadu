"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Vote,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Users,
  ChevronRight,
  X,
  AlertCircle,
  HelpCircle,
  Mail,
  Loader2,
  Check,
  TrendingUp,
  Layers,
  Building2,
} from "lucide-react";
import { ShortlistedIdea } from "@/lib/constants/campaign";
import { toast } from "sonner";

interface VotingPollProps {
  shortlistedIdeas: ShortlistedIdea[];
  votingEnd: string | Date | null;
  onVoteSuccess: (votedData: { idea: ShortlistedIdea; emailMasked: string }) => void;
}

export default function VotingPoll({
  shortlistedIdeas,
  votingEnd,
  onVoteSuccess,
}: VotingPollProps) {
  const [selectedId, setSelectedId] = useState<string>("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);

  const selectedIdea = useMemo(
    () => shortlistedIdeas.find((i) => i.id === selectedId || i.public_id === selectedId),
    [shortlistedIdeas, selectedId]
  );

  // Dynamic countdown timer
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 5,
    hours: 12,
    minutes: 45,
    seconds: 0,
  });

  useEffect(() => {
    if (!votingEnd) return;
    const target = new Date(votingEnd).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = target - now;
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [votingEnd]);

  // Request OTP
  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address to verify your vote.");
      return;
    }

    setIsRequestingOtp(true);
    try {
      const res = await fetch("/api/vote/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send verification code");

      setOtpSent(true);
      setMaskedEmail(data.masked_email || email);
      if (data.debug_code) {
        setOtp(data.debug_code); // auto-fill for frictionless verification in testing
      }
      toast.success("Verification code dispatched to your email!");
    } catch (err: any) {
      toast.error(err.message || "Could not send verification code.");
    } finally {
      setIsRequestingOtp(false);
    }
  };

  // Submit Final Vote
  const handleFinalVote = async () => {
    if (!selectedIdea) return;
    if (!email) {
      toast.error("Please enter your email to confirm your vote.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ideaId: selectedIdea.id,
          email,
          otp,
          district: selectedIdea.district,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.already_voted) {
          toast.error("A vote from this email address has already been recorded.");
          setIsConfirmOpen(false);
          return;
        }
        throw new Error(data.error || "Voting failed. Please try again.");
      }

      toast.success("Your vote has been counted! 🇮🇳");
      setIsConfirmOpen(false);
      onVoteSuccess({
        idea: selectedIdea,
        emailMasked: data.masked_email || email,
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to record vote.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-32">
      {/* ================= HERO: TAMIL NADU, YOU DECIDE ================= */}
      <div className="bg-[#060913] text-white pt-24 pb-16 lg:pb-20 border-b border-white/10 relative overflow-hidden">
        {/* Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#e85d26]/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#3b82f6]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="container relative z-10 max-w-4xl text-center space-y-5">
          {/* Status & Deadline pill */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>PUBLIC POLL IS LIVE</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/90 text-xs font-bold font-mono">
              <Clock size={13} className="text-[#fb923c]" />
              <span>
                Voting closes in {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
              </span>
            </div>
          </div>

          <h1 className="font-jakarta font-extrabold text-[36px] sm:text-[54px] lg:text-[62px] text-white tracking-tight leading-[1.05] uppercase">
            TAMIL NADU,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7a45] via-[#fb923c] to-[#f59e0b]">
              YOU DECIDE.
            </span>
          </h1>

          <div className="max-w-2xl mx-auto space-y-2">
            <p className="text-white/90 text-[16px] sm:text-[19px] font-medium leading-relaxed">
              We collected ideas from people across Tamil Nadu.
              <br className="hidden sm:inline" /> Now, these are the problems people want us to solve.
            </p>
            <p className="text-[#fb923c] font-semibold text-[15px] sm:text-[17px] font-tamil">
              இப்போது தமிழ்நாடு தீர்மானிக்கிறது. முதல் மென்பொருள் தயாரிப்பை நீங்கள் தேர்வு செய்யுங்கள்.
            </p>
          </div>

          {/* ================= THE CIVIC JOURNEY FUNNEL ================= */}
          <div className="pt-6">
            <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 bg-white/[0.04] border border-white/10 p-2.5 sm:p-3 rounded-2xl text-[11px] sm:text-[12px] text-white/70 font-semibold backdrop-blur-md">
              <span className="text-white/50">Thousands of submissions</span>
              <span className="text-[#fb923c]">→</span>
              <span className="text-white/50">20–30 problem groups</span>
              <span className="text-[#fb923c]">→</span>
              <span className="text-white/90 bg-white/10 px-2 py-0.5 rounded-lg border border-white/15">
                5 Finalists
              </span>
              <span className="text-[#fb923c]">→</span>
              <span className="text-[#fb923c] font-bold">Tamil Nadu Chooses ONE</span>
              <span className="text-[#fb923c]">→</span>
              <span className="text-emerald-400 font-bold">We Build It 🚀</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= POLL CONTENT AREA ================= */}
      <div className="container max-w-4xl pt-12 sm:pt-16 mt-5">
        {/* Section Heading */}
        <div className="text-center sm:text-left mb-8 pb-4 border-b border-[#e2e8f0]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-[#e85d26] uppercase tracking-wider block mb-1">
                The Finalist Ballot
              </span>
              <h2 className="font-jakarta font-extrabold text-[26px] sm:text-[32px] text-[#0a0e1a] tracking-tight">
                Which one should we build first?
              </h2>
            </div>
            <p className="text-[13.5px] font-bold text-[#64748b] bg-[#f8f7f4] px-3.5 py-1.5 rounded-full border border-[#e2e8f0] self-center sm:self-auto">
              You can choose only one.
            </p>
          </div>
        </div>

        {/* ================= PRODUCT CANDIDATE CARDS ================= */}
        <div className="space-y-5 mb-14" role="radiogroup" aria-label="Product finalists to vote on">
          {shortlistedIdeas.map((idea, idx) => {
            const isSelected = selectedId === idea.id || selectedId === idea.public_id;
            const displayNumber = idea.product_number || `0${idx + 1}`;
            const productName = idea.product_name || idea.title;
            const productEmoji = idea.emoji || "🚀";
            const productTagline = idea.tagline || idea.problem_description;
            const whyHereText = idea.why_is_this_here || `${idea.submitters_count} citizens submitted this problem across Tamil Nadu.`;

            return (
              <div
                key={idea.id}
                onClick={() => setSelectedId(idea.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setSelectedId(idea.id);
                  }
                }}
                role="radio"
                aria-checked={isSelected}
                tabIndex={0}
                className={`relative bg-white rounded-3xl p-6 sm:p-8 border-2 transition-all duration-200 cursor-pointer shadow-xs group hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#e85d26] ${isSelected
                    ? "border-[#e85d26] bg-[#fffaf7] ring-4 ring-[#e85d26]/15 -translate-y-0.5 shadow-md"
                    : "border-[#e2e8f0] hover:border-[#cbd5e1]"
                  }`}
              >
                {/* Accent Top Bar */}
                <div
                  className="absolute top-0 left-8 right-8 h-1 rounded-b-full transition-all"
                  style={{ backgroundColor: isSelected ? "#e85d26" : idea.category_color }}
                />

                <div className="flex items-start gap-4 sm:gap-6">
                  {/* Custom Radio Select Ring */}
                  <div className="pt-1 flex-shrink-0">
                    <div
                      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${isSelected
                          ? "border-[#e85d26] bg-[#e85d26] shadow-sm shadow-[#e85d26]/40"
                          : "border-[#cbd5e1] bg-white group-hover:border-[#94a3b8]"
                        }`}
                    >
                      {isSelected ? (
                        <div className="w-2.5 h-2.5 rounded-full bg-white animate-scale-in" />
                      ) : (
                        <span className="text-[11px] font-mono font-bold text-[#94a3b8]">
                          {displayNumber}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="flex-1 space-y-4">
                    {/* Header Row: Category Badge + Product Number */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="px-3 py-1 rounded-lg text-xs font-bold"
                          style={{
                            backgroundColor: idea.category_bg,
                            color: idea.category_color,
                          }}
                        >
                          {idea.category_name}
                        </span>
                        <span className="font-mono text-xs text-[#94a3b8]">#{idea.public_id}</span>
                      </div>

                      {idea.districts_count && (
                        <span className="text-xs text-[#64748b] font-medium flex items-center gap-1">
                          <MapPin size={12} className="text-[#e85d26]" />
                          <span>Across {idea.districts_count} Districts</span>
                        </span>
                      )}
                    </div>

                    {/* Product Concept Title & Emoji */}
                    <div>
                      <h3 className="font-jakarta font-extrabold text-[21px] sm:text-[25px] text-[#0a0e1a] leading-tight group-hover:text-[#e85d26] transition-colors flex items-center gap-2.5">
                        <span>
                          {displayNumber} — {productName}
                        </span>
                        <span className="text-[24px] sm:text-[28px]">{productEmoji}</span>
                      </h3>
                      {idea.title_tamil && (
                        <p className="text-[13.5px] font-semibold text-[#e85d26] font-tamil mt-1">
                          {idea.title_tamil}
                        </p>
                      )}
                    </div>

                    {/* Product Concept Tagline / Pitch */}
                    <p className="text-[#334155] text-[15.5px] sm:text-[16.5px] font-medium leading-relaxed italic border-l-2 border-[#e85d26]/40 pl-3">
                      &ldquo;{productTagline}&rdquo;
                    </p>

                    {/* Problem Description */}
                    <p className="text-[#64748b] text-[14px] leading-relaxed">
                      {idea.problem_description}
                    </p>

                    {/* ================= THE DEMOCRATIC PROOF: WHY IS THIS HERE? ================= */}
                    <div className="bg-[#f8f7f4] rounded-2xl p-4 sm:p-4.5 border border-[#e2e8f0] flex items-start gap-3 transition-colors group-hover:bg-[#f1f5f9]/80">
                      <div className="w-8 h-8 rounded-xl bg-[#e85d26]/10 text-[#e85d26] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Users size={16} />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[11.5px] font-extrabold text-[#0a0e1a] uppercase tracking-wider block">
                          Why is this here?
                        </span>
                        <p className="text-[13px] sm:text-[13.5px] text-[#0a0e1a] font-semibold leading-snug">
                          {whyHereText}
                        </p>
                        <p className="text-[11.5px] text-[#64748b]">
                          Synthesized directly from citizen submissions across Tamil Nadu.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= PROCESS EXPLANATION CARD ================= */}
        <div className="bg-white rounded-3xl p-7 sm:p-9 border border-[#e2e8f0] shadow-sm mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#e85d26] uppercase">
              <HelpCircle size={14} />
              <span>Civic Democracy In Action</span>
            </div>
            <h3 className="font-jakarta font-bold text-[20px] text-[#0a0e1a]">
              Why are there only 5 options?
            </h3>
            <p className="text-[#64748b] text-[14px] leading-relaxed">
              We keep the public poll focused on 5 genuinely strong, clustered product ideas. This ensures every citizen can read and compare them clearly, leading to a decisive and powerful mandate for Tamil Nadu.
            </p>
          </div>

          <Link
            href="/about"
            className="btn btn-secondary flex items-center gap-2 whitespace-nowrap font-bold text-sm h-11 px-5 rounded-xl"
          >
            <span>Explore The 7-Step Process</span>
            <ChevronRight size={15} />
          </Link>
        </div>
      </div>

      {/* ================= STICKY BOTTOM VOTING ACTION BAR ================= */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#e2e8f0] py-3.5 sm:py-4 px-4 shadow-2xl">
        <div className="container max-w-4xl flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            {selectedIdea ? (
              <div>
                <span className="text-[11px] font-bold text-[#e85d26] uppercase tracking-wider block">
                  Your Selected Choice:
                </span>
                <p className="font-jakarta font-bold text-[14.5px] sm:text-[16px] text-[#0a0e1a] truncate flex items-center gap-2">
                  <span>{selectedIdea.product_name || selectedIdea.title}</span>
                  <span>{selectedIdea.emoji || "🚀"}</span>
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-[13px] sm:text-[14px] text-[#64748b] font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#e85d26] animate-ping" />
                <span>Tap any product concept above to make your choice</span>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsConfirmOpen(true)}
            disabled={!selectedIdea}
            className="btn btn-primary btn-lg flex items-center gap-2 font-bold px-7 h-12 rounded-2xl shadow-lg shadow-[#e85d26]/25 hover:shadow-[#e85d26]/40 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            id="vote-action-btn"
          >
            <span>Make My Choice</span>
            <ArrowRight size={17} />
          </button>
        </div>
      </div>

      {/* ================= CONFIRMATION MODAL ================= */}
      {isConfirmOpen && selectedIdea && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
          onClick={() => !isSubmitting && setIsConfirmOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 sm:p-9 max-w-lg w-full text-[#0a0e1a] shadow-2xl relative animate-scale-in border border-[#e2e8f0]"
          >
            {/* Close */}
            <button
              onClick={() => setIsConfirmOpen(false)}
              disabled={isSubmitting}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#f1f5f9] hover:bg-[#e2e8f0] flex items-center justify-center text-[#64748b] transition-colors"
              aria-label="Close dialog"
            >
              <X size={16} />
            </button>

            {/* Header Badge */}
            <div className="w-12 h-12 rounded-2xl bg-[#e85d26]/10 text-[#e85d26] flex items-center justify-center mb-4">
              <Vote size={26} />
            </div>

            <span className="text-[11.5px] font-bold text-[#e85d26] uppercase tracking-wider block mb-1">
              Confirm Your Product Choice
            </span>

            <h3
              id="confirm-dialog-title"
              className="font-jakarta font-extrabold text-[22px] sm:text-[25px] text-[#0a0e1a] leading-tight mb-2"
            >
              You&apos;re choosing {selectedIdea.product_name || selectedIdea.title} {selectedIdea.emoji || "🚀"}
            </h3>

            {/* Selected Card Preview */}
            <div className="bg-[#f8f7f4] rounded-2xl p-4.5 border border-[#e2e8f0] mb-5">
              <p className="text-[13.5px] font-medium text-[#334155] italic mb-2">
                &ldquo;{selectedIdea.tagline || selectedIdea.problem_description}&rdquo;
              </p>
              <div className="flex items-center justify-between text-xs text-[#64748b] pt-2 border-t border-[#e2e8f0]">
                <span>{selectedIdea.category_name}</span>
                <span>{selectedIdea.why_is_this_here || `${selectedIdea.submitters_count} citizen requests`}</span>
              </div>
            </div>

            {/* Verification Form */}
            <form
              onSubmit={
                otpSent
                  ? (e) => {
                    e.preventDefault();
                    handleFinalVote();
                  }
                  : handleRequestOtp
              }
              className="space-y-4 mb-5"
            >
              <div>
                <label htmlFor="voter-email" className="block text-[13.5px] font-bold text-[#0a0e1a] mb-1.5">
                  Enter your email address to record your choice:
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                  <input
                    id="voter-email"
                    type="email"
                    required
                    disabled={otpSent || isSubmitting}
                    className="input pl-10 h-11 text-[14px]"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <p className="text-[12px] text-[#64748b] mt-1.5">
                  We use your email strictly to verify 1-person-1-vote and update you when Tamil Nadu&apos;s choice is announced. No spam.
                </p>
              </div>

              {otpSent && (
                <div className="animate-fade-in bg-[#f0fdf4] p-4 rounded-2xl border border-[#bbf7d0]">
                  <label htmlFor="voter-otp" className="block text-[13px] font-bold text-[#166534] mb-1.5">
                    Enter the 6-digit verification code sent to {maskedEmail}:
                  </label>
                  <input
                    id="voter-otp"
                    type="text"
                    required
                    maxLength={6}
                    autoFocus
                    className="input h-11 text-center font-mono font-bold tracking-widest text-[16px] bg-white"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
              )}
            </form>

            {/* Irreversible Notice */}
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#fffbeb] border border-[#fde68a] text-[12.5px] text-[#92400e] mb-6">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5 text-[#d97706]" />
              <span>
                <strong>Notice:</strong> Once submitted, your vote can&apos;t be changed.
              </span>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setIsConfirmOpen(false)}
                disabled={isSubmitting}
                className="btn btn-secondary flex-1 justify-center h-12 rounded-2xl font-bold"
              >
                Go Back
              </button>

              {!otpSent ? (
                <button
                  type="button"
                  onClick={handleRequestOtp}
                  disabled={!email || isRequestingOtp}
                  className="btn btn-primary flex-1 justify-center h-12 rounded-2xl font-bold shadow-md shadow-[#e85d26]/20 disabled:opacity-40"
                >
                  {isRequestingOtp ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <span>Confirm My Vote</span>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinalVote}
                  disabled={isSubmitting}
                  className="btn btn-primary flex-1 justify-center h-12 rounded-2xl font-bold shadow-md shadow-[#e85d26]/20 disabled:opacity-40"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Recording Vote...</span>
                    </>
                  ) : (
                    <span>Confirm My Vote 🇮🇳</span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
