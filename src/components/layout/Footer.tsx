// Footer is now a pure server component — no client-side fetches needed.
// All data is passed as props from the server page/layout.
import Link from "next/link";
import { Mail } from "lucide-react";
import { AppIconBadge } from "@/components/brand/Logo";
import type { CampaignStatus } from "@/lib/constants/campaign";

interface FooterProps {
  siteName?: string;
  supportEmail?: string;
  campaignStatus?: CampaignStatus;
}

function getStatusBadge(campaignStatus: string) {
  switch (campaignStatus) {
    case "VOTING":
      return { text: "Public Voting Live 🗳️", dot: "bg-emerald-400" };
    case "RESULTS":
    case "WINNER":
      return { text: "Winner Announced 🏆", dot: "bg-amber-400" };
    case "REVIEWING":
      return { text: "Ideas Under Review 🔍", dot: "bg-blue-400" };
    case "BUILDING":
      return { text: "Building in Public 🛠️", dot: "bg-purple-400" };
    case "COLLECTING":
    default:
      return { text: "Idea collection open", dot: "bg-[#22c55e]" };
  }
}

export default function Footer({
  siteName = "Build Tamil Nadu",
  supportEmail = "vanakkam@buildtamilnadu.in",
  campaignStatus = "COLLECTING",
}: FooterProps) {
  const badge = getStatusBadge(campaignStatus);

  return (
    <footer className="bg-[#0a0e1a] text-white" aria-label="Site footer">
      <div className="container">
        {/* Main footer content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <AppIconBadge size={34} />
              <div className="flex flex-col">
                <span className="font-jakarta font-extrabold text-[16px] text-white leading-none">
                  {siteName}
                </span>
                <span className="text-[11px] text-white/50 font-mono mt-0.5">
                  The Path We Build • மக்கள் குரல்
                </span>
              </div>
            </div>
            <p className="text-[#94a3b8] text-[15px] leading-relaxed mb-4 max-w-sm">
              What should we build for Tamil Nadu?
            </p>
            <p className="text-[#64748b] text-sm leading-relaxed max-w-sm mb-4">
              A citizen-driven technology initiative. We collect real problems from people across Tamil Nadu,
              let Tamil Nadu vote, and then actually build the winning solution.
            </p>

            <a
              href={`mailto:${supportEmail}`}
              className="inline-flex items-center gap-2 text-xs font-mono text-[#fb923c] hover:underline"
            >
              <Mail size={13} />
              <span>{supportEmail}</span>
            </a>

            {/* Disclaimer */}
            <div className="mt-8 p-4 rounded-lg border border-[#1e2640] bg-[#141928]">
              <p className="text-[12px] text-[#64748b] leading-relaxed">
                {siteName} is an independent technology initiative. It is not an official government
                platform and does not represent or speak on behalf of any political party or government department.
              </p>
            </div>
          </div>

          {/* Links: Platform */}
          <div>
            <h3 className="font-jakarta font-semibold text-[13px] text-[#94a3b8] uppercase tracking-wider mb-5">
              Platform
            </h3>
            <ul className="space-y-3">
              <FooterLink href="/submit">Share an Idea</FooterLink>
              <FooterLink href="/ideas">Explore Ideas</FooterLink>
              <FooterLink href="/vote">Public Voting</FooterLink>
              <FooterLink href="/about">About</FooterLink>
              <FooterLink href="/partner">Partner With Us</FooterLink>
            </ul>
          </div>

          {/* Links: Legal */}
          <div>
            <h3 className="font-jakarta font-semibold text-[13px] text-[#94a3b8] uppercase tracking-wider mb-5">
              Legal &amp; Status
            </h3>
            <ul className="space-y-3 mb-8">
              <FooterLink href="/privacy">Privacy</FooterLink>
              <FooterLink href="/terms">Terms</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
            </ul>

            {/* Campaign status badge — static, no JS */}
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#141928] border border-[#1e2640]">
              <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
              <span className="text-[12px] text-[#94a3b8] font-medium">
                {badge.text}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#1e2640] py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[13px] text-[#64748b]">
            © {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>
          <p className="text-[13px] text-[#64748b]">
            An open civic technology initiative built with and for{" "}
            <span className="text-[#94a3b8] font-medium">Tamil Nadu</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-[14px] text-[#64748b] hover:text-white transition-colors duration-150 flex items-center gap-1 group"
      >
        {children}
      </Link>
    </li>
  );
}
