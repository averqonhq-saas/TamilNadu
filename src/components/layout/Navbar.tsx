"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronRight, Sparkles, Vote, Trophy, Rocket } from "lucide-react";
import { AppIconBadge } from "@/components/brand/Logo";
import type { CampaignStatus } from "@/lib/constants/campaign";

interface NavbarProps {
  /** Campaign status passed from server — no client fetch needed */
  campaignStatus?: CampaignStatus;
}

export default function Navbar({ campaignStatus: initialStatus = "COLLECTING" }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [campaignStatus, setCampaignStatus] = useState<CampaignStatus>(initialStatus);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    setCampaignStatus(initialStatus);
    fetch("/api/campaign")
      .then((res) => res.json())
      .then((data) => {
        if (data?.status) setCampaignStatus(data.status as CampaignStatus);
      })
      .catch(() => {});
  }, [initialStatus]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  const useDarkNav = isHomePage && !isScrolled;

  const getCtaConfig = () => {
    switch (campaignStatus) {
      case "VOTING":
        return {
          href: "/vote",
          label: "Vote in Public Poll",
          icon: <Vote size={15} />,
          badge: "Live Poll",
          badgeColor: "bg-[#16a34a]/15 text-[#16a34a] border-[#16a34a]/30",
        };
      case "RESULTS":
      case "WINNER":
        return {
          href: "/vote",
          label: "View Winner Podium",
          icon: <Trophy size={15} />,
          badge: "Results Out",
          badgeColor: "bg-[#d97706]/15 text-[#d97706] border-[#d97706]/30",
        };
      case "BUILDING":
        return {
          href: "/about",
          label: "Building in Public",
          icon: <Rocket size={15} />,
          badge: "Building",
          badgeColor: "bg-[#8b5cf6]/15 text-[#8b5cf6] border-[#8b5cf6]/30",
        };
      case "REVIEWING":
        return {
          href: "/ideas",
          label: "Browse Citizen Ideas",
          icon: <ChevronRight size={15} />,
          badge: "Reviewing",
          badgeColor: "bg-[#3b82f6]/15 text-[#3b82f6] border-[#3b82f6]/30",
        };
      case "COLLECTING":
      default:
        return {
          href: "/submit",
          label: "Share Your Idea",
          icon: <ChevronRight size={15} />,
          badge: "Open for Ideas",
          badgeColor: "bg-[#e85d26]/15 text-[#e85d26] border-[#e85d26]/30",
        };
    }
  };

  const cta = getCtaConfig();

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          useDarkNav
            ? "bg-[#060913]/85 backdrop-blur-md border-b border-white/10 py-3.5"
            : "bg-white/95 backdrop-blur-md border-b border-[#e2e8f0] shadow-sm py-3"
        }`}
        aria-label="Main navigation"
      >
        <div className="container">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 group"
              aria-label="Build Tamil Nadu home"
            >
              <AppIconBadge size={34} />
              <div className="flex flex-col leading-tight">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`font-jakarta font-extrabold text-[16px] leading-none tracking-tight transition-colors ${
                      useDarkNav ? "text-white" : "text-[#0a0e1a]"
                    }`}
                  >
                    Build Tamil Nadu
                  </span>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${cta.badgeColor}`}>
                    {cta.badge}
                  </span>
                </div>
                <span
                  className={`text-[11px] leading-none mt-1 hidden sm:block transition-colors ${
                    useDarkNav ? "text-white/60" : "text-[#64748b]"
                  }`}
                >
                  Citizen Technology Initiative • மக்கள் குரல்
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              <NavLink href="/how-it-works" isDark={useDarkNav}>
                How It Works
              </NavLink>
              <NavLink href="/ideas" isDark={useDarkNav}>
                Browse Ideas
              </NavLink>
              <NavLink href="/about" isDark={useDarkNav}>
                About
              </NavLink>
              <span className={`mx-2 text-[13px] ${useDarkNav ? "text-white/20" : "text-[#e2e8f0]"}`}>
                |
              </span>
              <Link
                href="/vote"
                className={`flex items-center gap-1.5 text-[12px] font-bold px-3.5 py-1.5 rounded-full border transition-all ${
                  campaignStatus === "VOTING"
                    ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/30"
                    : useDarkNav
                    ? "text-[#fb923c] bg-[#e85d26]/15 border-[#e85d26]/30 hover:bg-[#e85d26]/25 hover:text-white"
                    : "text-[#e85d26] bg-[#fffaf7] border-[#e85d26]/30 hover:bg-[#fff5ee] hover:text-[#c2410c]"
                }`}
                aria-label="Participate in Public Poll"
              >
                {campaignStatus === "RESULTS" || campaignStatus === "WINNER" ? (
                  <>
                    <Trophy size={13} className="text-[#f59e0b]" />
                    <span>Winner Podium</span>
                  </>
                ) : campaignStatus === "VOTING" ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Public Poll • VOTE LIVE</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={13} className="text-[#f59e0b]" />
                    <span>Public Poll</span>
                  </>
                )}
              </Link>
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href={cta.href}
                className="btn btn-primary btn-sm flex items-center gap-2 shadow-lg shadow-[#e85d26]/20 hover:shadow-[#e85d26]/40 font-bold px-4"
                id="navbar-cta"
              >
                <span>{cta.label}</span>
                {cta.icon}
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className={`lg:hidden w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${
                useDarkNav
                  ? "text-white hover:bg-white/10 border border-white/10"
                  : "text-[#0a0e1a] hover:bg-[#f0ede8]"
              }`}
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileOpen}
            >
              {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-80 max-w-[85vw] bg-[#0a0e1a] text-white border-l border-white/10 shadow-2xl lg:hidden transition-transform duration-300 ease-in-out ${
          isMobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/10">
            <Link href="/" onClick={() => setIsMobileOpen(false)} className="flex items-center gap-2.5">
              <AppIconBadge size={30} />
              <div>
                <span className="font-jakarta font-bold text-[15px] text-white block">Build Tamil Nadu</span>
                <span className="text-[10px] text-white/50 block">Citizen Technology Initiative</span>
              </div>
            </Link>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/10"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          {/* Mobile Links */}
          <nav className="flex-1 p-5 space-y-2">
            <MobileNavLink href="/how-it-works" onClick={() => setIsMobileOpen(false)}>
              How It Works
            </MobileNavLink>
            <MobileNavLink href="/ideas" onClick={() => setIsMobileOpen(false)}>
              Browse Ideas
            </MobileNavLink>
            <MobileNavLink href="/about" onClick={() => setIsMobileOpen(false)}>
              About the Initiative
            </MobileNavLink>
            <div className="pt-3 pb-1">
              <Link
                href="/vote"
                onClick={() => setIsMobileOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/90 text-xs hover:bg-white/10 transition-colors"
              >
                <span className="flex items-center gap-2 font-medium">
                  <Sparkles size={14} className="text-[#f59e0b]" />
                  Public Poll • TN Decides
                </span>
                <span className="badge badge-accent text-[10px]">{cta.badge}</span>
              </Link>
            </div>
          </nav>

          {/* Mobile CTA */}
          <div className="p-5 border-t border-white/10 bg-[#070b14]">
            <Link
              href={cta.href}
              className="btn btn-primary w-full justify-center btn-lg gap-2 font-bold"
              onClick={() => setIsMobileOpen(false)}
            >
              <span>{cta.label}</span>
              {cta.icon}
            </Link>
            <p className="text-center text-[12px] text-white/40 mt-3">
              Phase: {campaignStatus}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function NavLink({
  href,
  isDark,
  children,
}: {
  href: string;
  isDark: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`px-3.5 py-2 text-[14px] font-medium rounded-lg transition-all duration-150 ${
        isDark
          ? "text-white/80 hover:text-white hover:bg-white/10"
          : "text-[#64748b] hover:text-[#0a0e1a] hover:bg-[#f0ede8]"
      }`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center justify-between px-4 py-3.5 rounded-xl text-[15px] font-medium text-white/90 hover:text-white hover:bg-white/10 transition-colors"
    >
      <span>{children}</span>
      <ChevronRight size={16} className="text-white/30" />
    </Link>
  );
}
