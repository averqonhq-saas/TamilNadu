export type CampaignStatus =
  | "PRE_LAUNCH"
  | "COLLECTING"
  | "REVIEWING"
  | "VOTING"
  | "WINNER"
  | "BUILDING"
  | "COMPLETED";

export type IdeaStatus =
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "PUBLIC"
  | "DUPLICATE"
  | "REJECTED"
  | "SHORTLISTED"
  | "SELECTED"
  | "BUILDING"
  | "COMPLETED";

export type IdeaVisibility = "PRIVATE" | "PUBLIC" | "HIDDEN";

export const CAMPAIGN_STATUS_LABELS: Record<CampaignStatus, string> = {
  PRE_LAUNCH: "Coming Soon",
  COLLECTING: "Collecting Ideas",
  REVIEWING: "Under Review",
  VOTING: "Voting Open",
  WINNER: "Winner Announced",
  BUILDING: "Building",
  COMPLETED: "Completed",
};

export const IDEA_STATUS_LABELS: Record<IdeaStatus, string> = {
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under Review",
  APPROVED: "Approved",
  PUBLIC: "Public",
  DUPLICATE: "Duplicate",
  REJECTED: "Rejected",
  SHORTLISTED: "Shortlisted",
  SELECTED: "Selected",
  BUILDING: "Building",
  COMPLETED: "Completed",
};

// Default campaign config — overridden by database values
export const DEFAULT_CAMPAIGN = {
  name: "Build Tamil Nadu",
  tagline: "What should we build for Tamil Nadu?",
  status: "COLLECTING" as CampaignStatus,
  collection_start: new Date("2026-08-17"),
  collection_end: new Date("2026-11-17"),
  voting_start: null as Date | null,
  voting_end: null as Date | null,
};

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://buildtamilnadu.in";
