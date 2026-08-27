import { ShortlistedIdea, DEFAULT_SHORTLISTED_IDEAS } from "@/lib/constants/campaign";

let candidatesStore: ShortlistedIdea[] = JSON.parse(JSON.stringify(DEFAULT_SHORTLISTED_IDEAS));

export function getVotingCandidates(): ShortlistedIdea[] {
  return candidatesStore;
}

export function setVotingCandidates(candidates: ShortlistedIdea[]): ShortlistedIdea[] {
  candidatesStore = candidates.map((c, idx) => ({
    ...c,
    product_number: `0${idx + 1}`,
  }));
  return candidatesStore;
}

export function addVotingCandidate(payload: {
  product_name: string;
  emoji?: string;
  tagline?: string;
  category_id?: string;
  category_name?: string;
  category_color?: string;
  category_bg?: string;
  problem_description?: string;
  district?: string;
  submitters_count?: number;
  why_is_this_here?: string;
}): ShortlistedIdea {
  const newId = `finalist-${Date.now()}`;
  const idx = candidatesStore.length;
  const num = `0${idx + 1}`;
  const count = payload.submitters_count || 1;
  const dist = payload.district || "Across Tamil Nadu";

  const newCandidate: ShortlistedIdea = {
    id: newId,
    public_id: `TN-2026-${Math.floor(10000 + Math.random() * 90000)}`,
    product_number: num,
    product_name: payload.product_name.trim(),
    emoji: payload.emoji || "🚀",
    tagline: payload.tagline?.trim() || "Empowering citizens across Tamil Nadu.",
    why_is_this_here: payload.why_is_this_here || `${count} citizen submissions grouped across ${dist}.`,
    districts_count: 1,
    category_id: payload.category_id || "transport",
    category_name: payload.category_name || "General",
    category_color: payload.category_color || "#e85d26",
    category_bg: payload.category_bg || "#fffaf7",
    title: payload.product_name.trim(),
    title_tamil: "",
    problem_description: payload.problem_description?.trim() || payload.product_name.trim(),
    district: dist,
    why_it_matters: "Synthesized directly from citizen submissions across Tamil Nadu.",
    submitters_count: count,
    vote_count: 0,
    percentage: 0,
  };

  candidatesStore.push(newCandidate);
  return newCandidate;
}

export function removeVotingCandidate(id: string): boolean {
  const idx = candidatesStore.findIndex((c) => c.id === id || c.public_id === id);
  if (idx === -1) return false;

  candidatesStore.splice(idx, 1);
  candidatesStore.forEach((c, i) => {
    c.product_number = `0${i + 1}`;
  });
  return true;
}
