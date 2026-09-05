import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import {
  Sparkles,
  HeartHandshake,
  Vote,
  Code2,
  ShieldAlert,
  Users,
  Compass,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Building,
  Terminal,
  Globe2,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — Build Tamil Nadu | Citizen-Driven Open Civic Tech",
  description:
    "Learn why Build Tamil Nadu exists, our core principles, open-source charter, and our mission to build technology for real-world problems.",
};

const PILLARS = [
  {
    icon: HeartHandshake,
    title: "1. Listen Without Preconceptions",
    titleTamil: "முன்முடிவுகள் இன்றி கேட்டல்",
    color: "#E85D26",
    bg: "rgba(232, 93, 38, 0.1)",
    description:
      "Instead of boardroom brainstorms and tech industry assumptions, we invite everyday citizens — from farmers in Thanjavur to daily commuters in Chennai — to voice their actual bottlenecks.",
  },
  {
    icon: Vote,
    title: "2. Democratic Prioritization",
    titleTamil: "மக்கள் வாக்கு மூலம் முன்னுரிமை",
    color: "#3B82F6",
    bg: "rgba(59, 130, 246, 0.1)",
    description:
      "We believe priorities should be set by the collective will of the people. Shortlisted ideas go to a state-wide public vote so Tamil Nadu decides what deserves engineering energy first.",
  },
  {
    icon: Code2,
    title: "3. 100% Open Public Good",
    titleTamil: "அனைவருக்குமான திறந்த மூல மென்பொருள்",
    color: "#10B981",
    bg: "rgba(16, 185, 129, 0.1)",
    description:
      "Every line of software produced is open-source under permissive licenses (MIT/Apache 2.0). No paywalls, no predatory monetization, and no proprietary vendor lock-in.",
  },
];

