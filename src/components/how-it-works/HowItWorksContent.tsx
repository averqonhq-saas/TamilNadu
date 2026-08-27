"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Mic,
  Brain,
  Filter,
  Vote,
  Code2,
  FlaskConical,
  Rocket,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Users,
  Target,
  FileCode,
  Zap,
  MapPin,
  Clock,
  Layers,
} from "lucide-react";

interface StepItem {
  number: string;
  phaseId: number;
  phaseName: string;
  title: string;
  titleTamil: string;
  tagline: string;
  description: string;
  whatHappens: string[];
  deliverable: string;
  icon: React.ElementType;
  color: string;
  accentBg: string;
  borderAccent: string;
}

const STEPS_DATA: StepItem[] = [
  {
    number: "01",
    phaseId: 1,
    phaseName: "Discovery & Ingestion",
    title: "Listen & Ingest",
    titleTamil: "கேட்டல் (Listen)",
    tagline: "Unfiltered problem ingestion from citizens in all 38 districts",
    description:
      "Anyone living in Tamil Nadu can submit a problem they experience in their daily lives — whether it's public bus frequency in Madurai, crop spot-pricing in Thanjavur, or hospital queues in Vellore.",
    whatHappens: [
      "Voice submissions in spoken Tamil, Tanglish, or English",
      "Categorized by 11 civic sectors (Healthcare, Transit, Agri, etc.)",
      "No technical jargon or coding expertise required",
    ],
    deliverable: "🎙️ Public Raw Problem Repository",
    icon: Mic,
    color: "#E85D26",
    accentBg: "rgba(232, 93, 38, 0.12)",
    borderAccent: "border-[#e85d26]/40",
  },
  {
    number: "02",
    phaseId: 1,
    phaseName: "Discovery & Ingestion",
    title: "Cluster & Understand",
    titleTamil: "புரிதல் (Cluster)",
    tagline: "Semantic grouping of recurring citizen problems",
    description:
      "Individual problem submissions are synthesized and cross-referenced. When hundreds of people across different towns articulate the same pain point, a high-conviction problem theme emerges.",
    whatHappens: [
      "AI & human editorial synthesis to group matching complaints",
      "Extraction of root causes vs surface symptoms",
      "Mapping problem density by district and demographic reach",
    ],
    deliverable: "📊 Consolidated Problem Matrix",
    icon: Brain,
    color: "#3B82F6",
    accentBg: "rgba(59, 130, 246, 0.12)",
    borderAccent: "border-[#3b82f6]/40",
  },
  {
    number: "03",
    phaseId: 1,
    phaseName: "Discovery & Ingestion",
    title: "Filter & Shortlist",
    titleTamil: "தேர்ந்தெடுத்தல் (Shortlist)",
    tagline: "Rigorous vetting against the Public Value Matrix",
    description:
      "A cross-functional panel of civic engineers, domain experts, and community leaders screens clustered ideas against four strict pillars: Impact, Reach, Tech Feasibility, and Public Utility.",
    whatHappens: [
      "Vetting against technical feasibility within open-source models",
      "Eliminating commercial, partisan, or out-of-scope entries",
      "Publishing public briefing papers for 5 shortlisted finalists",
    ],
    deliverable: "📋 5 Shortlisted Public Ballots",
    icon: Filter,
    color: "#10B981",
    accentBg: "rgba(16, 185, 129, 0.12)",
    borderAccent: "border-[#10b981]/40",
  },
  {
    number: "04",
    phaseId: 2,
    phaseName: "Democratic Voting",
    title: "Tamil Nadu Public Vote",
    titleTamil: "வாக்களிப்பு (Public Vote)",
    tagline: "Transparent, democratic decision by all citizens",
    description:
      "The 5 shortlisted projects are opened for state-wide public voting. Every resident of Tamil Nadu has one vote. The initiative builds whichever problem the people choose.",
    whatHappens: [
      "1-person 1-vote verification with zero paywalls or barriers",
      "Real-time transparent public tally and district leaderboards",
      "Clear rationale published for each voting choice",
    ],
    deliverable: "🗳️ Certified Public Winner",
    icon: Vote,
    color: "#F59E0B",
    accentBg: "rgba(245, 158, 11, 0.12)",
    borderAccent: "border-[#f59e0b]/40",
  },
  {
    number: "05",
    phaseId: 3,
    phaseName: "Open Build & Deployment",
    title: "Sprint & Build",
    titleTamil: "உருவாக்கம் (Sprint & Build)",
    tagline: "Full-stack open-source software engineering",
    description:
      "A dedicated engineering team, supported by top open-source developers, builds the winning solution. From UI/UX to resilient backends and localized Tamil language interfaces.",
    whatHappens: [
      "100% open-source GitHub repository under permissive licenses",
      "Modern tech stack: mobile-first, offline-capable, highly accessible",
      "Weekly public changelogs and community architecture reviews",
    ],
    deliverable: "💻 Open Source Production Codebase",
    icon: Code2,
    color: "#8B5CF6",
    accentBg: "rgba(139, 92, 246, 0.12)",
    borderAccent: "border-[#8b5cf6]/40",
  },
  {
    number: "06",
    phaseId: 3,
    phaseName: "Open Build & Deployment",
    title: "Field Test & Pilot",
    titleTamil: "கள சோதனை (Field Test)",
    tagline: "Real-world validation with actual end users",
    description:
      "We take the product directly to bus stands, primary health clinics, village panchayats, and mandis to test with the people who will rely on it daily.",
    whatHappens: [
      "Pilots conducted in 3 distinct districts (urban, rural, semi-urban)",
      "Direct usability feedback from senior citizens, workers, and youth",
      "Fast iterative bug fixing and performance optimizations",
    ],
    deliverable: "🔬 Validated Pilot Release",
    icon: FlaskConical,
    color: "#EC4899",
    accentBg: "rgba(236, 72, 153, 0.12)",
    borderAccent: "border-[#ec4899]/40",
  },
  {
    number: "07",
    phaseId: 3,
    phaseName: "Open Build & Deployment",
    title: "Launch & Scale",
    titleTamil: "விரிவாக்கம் (Scale & Impact)",
    tagline: "State-wide public rollout & sustainable institutional handoff",
    description:
      "The finalized platform is published for all 80+ million residents of Tamil Nadu. Where applicable, we integrate with official public APIs, civic bodies, and community organizations.",
    whatHappens: [
      "Zero-cost public availability across web, Android, and SMS/WhatsApp",
      "Institutional handoff & long-term maintenance partnerships",
      "Next cycle begins for the next high-priority citizen problem",
    ],
    deliverable: "🚀 Public Production Deployment",
    icon: Rocket,
    color: "#06B6D4",
    accentBg: "rgba(6, 182, 212, 0.12)",
    borderAccent: "border-[#06b6d4]/40",
  },
];

