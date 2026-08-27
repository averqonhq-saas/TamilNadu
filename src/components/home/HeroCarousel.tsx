"use client";

import { useState, useEffect } from "react";
import {
  ChevronRight,
  ChevronLeft,
  MapPin,
  TrendingUp,
  ArrowRight,
  Flame,
  HeartPulse,
  Bus,
  Wheat,
  GraduationCap,
  Building2,
  Cpu,
} from "lucide-react";
import Link from "next/link";

interface DistrictIdea {
  id: string;
  city: string;
  districtTamil: string;
  category: string;
  categoryIcon: React.ElementType;
  categoryColor: string;
  categoryBg: string;
  title: string;
  description: string;
  supporters: number;
  tags: string[];
}

const FEATURED_IDEAS: DistrictIdea[] = [
  {
    id: "idea-1",
    city: "Madurai",
    districtTamil: "மதுரை",
    category: "Transport",
    categoryIcon: Bus,
    categoryColor: "#F59E0B",
    categoryBg: "rgba(245, 158, 11, 0.15)",
    title: "Live Feeder Bus & Minibus Tracking for Rural Routes",
    description:
      "School students and daily wage workers wait hours without knowing bus timings. A simple GPS feed via WhatsApp/SMS would save lakhs of productive hours.",
    supporters: 428,
    tags: ["Transit", "Rural TN", "GPS"],
  },
  {
    id: "idea-2",
    city: "Thanjavur",
    districtTamil: "தஞ்சாவூர்",
    category: "Agriculture",
    categoryIcon: Wheat,
    categoryColor: "#10B981",
    categoryBg: "rgba(16, 185, 129, 0.15)",
    title: "Direct Rice & Crop Mandi Spot-Price SMS Alert",
    description:
      "Farmers lose margin to middlemen because daily wholesale rates aren't transparent. Direct daily price updates in Tamil allow fair bargaining.",
    supporters: 512,
    tags: ["Kaveri Delta", "Fair Trade", "SMS Bot"],
  },
  {
    id: "idea-3",
    city: "Chennai",
    districtTamil: "சென்னை",
    category: "Healthcare",
    categoryIcon: HeartPulse,
    categoryColor: "#EF4444",
    categoryBg: "rgba(239, 68, 68, 0.15)",
    title: "PHC Medicine Stock & OPD Live Token Display",
    description:
      "Patients travel miles to Government Primary Health Centers only to find specific medicines out of stock. Live digital stockboards prevent wasted trips.",
    supporters: 680,
    tags: ["Public Health", "GH Portal", "Open Data"],
  },
  {
    id: "idea-4",
    city: "Coimbatore",
    districtTamil: "கோயம்புத்தூர்",
    category: "Jobs & MSMEs",
    categoryIcon: Cpu,
    categoryColor: "#8B5CF6",
    categoryBg: "rgba(139, 92, 246, 0.15)",
    title: "Local MSME Machine Spare Parts & Tooling Sharing Exchange",
    description:
      "Small machine shops in Coimbatore often have idle CNC machine time or need urgent tools. A hyper-local B2B sharing network boosts industrial output.",
    supporters: 319,
    tags: ["Industrial Hub", "MSME", "Smart Economy"],
  },
  {
    id: "idea-5",
    city: "Tirunelveli",
    districtTamil: "திருநெல்வேலி",
    category: "Education",
    categoryIcon: GraduationCap,
    categoryColor: "#3B82F6",
    categoryBg: "rgba(59, 130, 246, 0.15)",
    title: "Tamil-Medium Digital Science Lab & Exam Prep Modules",
    description:
      "Government school students in Southern TN need high-quality animated science simulations and competitive exam prep in simple spoken Tamil.",
    supporters: 467,
    tags: ["Govt Schools", "STEM", "Equal Access"],
  },
  {
    id: "idea-6",
    city: "Salem",
    districtTamil: "சேலம்",
    category: "Public Services",
    categoryIcon: Building2,
    categoryColor: "#06B6D4",
    categoryBg: "rgba(6, 182, 212, 0.15)",
    title: "Ward Drinking Water Supply Schedule & Pressure Map",
    description:
      "Water is released on erratic schedules in many wards. Automated pressure sensors and alert messages can notify households 30 minutes before supply.",
    supporters: 384,
    tags: ["Smart City", "Water Grid", "Citizen Alert"],
  },
];

