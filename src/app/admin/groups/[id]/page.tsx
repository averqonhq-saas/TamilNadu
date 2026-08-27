"use client";

import { useState, useEffect, use, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  MapPin,
  Star,
  Save,
  Plus,
  Trash2,
  Search,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Layers,
  Check,
  X,
  Loader2,
  RefreshCw,
  Eye,
  Filter,
} from "lucide-react";
import { CATEGORIES } from "@/lib/constants/categories";
import { ManualGroup, GroupMemberIdea, GroupableIdea, GroupStatus } from "@/lib/data/groups";
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

const IDEA_STATUS_COLORS: Record<string, string> = {
  SUBMITTED: "#f59e0b",
  UNDER_REVIEW: "#3b82f6",
  APPROVED: "#22c55e",
  PUBLIC: "#10b981",
  DUPLICATE: "#94a3b8",
  REJECTED: "#ef4444",
  SHORTLISTED: "#8b5cf6",
};

export default function GroupDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [group, setGroup] = useState<ManualGroup | null>(null);
  const [ideas, setIdeas] = useState<GroupMemberIdea[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Group metadata form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("transport");
  const [productConcept, setProductConcept] = useState("");
  const [tagline, setTagline] = useState("");
  const [status, setStatus] = useState<GroupStatus>("DRAFT");
  const [isSaving, setIsSaving] = useState(false);

  // Table selection state
  const [selectedIdeaIds, setSelectedIdeaIds] = useState<string[]>([]);
  const [isRemoving, setIsRemoving] = useState(false);

  // "Add Ideas" Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [availableIdeas, setAvailableIdeas] = useState<GroupableIdea[]>([]);
  const [isSearchingIdeas, setIsSearchingIdeas] = useState(false);
  const [ideaSearchQuery, setIdeaSearchQuery] = useState("");
  const [modalCategory, setModalCategory] = useState("");
  const [modalDistrict, setModalDistrict] = useState("");
  const [unassignedOnly, setUnassignedOnly] = useState(false);
  const [modalSelectedIds, setModalSelectedIds] = useState<string[]>([]);
  const [isAddingIdeas, setIsAddingIdeas] = useState(false);

  const fetchGroupDetails = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/admin/groups/${id}`);
      if (!res.ok) throw new Error("Group not found");

      const data = await res.json();
      setGroup(data.group);
      setIdeas(data.ideas || []);

      // Init form fields
      setTitle(data.group.title || "");
      setDescription(data.group.description || "");
      setCategoryId(data.group.category_id || "transport");
      setProductConcept(data.group.product_concept || "");
      setTagline(data.group.tagline || "");
      setStatus(data.group.status || "DRAFT");
    } catch (err) {
      console.error("Error loading group:", err);
      toast.error("Failed to load group details.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupDetails();
  }, [id]);

  // Load ideas for the Add Ideas modal
  const fetchAvailableIdeas = async () => {
    try {
      setIsSearchingIdeas(true);
      const queryParams = new URLSearchParams();
      if (ideaSearchQuery) queryParams.set("search", ideaSearchQuery);
      if (modalCategory) queryParams.set("category", modalCategory);
      if (modalDistrict) queryParams.set("district", modalDistrict);
      if (unassignedOnly) queryParams.set("unassigned_only", "true");

      const res = await fetch(`/api/admin/ideas?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setAvailableIdeas(data.ideas || []);
      }
    } catch (err) {
      console.error("Error searching ideas:", err);
    } finally {
      setIsSearchingIdeas(false);
    }
  };

  useEffect(() => {
    if (isAddModalOpen) {
      fetchAvailableIdeas();
    }
  }, [isAddModalOpen, ideaSearchQuery, modalCategory, modalDistrict, unassignedOnly]);

  // Save Group Metadata
  const handleSaveGroup = async () => {
    if (!title.trim()) {
      toast.error("Group title cannot be empty.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/groups/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          category_id: categoryId,
          product_concept: productConcept.trim(),
          tagline: tagline.trim(),
          status,
        }),
      });

      if (!res.ok) throw new Error("Save failed");
      toast.success("Group definition updated successfully!");
      fetchGroupDetails();
    } catch (err: any) {
      toast.error(err.message || "Failed to save group.");
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle selection for all ideas in table
  const handleSelectAllTable = () => {
    if (selectedIdeaIds.length === ideas.length) {
      setSelectedIdeaIds([]);
    } else {
      setSelectedIdeaIds(ideas.map((i) => i.id));
    }
  };

  // Toggle single idea in table
  const handleToggleTableIdea = (ideaId: string) => {
    setSelectedIdeaIds((prev) =>
      prev.includes(ideaId) ? prev.filter((i) => i !== ideaId) : [...prev, ideaId]
    );
  };

  // Remove selected ideas
  const handleRemoveSelectedIdeas = async () => {
    if (selectedIdeaIds.length === 0) {
      toast.error("Select ideas to remove first.");
      return;
    }

    setIsRemoving(true);
    try {
      const res = await fetch(`/api/admin/groups/${id}/ideas`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea_ids: selectedIdeaIds }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to remove ideas");

      toast.success(`Removed ${data.removed_count} ${data.removed_count === 1 ? "idea" : "ideas"} from this group.`);
      setSelectedIdeaIds([]);
      fetchGroupDetails();
    } catch (err: any) {
      toast.error(err.message || "Error removing ideas");
    } finally {
      setIsRemoving(false);
    }
  };

  // Remove single idea
  const handleRemoveSingleIdea = async (ideaId: string, ideaTitle: string) => {
    try {
      const res = await fetch(`/api/admin/groups/${id}/ideas`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea_ids: [ideaId] }),
      });

      if (!res.ok) throw new Error("Failed to remove idea");
      toast.success(`"${ideaTitle}" removed from group.`);
      fetchGroupDetails();
    } catch {
      toast.error("Failed to remove idea.");
    }
  };

  // Add ideas from modal
  const handleAddSelectedModalIdeas = async () => {
    if (modalSelectedIds.length === 0) {
      toast.error("Please select at least one idea to add.");
      return;
    }

    setIsAddingIdeas(true);
    try {
      const res = await fetch(`/api/admin/groups/${id}/ideas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea_ids: modalSelectedIds }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add ideas");

      toast.success(`Added ${data.added_count} ${data.added_count === 1 ? "idea" : "ideas"} to "${group?.title}"!`);
      setModalSelectedIds([]);
      setIsAddModalOpen(false);
      fetchGroupDetails();
    } catch (err: any) {
      toast.error(err.message || "Error adding ideas to group.");
    } finally {
      setIsAddingIdeas(false);
    }
  };

  // Calculate unique districts for header display
  const uniqueDistricts = useMemo(() => {
    return Array.from(new Set(ideas.map((i) => i.district).filter(Boolean)));
  }, [ideas]);

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

  if (!group) {
    return (
      <div className="p-8 max-w-6xl text-center space-y-4">
        <AlertCircle size={40} className="mx-auto text-[#f59e0b]" />
        <h2 className="text-xl font-bold text-[#0a0e1a]">Idea Group Not Found</h2>
        <p className="text-sm text-[#64748b]">The requested group ID could not be loaded.</p>
        <Link href="/admin/groups" className="btn btn-primary btn-sm inline-flex items-center gap-2">
          <ArrowLeft size={14} />
          <span>Return to Groups</span>
        </Link>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.DRAFT;

  return (
    <div className="p-6 lg:p-8 max-w-6xl space-y-8">
      {/* Top Breadcrumb & Return */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/admin/groups"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#64748b] hover:text-[#0a0e1a] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to All Groups</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/shortlist"
            className="btn btn-secondary btn-sm flex items-center gap-2 text-xs font-bold"
          >
            <Star size={14} className="text-[#f59e0b]" />
            <span>Manage on Shortlist</span>
          </Link>

          <button
            onClick={handleSaveGroup}
            disabled={isSaving}
            className="btn btn-primary btn-sm flex items-center gap-2 font-bold px-5 h-10 rounded-xl shadow-md shadow-[#e85d26]/20"
          >
            <Save size={14} />
            <span>{isSaving ? "Saving..." : "Save Group"}</span>
          </button>
        </div>
      </div>

      {/* Main Group Header & Highlight Banner */}
      <div className="bg-white rounded-3xl p-7 sm:p-9 border border-[#e2e8f0] shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-[#e2e8f0]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#e85d26] uppercase tracking-wider">
                Group Curation Workbench
              </span>
              <span className="font-mono text-xs text-[#94a3b8]">ID: {group.id}</span>
            </div>
            <h1 className="font-jakarta font-extrabold text-[24px] sm:text-[28px] text-[#0a0e1a]">
              {group.title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[#64748b]">Status:</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as GroupStatus)}
              className={`input h-9 text-xs font-bold border rounded-xl ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
            >
              <option value="DRAFT">Draft</option>
              <option value="READY">Ready for Shortlist</option>
              <option value="SHORTLISTED">Shortlisted</option>
            </select>
          </div>
        </div>

        {/* Highlight Banner: 47 submitted ideas grouped manually */}
        <div className="bg-gradient-to-r from-[#0a0e1a] to-[#1e293b] text-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-[#fb923c]" />
              <span className="font-jakarta font-extrabold text-[20px] sm:text-[22px] text-white">
                {ideas.length > 0 ? ideas.length : group.submissions_count} submitted ideas grouped manually
              </span>
            </div>
            <p className="text-white/80 text-xs sm:text-sm">
              Across {uniqueDistricts.length > 0 ? uniqueDistricts.length : group.districts_count || 1} districts (
              {uniqueDistricts.length > 0
                ? uniqueDistricts.join(", ")
                : group.top_districts?.join(", ") || "Tamil Nadu"}
              ). These grouped submissions become **one voting option** on the public poll.
            </p>
          </div>

          <div className="flex-shrink-0">
            <span className="px-3 py-1.5 rounded-xl bg-white/10 text-white text-xs font-bold font-mono border border-white/15">
              1 Group = 1 Poll Option
            </span>
          </div>
        </div>

        {/* Group Meta Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#0a0e1a]">Group Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input text-sm font-semibold w-full"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#0a0e1a]">Category:</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="input text-sm font-semibold w-full"
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="block text-xs font-bold text-[#0a0e1a]">
              Primary Problem Statement (Synthesized for Citizens):
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input text-sm w-full p-3 resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#0a0e1a]">
              Mapped Candidate Product Concept:
            </label>
            <input
              type="text"
              value={productConcept}
              onChange={(e) => setProductConcept(e.target.value)}
              placeholder="e.g. Smart Bus TN 🚌"
              className="input text-sm font-semibold w-full"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#0a0e1a]">
              Ballot Tagline / Pitch:
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Know where your bus is, when it will arrive, and how crowded it is."
              className="input text-sm font-semibold w-full"
            />
          </div>
        </div>
      </div>

      {/* ================= GROUPED CITIZEN SUBMISSIONS TABLE ================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2e8f0] shadow-xs space-y-6">
        {/* Table Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e2e8f0]">
          <div className="space-y-0.5">
            <h2 className="font-jakarta font-bold text-[20px] text-[#0a0e1a] flex items-center gap-2">
              <span>Submissions in this Group</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#f8f7f4] text-xs font-bold text-[#64748b] border border-[#e2e8f0]">
                {ideas.length} ideas
              </span>
            </h2>
            <p className="text-xs text-[#64748b]">
              Every selected idea below belongs to &ldquo;{group.title}&rdquo; and contributes to its total problem count.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {selectedIdeaIds.length > 0 && (
              <button
                onClick={handleRemoveSelectedIdeas}
                disabled={isRemoving}
                className="btn btn-secondary btn-sm text-rose-600 hover:bg-rose-50 border-rose-200 flex items-center gap-1.5 font-bold"
              >
                {isRemoving ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Trash2 size={13} />
                )}
                <span>Remove Selected ({selectedIdeaIds.length})</span>
              </button>
            )}

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn btn-primary btn-sm flex items-center gap-1.5 font-bold px-4 h-9 rounded-xl shadow-xs"
            >
              <Plus size={15} />
              <span>Add Ideas</span>
            </button>
          </div>
        </div>

        {/* Table */}
        {ideas.length === 0 ? (
          <div className="bg-[#f8f7f4] rounded-2xl p-10 text-center space-y-3 border border-dashed border-[#cbd5e1]">
            <div className="w-12 h-12 rounded-xl bg-white text-[#64748b] flex items-center justify-center mx-auto shadow-xs">
              <Layers size={22} />
            </div>
            <h3 className="font-jakarta font-bold text-sm text-[#0a0e1a]">No Ideas Grouped Yet</h3>
            <p className="text-xs text-[#64748b] max-w-sm mx-auto">
              This group is currently empty. Click <strong>[ Add Ideas ]</strong> to search citizen submissions and select ideas with checkboxes.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn btn-primary btn-sm font-bold inline-flex items-center gap-1.5"
            >
              <Plus size={14} />
              <span>Add Ideas to Group</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#e2e8f0] bg-[#f8f7f4] text-[#64748b] font-bold">
                  <th className="p-3 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={ideas.length > 0 && selectedIdeaIds.length === ideas.length}
                      onChange={handleSelectAllTable}
                      className="w-4 h-4 rounded border-[#cbd5e1] text-[#e85d26] focus:ring-[#e85d26] cursor-pointer"
                    />
                  </th>
                  <th className="p-3">Public ID</th>
                  <th className="p-3">Idea Title / Problem</th>
                  <th className="p-3">District</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {ideas.map((idea) => {
                  const isSelected = selectedIdeaIds.includes(idea.id);
                  const statusColor = IDEA_STATUS_COLORS[idea.status] || "#64748b";

                  return (
                    <tr
                      key={idea.id}
                      className={`hover:bg-[#f8f7f4] transition-colors ${
                        isSelected ? "bg-[#fffaf7]" : ""
                      }`}
                    >
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleTableIdea(idea.id)}
                          className="w-4 h-4 rounded border-[#cbd5e1] text-[#e85d26] focus:ring-[#e85d26] cursor-pointer"
                        />
                      </td>

                      <td className="p-3 font-mono text-[11px] font-bold text-[#94a3b8]">
                        #{idea.public_id}
                      </td>

                      <td className="p-3 max-w-md">
                        <Link
                          href={`/admin/ideas/${idea.id}`}
                          className="font-bold text-[#0a0e1a] hover:text-[#e85d26] transition-colors line-clamp-1"
                        >
                          {idea.title}
                        </Link>
                        {idea.description && (
                          <p className="text-[11px] text-[#64748b] line-clamp-1 mt-0.5">
                            {idea.description}
                          </p>
                        )}
                      </td>

                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 font-semibold text-[#0a0e1a]">
                          <MapPin size={11} className="text-[#e85d26]" />
                          {idea.district}
                        </span>
                      </td>

                      <td className="p-3">
                        <span
                          className="px-2 py-0.5 rounded-md text-[10px] font-bold"
                          style={{
                            backgroundColor: `${statusColor}15`,
                            color: statusColor,
                          }}
                        >
                          {idea.status}
                        </span>
                      </td>

                      <td className="p-3 text-[#94a3b8] font-mono text-[11px]">
                        {new Date(idea.created_at).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                        })}
                      </td>

                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleRemoveSingleIdea(idea.id, idea.title)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                          title="Remove from group"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= "ADD IDEAS" SEARCH & MULTI-SELECT MODAL ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#e2e8f0] animate-scale-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#e2e8f0] flex-shrink-0">
              <div>
                <span className="text-xs font-bold text-[#e85d26] uppercase tracking-wider block">
                  Manual Idea Picker
                </span>
                <h3 className="font-jakarta font-extrabold text-[22px] text-[#0a0e1a]">
                  Add Ideas to &ldquo;{group.title}&rdquo;
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setModalSelectedIds([]);
                }}
                className="w-8 h-8 rounded-full bg-[#f8f7f4] hover:bg-[#e2e8f0] flex items-center justify-center text-[#64748b]"
              >
                <X size={16} />
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="py-4 space-y-3 flex-shrink-0 border-b border-[#f1f5f9]">
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  type="text"
                  placeholder="Search citizen submissions by title, keywords, district, ID..."
                  value={ideaSearchQuery}
                  onChange={(e) => setIdeaSearchQuery(e.target.value)}
                  className="input h-10 pl-10 text-xs w-full bg-[#f8f7f4] border-[#e2e8f0] focus:bg-white"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <select
                    value={modalCategory}
                    onChange={(e) => setModalCategory(e.target.value)}
                    className="input h-8 text-xs font-semibold bg-[#f8f7f4] border-[#e2e8f0]"
                  >
                    <option value="">All Categories</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                  <label className="flex items-center gap-1.5 text-[#64748b] font-bold cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={unassignedOnly}
                      onChange={(e) => setUnassignedOnly(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-[#cbd5e1] text-[#e85d26] focus:ring-[#e85d26]"
                    />
                    <span>Unassigned only</span>
                  </label>
                </div>

                <div className="font-bold text-[#64748b]">
                  {availableIdeas.length} ideas found •{" "}
                  <span className="text-[#e85d26]">{modalSelectedIds.length} selected</span>
                </div>
              </div>
            </div>

            {/* Ideas List with Checkboxes */}
            <div className="flex-1 overflow-y-auto py-3 divide-y divide-[#f1f5f9]">
              {isSearchingIdeas ? (
                <div className="py-16 flex flex-col items-center justify-center text-[#64748b] space-y-2">
                  <Loader2 size={24} className="animate-spin text-[#e85d26]" />
                  <span className="text-xs">Searching ideas...</span>
                </div>
              ) : availableIdeas.length === 0 ? (
                <div className="py-12 text-center text-[#64748b] text-xs">
                  No ideas match your search criteria.
                </div>
              ) : (
                availableIdeas.map((idea) => {
                  const isChecked = modalSelectedIds.includes(idea.id);
                  const isAlreadyInThisGroup = group.member_idea_ids.includes(idea.id);
                  const isInOtherGroup =
                    idea.assigned_group_id && idea.assigned_group_id !== group.id;

                  return (
                    <div
                      key={idea.id}
                      onClick={() => {
                        if (isAlreadyInThisGroup) return;
                        setModalSelectedIds((prev) =>
                          prev.includes(idea.id)
                            ? prev.filter((i) => i !== idea.id)
                            : [...prev, idea.id]
                        );
                      }}
                      className={`p-3.5 rounded-2xl transition-all cursor-pointer flex items-start gap-3.5 ${
                        isAlreadyInThisGroup
                          ? "opacity-40 bg-[#f8f7f4] cursor-not-allowed"
                          : isChecked
                          ? "bg-[#fffaf7] border border-[#e85d26]/30"
                          : "hover:bg-[#f8f7f4]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked || isAlreadyInThisGroup}
                        disabled={isAlreadyInThisGroup}
                        onChange={() => {}} // Handled by container onClick
                        className="w-4 h-4 rounded border-[#cbd5e1] text-[#e85d26] focus:ring-[#e85d26] mt-0.5 cursor-pointer"
                      />

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-[10.5px] font-bold text-[#94a3b8]">
                            #{idea.public_id}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#f1f5f9] text-[#0a0e1a]">
                            {idea.category_name}
                          </span>
                          <span className="text-[11px] font-semibold text-[#64748b] flex items-center gap-1">
                            <MapPin size={11} className="text-[#e85d26]" />
                            {idea.district}
                          </span>

                          {isAlreadyInThisGroup ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700">
                              Already in this group
                            </span>
                          ) : isInOtherGroup ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                              In: {idea.assigned_group_title} (will reassign)
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                              Unassigned
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-xs text-[#0a0e1a] line-clamp-1">
                          {idea.title}
                        </h4>

                        {idea.description && (
                          <p className="text-[11px] text-[#64748b] line-clamp-2">
                            {idea.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-[#e2e8f0] flex items-center justify-between gap-3 flex-shrink-0">
              <div className="text-xs font-bold text-[#0a0e1a]">
                {modalSelectedIds.length} {modalSelectedIds.length === 1 ? "idea" : "ideas"} selected
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setModalSelectedIds([]);
                  }}
                  className="btn btn-secondary btn-sm font-bold"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleAddSelectedModalIdeas}
                  disabled={modalSelectedIds.length === 0 || isAddingIdeas}
                  className="btn btn-primary btn-sm font-bold px-5"
                >
                  {isAddingIdeas ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <span>Add {modalSelectedIds.length} Selected Ideas</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