const CRITERIA = [
  {
    icon: Users,
    title: "1. Human Impact",
    titleTamil: "மனித தாக்கம்",
    score: "40% Weight",
    color: "#E85D26",
    description:
      "How deeply does this problem affect everyday livelihood, health, financial wellbeing, or dignity of citizens?",
  },
  {
    icon: Target,
    title: "2. Geographic Reach",
    titleTamil: "பரவல் & எல்லை",
    score: "25% Weight",
    color: "#3B82F6",
    description:
      "Is this problem shared across multiple towns and districts, or scalable across all 38 districts of Tamil Nadu?",
  },
  {
    icon: Zap,
    title: "3. Tech Feasibility",
    titleTamil: "தொழில்நுட்ப சாத்தியம்",
    score: "20% Weight",
    color: "#10B981",
    description:
      "Can modern digital software (web, mobile, SMS, maps, AI) realistically solve or dramatically ease this pain point?",
  },
  {
    icon: FileCode,
    title: "4. Open Utility",
    titleTamil: "திறந்த மூல பயன்பாடு",
    score: "15% Weight",
    color: "#8B5CF6",
    description:
      "Can this be sustained as a public good, free from restrictive licensing or predatory monetization?",
  },
];

const FAQS = [
  {
    question: "Who can submit an idea, and does it cost anything?",
    questionTamil: "யார் யோசனைகளை சமர்ப்பிக்கலாம்? கட்டணம் ஏதும் உண்டா?",
    answer:
      "Anyone who lives, works, or has ties to Tamil Nadu can submit. The platform is 100% free, non-commercial, and open. You don't need any technical skills—you simply describe the daily problem you encounter in spoken or written Tamil or English.",
  },
  {
    question: "How do you ensure rural and non-English speakers are heard?",
    questionTamil: "கிராமப்புற மக்களின் குரல் எவ்வாறு சென்றடையும்?",
    answer:
      "We built dedicated voice input supporting regional spoken Tamil and Tanglish. Our data clustering actively normalizes district submissions to ensure rural agricultural and small-town transport ideas receive equal consideration alongside major urban centers.",
  },
  {
    question: "Who owns the code that gets built?",
    questionTamil: "உருவாக்கப்படும் மென்பொருளின் உரிமை யாருக்கு?",
    answer:
      "All code produced through Build Tamil Nadu is 100% open-source under permissive licenses (MIT / Apache 2.0). It belongs to the public domain and the citizens of Tamil Nadu. No private corporation owns the intellectual property.",
  },
  {
    question: "How will public voting prevent spam and bot manipulation?",
    questionTamil: "வாக்களிப்பில் முறைகேடுகள் எவ்வாறு தடுக்கப்படும்?",
    answer:
      "When voting begins in Phase 2, we implement multi-layer voter verification (device fingerprinting, OTP verification, and rate limiting) paired with transparent ballot hashing so the public vote is fully verifiable and tamper-proof.",
  },
  {
    question: "Can local developers and students contribute to building it?",
    questionTamil: "மாணவர்களும் டெவலப்பர்களும் இதில் பங்களிக்க முடியுமா?",
    answer:
      "Yes! In Phase 3 (Build), the entire repository is hosted publicly on GitHub with open issues, architectural docs, mentorship, and bounty tracks for Tamil Nadu students and local engineering teams.",
  },
];

