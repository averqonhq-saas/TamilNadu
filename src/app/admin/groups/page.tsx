"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Users,
  MapPin,
  Star,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Trash2,
  Filter,
  Layers,
  Clock,
  ArrowRight,
  X,
  Loader2,
  Edit3,
} from "lucide-react";
import { CATEGORIES } from "@/lib/constants/categories";
import { ManualGroup, GroupStatus } from "@/lib/data/groups";
import { toast } from "sonner";

const STATUS_CONFIG: Record<
  GroupStatus,
  { label: string; bg: string; text: string; border: string }
> = {
  DRAFT: {
    label: "Draft",
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-300",
  },
  READY: {
    label: "Ready for Shortlist",
    bg: "bg-cyan-50",
    text: "text-cyan-700",
    border: "border-cyan-200",
  },
  SHORTLISTED: {
    label: "Shortlisted",
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
  },
};

export default function AdminGroupsPage() {
  const [groups, setGroups] = useState<ManualGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Create Group Modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newProblem, setNewProblem] = useState("");
  const [newCategory, setNewCategory] = useState("transport");
  const [newProductConcept, setNewProductConcept] = useState("");
  const [newTagline, setNewTagline] = useState("");
  const [newStatus, setNewStatus] = useState<GroupStatus>("DRAFT");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchGroups = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/groups");
      if (res.ok) {
        const data = await res.json();
        setGroups(data.groups || []);
      }
    } catch (err) {
      console.error("Error fetching groups:", err);
      toast.error("Failed to load idea groups");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error("Please enter a group title.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle.trim(),
          description: newProblem.trim(),
          category_id: newCategory,
          status: newStatus,
          product_concept: newProductConcept.trim() || newTitle.trim(),
          tagline: newTagline.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create group");

      toast.success(`Idea Group "${newTitle}" created!`);
      setIsCreateOpen(false);
      setNewTitle("");
      setNewProblem("");
      setNewProductConcept("");
      setNewTagline("");
      setNewStatus("DRAFT");
      fetchGroups();
    } catch (err: any) {
      toast.error(err.message || "Failed to create idea group.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickStatusChange = async (groupId: string, status: GroupStatus) => {
    try {
      const res = await fetch(`/api/admin/groups/${groupId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Status update failed");

      setGroups((prev) =>
        prev.map((g) => (g.id === groupId ? { ...g, status } : g))
      );
      toast.success(`Group status updated to ${STATUS_CONFIG[status].label}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteGroup = async (groupId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete the group "${title}"? Any linked ideas will be unassigned.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/groups/${groupId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      setGroups((prev) => prev.filter((g) => g.id !== groupId));
      toast.success(`Group "${title}" removed.`);
    } catch {
      toast.error("Failed to delete group");
    }
  };

  // Filter groups
  const filtered = groups.filter((g) => {
    const matchesSearch =
      g.title.toLowerCase().includes(search.toLowerCase()) ||
      g.description.toLowerCase().includes(search.toLowerCase()) ||
      g.category_name.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      selectedStatus === "ALL" || g.status === selectedStatus;

    const matchesCategory =
      !selectedCategory || g.category_id === selectedCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Calculate metrics
  const totalSubmissions = groups.reduce((acc, g) => acc + (g.member_idea_ids?.length ?? g.submissions_count ?? 0), 0);
  const shortlistedCount = groups.filter((g) => g.status === "SHORTLISTED").length;
  const readyCount = groups.filter((g) => g.status === "READY").length;
  const draftCount = groups.filter((g) => g.status === "DRAFT").length;

  return (
    <div className="p-6 lg:p-8 max-w-7xl space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge badge-accent text-xs">Phase 1 Manual Grouping</span>
            <span className="text-xs text-[#64748b]">• {groups.length} Problem Groups</span>
          </div>
          <h1 className="font-jakarta font-extrabold text-[28px] sm:text-[32px] text-[#0a0e1a] tracking-tight">
            Idea Groups &amp; Manual Curation
          </h1>
          <p className="text-[#64748b] text-[15px]">
            Manually cluster related citizen submissions into cohesive problem groups. Each shortlisted group becomes a candidate option on the public voting ballot.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="btn btn-primary btn-sm flex items-center gap-2 font-bold px-4 h-10 rounded-xl shadow-md shadow-[#e85d26]/20"
          >
            <Plus size={16} />
            <span>Create Group</span>
          </button>

          <Link
            href="/admin/shortlist"
            className="btn btn-secondary btn-sm flex items-center gap-2 font-bold px-4 h-10 rounded-xl"
          >
            <Star size={15} className="text-[#f59e0b]" />
            <span>Curate Voting Shortlist</span>
          </Link>
        </div>
      </div>

      {/* Summary KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-xs space-y-1">
          <span className="text-xs font-bold text-[#64748b] uppercase tracking-wider">Total Groups</span>
          <div className="font-jakarta font-extrabold text-[28px] text-[#0a0e1a]">{groups.length}</div>
          <span className="text-xs text-[#64748b]">Human-curated clusters</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-xs space-y-1">
          <span className="text-xs font-bold text-[#64748b] uppercase tracking-wider">Total Grouped Submissions</span>
          <div className="font-jakarta font-extrabold text-[28px] text-[#e85d26]">
            {totalSubmissions.toLocaleString()}
          </div>
          <span className="text-xs text-[#64748b]">Across all active groups</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-xs space-y-1">
          <span className="text-xs font-bold text-[#64748b] uppercase tracking-wider">Ready for Shortlist</span>
          <div className="font-jakarta font-extrabold text-[28px] text-[#0891b2]">{readyCount}</div>
          <span className="text-xs text-[#64748b]">Awaiting final editorial review</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-xs space-y-1">
          <span className="text-xs font-bold text-[#64748b] uppercase tracking-wider">Shortlisted Candidates</span>
          <div className="font-jakarta font-extrabold text-[28px] text-purple-600">{shortlistedCount}</div>
          <span className="text-xs text-[#64748b]">Candidates on public ballot</span>
        </div>
      </div>

      {/* Filter / Search Ribbon */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e2e8f0] shadow-xs space-y-4">
        {/* Status Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-[#f1f5f9]">
          <div className="flex gap-2 flex-wrap">
            {[
              { id: "ALL", label: "All Groups", count: groups.length },
              { id: "DRAFT", label: "Draft", count: draftCount },
              { id: "READY", label: "Ready for Shortlist", count: readyCount },
              { id: "SHORTLISTED", label: "Shortlisted", count: shortlistedCount },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedStatus(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  selectedStatus === tab.id
                    ? "bg-[#0a0e1a] text-white shadow-xs"
                    : "bg-[#f8f7f4] text-[#64748b] hover:text-[#0a0e1a] hover:bg-[#e2e8f0]"
                }`}
              >
                <span>{tab.label}</span>
                <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[10px] font-mono">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="text-xs font-bold text-[#64748b]">
            Showing {filtered.length} of {groups.length} groups
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
            <input
              type="text"
              placeholder="Search group title, problem statement, category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input h-10 pl-10 text-sm w-full bg-[#f8f7f4] border-[#e2e8f0] focus:bg-white"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input h-10 text-xs font-semibold bg-[#f8f7f4] border-[#e2e8f0] sm:w-56"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Idea Groups */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-[#64748b] space-y-2">
          <Loader2 size={32} className="animate-spin text-[#e85d26]" />
          <span className="text-sm font-medium">Loading manual idea groups...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-[#e2e8f0] text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#f8f7f4] text-[#64748b] flex items-center justify-center mx-auto">
            <Layers size={26} />
          </div>
          <h3 className="font-jakarta font-bold text-lg text-[#0a0e1a]">No Idea Groups Match</h3>
          <p className="text-sm text-[#64748b] max-w-md mx-auto">
            No groups found matching your search or status filter. Try clearing filters or create a new group.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setSelectedStatus("ALL");
              setSelectedCategory("");
            }}
            className="btn btn-secondary btn-sm"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((group) => {
            const statusConfig = STATUS_CONFIG[group.status] || STATUS_CONFIG.DRAFT;

            return (
              <div
                key={group.id}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-[#e2e8f0] shadow-xs hover:shadow-xl transition-all space-y-5 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Top Bar: Category + Submissions Count + Status */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="px-3 py-1 rounded-lg text-xs font-bold"
                        style={{
                          backgroundColor: group.category_bg || `${group.category_color}15`,
                          color: group.category_color,
                        }}
                      >
                        {group.category_name}
                      </span>

                      <span
                        className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                      >
                        {statusConfig.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#0a0e1a] bg-[#f8f7f4] px-2.5 py-1 rounded-lg border border-[#e2e8f0]">
                      <Users size={13} className="text-[#e85d26]" />
                      <span>{group.submissions_count} submissions</span>
                    </div>
                  </div>

                  {/* Group Title */}
                  <h2 className="font-jakarta font-extrabold text-[20px] sm:text-[22px] text-[#0a0e1a] leading-snug group-hover:text-[#e85d26] transition-colors">
                    {group.title}
                  </h2>

                  {/* Synthesized Problem Statement */}
                  <div className="bg-[#f8f7f4] rounded-2xl p-4 border border-[#e2e8f0] space-y-1">
                    <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider block">
                      Synthesized Problem Statement:
                    </span>
                    <p className="text-[13.5px] text-[#334155] leading-relaxed font-medium">
                      {group.description || "No description provided yet."}
                    </p>
                  </div>

                  {/* District Spread */}
                  <div className="flex items-center gap-1.5 text-xs text-[#64748b]">
                    <MapPin size={13} className="text-[#e85d26] flex-shrink-0" />
                    <span className="truncate">
                      Submitted across {group.districts_count || 1} districts ({group.top_districts?.join(", ") || "Tamil Nadu"})
                    </span>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-4 border-t border-[#e2e8f0] space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10.5px] font-bold text-[#64748b] uppercase block">
                        Poll Candidate Concept:
                      </span>
                      <span className="font-jakarta font-bold text-xs text-[#0a0e1a]">
                        {group.product_concept || group.title}
                      </span>
                    </div>

                    <Link
                      href={`/admin/groups/${group.id}`}
                      className="btn btn-primary btn-sm flex items-center gap-1.5 text-xs font-bold shadow-sm"
                    >
                      <span>Manage Ideas ({group.member_idea_ids?.length || 0})</span>
                      <ChevronRight size={14} />
                    </Link>
                  </div>

                  {/* Quick Status Bar & Delete */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#f1f5f9] text-[11px]">
                    <div className="flex items-center gap-1">
                      <span className="text-[#94a3b8] font-bold">Status:</span>
                      {group.status !== "DRAFT" && (
                        <button
                          onClick={() => handleQuickStatusChange(group.id, "DRAFT")}
                          className="text-[#64748b] hover:text-[#0a0e1a] font-semibold underline px-1"
                        >
                          Draft
                        </button>
                      )}
                      {group.status !== "READY" && (
                        <button
                          onClick={() => handleQuickStatusChange(group.id, "READY")}
                          className="text-cyan-700 hover:text-cyan-900 font-semibold underline px-1"
                        >
                          Ready for Shortlist
                        </button>
                      )}
                      {group.status !== "SHORTLISTED" && (
                        <button
                          onClick={() => handleQuickStatusChange(group.id, "SHORTLISTED")}
                          className="text-purple-700 hover:text-purple-900 font-semibold underline px-1"
                        >
                          Shortlist
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => handleDeleteGroup(group.id, group.title)}
                      className="text-rose-500 hover:text-rose-700 font-bold flex items-center gap-1"
                      title="Delete Group"
                    >
                      <Trash2 size={12} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= CREATE GROUP MODAL ================= */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#e2e8f0] space-y-6 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
              <div>
                <span className="text-xs font-bold text-[#e85d26] uppercase tracking-wider block">
                  Manual Clustering
                </span>
                <h3 className="font-jakarta font-extrabold text-[22px] text-[#0a0e1a]">
                  Create New Idea Group
                </h3>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f8f7f4] hover:bg-[#e2e8f0] flex items-center justify-center text-[#64748b]"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0a0e1a] mb-1">
                  Group Title <span className="text-rose-500">*</span>:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Real-time Bus Tracking"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="input text-sm font-semibold w-full"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0a0e1a] mb-1">
                  Category:
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
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
                  Synthesized Problem Statement:
                </label>
                <textarea
                  rows={3}
                  placeholder="Summarize the core problem people across Tamil Nadu are facing..."
                  value={newProblem}
                  onChange={(e) => setNewProblem(e.target.value)}
                  className="input text-sm w-full p-3 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0a0e1a] mb-1">
                  Candidate Product Name (for Voting Ballot):
                </label>
                <input
                  type="text"
                  placeholder="e.g. Smart Bus TN 🚌"
                  value={newProductConcept}
                  onChange={(e) => setNewProductConcept(e.target.value)}
                  className="input text-sm font-semibold w-full"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0a0e1a] mb-1">
                  Initial Status:
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as GroupStatus)}
                  className="input text-sm font-semibold w-full"
                >
                  <option value="DRAFT">Draft (Working group)</option>
                  <option value="READY">Ready for Shortlist</option>
                  <option value="SHORTLISTED">Shortlisted for Voting Poll</option>
                </select>
              </div>

              <div className="pt-4 border-t border-[#e2e8f0] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="btn btn-secondary btn-sm font-bold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary btn-sm font-bold px-6"
                >
                  {isSubmitting ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <span>Create Group</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
