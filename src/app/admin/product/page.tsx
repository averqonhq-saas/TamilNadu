"use client";

import Link from "next/link";
import {
  Rocket,
  Code2,
  GitBranch,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  Layers,
  ArrowRight,
} from "lucide-react";

interface Milestone {
  step: string;
  title: string;
  desc: string;
  status: "COMPLETED" | "IN_PROGRESS" | "UPCOMING";
  eta: string;
}

const MILESTONES: Milestone[] = [
  {
    step: "01",
    title: "Public Vote Outcome & Architecture Blueprint",
    desc: "Synthesis of citizen voting results, tech stack selection, and system design document.",
    status: "COMPLETED",
    eta: "Aug 24, 2026",
  },
  {
    step: "02",
    title: "Open-Source GitHub Repository Initialization",
    desc: "Monorepo setup, CI/CD pipeline, and public contribution guidelines.",
    status: "IN_PROGRESS",
    eta: "Aug 26, 2026",
  },
  {
    step: "03",
    title: "Core Backend APIs & Transport/PHC Data Ingestion",
    desc: "Connecting open state transport APIs and real-time database endpoints.",
    status: "UPCOMING",
    eta: "Sep 02, 2026",
  },
  {
    step: "04",
    title: "Bilingual Mobile Web Application (Tamil & English)",
    desc: "Lightweight, offline-first PWA for daily commuters and rural families.",
    status: "UPCOMING",
    eta: "Sep 10, 2026",
  },
  {
    step: "05",
    title: "Pilot Launch & State-Wide Delivery",
    desc: "Pilot testing across 5 districts with municipal stakeholders.",
    status: "UPCOMING",
    eta: "Sep 20, 2026",
  },
];

export default function AdminProductPage() {
  return (
    <div className="p-6 lg:p-8 max-w-5xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge badge-accent text-xs">Episode 3 Execution</span>
            <span className="text-xs text-[#64748b]">• Build In Public</span>
          </div>
          <h1 className="font-jakarta font-extrabold text-[28px] text-[#0a0e1a]">
            Episode 3: Product Engineering Roadmap
          </h1>
          <p className="text-[#64748b] text-[15px]">
            &ldquo;Okay. Tamil Nadu chose it. Now let&apos;s build it.&rdquo;
          </p>
        </div>

        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary btn-sm flex items-center gap-2 font-bold px-4 h-10 rounded-xl"
        >
          <Code2 size={15} />
          <span>GitHub Repository</span>
          <ExternalLink size={13} />
        </a>
      </div>

      {/* Winning Product Spotlight */}
      <div className="bg-[#0a0e1a] text-white rounded-3xl p-7 sm:p-8 border border-white/10 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#fb923c] uppercase tracking-wider">
            Active Chosen Product
          </span>
          <span className="font-mono text-xs text-white/60">Phase: Sprint 1 Underway</span>
        </div>

        <h2 className="font-jakarta font-extrabold text-[24px] sm:text-[28px] text-white flex items-center gap-3">
          <span>01 — Smart Bus TN</span>
          <span className="text-[28px]">🚌</span>
        </h2>

        <p className="text-white/80 text-[15px] italic leading-relaxed">
          &ldquo;Know where your bus is, when it will arrive, and how crowded it is.&rdquo;
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-white/60">
          <span>Target Launch: September 2026</span>
          <span>•</span>
          <span>100% Free &amp; Open Source</span>
          <span>•</span>
          <span>Engineered for Tamil Nadu</span>
        </div>
      </div>

      {/* Roadmap Milestones */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2e8f0] shadow-xs space-y-6">
        <h3 className="font-jakarta font-bold text-[18px] text-[#0a0e1a]">
          Sprint Milestones
        </h3>

        <div className="space-y-4">
          {MILESTONES.map((m) => (
            <div
              key={m.step}
              className="p-5 rounded-2xl border border-[#e2e8f0] bg-[#f8f7f4] flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <span className="w-10 h-10 rounded-xl bg-[#0a0e1a] text-white font-mono font-bold flex items-center justify-center text-sm flex-shrink-0">
                  {m.step}
                </span>
                <div className="space-y-1">
                  <h4 className="font-jakarta font-bold text-[15.5px] text-[#0a0e1a]">
                    {m.title}
                  </h4>
                  <p className="text-xs text-[#64748b] leading-relaxed max-w-xl">{m.desc}</p>
                </div>
              </div>

              <div className="text-right flex-shrink-0 space-y-1">
                <span
                  className={`badge text-[11px] font-bold ${
                    m.status === "COMPLETED"
                      ? "badge-success"
                      : m.status === "IN_PROGRESS"
                      ? "badge-warning"
                      : "badge-ghost bg-white"
                  }`}
                >
                  {m.status}
                </span>
                <span className="text-[11px] text-[#94a3b8] block font-mono">ETA: {m.eta}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
