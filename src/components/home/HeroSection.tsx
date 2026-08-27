// HeroSection is now a SERVER component.
// The static heading, description, CTAs, and category chips render as plain HTML
// with zero client JS — the LCP element paints instantly.
// Only the interactive idea carousel (HeroCarousel) is a "use client" component.
import Link from "next/link";
import { Suspense } from "react";
import {
  ChevronRight,
  Mic,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import type { CampaignStatus } from "@/lib/constants/campaign";
import HeroCarousel from "./HeroCarousel";

const QUICK_CATEGORIES = [
  { id: "agriculture", label: "🌾 Agriculture" },
  { id: "healthcare", label: "🏥 Healthcare" },
  { id: "transport", label: "🚌 Transport" },
  { id: "education", label: "🎓 Education" },
  { id: "jobs", label: "💼 Jobs & MSMEs" },
  { id: "public-services", label: "🏛️ Civic Services" },
];

const DYNAMIC_WORDS_FIRST = "Tamil Nadu";

function getHeroPill(campaignStatus: CampaignStatus) {
  switch (campaignStatus) {
    case "VOTING":
      return {
        label: "Phase 3 : Public Voting Live 🗳️",
        dotColor: "bg-emerald-400",
        ctaHref: "/vote",
        ctaLabel: "Cast Your Vote Now",
        secHref: "/vote",
        secLabel: "Explore Candidates",
      };
    case "RESULTS":
    case "WINNER":
      return {
        label: "Phase 4 : Results & Winner Announced 🏆",
        dotColor: "bg-amber-400",
        ctaHref: "/vote",
        ctaLabel: "View Winner Podium",
        secHref: "/ideas",
        secLabel: "Browse All Submissions",
      };
    case "BUILDING":
      return {
        label: "Phase 5 : Building in Public 🛠️",
        dotColor: "bg-purple-400",
        ctaHref: "/about",
        ctaLabel: "Track Build Progress",
        secHref: "/ideas",
        secLabel: "Browse Ideas",
      };
    case "REVIEWING":
      return {
        label: "Phase 2 : Reviewing Submissions 🔍",
        dotColor: "bg-blue-400",
        ctaHref: "/ideas",
        ctaLabel: "Browse Citizen Ideas",
        secHref: "/vote",
        secLabel: "Preview Ballot",
      };
    case "COLLECTING":
    default:
      return {
        label: "Phase 1 : Idea Ingestion Live",
        dotColor: "bg-[#22c55e]",
        ctaHref: "/submit",
        ctaLabel: "Share Your Problem",
        secHref: "/submit",
        secLabel: "Speak Idea in Tamil",
      };
  }
}

interface HeroSectionProps {
  campaignStatus?: CampaignStatus;
}

export default function HeroSection({ campaignStatus = "COLLECTING" }: HeroSectionProps) {
  const pill = getHeroPill(campaignStatus);

  return (
    <section
      className="relative min-h-[92vh] lg:min-h-screen flex items-center overflow-hidden bg-[#060913] text-white pt-24 lg:pt-28 pb-16"
      aria-label="Hero section"
    >
      {/* Ambient Background — reduced from 4 to 2 blur layers for GPU perf */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(232,93,38,0.18),rgba(255,255,255,0))]" aria-hidden="true" />
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#e85d26]/10 rounded-full blur-[130px] pointer-events-none" aria-hidden="true" />

      {/* Subtle dot grid — CSS only */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
        aria-hidden="true"
      />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* ===== LEFT: Static Hero Content (Server-rendered, 0 client JS) ===== */}
          <div className="lg:col-span-7 space-y-7">
            {/* Live pill */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.07] border border-white/10 backdrop-blur-md shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${pill.dotColor}`} />
                </span>
                <span className="text-[12px] font-semibold text-white/90 tracking-wide uppercase">
                  {pill.label}
                </span>
              </div>
              <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#e85d26]/15 border border-[#e85d26]/30 text-[12px] text-[#f97316] font-medium">
                <span>🏛️</span>
                <span>தமிழ்நாடு மக்கள் குரல் 2026</span>
              </div>
            </div>

            {/* Headline — this is the LCP element, fully server-rendered */}
            <div>
              <h1 className="font-jakarta text-white text-[38px] sm:text-[54px] lg:text-[62px] font-extrabold leading-[1.08] tracking-tight">
                <span className="text-white">What should we</span>{" "}
                <span className="relative inline-block px-1.5">
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b35] via-[#f97316] to-[#f59e0b]">
                    build
                  </span>
                  <span className="absolute bottom-1.5 left-0 right-0 h-3 bg-[#e85d26]/25 rounded -rotate-1 -z-0" />
                </span>{" "}
                <br className="hidden sm:inline" />
                <span className="text-white">for</span>{" "}
                <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#fff7ed] via-[#fed7aa] to-[#fb923c] drop-shadow-sm">
                  {DYNAMIC_WORDS_FIRST}?
                </span>
              </h1>

              <p className="mt-4 text-[#fb923c] font-medium text-[15px] sm:text-[17px] flex items-center gap-2">
                <span className="text-[#f59e0b]">✦</span>
                <span>உங்கள் ஊரின் பிரச்சனையை சொல்லுங்கள் — தொழில்நுட்ப தீர்வை உருவாக்குவோம்.</span>
              </p>
            </div>

            {/* Core description */}
            <p className="text-white/70 text-[16px] sm:text-[18px] leading-relaxed max-w-2xl font-normal">
              From bus routes in Madurai to farm insights in Thanjavur — real citizens know what hurts most.
              Submit everyday challenges via <strong className="text-white font-semibold">voice in Tamil</strong> or text.
              The community votes, and open-source engineers build it.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Link
                href={pill.ctaHref}
                className="btn btn-primary btn-lg shadow-xl shadow-[#e85d26]/25 hover:shadow-[#e85d26]/45 group relative overflow-hidden text-[16px] font-bold"
                id="hero-cta-primary"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {pill.ctaLabel}
                  <ChevronRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
                </span>
              </Link>

              <Link
                href={pill.secHref}
                className="btn btn-lg bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/15 backdrop-blur-md flex items-center justify-center gap-2.5 transition-all text-[15px]"
                id="hero-cta-secondary"
              >
                {campaignStatus === "COLLECTING" ? (
                  <>
                    <div className="w-6 h-6 rounded-full bg-[#e85d26]/30 flex items-center justify-center text-[#ff7a45]">
                      <Mic size={14} />
                    </div>
                    <span>{pill.secLabel}</span>
                  </>
                ) : (
                  <span>{pill.secLabel}</span>
                )}
              </Link>
            </div>

            {/* Trust markers */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2.5 gap-x-4 pt-2 text-[13px] text-white/60">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-[#22c55e] flex-shrink-0" />
                <span>Takes ~2 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-[#22c55e] flex-shrink-0" />
                <span>100% Free & Open Source</span>
              </div>
              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <CheckCircle2 size={15} className="text-[#22c55e] flex-shrink-0" />
                <span>No tech skills needed</span>
              </div>
            </div>

            {/* Category chips */}
            <div className="pt-2">
              <div className="text-[12px] font-semibold uppercase tracking-wider text-white/40 mb-2.5 flex items-center gap-1.5">
                <Sparkles size={13} className="text-[#f59e0b]" />
                <span>Explore or submit by theme</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {QUICK_CATEGORIES.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/submit?category=${cat.id}`}
                    className="text-[12.5px] font-medium px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 hover:border-white/20 text-white/80 hover:text-white transition-all duration-200"
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ===== RIGHT: Interactive Carousel (Client-only, loaded after paint) ===== */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <Suspense
              fallback={
                <div className="rounded-3xl bg-white/[0.04] border border-white/10 h-[420px] animate-pulse" />
              }
            >
              <HeroCarousel />
            </Suspense>

            {/* Mini Trust Stats — static, server-rendered */}
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5">
                <div className="font-jakarta font-extrabold text-base text-white">38 / 38</div>
                <div className="text-[10px] text-white/50 uppercase">Districts Covered</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5">
                <div className="font-jakarta font-extrabold text-base text-[#22c55e]">100%</div>
                <div className="text-[10px] text-white/50 uppercase">Citizen Driven</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5">
                <div className="font-jakarta font-extrabold text-base text-[#f59e0b]">Open</div>
                <div className="text-[10px] text-white/50 uppercase">Source Code</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
