"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Globe,
  Star,
  GitMerge,
  Copy,
  Trash2,
  Clock,
  MapPin,
  Mail,
  User,
  Sparkles,
  Save,
  MessageSquare,
  ShieldCheck,
  AlertCircle,
  Tag,
  Share2,
  ExternalLink,
  Send,
} from "lucide-react";
import { toast } from "sonner";

interface IdeaDetail {
  id: string;
  public_id: string;
  title: string;
  problem_description: string;
  solution_idea?: string;
  category_id: string;
  category_name: string;
  district: string;
  scope: string;
  status: string;
  visibility: string;
  internal_notes: string;
  submitter_email: string;
  submitter_name?: string;
  created_at: string;
  group_id?: string;
}

export default function IdeaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const id = resolvedParams.id;

  const [idea, setIdea] = useState<IdeaDetail | null>(null);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    async function loadIdea() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/admin/ideas/${id}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.id) {
            setIdea(data);
            setNotes(data.internal_notes || "");
          }
        }
      } catch (err) {
        console.error("Error loading idea detail:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadIdea();
  }, [id]);

  const handleUpdateStatus = async (newStatus: string, newVisibility?: string) => {
    setIsUpdatingStatus(true);
    try {
      const res = await fetch(`/api/admin/ideas/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          ...(newVisibility && { visibility: newVisibility }),
        }),
      });

      if (!res.ok) throw new Error("Status update failed");

      setIdea((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              ...(newVisibility && { visibility: newVisibility }),
            }
          : null
      );
      toast.success(`Idea status updated to ${newStatus}`);
    } catch {
      toast.error("Failed to update status.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    try {
      const res = await fetch(`/api/admin/ideas/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ internal_notes: notes }),
      });
      if (!res.ok) throw new Error("Notes save failed");

      setIdea((prev) => (prev ? { ...prev, internal_notes: notes } : null));
      toast.success("Private internal notes saved!");
    } catch {
      toast.error("Could not save notes.");
    } finally {
      setIsSavingNotes(false);
    }
  };

  const copyEmail = () => {
    if (idea?.submitter_email) {
      navigator.clipboard.writeText(idea.submitter_email);
      toast.success("Submitter email copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-6xl space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-32 bg-[#e2e8f0] rounded" />
          <div className="h-48 bg-white border border-[#e2e8f0] rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="p-8 max-w-6xl space-y-6 text-center">
        <div className="bg-white rounded-3xl p-12 border border-[#e2e8f0] space-y-4">
          <AlertCircle size={40} className="mx-auto text-[#f59e0b]" />
          <h2 className="text-xl font-bold text-[#0a0e1a]">Idea Not Found</h2>
          <p className="text-sm text-[#64748b]">The requested idea ID could not be loaded.</p>
          <Link href="/admin/ideas" className="btn btn-primary btn-sm inline-flex items-center gap-2">
            <ArrowLeft size={14} />
            <span>Return to Ideas Table</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl space-y-6">
      {/* Top Breadcrumb & Return Link */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/ideas"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#64748b] hover:text-[#0a0e1a] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Ideas Table</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-[#94a3b8]">ID: #{idea.public_id}</span>
          <span className="text-xs text-[#64748b]">•</span>
          <span className="text-xs text-[#64748b]">
            Submitted on {new Date(idea.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
          </span>
        </div>
      </div>

      {/* Main Grid: Left Details + Right Operations Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols: Full Problem Description & Submitter Info */}
        <div className="lg:col-span-8 space-y-6">
          {/* Submitter Identity Card */}
          <div className="bg-gradient-to-br from-[#0a0e1a] to-[#1e293b] text-white rounded-3xl p-6 sm:p-7 border border-white/10 shadow-lg relative overflow-hidden space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#e85d26] flex items-center justify-center text-white font-bold shadow-md shadow-[#e85d26]/30">
                  <User size={20} />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-white/50 uppercase tracking-wider block">
                    Citizen Submitter
                  </span>
                  <h3 className="font-jakarta font-bold text-[16px] text-white">
                    {idea.submitter_name || "Resident of Tamil Nadu"}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                  <ShieldCheck size={14} />
                  <span>Verified Citizen</span>
                </div>
              </div>
            </div>

            {/* Email Contact Box */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <Mail size={16} className="text-[#e85d26] flex-shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-white/60 block">Registered Email Address</span>
                  <span className="font-mono text-sm text-white font-semibold truncate block">
                    {idea.submitter_email}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={copyEmail}
                  className="btn bg-white/10 hover:bg-white/20 text-white border-white/10 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all"
                  title="Copy email ID"
                >
                  <Copy size={13} />
                  <span>Copy</span>
                </button>
                <a
                  href={`mailto:${idea.submitter_email}?subject=Build Tamil Nadu: Regarding your submission (${idea.public_id})`}
                  className="btn btn-primary text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold shadow-md"
                >
                  <Send size={13} />
                  <span>Send Mail</span>
                </a>
              </div>
            </div>
          </div>

          {/* Idea Content Card */}
          <div className="bg-white rounded-3xl p-7 sm:p-9 border border-[#e2e8f0] shadow-xs space-y-6">
            {/* Header Badge Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#e2e8f0]">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-lg text-xs font-bold bg-[#f1f5f9] text-[#0a0e1a]">
                  {idea.category_name}
                </span>
                <span className="text-xs text-[#64748b] flex items-center gap-1 font-medium">
                  <MapPin size={13} className="text-[#e85d26]" />
                  {idea.district}
                </span>
                <span className="text-xs text-[#94a3b8]">({idea.scope || "State-wide"})</span>
              </div>

              <span
                className={`badge font-bold text-xs ${
                  idea.status === "APPROVED"
                    ? "badge-success"
                    : idea.status === "SHORTLISTED"
                    ? "bg-purple-100 text-purple-700 border-purple-200"
                    : idea.status === "REJECTED"
                    ? "badge-danger"
                    : "badge-warning"
                }`}
              >
                {idea.status}
              </span>
            </div>

            {/* Title */}
            <div>
              <span className="text-xs font-bold text-[#e85d26] uppercase tracking-wider block mb-1">
                Citizen Submission Title:
              </span>
              <h1 className="font-jakarta font-extrabold text-[24px] sm:text-[28px] text-[#0a0e1a] leading-snug">
                {idea.title}
              </h1>
            </div>

            {/* Problem Statement */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#0a0e1a] uppercase tracking-wider block">
                The Core Bottleneck / Problem:
              </span>
              <div className="bg-[#f8f7f4] rounded-2xl p-5 border border-[#e2e8f0] text-[15px] text-[#334155] leading-relaxed">
                {idea.problem_description}
              </div>
            </div>

            {/* Proposed Solution (if provided) */}
            {idea.solution_idea && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#0a0e1a] uppercase tracking-wider block">
                  Citizen&apos;s Suggested Solution / Wish:
                </span>
                <div className="bg-[#fffaf7] rounded-2xl p-5 border border-[#e85d26]/20 text-[14.5px] text-[#0a0e1a] leading-relaxed">
                  {idea.solution_idea}
                </div>
              </div>
            )}
          </div>

          {/* Internal Private Notes Box */}
          <div className="bg-white rounded-3xl p-7 border border-[#e2e8f0] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare size={16} className="text-[#e85d26]" />
                <h3 className="font-jakarta font-bold text-[16px] text-[#0a0e1a]">
                  Internal Private Notes (Team Only)
                </h3>
              </div>
              <span className="text-[11px] text-[#94a3b8]">Never visible to public</span>
            </div>

            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add review notes, cluster group IDs, feasibility comments, or engineering remarks..."
              className="input w-full p-4 text-[14px] leading-relaxed bg-[#f8f7f4] border-[#e2e8f0] focus:bg-white resize-none"
            />

            <div className="flex justify-end">
              <button
                onClick={handleSaveNotes}
                disabled={isSavingNotes}
                className="btn btn-primary btn-sm flex items-center gap-2 font-bold px-5"
              >
                <Save size={13} />
                <span>{isSavingNotes ? "Saving..." : "Save Internal Notes"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Operations Action Center */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Status Modifiers */}
          <div className="bg-white rounded-3xl p-6 border border-[#e2e8f0] shadow-xs space-y-5">
            <div>
              <span className="text-xs font-bold text-[#64748b] uppercase tracking-wider block mb-1">
                Moderation Action
              </span>
              <h3 className="font-jakarta font-bold text-[16px] text-[#0a0e1a]">
                Update Submission Status
              </h3>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => handleUpdateStatus("APPROVED", "PUBLIC")}
                disabled={isUpdatingStatus || idea.status === "APPROVED"}
                className={`w-full p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${
                  idea.status === "APPROVED"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-white hover:bg-emerald-50 text-[#0a0e1a] border-[#e2e8f0] hover:border-emerald-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-600" />
                  <span>Approve &amp; Make Public</span>
                </div>
                {idea.status === "APPROVED" && <span className="text-[10px] font-mono">ACTIVE</span>}
              </button>

              <button
                onClick={() => handleUpdateStatus("SHORTLISTED")}
                disabled={isUpdatingStatus || idea.status === "SHORTLISTED"}
                className={`w-full p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${
                  idea.status === "SHORTLISTED"
                    ? "bg-purple-50 text-purple-700 border-purple-200"
                    : "bg-white hover:bg-purple-50 text-[#0a0e1a] border-[#e2e8f0] hover:border-purple-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Star size={15} className="text-purple-600" />
                  <span>Shortlist for Voting Poll</span>
                </div>
                {idea.status === "SHORTLISTED" && <span className="text-[10px] font-mono">ACTIVE</span>}
              </button>

              <button
                onClick={() => handleUpdateStatus("REJECTED", "PRIVATE")}
                disabled={isUpdatingStatus || idea.status === "REJECTED"}
                className={`w-full p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${
                  idea.status === "REJECTED"
                    ? "bg-rose-50 text-rose-700 border-rose-200"
                    : "bg-white hover:bg-rose-50 text-[#0a0e1a] border-[#e2e8f0] hover:border-rose-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  <XCircle size={15} className="text-rose-600" />
                  <span>Reject Submission</span>
                </div>
                {idea.status === "REJECTED" && <span className="text-[10px] font-mono">ACTIVE</span>}
              </button>
            </div>
          </div>

          {/* Submitter Quick Contact Card */}
          <div className="bg-[#f8f7f4] rounded-3xl p-6 border border-[#e2e8f0] space-y-3">
            <span className="text-xs font-bold text-[#64748b] uppercase tracking-wider block">
              Direct Contact
            </span>
            <p className="text-xs text-[#64748b]">
              Need clarification on this citizen problem? Reach out directly via registered email.
            </p>
            <a
              href={`mailto:${idea.submitter_email}?subject=Build Tamil Nadu: Your idea (#${idea.public_id})`}
              className="btn btn-secondary w-full text-xs font-bold flex items-center justify-center gap-2 py-2.5"
            >
              <Mail size={14} className="text-[#e85d26]" />
              <span>Email {idea.submitter_email}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
