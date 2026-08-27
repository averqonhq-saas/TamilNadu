"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Tag,
  Sparkles,
  Plus,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Users,
  Trash2,
  X,
  Loader2,
  FolderPlus,
  AlertCircle,
} from "lucide-react";
import { AdminCategory } from "@/lib/data/categories";
import { toast } from "sonner";

const ICON_PRESETS = ["🚌", "🏥", "🌾", "🎓", "🚨", "🏛️", "💼", "🌱", "⚡", "🛡️", "💧", "🏘️", "📱", "⚖️", "🎨"];
const COLOR_PRESETS = ["#F59E0B", "#EF4444", "#16A34A", "#3B82F6", "#0891B2", "#8B5CF6", "#EC4899", "#10B981", "#64748B", "#F97316"];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Add Category Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState("");
  const [nameTamil, setNameTamil] = useState("");
  const [icon, setIcon] = useState("📁");
  const [color, setColor] = useState("#e85d26");
  const [topProblem, setTopProblem] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete confirmation modal state
  const [deleteTarget, setDeleteTarget] = useState<AdminCategory | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      toast.error("Failed to load categories.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Category name is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          nameTamil: nameTamil.trim(),
          icon,
          color,
          topProblem: topProblem.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create category");

      toast.success(`Category "${name}" added successfully!`);
      setIsAddOpen(false);
      setName("");
      setNameTamil("");
      setIcon("📁");
      setColor("#e85d26");
      setTopProblem("");
      fetchCategories();
    } catch (err: any) {
      toast.error(err.message || "Failed to add category.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/categories?id=${deleteTarget.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete category");

      toast.success(`Category "${deleteTarget.name}" deleted.`);
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete category.");
    } finally {
      setIsDeleting(false);
    }
  };

  const totalSubmissions = categories.reduce((acc, c) => acc + (c.count || 0), 0);

  return (
    <div className="p-6 lg:p-8 max-w-6xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge badge-accent text-xs">Taxonomy &amp; Governance</span>
            <span className="text-xs text-[#64748b]">• {categories.length} Active Categories</span>
          </div>
          <h1 className="font-jakarta font-extrabold text-[28px] sm:text-[32px] text-[#0a0e1a] tracking-tight">
            Civic Categories &amp; Distribution
          </h1>
          <p className="text-[#64748b] text-[15px]">
            Manage state governance categories and inspect citizen problem distributions across sectors.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setIsAddOpen(true)}
            className="btn btn-primary btn-sm flex items-center gap-2 font-bold px-4 h-10 rounded-xl shadow-md shadow-[#e85d26]/20"
          >
            <Plus size={16} />
            <span>Add Category</span>
          </button>

          <Link
            href="/admin/ideas"
            className="btn btn-secondary btn-sm flex items-center gap-2 font-bold text-xs h-10 rounded-xl"
          >
            <span>Explore All Submissions</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* Summary KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-xs space-y-1">
          <span className="text-xs font-bold text-[#64748b] uppercase tracking-wider">Total Sectors</span>
          <div className="font-jakarta font-extrabold text-[28px] text-[#0a0e1a]">{categories.length}</div>
          <span className="text-xs text-[#64748b]">Active problem categories</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-xs space-y-1">
          <span className="text-xs font-bold text-[#64748b] uppercase tracking-wider">Total Classified</span>
          <div className="font-jakarta font-extrabold text-[28px] text-[#e85d26]">
            {totalSubmissions.toLocaleString()}
          </div>
          <span className="text-xs text-[#64748b]">Citizen submissions</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-xs space-y-1 col-span-2 sm:col-span-1">
          <span className="text-xs font-bold text-[#64748b] uppercase tracking-wider">Top Sector</span>
          <div className="font-jakarta font-extrabold text-[20px] text-[#0a0e1a] truncate">
            {categories[0]?.name || "Transport"}
          </div>
          <span className="text-xs text-emerald-600 font-bold">
            {categories[0]?.percentage || 0}% of all submissions
          </span>
        </div>
      </div>

      {/* Grid of Categories */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-[#64748b] space-y-2">
          <Loader2 size={32} className="animate-spin text-[#e85d26]" />
          <span className="text-sm font-medium">Loading civic categories...</span>
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-[#e2e8f0] text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#f8f7f4] text-[#64748b] flex items-center justify-center mx-auto">
            <Tag size={26} />
          </div>
          <h3 className="font-jakarta font-bold text-lg text-[#0a0e1a]">No Categories Configured</h3>
          <p className="text-sm text-[#64748b] max-w-md mx-auto">
            Click <strong>[ Add Category ]</strong> above to add governance sectors for citizen submissions.
          </p>
          <button
            onClick={() => setIsAddOpen(true)}
            className="btn btn-primary btn-sm font-bold inline-flex items-center gap-1.5"
          >
            <Plus size={14} />
            <span>Add First Category</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-3xl p-6 border border-[#e2e8f0] shadow-xs hover:shadow-xl transition-all space-y-4 flex flex-col justify-between group relative"
            >
              <div className="space-y-3.5">
                {/* Top Row: Icon + Submissions Count + Delete Button */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#f8f7f4] flex items-center justify-center text-[24px] shadow-2xs border border-[#e2e8f0]">
                    {cat.icon}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#0a0e1a] bg-[#f8f7f4] px-2.5 py-1 rounded-lg border border-[#e2e8f0]">
                      {cat.count} ideas
                    </span>

                    <button
                      onClick={() => setDeleteTarget(cat)}
                      className="w-8 h-8 rounded-xl bg-transparent hover:bg-rose-50 text-[#94a3b8] hover:text-rose-600 flex items-center justify-center transition-all"
                      title="Delete category"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Name & Tamil Name */}
                <div>
                  <h3 className="font-jakarta font-extrabold text-[19px] text-[#0a0e1a] group-hover:text-[#e85d26] transition-colors">
                    {cat.name}
                  </h3>
                  {cat.nameTamil && (
                    <p className="text-xs font-tamil text-[#e85d26] font-semibold mt-0.5">
                      {cat.nameTamil}
                    </p>
                  )}
                </div>

                {/* Share of Total Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#64748b]">
                    <span>Share of total:</span>
                    <span className="font-mono">{cat.percentage}%</span>
                  </div>
                  <div className="h-2 w-full bg-[#f1f5f9] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(cat.percentage, 4)}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>

                {/* Top Bottleneck Callout */}
                <div className="bg-[#f8f7f4] rounded-2xl p-3.5 border border-[#e2e8f0] text-xs text-[#334155] space-y-0.5">
                  <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider block">
                    Core Bottleneck:
                  </span>
                  <p className="font-medium leading-snug line-clamp-2">{cat.topProblem}</p>
                </div>
              </div>

              {/* View Ideas Link */}
              <Link
                href={`/admin/ideas?category=${cat.slug}`}
                className="text-xs font-bold text-[#e85d26] flex items-center justify-between hover:underline pt-3 border-t border-[#f1f5f9]"
              >
                <span>View {cat.count} {cat.name} ideas</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* ================= ADD CATEGORY MODAL ================= */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#e2e8f0] space-y-6 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#e85d26]/10 text-[#e85d26] flex items-center justify-center">
                  <FolderPlus size={20} />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#e85d26] uppercase tracking-wider block">
                    Taxonomy
                  </span>
                  <h3 className="font-jakarta font-extrabold text-[20px] text-[#0a0e1a]">
                    Add Civic Category
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setIsAddOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f8f7f4] hover:bg-[#e2e8f0] flex items-center justify-center text-[#64748b]"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0a0e1a] mb-1">
                  Category Name <span className="text-rose-500">*</span>:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Women Safety & Child Welfare"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="input text-sm font-semibold w-full"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0a0e1a] mb-1">
                  Tamil Name (தமிழ் பெயர்):
                </label>
                <input
                  type="text"
                  placeholder="e.g. பெண்கள் பாதுகாப்பு & குழந்தைகள் நலம்"
                  value={nameTamil}
                  onChange={(e) => setNameTamil(e.target.value)}
                  className="input text-sm font-semibold w-full font-tamil"
                />
              </div>

              {/* Icon Selector */}
              <div>
                <label className="block text-xs font-bold text-[#0a0e1a] mb-1">
                  Icon (Select or Type):
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="input w-16 text-center text-lg h-10 font-bold"
                  />
                  <div className="flex gap-1.5 flex-wrap flex-1">
                    {ICON_PRESETS.map((ic) => (
                      <button
                        type="button"
                        key={ic}
                        onClick={() => setIcon(ic)}
                        className={`w-8 h-8 rounded-lg text-sm flex items-center justify-center border transition-all ${
                          icon === ic
                            ? "border-[#e85d26] bg-[#fffaf7] scale-110"
                            : "border-[#e2e8f0] hover:bg-[#f8f7f4]"
                        }`}
                      >
                        {ic}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Color Selector */}
              <div>
                <label className="block text-xs font-bold text-[#0a0e1a] mb-1">
                  Accent Color:
                </label>
                <div className="flex items-center gap-2">
                  {COLOR_PRESETS.map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-full border-2 transition-all ${
                        color === c ? "border-[#0a0e1a] scale-110 shadow-sm" : "border-transparent"
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-7 h-7 rounded-full cursor-pointer border-0 p-0"
                    title="Custom color"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0a0e1a] mb-1">
                  Core Bottleneck / Description:
                </label>
                <textarea
                  rows={3}
                  placeholder="Primary challenge citizens face in this sector..."
                  value={topProblem}
                  onChange={(e) => setTopProblem(e.target.value)}
                  className="input text-sm w-full p-3 resize-none"
                />
              </div>

              <div className="pt-4 border-t border-[#e2e8f0] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
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
                    <span>Add Category</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#e2e8f0] space-y-5 animate-scale-in text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
              <Trash2 size={24} />
            </div>

            <div className="space-y-1">
              <h3 className="font-jakarta font-extrabold text-[20px] text-[#0a0e1a]">
                Delete Category?
              </h3>
              <p className="text-xs text-[#64748b]">
                Are you sure you want to remove <strong>&ldquo;{deleteTarget.name}&rdquo;</strong>? Existing ideas in this category will remain preserved.
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
                onClick={handleDeleteCategory}
                disabled={isDeleting}
                className="btn btn-sm bg-rose-600 hover:bg-rose-700 text-white font-bold px-5 shadow-sm"
              >
                {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <span>Delete Category</span>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
