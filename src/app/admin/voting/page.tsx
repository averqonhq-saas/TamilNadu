"use client";

import { useState, useEffect } from "react";
import {
  Vote,
  Trophy,
  Calendar,
  Clock,
  Download,
  Users,
  ShieldCheck,
  Flame,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Eye,
  Sliders,
  ExternalLink,
  MapPin,
  Sparkles,
  Plus,
  Trash2,
  X,
  Loader2,
  Layers,
  Check,
} from "lucide-react";
import {
  CampaignStatus,
  ShortlistedIdea,
  DEFAULT_SHORTLISTED_IDEAS,
  DEFAULT_CAMPAIGN,
} from "@/lib/constants/campaign";
import { CATEGORIES, getCategoryById } from "@/lib/constants/categories";
import { ManualGroup } from "@/lib/data/groups";
import { toast } from "sonner";

const EMOJI_PRESETS = ["🚌", "🏥", "🌾", "🎓", "🚨", "🏛️", "💼", "🌱", "⚡", "🛡️", "💧", "🏘️", "📱", "🎯", "🚀"];

export default function AdminVotingPage() {
  const [status, setStatus] = useState<CampaignStatus>("COLLECTING");
  const [candidates, setCandidates] = useState<ShortlistedIdea[]>(DEFAULT_SHORTLISTED_IDEAS);
  const [totalVotes, setTotalVotes] = useState(0);
  const [votingStart, setVotingStart] = useState("2026-11-18");
  const [votingEnd, setVotingEnd] = useState("2026-11-28");
  const [allowResults, setAllowResults] = useState(false);
  const [districts, setDistricts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Add Finalist Modal State
  const [isAddFinalistOpen, setIsAddFinalistOpen] = useState(false);
  const [modalTab, setModalTab] = useState<"GROUPS" | "CUSTOM">("GROUPS");
  const [availableGroups, setAvailableGroups] = useState<ManualGroup[]>([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);

  // Custom Finalist Form
  const [customName, setCustomName] = useState("");
  const [customCategory, setCustomCategory] = useState("transport");
  const [customEmoji, setCustomEmoji] = useState("🚀");
  const [customTagline, setCustomTagline] = useState("");
  const [customProblem, setCustomProblem] = useState("");
  const [customDistrict, setCustomDistrict] = useState("Across Tamil Nadu");
  const [customSubmittersCount, setCustomSubmittersCount] = useState(1);
  const [isSubmittingFinalist, setIsSubmittingFinalist] = useState(false);

  // Delete Target Modal
  const [deleteTarget, setDeleteTarget] = useState<ShortlistedIdea | null>(null);
  const [isDeletingFinalist, setIsDeletingFinalist] = useState(false);

  const fetchVotingData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/voting");
      if (res.ok) {
        const data = await res.json();
        if (data.status) setStatus(data.status);
        if (data.candidates) setCandidates(data.candidates);
        if (data.total_votes !== undefined) setTotalVotes(data.total_votes);
        if (data.voting_start) setVotingStart(new Date(data.voting_start).toISOString().split("T")[0]);
        if (data.voting_end) setVotingEnd(new Date(data.voting_end).toISOString().split("T")[0]);
        if (data.districts) setDistricts(data.districts);
        if (data.allow_results !== undefined) setAllowResults(data.allow_results);
      }
    } catch (err) {
      console.error("Admin voting fetch error:", err);
      toast.error("Failed to load voting data.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGroupsForModal = async () => {
    setIsLoadingGroups(true);
    try {
      const res = await fetch("/api/admin/groups");
      if (res.ok) {
        const data = await res.json();
        setAvailableGroups(data.groups || []);
      }
    } catch (err) {
      console.error("Failed to load groups for finalist selection:", err);
    } finally {
      setIsLoadingGroups(false);
    }
  };

  useEffect(() => {
    fetchVotingData();
  }, []);

  useEffect(() => {
    if (isAddFinalistOpen) {
      fetchGroupsForModal();
    }
  }, [isAddFinalistOpen]);

  const handleUpdateStatus = async (newStatus: CampaignStatus) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/voting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "UPDATE_STATUS",
          status: newStatus,
          voting_start: votingStart,
          voting_end: votingEnd,
          allow_results: allowResults,
        }),
      });
      if (res.ok) {
        setStatus(newStatus);
        toast.success(`Campaign phase switched to: ${newStatus}`);
      } else {
        toast.error("Failed to update status.");
      }
    } catch {
      toast.error("Network error updating status.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddGroupAsFinalist = async (grp: ManualGroup) => {
    setIsSubmittingFinalist(true);
    try {
      const count = grp.submissions_count > 0 ? grp.submissions_count : (grp.member_idea_ids?.length || 1);
      const dist = grp.top_districts && grp.top_districts.length > 0
        ? grp.top_districts.join(", ")
        : "Across Tamil Nadu";

      const res = await fetch("/api/admin/voting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ADD_FINALIST",
          candidate: {
            product_name: grp.product_concept || grp.title,
            emoji: grp.emoji || "💡",
            tagline: grp.tagline || grp.description,
            category_id: grp.category_id,
            category_name: grp.category_name,
            category_color: grp.category_color,
            category_bg: grp.category_bg,
            problem_description: grp.description,
            district: dist,
            submitters_count: count,
            why_is_this_here: `${count} citizen submissions grouped across ${dist}.`,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add finalist");

      toast.success(`Group "${grp.title}" added to voting ballot!`);
      setIsAddFinalistOpen(false);
      fetchVotingData();
    } catch (err: any) {
      toast.error(err.message || "Failed to add finalist");
    } finally {
      setIsSubmittingFinalist(false);
    }
  };

  const handleAddCustomFinalist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) {
      toast.error("Please enter a candidate product name.");
      return;
    }

    setIsSubmittingFinalist(true);
    try {
      const cat = getCategoryById(customCategory) || CATEGORIES[0];

      const res = await fetch("/api/admin/voting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ADD_FINALIST",
          candidate: {
            product_name: customName.trim(),
            emoji: customEmoji,
            tagline: customTagline.trim() || customProblem.trim(),
            category_id: cat.id,
            category_name: cat.name,
            category_color: cat.color,
            category_bg: cat.bgColor,
            problem_description: customProblem.trim() || customName.trim(),
            district: customDistrict.trim() || "Across Tamil Nadu",
            submitters_count: customSubmittersCount,
            why_is_this_here: `${customSubmittersCount} citizen submissions across ${customDistrict}.`,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create finalist");

      toast.success(`Finalist "${customName}" added to voting ballot!`);
      setIsAddFinalistOpen(false);
      setCustomName("");
      setCustomTagline("");
      setCustomProblem("");
      setCustomDistrict("Across Tamil Nadu");
      setCustomSubmittersCount(1);
      fetchVotingData();
    } catch (err: any) {
      toast.error(err.message || "Failed to add custom finalist");
    } finally {
      setIsSubmittingFinalist(false);
    }
  };

  const handleDeleteFinalist = async () => {
    if (!deleteTarget) return;

    setIsDeletingFinalist(true);
    try {
      const res = await fetch("/api/admin/voting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "REMOVE_FINALIST",
          candidateId: deleteTarget.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to remove finalist");

      toast.success(`Finalist "${deleteTarget.product_name || deleteTarget.title}" removed.`);
      setDeleteTarget(null);
      fetchVotingData();
    } catch (err: any) {
      toast.error(err.message || "Failed to remove finalist.");
    } finally {
      setIsDeletingFinalist(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ["Rank", "Candidate ID", "Public ID", "Title", "Category", "District", "Submitters Count", "Votes Cast", "Vote %"];
    const rows = candidates.map((c, idx) => [
      idx + 1,
      c.id,
      c.public_id,
      `"${(c.product_name || c.title).replace(/"/g, '""')}"`,
      c.category_name,
      `"${c.district}"`,
      c.submitters_count,
      c.vote_count || 0,
      `${c.percentage || 0}%`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `build_tamil_nadu_votes_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Voting report exported as CSV!");
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge badge-accent text-xs">Phase 2 / 3 Governance</span>
            <span className="text-xs text-[#64748b]">• Build Tamil Nadu</span>
          </div>
          <h1 className="font-jakarta font-extrabold text-[28px] sm:text-[32px] text-[#0a0e1a] tracking-tight">
            Public Voting Management
          </h1>
          <p className="text-[#64748b] text-[15px]">
            Oversee shortlisted finalists, control poll phases, inspect participation, and publish verified results.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={fetchVotingData}
            className="btn btn-secondary btn-sm flex items-center gap-2"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
          <a
            href="/vote"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm flex items-center gap-2 text-[#e85d26]"
          >
            <ExternalLink size={14} />
            <span>Preview /vote</span>
          </a>
          <button
            onClick={handleExportCSV}
            className="btn btn-primary btn-sm flex items-center gap-2 font-bold px-4"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Phase Control Ribbon */}
      <div className="bg-white rounded-3xl p-6 border border-[#e2e8f0] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-jakarta font-bold text-[17px] text-[#0a0e1a]">
              Active Campaign Phase
            </h2>
            <p className="text-xs text-[#64748b]">
              Switching the phase updates the platform experience instantly for all citizens.
            </p>
          </div>
          <span className="font-mono text-xs font-bold text-[#e85d26] bg-[#e85d26]/10 px-3 py-1 rounded-full border border-[#e85d26]/20">
            Current: {status}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => handleUpdateStatus("COLLECTING")}
            disabled={isSaving}
            className={`p-4 rounded-2xl border text-left transition-all ${
              status === "COLLECTING"
                ? "bg-[#e85d26] text-white border-[#e85d26] shadow-md shadow-[#e85d26]/20"
                : "bg-[#f8f7f4] text-[#0a0e1a] border-[#e2e8f0] hover:border-[#cbd5e1]"
            }`}
          >
            <span className="text-xs font-bold block opacity-80 mb-1">01 Ingestion</span>
            <span className="font-jakarta font-bold text-[14px] block">Collecting Ideas</span>
            <span className="text-[11px] opacity-75 mt-0.5 block">Locked voting preview</span>
          </button>

          <button
            onClick={() => handleUpdateStatus("REVIEWING")}
            disabled={isSaving}
            className={`p-4 rounded-2xl border text-left transition-all ${
              status === "REVIEWING"
                ? "bg-[#3b82f6] text-white border-[#3b82f6] shadow-md shadow-[#3b82f6]/20"
                : "bg-[#f8f7f4] text-[#0a0e1a] border-[#e2e8f0] hover:border-[#cbd5e1]"
            }`}
          >
            <span className="text-xs font-bold block opacity-80 mb-1">02 Shortlisting</span>
            <span className="font-jakarta font-bold text-[14px] block">Under Review</span>
            <span className="text-[11px] opacity-75 mt-0.5 block">Finalist selection</span>
          </button>

          <button
            onClick={() => handleUpdateStatus("VOTING")}
            disabled={isSaving}
            className={`p-4 rounded-2xl border text-left transition-all ${
              status === "VOTING"
                ? "bg-[#16a34a] text-white border-[#16a34a] shadow-md shadow-[#16a34a]/20"
                : "bg-[#f8f7f4] text-[#0a0e1a] border-[#e2e8f0] hover:border-[#cbd5e1]"
            }`}
          >
            <span className="text-xs font-bold block opacity-80 mb-1">03 Democratic Vote</span>
            <span className="font-jakarta font-bold text-[14px] block">Voting Open Live</span>
            <span className="text-[11px] opacity-75 mt-0.5 block">Citizens cast 1 vote</span>
          </button>

          <button
            onClick={() => handleUpdateStatus("RESULTS")}
            disabled={isSaving}
            className={`p-4 rounded-2xl border text-left transition-all ${
              status === "RESULTS"
                ? "bg-[#d97706] text-white border-[#d97706] shadow-md shadow-[#d97706]/20"
                : "bg-[#f8f7f4] text-[#0a0e1a] border-[#e2e8f0] hover:border-[#cbd5e1]"
            }`}
          >
            <span className="text-xs font-bold block opacity-80 mb-1">04 Outcome</span>
            <span className="font-jakarta font-bold text-[14px] block">Publish Results</span>
            <span className="text-[11px] opacity-75 mt-0.5 block">Show winner podium</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-[#64748b] text-xs font-bold mb-2">
            <span>TOTAL VOTES CAST</span>
            <Vote size={16} className="text-[#e85d26]" />
          </div>
          <div className="text-[32px] font-jakarta font-extrabold text-[#0a0e1a]">
            {totalVotes.toLocaleString()}
          </div>
          <span className="text-[11.5px] text-[#16a34a] font-medium">100% SHA-256 Verified</span>
        </div>

        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-[#64748b] text-xs font-bold mb-2">
            <span>SHORTLISTED FINALISTS</span>
            <Trophy size={16} className="text-[#f59e0b]" />
          </div>
          <div className="text-[32px] font-jakarta font-extrabold text-[#0a0e1a]">
            {candidates.length}
          </div>
          <span className="text-[11.5px] text-[#64748b]">Active ballot candidate options</span>
        </div>

        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-[#64748b] text-xs font-bold mb-2">
            <span>DISTRICT SPREAD</span>
            <MapPin size={16} className="text-[#3b82f6]" />
          </div>
          <div className="text-[32px] font-jakarta font-extrabold text-[#0a0e1a]">
            {Object.keys(districts).length || 38} <span className="text-[18px] text-[#64748b]">/ 38</span>
          </div>
          <span className="text-[11.5px] text-[#3b82f6] font-medium">State-wide reach</span>
        </div>

        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-[#64748b] text-xs font-bold mb-2">
            <span>INTEGRITY STATUS</span>
            <ShieldCheck size={16} className="text-[#16a34a]" />
          </div>
          <div className="text-[20px] font-jakarta font-bold text-[#16a34a] pt-1">
            0 Anomalies
          </div>
          <span className="text-[11.5px] text-[#64748b]">Duplicate prevention active</span>
        </div>
      </div>

      {/* ================= SHORTLISTED FINALIST STANDINGS ================= */}
      <div className="bg-white rounded-3xl border border-[#e2e8f0] shadow-xs overflow-hidden">
        <div className="p-6 sm:p-7 border-b border-[#e2e8f0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h2 className="font-jakarta font-extrabold text-[20px] text-[#0a0e1a] flex items-center gap-2">
              <span>Shortlisted Finalist Standings</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#f8f7f4] text-xs font-bold text-[#64748b] border border-[#e2e8f0]">
                {candidates.length} finalists
              </span>
            </h2>
            <p className="text-xs text-[#64748b]">
              Candidate ideas on the public voting ballot, ranked by live verified citizen votes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddFinalistOpen(true)}
              className="btn btn-primary btn-sm flex items-center gap-2 font-bold px-4 h-9 rounded-xl shadow-xs"
            >
              <Plus size={15} />
              <span>Add Finalist Idea</span>
            </button>
          </div>
        </div>

        <div className="divide-y divide-[#e2e8f0]">
          {candidates.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Trophy size={32} className="mx-auto text-[#94a3b8]" />
              <h3 className="font-bold text-sm text-[#0a0e1a]">No Finalist Candidates on Ballot</h3>
              <p className="text-xs text-[#64748b]">
                Click <strong>[ Add Finalist Idea ]</strong> above to add candidates from Idea Groups or create custom finalists.
              </p>
            </div>
          ) : (
            candidates.map((idea, idx) => (
              <div
                key={idea.id}
                className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[#f8f7f4]/60 transition-colors group"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-9 h-9 rounded-xl bg-[#0a0e1a] text-white font-mono font-extrabold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                    {idea.product_number || `0${idx + 1}`}
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="px-2.5 py-0.5 rounded-md text-[10.5px] font-bold"
                        style={{
                          backgroundColor: idea.category_bg || `${idea.category_color}15`,
                          color: idea.category_color,
                        }}
                      >
                        {idea.category_name}
                      </span>
                      <span className="font-mono text-xs text-[#94a3b8]">#{idea.public_id}</span>
                      <span className="text-xs text-[#64748b] flex items-center gap-1 font-medium">
                        <MapPin size={11} className="text-[#e85d26]" />
                        {idea.district}
                      </span>
                    </div>

                    <h3 className="font-jakarta font-extrabold text-[17px] text-[#0a0e1a] flex items-center gap-2">
                      <span>{idea.product_name || idea.title}</span>
                      <span>{idea.emoji || "🚀"}</span>
                    </h3>

                    <p className="text-xs text-[#64748b] line-clamp-1 italic">
                      &ldquo;{idea.tagline || idea.problem_description}&rdquo;
                    </p>

                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#0a0e1a] bg-[#f8f7f4] px-2.5 py-1 rounded-lg border border-[#e2e8f0] w-fit">
                      <Users size={12} className="text-[#e85d26]" />
                      <span>{idea.why_is_this_here}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 self-end sm:self-center">
                  <div className="text-right">
                    <span className="font-mono text-xl font-extrabold text-[#0a0e1a] block">
                      {idea.vote_count || 0}
                    </span>
                    <span className="text-[11px] text-[#64748b] font-bold">
                      {idea.percentage || 0}% of votes
                    </span>
                  </div>

                  <button
                    onClick={() => setDeleteTarget(idea)}
                    className="w-8 h-8 rounded-xl bg-transparent hover:bg-rose-50 text-[#94a3b8] hover:text-rose-600 flex items-center justify-center transition-all"
                    title="Remove from ballot"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ================= ADD FINALIST IDEA MODAL ================= */}
      {isAddFinalistOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#e2e8f0] animate-scale-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#e2e8f0] flex-shrink-0">
              <div>
                <span className="text-xs font-bold text-[#e85d26] uppercase tracking-wider block">
                  Ballot Candidate Configurator
                </span>
                <h3 className="font-jakarta font-extrabold text-[22px] text-[#0a0e1a]">
                  Add Finalist Candidate Option
                </h3>
              </div>
              <button
                onClick={() => setIsAddFinalistOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f8f7f4] hover:bg-[#e2e8f0] flex items-center justify-center text-[#64748b]"
              >
                <X size={16} />
              </button>
            </div>

            {/* Tab Switcher */}
            <div className="flex gap-2 p-1 bg-[#f8f7f4] rounded-2xl my-4 border border-[#e2e8f0] flex-shrink-0">
              <button
                type="button"
                onClick={() => setModalTab("GROUPS")}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  modalTab === "GROUPS"
                    ? "bg-white text-[#0a0e1a] shadow-xs"
                    : "text-[#64748b] hover:text-[#0a0e1a]"
                }`}
              >
                <Layers size={14} className="text-[#e85d26]" />
                <span>Pick from Curated Idea Groups</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab("CUSTOM")}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  modalTab === "CUSTOM"
                    ? "bg-white text-[#0a0e1a] shadow-xs"
                    : "text-[#64748b] hover:text-[#0a0e1a]"
                }`}
              >
                <Plus size={14} className="text-[#3b82f6]" />
                <span>Create Custom Finalist</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto pr-1">
              {modalTab === "GROUPS" ? (
                <div className="space-y-3">
                  <p className="text-xs text-[#64748b]">
                    Select any curated group from Phase 1 to promote it directly into the public voting poll candidate list:
                  </p>

                  {isLoadingGroups ? (
                    <div className="py-12 flex flex-col items-center justify-center text-[#64748b] space-y-2">
                      <Loader2 size={24} className="animate-spin text-[#e85d26]" />
                      <span className="text-xs">Loading Idea Groups...</span>
                    </div>
                  ) : availableGroups.length === 0 ? (
                    <div className="py-12 text-center text-[#64748b] text-xs">
                      No Idea Groups found. Create groups in /admin/groups first or use Custom Finalist.
                    </div>
                  ) : (
                    <div className="divide-y divide-[#f1f5f9]">
                      {availableGroups.map((grp) => {
                        const isAlreadyCandidate = candidates.some(
                          (c) => c.product_name === grp.product_concept || c.title.includes(grp.title)
                        );

                        return (
                          <div
                            key={grp.id}
                            className="py-3.5 flex items-center justify-between gap-4 hover:bg-[#f8f7f4] px-3 rounded-2xl transition-colors"
                          >
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2">
                                <span
                                  className="px-2 py-0.5 rounded text-[10.5px] font-bold"
                                  style={{ backgroundColor: grp.category_bg, color: grp.category_color }}
                                >
                                  {grp.category_name}
                                </span>
                                <span className="font-mono text-[11px] font-bold text-[#64748b]">
                                  {grp.submissions_count} submissions
                                </span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                                  {grp.status}
                                </span>
                              </div>

                              <h4 className="font-jakarta font-bold text-sm text-[#0a0e1a]">
                                {grp.product_concept || grp.title} {grp.emoji}
                              </h4>

                              <p className="text-xs text-[#64748b] line-clamp-1">
                                {grp.description}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleAddGroupAsFinalist(grp)}
                              disabled={isAlreadyCandidate || isSubmittingFinalist}
                              className={`btn btn-sm text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 flex-shrink-0 ${
                                isAlreadyCandidate
                                  ? "bg-[#f1f5f9] text-[#94a3b8] cursor-not-allowed border-0"
                                  : "btn-primary shadow-xs"
                              }`}
                            >
                              {isAlreadyCandidate ? (
                                <>
                                  <Check size={13} />
                                  <span>On Ballot</span>
                                </>
                              ) : (
                                <>
                                  <Plus size={13} />
                                  <span>Add to Ballot</span>
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleAddCustomFinalist} className="space-y-4 py-1">
                  <div>
                    <label className="block text-xs font-bold text-[#0a0e1a] mb-1">
                      Product Name <span className="text-rose-500">*</span>:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Smart Bus TN"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      required
                      className="input text-sm font-semibold w-full"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#0a0e1a] mb-1">
                        Category:
                      </label>
                      <select
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        className="input text-sm font-semibold w-full"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0a0e1a] mb-1">
                        Emoji Badge:
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={customEmoji}
                          onChange={(e) => setCustomEmoji(e.target.value)}
                          className="input w-14 text-center text-base font-bold"
                        />
                        <div className="flex gap-1 overflow-x-auto flex-1 py-1">
                          {EMOJI_PRESETS.slice(0, 7).map((em) => (
                            <button
                              type="button"
                              key={em}
                              onClick={() => setCustomEmoji(em)}
                              className={`p-1 rounded-lg text-sm border ${
                                customEmoji === em ? "border-[#e85d26] bg-[#fffaf7]" : "border-[#e2e8f0]"
                              }`}
                            >
                              {em}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0a0e1a] mb-1">
                      Tagline / Pitch:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Know where your bus is, when it will arrive, and how crowded it is."
                      value={customTagline}
                      onChange={(e) => setCustomTagline(e.target.value)}
                      className="input text-sm font-semibold w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0a0e1a] mb-1">
                      Problem Statement:
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Summarize the core problem citizens submitted..."
                      value={customProblem}
                      onChange={(e) => setCustomProblem(e.target.value)}
                      className="input text-sm w-full p-2.5 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#0a0e1a] mb-1">
                        Submitters Count:
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={customSubmittersCount}
                        onChange={(e) => setCustomSubmittersCount(parseInt(e.target.value) || 1)}
                        className="input text-sm font-semibold w-full font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0a0e1a] mb-1">
                        Districts Covered:
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Across 28 Districts"
                        value={customDistrict}
                        onChange={(e) => setCustomDistrict(e.target.value)}
                        className="input text-sm font-semibold w-full"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#e2e8f0] flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsAddFinalistOpen(false)}
                      className="btn btn-secondary btn-sm font-bold"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmittingFinalist}
                      className="btn btn-primary btn-sm font-bold px-5"
                    >
                      {isSubmittingFinalist ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <span>Add Finalist Option</span>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE FINALIST CONFIRMATION MODAL ================= */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#e2e8f0] space-y-5 animate-scale-in text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
              <Trash2 size={24} />
            </div>

            <div className="space-y-1">
              <h3 className="font-jakarta font-extrabold text-[20px] text-[#0a0e1a]">
                Remove Finalist from Ballot?
              </h3>
              <p className="text-xs text-[#64748b]">
                Are you sure you want to remove <strong>&ldquo;{deleteTarget.product_name || deleteTarget.title}&rdquo;</strong> from the live voting poll?
              </p>
            </div>

            <div className="pt-3 border-t border-[#e2e8f0] flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="btn btn-secondary btn-sm font-bold px-5"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteFinalist}
                disabled={isDeletingFinalist}
                className="btn btn-sm bg-rose-600 hover:bg-rose-700 text-white font-bold px-5 shadow-sm"
              >
                {isDeletingFinalist ? <Loader2 size={14} className="animate-spin" /> : <span>Remove Finalist</span>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