export default function HowItWorksContent() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
  const [campaignStatus, setCampaignStatus] = useState<string>("COLLECTING");

  useEffect(() => {
    fetch("/api/campaign")
      .then((res) => res.json())
      .then((data) => {
        if (data.status) setCampaignStatus(data.status);
      })
      .catch(() => {});
  }, []);

  const isPhase1Active = campaignStatus === "COLLECTING" || campaignStatus === "REVIEWING" || campaignStatus === "PRE_LAUNCH";
  const isPhase2Active = campaignStatus === "VOTING";
  const isPhase3Active = campaignStatus === "RESULTS" || campaignStatus === "WINNER" || campaignStatus === "BUILDING" || campaignStatus === "COMPLETED";

  const dynamicPhases = [
    {
      id: 1,
      name: "Discovery & Synthesis",
      nameTamil: "கண்டறிதல் மற்றும் தொகுத்தல்",
      steps: "01 – 03",
      status: isPhase1Active ? "CURRENTLY ACTIVE 🟢" : "COMPLETED ✓",
      statusColor: isPhase1Active
        ? "bg-[#22c55e]/15 text-[#22c55e] border-[#22c55e]/30"
        : "bg-white/10 text-white/70 border-white/10",
      description: "Collecting citizen voices from all 38 districts and synthesizing recurring systemic challenges.",
    },
    {
      id: 2,
      name: "Democratic Voting",
      nameTamil: "மக்கள் வாக்களிப்பு",
      steps: "04",
      status: isPhase2Active ? "LIVE VOTING POLL 🗳️" : isPhase3Active ? "COMPLETED ✓" : "UPCOMING ⏳",
      statusColor: isPhase2Active
        ? "bg-[#e85d26]/20 text-[#fb923c] border-[#e85d26]/40 animate-pulse"
        : isPhase3Active
        ? "bg-white/10 text-white/70 border-white/10"
        : "bg-[#f59e0b]/15 text-[#f59e0b] border-[#f59e0b]/30",
      description: "Every person in Tamil Nadu gets 1 transparent vote to decide what software solution gets built first.",
    },
    {
      id: 3,
      name: "Open Build & Deployment",
      nameTamil: "உருவாக்கம் & பயன்பாடு",
      steps: "05 – 07",
      status: isPhase3Active ? "ACTIVE STAGE 🚀" : "FINAL STAGE ⏳",
      statusColor: isPhase3Active
        ? "bg-[#8b5cf6]/20 text-[#a78bfa] border-[#8b5cf6]/40"
        : "bg-white/10 text-white/50 border-white/10",
      description: "100% open-source software engineering, ground field testing, and state-wide public deployment.",
    },
  ];

  const filteredSteps = selectedPhase
    ? STEPS_DATA.filter((s) => s.phaseId === selectedPhase)
    : STEPS_DATA;

  return (
    <div className="bg-[#f8f7f4]">
      {/* ================= HERO HEADER ================= */}
      <section className="relative bg-[#060913] text-white pt-24 pb-20 lg:pb-28 overflow-hidden">
        {/* Dynamic Glows */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_-10%,rgba(232,93,38,0.18),rgba(255,255,255,0))]" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-[#e85d26]/12 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-5 left-10 w-96 h-96 bg-[#3b82f6]/10 rounded-full blur-[130px] pointer-events-none" />

        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Tag badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.08] border border-white/15 backdrop-blur-md shadow-sm">
              <Sparkles size={14} className="text-[#f59e0b]" />
              <span className="text-[12px] font-bold tracking-wider uppercase text-white/90">
                Civic Innovation Lifecycle
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-jakarta text-white text-[38px] sm:text-[54px] lg:text-[60px] font-extrabold leading-[1.08] tracking-tight">
              From Citizen Voice to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b35] via-[#f97316] to-[#f59e0b]">
                Shipped Solution.
              </span>
            </h1>

            {/* Tamil Subtitle */}
            <p className="text-[#fb923c] font-medium text-[16px] sm:text-[18px]">
              உங்கள் பிரச்சனை முதல் உண்மையான தயாரிப்பு வரை — 7 தெளிவான படிநிலைகள்.
            </p>

            <p className="text-white/70 text-[16px] sm:text-[18px] leading-relaxed max-w-2xl mx-auto">
              Build Tamil Nadu is not a hackathon or a conceptual think-tank. It is a transparent,
              citizen-powered assembly line designed to convert real public struggles into live, production software.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
              <Link
                href={campaignStatus === "VOTING" || campaignStatus === "RESULTS" || campaignStatus === "WINNER" ? "/vote" : "/submit"}
                className="btn btn-primary btn-lg shadow-xl shadow-[#e85d26]/30 hover:shadow-[#e85d26]/50 flex items-center gap-2 text-[15px] w-full sm:w-auto justify-center font-bold"
              >
                <span>
                  {campaignStatus === "VOTING"
                    ? "Participate in Live Vote"
                    : campaignStatus === "RESULTS" || campaignStatus === "WINNER"
                    ? "View Winner Results"
                    : "Submit a Problem for Phase 1"}
                </span>
                <ChevronRight size={17} />
              </Link>
              <Link
                href="/ideas"
                className="btn btn-lg bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/15 backdrop-blur-md text-[15px] w-full sm:w-auto justify-center"
              >
                Browse Ingested Ideas
              </Link>
            </div>
          </div>

          {/* ================= 3 PHASES TIMELINE OVERVIEW BAR ================= */}
          <div className="mt-16 pt-12 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-4">
            {dynamicPhases.map((phase) => {
              const isSelected = selectedPhase === phase.id;
              return (
                <button
                  key={phase.id}
                  onClick={() => setSelectedPhase(selectedPhase === phase.id ? null : phase.id)}
                  className={`text-left p-5 rounded-2xl border transition-all duration-200 ${
                    isSelected
                      ? "bg-white/[0.12] border-[#e85d26] shadow-lg shadow-[#e85d26]/20 scale-[1.02]"
                      : "bg-white/[0.04] hover:bg-white/[0.08] border-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-mono text-white/50 uppercase tracking-wider font-semibold">
                      Steps {phase.steps}
                    </span>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${phase.statusColor}`}>
                      {phase.status}
                    </span>
                  </div>
                  <h2 className="font-jakarta font-bold text-[18px] text-white mb-1">
                    Phase {phase.id}: {phase.name}
                  </h2>
                  <p className="text-[12px] text-[#fb923c] font-tamil mb-2">
                    {phase.nameTamil}
                  </p>
                  <p className="text-[13px] text-white/60 leading-relaxed">
                    {phase.description}
                  </p>
                </button>
              );
            })}
          </div>

          {selectedPhase && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setSelectedPhase(null)}
                className="text-xs text-[#f97316] hover:underline"
              >
                Showing Phase {selectedPhase} steps · Click to show all 7 steps
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ================= 7-STEP DETAILED JOURNEY ================= */}
      <section className="py-20 lg:py-28" aria-label="Step-by-step process">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#e85d26]/10 text-[#e85d26] text-xs font-bold uppercase tracking-wider mb-3">
              <Layers size={14} />
              <span>Full 7-Step Roadmap</span>
            </div>
            <h2 className="font-jakarta font-extrabold text-[32px] sm:text-[42px] text-[#0a0e1a] tracking-tight">
              The 7 Stages of Civic Tech Creation
            </h2>
            <p className="text-[#64748b] text-[16px] sm:text-[17px] mt-3">
              Every idea submitted goes through this structured pipeline to ensure fairness, transparency, and high execution quality.
            </p>
          </div>

          {/* Steps Container */}
          <div className="max-w-4xl mx-auto space-y-8">
            {filteredSteps.map((item) => {
              const StepIcon = item.icon;
              return (
                <div
                  key={item.number}
                  className="bg-white rounded-3xl p-6 sm:p-9 border border-[#e2e8f0] shadow-sm hover:shadow-xl transition-all duration-300 relative group overflow-hidden"
                >
                  {/* Left Color Accent Bar */}
                  <div
                    className="absolute top-0 left-0 bottom-0 w-2 transition-all duration-300 group-hover:w-3"
                    style={{ backgroundColor: item.color }}
                  />

                  <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8">
                    {/* Step Badge & Icon */}
                    <div className="flex sm:flex-col items-center gap-3 sm:gap-2 flex-shrink-0">
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-md transition-transform group-hover:scale-105"
                        style={{ backgroundColor: item.accentBg, color: item.color }}
                      >
                        <StepIcon size={28} />
                      </div>
                      <span className="font-jakarta font-black text-2xl sm:text-lg text-[#64748b] font-mono">
                        #{item.number}
                      </span>
                    </div>

                    {/* Step Main Details */}
                    <div className="flex-1 space-y-4">
                      {/* Step Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2.5">
                            <h3 className="font-jakarta font-extrabold text-[22px] sm:text-[26px] text-[#0a0e1a]">
                              {item.title}
                            </h3>
                            <span className="text-[14px] font-bold text-[#e85d26] font-tamil bg-[#e85d26]/10 px-2.5 py-0.5 rounded-md">
                              {item.titleTamil}
                            </span>
                          </div>
                          <p className="text-[13px] font-semibold text-[#64748b] mt-0.5">
                            {item.tagline}
                          </p>
                        </div>

                        <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#f8f7f4] text-[#475569] border border-[#e2e8f0]">
                          Phase {item.phaseId}: {item.phaseName}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-[#334155] text-[15px] sm:text-[16px] leading-relaxed">
                        {item.description}
                      </p>

                      {/* Bulleted Activities */}
                      <div className="bg-[#f8f7f4] rounded-2xl p-4 sm:p-5 border border-[#e2e8f0]/80">
                        <div className="text-[12px] font-bold text-[#0a0e1a] uppercase tracking-wider mb-2.5">
                          Key Activities in this Stage:
                        </div>
                        <ul className="space-y-2">
                          {item.whatHappens.map((act, aIdx) => (
                            <li key={aIdx} className="flex items-start gap-2 text-[13.5px] text-[#475569]">
                              <CheckCircle2 size={16} className="text-[#22c55e] flex-shrink-0 mt-0.5" />
                              <span>{act}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Deliverable Badge */}
                      <div className="flex items-center justify-between pt-2 border-t border-[#f1f5f9] text-[13px]">
                        <span className="text-[#64748b] font-medium">Stage Output:</span>
                        <span className="font-bold text-[#0a0e1a] bg-white px-3 py-1 rounded-lg border border-[#e2e8f0] shadow-2xs">
                          {item.deliverable}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= SELECTION MATRIX & PILLARS ================= */}
      <section className="bg-white py-20 lg:py-24 border-y border-[#e2e8f0]">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#3b82f6]/10 text-[#3b82f6] text-xs font-bold uppercase tracking-wider mb-3">
              <ShieldCheck size={14} />
              <span>Evaluation Rigor</span>
            </div>
            <h2 className="font-jakarta font-extrabold text-[32px] sm:text-[40px] text-[#0a0e1a] tracking-tight">
              How Ideas Are Evaluated
            </h2>
            <p className="text-[#64748b] text-[16px] mt-3">
              Before reaching the public ballot, ideas are evaluated openly against our 4 Core Evaluation Pillars.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {CRITERIA.map((crit, idx) => {
              const CritIcon = crit.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#f8f7f4] rounded-3xl p-7 border border-[#e2e8f0] hover:border-[#e85d26]/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center shadow-xs"
                        style={{ backgroundColor: `${crit.color}15`, color: crit.color }}
                      >
                        <CritIcon size={22} />
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white text-[#475569] border border-[#e2e8f0]">
                        {crit.score}
                      </span>
                    </div>

                    <h3 className="font-jakarta font-bold text-[18px] text-[#0a0e1a] mb-1">
                      {crit.title}
                    </h3>
                    <p className="text-[12px] font-semibold text-[#e85d26] font-tamil mb-3">
                      {crit.titleTamil}
                    </p>
                    <p className="text-[13.5px] text-[#64748b] leading-relaxed">
                      {crit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= CIVIC FAQ ACCORDION ================= */}
      <section className="py-20 lg:py-24">
        <div className="container max-w-4xl">
          <div className="text-center mb-14">
            <h2 className="font-jakarta font-extrabold text-[32px] sm:text-[38px] text-[#0a0e1a] tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-[#64748b] text-[16px] mt-2">
              Everything you need to know about the initiative, privacy, voting, and code ownership.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden transition-all duration-200 shadow-2xs"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-[#f8f7f4]/60 transition-colors"
                  >
                    <div>
                      <h3 className="font-jakarta font-bold text-[17px] sm:text-[18px] text-[#0a0e1a]">
                        {faq.question}
                      </h3>
                      <p className="text-[13px] font-semibold text-[#e85d26] font-tamil mt-1">
                        {faq.questionTamil}
                      </p>
                    </div>
                    <div
                      className={`w-8 h-8 rounded-full bg-[#f8f7f4] flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 bg-[#e85d26]/10 text-[#e85d26]" : "text-[#64748b]"
                      }`}
                    >
                      <ChevronDown size={18} />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 text-[#475569] text-[15px] leading-relaxed border-t border-[#f1f5f9] bg-white animate-fade-in">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= BOTTOM CTA ================= */}
      <section className="bg-[#060913] text-white py-16 lg:py-20 border-t border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(232,93,38,0.15),transparent_70%)] pointer-events-none" />
        <div className="container relative z-10 text-center max-w-2xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#22c55e]/15 border border-[#22c55e]/30 text-[12px] text-[#22c55e] font-bold">
            <span>
              {campaignStatus === "VOTING"
                ? "● Phase 3: Public Voting Is Live"
                : campaignStatus === "RESULTS" || campaignStatus === "WINNER"
                ? "● Phase 4: Voting Results Published"
                : "● Phase 1 is Currently Open"}
            </span>
          </div>

          <h2 className="font-jakarta font-extrabold text-[32px] sm:text-[42px] text-white leading-tight">
            {campaignStatus === "VOTING"
              ? "Tamil Nadu is voting right now."
              : campaignStatus === "RESULTS" || campaignStatus === "WINNER"
              ? "The winner has been chosen by citizens."
              : "Ready to shape what Tamil Nadu builds next?"}
          </h2>

          <p className="text-white/70 text-[16px] leading-relaxed">
            {campaignStatus === "VOTING"
              ? "Review the shortlisted civic tech finalists and cast your 1 verified vote before the ballot closes."
              : campaignStatus === "RESULTS" || campaignStatus === "WINNER"
              ? "Explore the winning problem and track open-source engineering development."
              : "Take 2 minutes to voice or write your everyday problem. We'll make sure it is heard, grouped, and put before the state for voting."}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link
              href={campaignStatus === "VOTING" || campaignStatus === "RESULTS" || campaignStatus === "WINNER" ? "/vote" : "/submit"}
              className="btn btn-primary btn-lg shadow-xl shadow-[#e85d26]/30 hover:shadow-[#e85d26]/50 flex items-center gap-2 text-[16px] w-full sm:w-auto justify-center font-bold"
            >
              <span>
                {campaignStatus === "VOTING"
                  ? "Cast Your Vote Now"
                  : campaignStatus === "RESULTS" || campaignStatus === "WINNER"
                  ? "View Winner Podium"
                  : "Share Your Idea Now"}
              </span>
              <ArrowRight size={17} />
            </Link>
            <Link
              href="/ideas"
              className="btn btn-lg bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/15 backdrop-blur-md text-[15px] w-full sm:w-auto justify-center"
            >
              Explore Live Ideas
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
