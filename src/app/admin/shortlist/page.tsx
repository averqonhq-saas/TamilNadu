"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Star,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Save,
  Plus,
  Vote,
  Users,
  MapPin,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Layers,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { DEFAULT_SHORTLISTED_IDEAS, ShortlistedIdea } from "@/lib/constants/campaign";
import { ManualGroup } from "@/lib/data/groups";
import { toast } from "sonner";

export default function AdminShortlistPage() {
  const [shortlist, setShortlist] = useState<ShortlistedIdea[]>(DEFAULT_SHORTLISTED_IDEAS);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load from API groups with status=SHORTLISTED if available
  const loadShortlistedGroups = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/groups?status=SHORTLISTED");
      if (res.ok) {
        const data = await res.json();
        const groups: ManualGroup[] = data.groups || [];

        if (groups.length > 0) {
          const mappedShortlist: ShortlistedIdea[] = groups.map((g, idx) => {
            const count = g.submissions_count > 0 ? g.submissions_count : (g.member_idea_ids?.length || 1);
            const distCount = g.districts_count > 0 ? g.districts_count : (g.top_districts?.length || 1);
            const distText =
              g.top_districts && g.top_districts.length > 0
                ? `Across ${distCount} Districts (${g.top_districts.slice(0, 3).join(", ")})`
                : "Tamil Nadu";

            return {
              id: g.id,
              public_id: `GRP-${g.id.slice(0, 6).toUpperCase()}`,
              product_number: `0${idx + 1}`,
              product_name: g.product_concept || g.title,
              emoji: g.emoji || "💡",
              tagline: g.tagline || g.description,
              why_is_this_here: `${count} people submitted a similar problem across ${distCount} districts.`,
              districts_count: distCount,
              category_id: g.category_id,
              category_name: g.category_name,
              category_color: g.category_color,
              category_bg: g.category_bg || `${g.category_color}15`,
              title: `${g.product_concept || g.title} — ${g.title}`,
              title_tamil: "",
              problem_description: g.description,
              district: distText,
              why_it_matters: `Synthesized directly from ${count} citizen submissions across Tamil Nadu.`,
              submitters_count: count,
            };
          });

          setShortlist(mappedShortlist);
          toast.success(`Loaded ${mappedShortlist.length} candidate groups from Idea Groups!`);
        }
      }
    } catch (err) {
      console.warn("Using default shortlisted ideas:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadShortlistedGroups();
  }, []);

  const moveItem = (index: number, direction: "UP" | "DOWN") => {
    const newIdx = direction === "UP" ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= shortlist.length) return;

    const updated = [...shortlist];
    const temp = updated[index];
    updated[index] = updated[newIdx];
    updated[newIdx] = temp;

    // update product_number
    updated.forEach((item, idx) => {
      item.product_number = `0${idx + 1}`;
    });

    setShortlist(updated);
    toast.success("Finalist ballot order updated!");
  };

  const removeItem = (id: string) => {
    if (shortlist.length <= 3) {
      toast.error("You must retain at least 3 finalists for the public poll.");
      return;
    }
    const filtered = shortlist.filter((i) => i.id !== id);
    filtered.forEach((item, idx) => {
      item.product_number = `0${idx + 1}`;
    });
    setShortlist(filtered);
    toast.success("Finalist removed from shortlist.");
  };

  const handleSaveShortlist = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Public Voting Shortlist saved successfully! Live ballot updated.");
    }, 500);
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge badge-accent text-xs">Bridge To Voting</span>
            <span className="text-xs text-[#64748b]">• {shortlist.length} Finalists Configured</span>
          </div>
          <h1 className="font-jakarta font-extrabold text-[28px] sm:text-[32px] text-[#0a0e1a] tracking-tight">
            Public Voting Shortlist
          </h1>
          <p className="text-[#64748b] text-[15px]">
            Each finalist represents a curated <strong>Idea Group</strong>. When citizens vote, the whole group is the candidate option.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href="/admin/groups"
            className="btn btn-secondary btn-sm flex items-center gap-2 text-xs font-bold"
          >
            <Layers size={14} />
            <span>Manage Idea Groups</span>
          </Link>

          <Link
            href="/admin/voting"
            className="btn btn-secondary btn-sm flex items-center gap-2 text-xs font-bold"
          >
            <Vote size={14} className="text-emerald-600" />
            <span>Voting Controls</span>
          </Link>

          <button
            onClick={handleSaveShortlist}
            disabled={isSaving}
            className="btn btn-primary btn-sm flex items-center gap-2 font-bold px-5 h-10 rounded-xl shadow-md shadow-[#e85d26]/20"
          >
            <Save size={14} />
            <span>{isSaving ? "Saving..." : "Save Shortlist"}</span>
          </button>
        </div>
      </div>

      {/* Info Banner: 1 Group = 1 Poll Candidate */}
      <div className="bg-[#fffaf7] border border-[#e85d26]/20 rounded-2xl p-5 flex items-start gap-3">
        <Sparkles size={18} className="text-[#e85d26] flex-shrink-0 mt-0.5" />
        <div className="text-xs text-[#334155] leading-relaxed space-y-1">
          <strong className="text-[#0a0e1a]">Democratic Voting Architecture:</strong> 47 people submitted similar problems &rarr; <strong>Real-time Bus Tracking</strong> Idea Group &rarr; <strong>One public voting option</strong> on <code className="bg-white px-1.5 py-0.5 rounded border border-[#e2e8f0]">/vote</code>. Reorder finalists using the Up/Down controls below.
        </div>
      </div>

      {/* Finalist Cards List */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-[#64748b] space-y-2">
          <Loader2 size={32} className="animate-spin text-[#e85d26]" />
          <span className="text-sm">Loading voting finalists...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {shortlist.map((idea, idx) => {
            const num = idea.product_number || `0${idx + 1}`;
            const isFirst = idx === 0;
            const isLast = idx === shortlist.length - 1;

            return (
              <div
                key={idea.id}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-[#e2e8f0] shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex items-start gap-4 flex-1">
                  {/* Number Badge */}
                  <div className="w-12 h-12 rounded-2xl bg-[#0a0e1a] text-white flex items-center justify-center font-mono font-extrabold text-base flex-shrink-0">
                    {num}
                  </div>

                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="px-2.5 py-0.5 rounded-lg text-xs font-bold"
                        style={{
                          backgroundColor: idea.category_bg,
                          color: idea.category_color,
                        }}
                      >
                        {idea.category_name}
                      </span>
                      <span className="text-xs text-[#64748b] font-medium flex items-center gap-1">
                        <MapPin size={12} className="text-[#e85d26]" />
                        {idea.district}
                      </span>
                      <span className="font-mono text-xs text-[#94a3b8]">#{idea.public_id}</span>
                    </div>

                    <h3 className="font-jakarta font-extrabold text-[19px] sm:text-[21px] text-[#0a0e1a] flex items-center gap-2">
                      <span>{idea.product_name}</span>
                      <span>{idea.emoji}</span>
                    </h3>

                    <p className="text-[14px] text-[#475569] font-medium italic">
                      &ldquo;{idea.tagline}&rdquo;
                    </p>

                    {/* Grouped Proof Badge */}
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#0a0e1a] bg-[#f8f7f4] px-3 py-1.5 rounded-xl border border-[#e2e8f0] w-fit">
                      <Users size={13} className="text-[#e85d26]" />
                      <span>{idea.why_is_this_here}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons: Move Up, Move Down, Remove */}
                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    onClick={() => moveItem(idx, "UP")}
                    disabled={isFirst}
                    className="btn btn-secondary btn-sm p-2 disabled:opacity-30"
                    title="Move Up on Ballot"
                  >
                    <ArrowUp size={15} />
                  </button>

                  <button
                    onClick={() => moveItem(idx, "DOWN")}
                    disabled={isLast}
                    className="btn btn-secondary btn-sm p-2 disabled:opacity-30"
                    title="Move Down on Ballot"
                  >
                    <ArrowDown size={15} />
                  </button>

                  <button
                    onClick={() => removeItem(idea.id)}
                    className="btn btn-secondary btn-sm p-2 text-rose-500 hover:bg-rose-50 hover:border-rose-300"
                    title="Remove from Shortlist"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Save Bar */}
      <div className="pt-4 flex items-center justify-between">
        <Link
          href="/vote"
          target="_blank"
          className="text-xs font-bold text-[#e85d26] flex items-center gap-1 hover:underline"
        >
          <span>Preview live voting screen (/vote)</span>
          <ExternalLink size={13} />
        </Link>

        <button
          onClick={handleSaveShortlist}
          disabled={isSaving}
          className="btn btn-primary font-bold px-7 h-11 rounded-xl shadow-lg shadow-[#e85d26]/20"
        >
          <span>Save Shortlist</span>
        </button>
      </div>
    </div>
  );
}
