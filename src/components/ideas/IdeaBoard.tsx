"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, X, Lightbulb, ChevronRight, Filter, Sparkles, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import IdeaCard from "./IdeaCard";
import { CATEGORIES } from "@/lib/constants/categories";
import { DISTRICTS } from "@/lib/constants/districts";

interface Idea {
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
}

export default function IdeaBoard() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const fetchIdeas = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedDistrict) params.set("district", selectedDistrict);
    params.set("page", String(page));
    params.set("limit", "12");

    try {
      const res = await fetch(`/api/ideas?${params.toString()}`);
      const data = await res.json();
      setIdeas(data.ideas || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch {
      setIdeas([]);
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory, selectedDistrict, page]);

  useEffect(() => {
    const timeout = setTimeout(fetchIdeas, 300);
    return () => clearTimeout(timeout);
  }, [fetchIdeas]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setSelectedDistrict("");
    setPage(1);
  };

  const hasFilters = search || selectedCategory || selectedDistrict;

  return (
    <div>
      {/* Category Horizontal Quick Chips */}
      <div className="mb-6 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden mt-6">
        <div className="flex items-center gap-2 w-max">
          <button
            onClick={() => { setSelectedCategory(""); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-[15px] font-bold transition-all whitespace-nowrap ${
              selectedCategory === ""
                ? "bg-[#0a0e1a] text-white shadow-md"
                : "bg-white text-[#64748b] hover:bg-[#f1f5f9] border border-[#e2e8f0]"
            }`}
          >
            All Categories ({total > 0 ? total : "—"})
          </button>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(isSelected ? "" : cat.id);
                  setPage(1);
                }}
                className={`px-3.5 py-2 rounded-xl text-[13px] font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  isSelected
                    ? "bg-[#e85d26] text-white shadow-md shadow-[#e85d26]/30 font-bold"
                    : "bg-white text-[#334155] hover:bg-[#f1f5f9] border border-[#e2e8f0]"
                }`}
              >
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Filter Bar */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-[#e2e8f0] shadow-sm flex flex-col md:flex-row gap-3 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={17}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]"
          />
          <input
            type="search"
            className="input pl-10 h-11 text-[14px]"
            placeholder="Search problems, keywords, public IDs..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            aria-label="Search ideas"
          />
          {search && (
            <button
              onClick={() => { setSearch(""); setPage(1); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#0a0e1a]"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* District selector */}
        <div className="w-full md:w-64">
          <select
            className="input h-11 text-[14px]"
            value={selectedDistrict}
            onChange={(e) => { setSelectedDistrict(e.target.value); setPage(1); }}
            aria-label="Filter by district"
          >
            <option value="">All 38 Districts</option>
            {DISTRICTS.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="btn btn-ghost h-11 flex items-center gap-1.5 text-[#e85d26] hover:bg-[#fde8dc] text-[13px] font-bold rounded-xl flex-shrink-0"
          >
            <X size={14} />
            Reset
          </button>
        )}
      </div>

      {/* Results Count Header */}
      {!loading && (
        <div className="flex items-center justify-between mb-6">
          <p className="text-[14px] text-[#64748b] font-medium">
            Showing <strong className="text-[#0a0e1a]">{total.toLocaleString("en-IN")}</strong>{" "}
            {total === 1 ? "problem" : "problems"}
            {hasFilters ? " matching active filters" : " across Tamil Nadu"}
          </p>

          <Link
            href="/submit"
            className="text-[13px] font-bold text-[#e85d26] hover:underline hidden sm:flex items-center gap-1"
          >
            <span>Submit a new problem</span>
            <ChevronRight size={14} />
          </Link>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-[#e2e8f0] shadow-sm">
              <div className="skeleton h-5 w-24 mb-4 rounded-md" />
              <div className="skeleton h-6 w-full mb-3 rounded-md" />
              <div className="skeleton h-4 w-3/4 mb-4 rounded-md" />
              <div className="skeleton h-4 w-1/2 rounded-md" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && ideas.length === 0 && (
        <div className="bg-white rounded-3xl p-8 sm:p-12 lg:p-16 border border-[#e2e8f0] text-center max-w-xl mx-auto shadow-sm my-8">
          <div className="w-16 h-16 rounded-2xl bg-[#fde8dc] flex items-center justify-center mx-auto mb-5 shadow-xs">
            <Lightbulb size={30} className="text-[#e85d26]" />
          </div>

          {hasFilters ? (
            <>
              <h2 className="font-jakarta font-bold text-[22px] text-[#0a0e1a] mb-2">
                No problems found matching filters
              </h2>
              <p className="text-[#64748b] text-[15px] mb-6 leading-relaxed">
                We couldn&apos;t find any ideas for the selected category or district. Be the first citizen to report an issue here!
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button onClick={clearFilters} className="btn btn-secondary w-full sm:w-auto">
                  Clear Filters
                </button>
                <Link href="/submit" className="btn btn-primary w-full sm:w-auto">
                  Submit This Problem
                </Link>
              </div>
            </>
          ) : (
            <>
              <h2 className="font-jakarta font-bold text-[22px] text-[#0a0e1a] mb-2">
                The board is ready for its first submission!
              </h2>
              <p className="text-[#64748b] text-[15px] mb-6 leading-relaxed">
                Phase 1 Ingestion is live. Submit your problem via voice or text in under 2 minutes.
              </p>
              <Link href="/submit" className="btn btn-primary btn-lg inline-flex items-center gap-2">
                <span>Share Your Idea Now</span>
                <ChevronRight size={17} />
              </Link>
            </>
          )}
        </div>
      )}

      {/* Ideas Grid */}
      {!loading && ideas.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {ideas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-6 border-t border-[#e2e8f0]">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="btn btn-secondary btn-sm disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-[13px] text-[#64748b] font-medium px-4">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="btn btn-secondary btn-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