export default function HeroCarousel() {
  const [activeIdeaIndex, setActiveIdeaIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Auto-cycle ideas
  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(() => {
      setActiveIdeaIndex((prev) => (prev + 1) % FEATURED_IDEAS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isAutoPlay]);

  const currentIdea = FEATURED_IDEAS[activeIdeaIndex];
  const CategoryIcon = currentIdea.categoryIcon;

  return (
    <div className="relative rounded-3xl p-6 sm:p-7 bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/15 backdrop-blur-xl shadow-2xl shadow-black/50">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#e85d26]" style={{ animation: "pulse 2s ease-in-out infinite" }} />
          <span className="font-jakarta font-bold text-[14px] text-white tracking-wide">
            Tamil Nadu Live Pulse Hub
          </span>
        </div>

        {/* Carousel Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setIsAutoPlay(false);
              setActiveIdeaIndex(
                (prev) => (prev - 1 + FEATURED_IDEAS.length) % FEATURED_IDEAS.length
              );
            }}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 transition-colors"
            aria-label="Previous idea"
          >
            <ChevronLeft size={15} />
          </button>
          <span className="text-[11px] text-white/50 px-1 font-mono">
            {activeIdeaIndex + 1}/{FEATURED_IDEAS.length}
          </span>
          <button
            onClick={() => {
              setIsAutoPlay(false);
              setActiveIdeaIndex((prev) => (prev + 1) % FEATURED_IDEAS.length);
            }}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 transition-colors"
            aria-label="Next idea"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* District pills */}
      <div className="mb-5 bg-black/30 rounded-2xl p-3 border border-white/5">
        <div className="text-[11px] text-white/50 uppercase tracking-wider font-semibold mb-2.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <MapPin size={12} className="text-[#e85d26]" />
            38 Districts Active
          </span>
          <span className="text-[#22c55e] font-mono text-[10px]">● Live Stream</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {FEATURED_IDEAS.map((idea, idx) => {
            const isSelected = idx === activeIdeaIndex;
            return (
              <button
                key={idea.id}
                onClick={() => {
                  setIsAutoPlay(false);
                  setActiveIdeaIndex(idx);
                }}
                className={`text-[11px] px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1 ${
                  isSelected
                    ? "bg-[#e85d26] text-white font-bold shadow-md shadow-[#e85d26]/40 scale-105"
                    : "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white"
                }`}
              >
                <span>{idea.city}</span>
                <span className="text-[9px] opacity-70">({idea.districtTamil})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Idea Card */}
      <div
        key={currentIdea.id}
        className="bg-white/[0.06] rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all duration-300 relative group animate-fade-in"
      >
        <div className="flex items-center justify-between gap-2 mb-3">
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] font-bold"
            style={{ backgroundColor: currentIdea.categoryBg, color: currentIdea.categoryColor }}
          >
            <CategoryIcon size={14} />
            <span>{currentIdea.category}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-white/80 bg-white/10 px-2.5 py-1 rounded-md">
            <MapPin size={12} className="text-[#e85d26]" />
            <span className="font-semibold">{currentIdea.city}</span>
            <span className="text-white/40">·</span>
            <span className="text-white/60">{currentIdea.districtTamil}</span>
          </div>
        </div>

        <h3 className="font-jakarta font-bold text-[17px] sm:text-[18px] text-white leading-snug mb-2 group-hover:text-[#f97316] transition-colors">
          {currentIdea.title}
        </h3>

        <p className="text-white/70 text-[13px] sm:text-[14px] leading-relaxed mb-4 line-clamp-3">
          &ldquo;{currentIdea.description}&rdquo;
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <div className="flex items-center gap-1.5 text-[12px] text-[#22c55e] font-semibold bg-[#22c55e]/10 border border-[#22c55e]/20 px-2.5 py-1 rounded-full">
            <TrendingUp size={13} />
            <span>{currentIdea.supporters} citizens agreed</span>
          </div>
          <Link
            href="/ideas"
            className="text-[12px] font-semibold text-white/80 hover:text-white flex items-center gap-1 group/link"
          >
            <span>View discussion</span>
            <ArrowRight size={13} className="group-hover/link:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Bottom prompt */}
      <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-[12px]">
        <div className="text-white/50 flex items-center gap-1.5">
          <Flame size={14} className="text-[#e85d26]" />
          <span>Have a problem in your area?</span>
        </div>
        <Link
          href="/submit"
          className="font-bold text-[#f97316] hover:text-[#ff8a4c] transition-colors flex items-center gap-1"
        >
          <span>Post yours</span>
          <span>→</span>
        </Link>
      </div>

      {/* Floating badge */}
      <div className="absolute -top-3.5 -right-3.5 bg-gradient-to-r from-[#e85d26] to-[#f59e0b] text-white text-[11px] font-extrabold px-3 py-1 rounded-full shadow-lg shadow-[#e85d26]/40 flex items-center gap-1">
        <span>✦</span>
        <span>Tamil Nadu 2026</span>
      </div>
    </div>
  );
}
