"use client";

import { MapPin, Calendar, ArrowUpRight, TrendingUp, Sparkles } from "lucide-react";
import { formatRelativeDate } from "@/lib/utils";
import Link from "next/link";

interface IdeaCardProps {
  idea: {
    id: string;
    public_id: string;
    title: string;
    description: string | null;
    district: string;
    created_at: string;
    categories: {
      name: string;
      slug: string;
      icon: string;
      color: string;
    } | null;
  };
}

export default function IdeaCard({ idea }: IdeaCardProps) {
  const category = idea.categories;
  const categoryColor = category?.color || "#E85D26";

  return (
    <article className="bg-white rounded-2xl p-6 border border-[#e2e8f0] shadow-sm hover:shadow-xl hover:border-[#e85d26]/40 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
      {/* Top Accent Line */}
      <div
        className="absolute top-0 left-0 right-0 h-1 transition-all duration-300 group-hover:h-1.5"
        style={{ backgroundColor: categoryColor }}
      />

      <div>
        {/* Header: Category + Public ID */}
        <div className="flex items-center justify-between gap-2 mb-3.5 pt-1">
          {category ? (
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11.5px] font-bold"
              style={{
                backgroundColor: `${category.color}15`,
                color: category.color,
              }}
            >
              <span>{category.name}</span>
            </span>
          ) : (
            <span className="badge badge-navy text-[11.5px]">General Issue</span>
          )}

          <span className="text-[11px] text-[#94a3b8] font-mono font-bold bg-[#f8f7f4] px-2 py-0.5 rounded border border-[#e2e8f0]">
            #{idea.public_id}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-jakarta font-bold text-[17px] text-[#0a0e1a] leading-snug mb-2.5 group-hover:text-[#e85d26] transition-colors line-clamp-2">
          {idea.title}
        </h3>

        {/* Description */}
        {idea.description && (
          <p className="text-[13.5px] text-[#64748b] leading-relaxed mb-4 line-clamp-3">
            {idea.description}
          </p>
        )}
      </div>

      {/* Meta Footer */}
      <div className="pt-4 border-t border-[#f1f5f9] mt-4 flex items-center justify-between text-[12px] text-[#64748b]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-medium text-[#0a0e1a]">
            <MapPin size={13} className="text-[#e85d26]" />
            {idea.district}
          </span>
          <span className="text-[#cbd5e1]">•</span>
          <span className="flex items-center gap-1 text-[#94a3b8]">
            <Calendar size={12} />
            {formatRelativeDate(idea.created_at)}
          </span>
        </div>

        <Link
          href={`/submit?category=${category?.slug || ""}`}
          className="text-[11px] font-semibold text-[#e85d26] hover:underline flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <span>Submit similar</span>
          <ArrowUpRight size={12} />
        </Link>
      </div>
    </article>
  );
}

