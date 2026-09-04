// CtaSection is now a server component — no client JS needed.
// campaignStatus is passed from the server page.
import Link from "next/link";
import { Clock } from "lucide-react";
import type { CampaignStatus } from "@/lib/constants/campaign";

interface CtaSectionProps {
  campaignStatus?: CampaignStatus;
}

function getCtaContent(status: CampaignStatus) {
  switch (status) {
    case "VOTING":
      return {
        pill: "Public Voting Poll Is Live 🗳️",
        dotColor: "bg-emerald-400",
        headline: "Tamil Nadu is deciding right now.",
        sub: "Every citizen has 1 vote to decide which civic software we build first.",
        buttonText: "Vote in Public Poll →",
        href: "/vote",
      };
    case "RESULTS":
    case "WINNER":
      return {
        pill: "Winner Announced 🏆",
        dotColor: "bg-amber-400",
        headline: "Tamil Nadu has spoken.",
        sub: "Check out the winning civic technology solution selected by citizens.",
        buttonText: "View Winner Podium →",
        href: "/vote",
      };
    case "REVIEWING":
      return {
        pill: "Submissions Under Review 🔍",
        dotColor: "bg-blue-400",
        headline: "Clustering & shortlisting citizen problems.",
        sub: "Our team is synthesizing problems across 38 districts to prepare the voting ballot.",
        buttonText: "Browse Submitted Ideas →",
        href: "/ideas",
      };
    case "COLLECTING":
    default:
      return {
        pill: "Idea collection is currently open",
        dotColor: "bg-[#22c55e]",
        headline: "You've probably thought of something.",
        sub: "Maybe it's a problem you face every week. This is your chance to put that idea forward.",
        buttonText: "Share Your Idea →",
        href: "/submit",
      };
  }
}

export default function CtaSection({ campaignStatus = "COLLECTING" }: CtaSectionProps) {
  const content = getCtaContent(campaignStatus);

  return (
    <section className="section bg-[#0a0e1a] relative overflow-hidden" aria-labelledby="cta-heading">
      {/* Background decoration — CSS only, no JS */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#e85d26] rounded-full blur-[150px] opacity-[0.08]" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#3b82f6] rounded-full blur-[100px] opacity-[0.05]" />
      </div>

      <div className="container relative z-10 text-center">
        {/* Status pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/10 text-[13px] text-white/80 font-medium mb-8">
          <span className={`w-2 h-2 rounded-full ${content.dotColor}`} />
          <span>{content.pill}</span>
        </div>

        <h2
          className="font-jakarta text-white mb-6 max-w-3xl mx-auto font-extrabold tracking-tight"
          id="cta-heading"
          style={{ fontSize: "clamp(28px, 5vw, 52px)", lineHeight: 1.1 }}
        >
          {content.headline}
        </h2>

        <p className="text-white/60 text-[15px] sm:text-[17px] lg:text-[19px] max-w-xl mx-auto mb-10 leading-relaxed">
          {content.sub}
        </p>

        {/* CTA */}
        <Link
          href={content.href}
          className="btn btn-primary btn-lg mx-auto inline-flex font-bold shadow-xl shadow-[#e85d26]/20 hover:shadow-[#e85d26]/40 py-3.5 px-6 sm:py-[18px] sm:px-10"
          id="main-cta"
          style={{ fontSize: "17px" }}
        >
          {content.buttonText}
        </Link>

        {/* Reassurance */}
        <div className="flex items-center justify-center gap-2 mt-5 text-white/40 text-[13px]">
          <Clock size={14} />
          <span>100% Free · Open Source · Built with Tamil Nadu</span>
        </div>
      </div>
    </section>
  );
}
