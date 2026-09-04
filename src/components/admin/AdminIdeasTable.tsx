"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { formatRelativeDate } from "@/lib/utils";
import { Eye, Check, X, Star, Trash2, Globe } from "lucide-react";

interface Idea {
  id: string;
  public_id: string;
  title: string;
  district: string;
  status: string;
  visibility: string;
  created_at: string;
  categories: { name: string; slug: string } | null;
  users: { email: string } | null;
}

const STATUS_COLORS: Record<string, string> = {
  SUBMITTED: "#f59e0b",
  UNDER_REVIEW: "#3b82f6",
  APPROVED: "#22c55e",
  PUBLIC: "#10b981",
  DUPLICATE: "#94a3b8",
  REJECTED: "#ef4444",
  SHORTLISTED: "#8b5cf6",
  SELECTED: "#e85d26",
  BUILDING: "#e85d26",
  COMPLETED: "#22c55e",
};

export default function AdminIdeasTable({
  ideas,
  total,
  page,
  limit,
}: {
  ideas: Idea[];
  total: number;
  page: number;
  limit: number;
}) {
  const [currentIdeas, setCurrentIdeas] = useState<Idea[]>(ideas);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Sync prop changes
  useEffect(() => {
    setCurrentIdeas(ideas);
  }, [ideas]);

  const updateIdea = async (
    id: string,
    updates: { status?: string; visibility?: string }
  ) => {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/ideas/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || errData.message || "Update failed");
      }

      toast.success("Idea updated successfully");
      window.location.reload();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update idea");
    } finally {
      setLoadingId(null);
    }
  };

  const deleteIdea = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete idea "${title}"? This cannot be undone.`)) {
      return;
    }
    setLoadingId(id);
    const previousIdeas = currentIdeas;
    // Optimistic removal
    setCurrentIdeas((prev) => prev.filter((i) => i.id !== id && i.public_id !== id));

    try {
      const res = await fetch(`/api/admin/ideas/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || data.message || "Delete failed");
      }

      toast.success("Idea deleted successfully");
    } catch (err: any) {
      // Revert optimistic removal on failure
      setCurrentIdeas(previousIdeas);
      toast.error(err?.message || "Failed to delete idea");
    } finally {
      setLoadingId(null);
    }
  };

  if (currentIdeas.length === 0) {
    return (
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-12 text-center">
        <p className="text-[#64748b]">No ideas found.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden mb-4">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8f7f4]">
                <th className="text-left px-4 py-3 font-semibold text-[#64748b]">ID</th>
                <th className="text-left px-4 py-3 font-semibold text-[#64748b]">Title</th>
                <th className="text-left px-4 py-3 font-semibold text-[#64748b]">Category</th>
                <th className="text-left px-4 py-3 font-semibold text-[#64748b]">District</th>
                <th className="text-left px-4 py-3 font-semibold text-[#64748b]">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-[#64748b]">Email</th>
                <th className="text-left px-4 py-3 font-semibold text-[#64748b]">Date</th>
                <th className="text-left px-4 py-3 font-semibold text-[#64748b]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentIdeas.map((idea) => {
                const isLoading = loadingId === idea.id;
                const statusColor = STATUS_COLORS[idea.status] || "#64748b";

                return (
                  <tr key={idea.id} className="border-b border-[#f1f5f9] hover:bg-[#f8f7f4] transition-colors">
                    <td className="px-4 py-3 font-mono text-[11px] text-[#94a3b8]">
                      {idea.public_id}
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <a
                        href={`/admin/ideas/${idea.id}`}
                        className="font-medium text-[#0a0e1a] hover:text-[#e85d26] transition-colors line-clamp-2"
                      >
                        {idea.title}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-[#64748b]">
                      {idea.categories?.name || "—"}
                    </td>
                    <td className="px-4 py-3 text-[#64748b]">{idea.district}</td>
                    <td className="px-4 py-3">
                      <span
                        className="badge text-[11px]"
                        style={{
                          backgroundColor: `${statusColor}15`,
                          color: statusColor,
                        }}
                      >
                        {idea.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-[11.5px]">
                      {idea.users?.email ? (
                        <a
                          href={`mailto:${idea.users.email}?subject=Build Tamil Nadu: Regarding your submission (${idea.public_id})`}
                          className="text-[#0a0e1a] hover:text-[#e85d26] underline decoration-dotted transition-colors inline-flex items-center gap-1"
                          title="Click to email citizen"
                        >
                          <span>{idea.users.email}</span>
                        </a>
                      ) : (
                        <span className="text-[#94a3b8]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[#94a3b8]">
                      {formatRelativeDate(idea.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {/* View */}
                        <a
                          href={`/admin/ideas/${idea.id}`}
                          className="btn btn-icon btn-ghost text-[#64748b] hover:text-[#0a0e1a]"
                          title="View"
                        >
                          <Eye size={14} />
                        </a>

                        {/* Make public */}
                        {idea.visibility !== "PUBLIC" && (
                          <button
                            type="button"
                            onClick={() => updateIdea(idea.id, { status: "PUBLIC", visibility: "PUBLIC" })}
                            disabled={isLoading}
                            className="btn btn-icon btn-ghost text-[#22c55e] hover:text-[#16a34a]"
                            title="Make public"
                          >
                            <Globe size={14} />
                          </button>
                        )}

                        {/* Shortlist */}
                        {idea.status !== "SHORTLISTED" && (
                          <button
                            type="button"
                            onClick={() => updateIdea(idea.id, { status: "SHORTLISTED" })}
                            disabled={isLoading}
                            className="btn btn-icon btn-ghost text-[#8b5cf6] hover:text-[#7c3aed]"
                            title="Shortlist"
                          >
                            <Star size={14} />
                          </button>
                        )}

                        {/* Reject */}
                        {idea.status !== "REJECTED" && (
                          <button
                            type="button"
                            onClick={() => updateIdea(idea.id, { status: "REJECTED" })}
                            disabled={isLoading}
                            className="btn btn-icon btn-ghost text-[#ef4444] hover:text-[#dc2626]"
                            title="Reject"
                          >
                            <X size={14} />
                          </button>
                        )}

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => deleteIdea(idea.id, idea.title)}
                          disabled={isLoading}
                          className="btn btn-icon btn-ghost text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                          title="Delete Idea"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {total > limit && (
        <div className="flex items-center justify-between text-[13px] text-[#64748b]">
          <span>
            Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <a
                href={`/admin/ideas?page=${page - 1}`}
                className="btn btn-secondary btn-sm"
              >
                Previous
              </a>
            )}
            {page * limit < total && (
              <a
                href={`/admin/ideas?page=${page + 1}`}
                className="btn btn-secondary btn-sm"
              >
                Next
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