const COMPARISONS = [
  {
    topic: "Problem Sourcing",
    traditional: "Created by tech founders looking for venture profit",
    buildTN: "Directly voiced by real citizens across 38 districts",
  },
  {
    topic: "Language & Access",
    traditional: "English-first, tech-savvy users, urban centric",
    buildTN: "Voice-enabled in spoken Tamil, Tanglish & English",
  },
  {
    topic: "Code Ownership",
    traditional: "Proprietary software owned by private corporations",
    buildTN: "100% Open Source belonging to the public domain",
  },
  {
    topic: "Priority Selection",
    traditional: "Highest return-on-investment & revenue potential",
    buildTN: "Public voting based on human impact & civic utility",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="bg-[#f8f7f4]">
        {/* ================= HERO HEADER ================= */}
        <section className="relative bg-[#060913] text-white pt-32 sm:pt-40 lg:pt-44 pb-20 lg:pb-28 overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_-10%,rgba(232,93,38,0.18),transparent)]" />
          <div className="absolute top-1/3 right-10 w-96 h-96 bg-[#e85d26]/12 rounded-full blur-[140px] pointer-events-none hidden lg:block" />
          <div className="absolute bottom-5 left-10 w-96 h-96 bg-[#3b82f6]/10 rounded-full blur-[130px] pointer-events-none hidden lg:block" />

          <div className="container relative z-10 pt-4 sm:pt-6">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.08] border border-white/15 backdrop-blur-md">
                <Sparkles size={14} className="text-[#f59e0b]" />
                <span className="text-[12px] font-bold tracking-wider uppercase text-white/90">
                  Our Mission & Manifesto
                </span>
              </div>

              <h1 className="font-jakarta text-white text-[28px] sm:text-[44px] lg:text-[58px] font-extrabold leading-[1.08] tracking-tight">
                Great technology starts with a{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b35] via-[#f97316] to-[#f59e0b]">
                  real human struggle.
                </span>
              </h1>

              <p className="text-[#fb923c] font-medium text-[16px] sm:text-[18px]">
                மக்களின் தேவைக்கேற்ப உருவாக்கும் வெளிப்படையான மக்கள் தொழில்நுட்பம்.
              </p>

              <p className="text-white/70 text-[16px] sm:text-[18px] leading-relaxed max-w-2xl mx-auto">
                Too much software is designed in air-conditioned offices for people who already have everything. 
                Build Tamil Nadu is an open initiative that flips the pyramid: listening first, letting citizens vote, and engineering open-source solutions that matter.
              </p>
            </div>
          </div>
        </section>

        {/* ================= 3 CORE PILLARS ================= */}
        <section className="py-20 lg:py-24" aria-label="Core principles">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#e85d26]/10 text-[#e85d26] text-xs font-bold uppercase tracking-wider mb-3">
                <Compass size={14} />
                <span>Foundational Principles</span>
              </div>
              <h2 className="font-jakarta font-extrabold text-[32px] sm:text-[40px] text-[#0a0e1a] tracking-tight">
                How We Think About Building
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {PILLARS.map((pillar, idx) => {
                const PillarIcon = pillar.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-3xl p-5 sm:p-8 border border-[#e2e8f0] shadow-sm hover:shadow-xl hover:border-[#e85d26]/40 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-xs"
                        style={{ backgroundColor: pillar.bg, color: pillar.color }}
                      >
                        <PillarIcon size={26} />
                      </div>

                      <h3 className="font-jakarta font-bold text-[20px] text-[#0a0e1a] mb-1">
                        {pillar.title}
                      </h3>
                      <p className="text-[12.5px] font-semibold text-[#e85d26] font-tamil mb-4">
                        {pillar.titleTamil}
                      </p>

                      <p className="text-[#64748b] text-[15px] leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= COMPARISON SECTION ================= */}
        <section className="py-20 bg-white border-y border-[#e2e8f0]">
          <div className="container max-w-5xl">
            <div className="text-center mb-14">
              <h2 className="font-jakarta font-extrabold text-[30px] sm:text-[38px] text-[#0a0e1a] tracking-tight">
                Why A Citizen-First Approach Matters
              </h2>
              <p className="text-[#64748b] text-[16px] mt-2">
                Comparing conventional venture tech development with Build Tamil Nadu.
              </p>
            </div>

            <div className="bg-[#f8f7f4] rounded-3xl p-6 sm:p-8 border border-[#e2e8f0] overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-[#e2e8f0]">
                    <th className="pb-4 font-jakarta font-bold text-[14px] text-[#64748b] uppercase tracking-wider">
                      Dimension
                    </th>
                    <th className="pb-4 font-jakarta font-bold text-[14px] text-[#ef4444] uppercase tracking-wider">
                      Conventional Tech
                    </th>
                    <th className="pb-4 font-jakarta font-bold text-[14px] text-[#10b981] uppercase tracking-wider">
                      Build Tamil Nadu
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8f0]">
                  {COMPARISONS.map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/60 transition-colors">
                      <td className="py-4 font-bold text-[14px] text-[#0a0e1a]">
                        {row.topic}
                      </td>
                      <td className="py-4 text-[14px] text-[#64748b] pr-4">
                        <div className="flex items-start gap-2">
                          <XCircle size={16} className="text-[#ef4444] flex-shrink-0 mt-0.5" />
                          <span>{row.traditional}</span>
                        </div>
                      </td>
                      <td className="py-4 text-[14px] text-[#0a0e1a] font-medium">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 size={16} className="text-[#10b981] flex-shrink-0 mt-0.5" />
                          <span>{row.buildTN}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ================= CIVIC INDEPENDENCE CHARTER ================= */}
        <section className="py-20 lg:py-24">
          <div className="container max-w-4xl space-y-12">
            {/* Non-Partisan & Transparency Disclaimer */}
            <div className="bg-[#fffbeb] border border-[#fde68a] rounded-3xl p-8 sm:p-10 relative shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#f59e0b]/15 text-[#b45309] flex items-center justify-center flex-shrink-0">
                  <ShieldAlert size={26} />
                </div>
                <div className="space-y-3">
                  <h3 className="font-jakarta font-bold text-[20px] text-[#0a0e1a]">
                    Civic Independence & Non-Partisan Charter
                  </h3>
                  <p className="text-[#374151] text-[15px] leading-relaxed">
                    Build Tamil Nadu is an <strong>independent citizen technology initiative</strong>. It is not an official government platform and does not represent or speak on behalf of any political party or government department. We do not claim government endorsement, nor do we solicit partisan sponsorship.
                  </p>
                  <p className="text-[#374151] text-[15px] leading-relaxed">
                    Our singular mandate is to build software that serves the public good, with zero political bias and complete transparency.
                  </p>
                </div>
              </div>
            </div>

            {/* About the Builders */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#e2e8f0] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div className="space-y-3 max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8b5cf6]/10 text-[#8b5cf6] text-xs font-bold uppercase">
                  <Users size={13} />
                  <span>The Community & Leadership</span>
                </div>
                <h3 className="font-jakarta font-bold text-[24px] text-[#0a0e1a]">
                  An Initiative by WeDigi & Open Source Volunteers
                </h3>
                <p className="text-[#64748b] text-[15px] leading-relaxed">
                  Build Tamil Nadu is maintained and engineered by WeDigi alongside passionate volunteer software engineers, designers, student developers, and local civic advocates across the state.
                </p>
              </div>

              <Link
                href="/submit"
                className="btn btn-primary btn-lg flex items-center gap-2 whitespace-nowrap shadow-lg shadow-[#e85d26]/25"
              >
                <span>Submit a Problem</span>
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

