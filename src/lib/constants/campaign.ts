export type CampaignStatus =
  | "PRE_LAUNCH"
  | "COLLECTING"
  | "REVIEWING"
  | "VOTING"
  | "CLOSED"
  | "WINNER"
  | "RESULTS"
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

export interface ShortlistedIdea {
  id: string;
  public_id: string;
  product_number?: string;
  product_name: string;
  emoji: string;
  tagline: string;
  why_is_this_here: string;
  districts_count?: number;
  category_id: string;
  category_name: string;
  category_color: string;
  category_bg: string;
  title: string;
  title_tamil: string;
  problem_description: string;
  district: string;
  why_it_matters: string;
  submitters_count: number;
  vote_count?: number;
  percentage?: number;
}

export const CAMPAIGN_STATUS_LABELS: Record<CampaignStatus, string> = {
  PRE_LAUNCH: "Coming Soon",
  COLLECTING: "Collecting Ideas",
  REVIEWING: "Under Review",
  VOTING: "Voting Open",
  CLOSED: "Voting Closed",
  WINNER: "Winner Announced",
  RESULTS: "Voting Results Published",
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

// 5 Curated Product Finalists shortlisted from citizen submissions across Tamil Nadu
export const DEFAULT_SHORTLISTED_IDEAS: ShortlistedIdea[] = [
  {
    id: "finalist-1",
    public_id: "TN-2026-00108",
    product_number: "01",
    product_name: "Smart Bus TN",
    emoji: "🚌",
    tagline: "Know where your bus is, when it will arrive, and how crowded it is.",
    why_is_this_here: "842 people submitted a similar problem across 28 districts.",
    districts_count: 28,
    category_id: "transport",
    category_name: "Transport",
    category_color: "#F59E0B",
    category_bg: "#FFFBEB",
    title: "Smart Bus TN — Real-Time Bus Tracking & Crowding Alerts",
    title_tamil: "நேரலை பேருந்து இருப்பிடம் & கூட்ட நெரிசல் எச்சரிக்கை",
    problem_description:
      "Millions of daily commuters wait at bus stops with zero visibility on government bus arrival times, delay notices, or bus crowding levels.",
    district: "Across 28 Districts in Tamil Nadu",
    why_it_matters:
      "Saves over 30 minutes of daily commute uncertainty for students, factory workers, and senior citizens.",
    submitters_count: 842,
  },
  {
    id: "finalist-2",
    public_id: "TN-2026-00491",
    product_number: "02",
    product_name: "HealthAccess TN",
    emoji: "🏥",
    tagline: "Find nearby hospitals, available services, medicine stocks, and doctor info in one place.",
    why_is_this_here: "537 people submitted a similar problem across 19 districts.",
    districts_count: 19,
    category_id: "healthcare",
    category_name: "Healthcare",
    category_color: "#EF4444",
    category_bg: "#FEF2F2",
    title: "HealthAccess TN — Primary Health Centre Medicine & Doctor Tracker",
    title_tamil: "ஆரம்ப சுகாதார நிலைய மருந்து இருப்பு & மருத்துவர் நேரம்",
    problem_description:
      "Rural families travel long distances to local PHCs only to discover essential medicines are out of stock or specialists are visiting other wards.",
    district: "Across 19 Districts (Salem, Tirunelveli & Rural TN)",
    why_it_matters:
      "Prevents wasted medical trips and gives patients instant SMS availability alerts in spoken Tamil.",
    submitters_count: 537,
  },
  {
    id: "finalist-3",
    public_id: "TN-2026-00620",
    product_number: "03",
    product_name: "Scholarship Finder",
    emoji: "🎓",
    tagline: "Find scholarships and government education benefits you're eligible for.",
    why_is_this_here: "485 people submitted a similar problem across 31 districts.",
    districts_count: 31,
    category_id: "education",
    category_name: "Education",
    category_color: "#3B82F6",
    category_bg: "#EFF6FF",
    title: "Scholarship Finder — TN Student Scholarship & Benefits Engine",
    title_tamil: "மாணவர் கல்வி உதவித்தொகை & தொழிற்கல்வி தேடல் தளம்",
    problem_description:
      "Hundreds of government and private college scholarships go unclaimed because eligible first-generation students don't know about them in time.",
    district: "Across 31 Districts in Tamil Nadu",
    why_it_matters:
      "Empowers under-resourced students to find financial aid, vocational mentorship, and career pathways in their district.",
    submitters_count: 485,
  },
  {
    id: "finalist-4",
    public_id: "TN-2026-00788",
    product_number: "04",
    product_name: "Emergency Connect",
    emoji: "🚨",
    tagline: "One place to find and quickly connect with emergency services, blood banks, and nearby help.",
    why_is_this_here: "427 people submitted a similar problem across 14 districts.",
    districts_count: 14,
    category_id: "public-services",
    category_name: "Emergency & Safety",
    category_color: "#0891B2",
    category_bg: "#ECFEFF",
    title: "Emergency Connect — Verified Instant Emergency & Blood Network",
    title_tamil: "அவசர உதவி, ஆம்புலன்ஸ் & ரத்த தான விரைவு இணைப்பு",
    problem_description:
      "During critical road accidents and medical emergencies, finding verified local ambulances, immediate blood donors, and ward responders takes precious minutes.",
    district: "Across 14 Districts in Tamil Nadu",
    why_it_matters:
      "Provides zero-friction 1-tap emergency dispatch, local volunteer alerts, and verified nearest hospital contacts.",
    submitters_count: 427,
  },
  {
    id: "finalist-5",
    public_id: "TN-2026-00342",
    product_number: "05",
    product_name: "Uzhavar Direct",
    emoji: "🌾",
    tagline: "Real-time Uzhavar Sandhai market rates, cold storage booking, and direct buyer connections.",
    why_is_this_here: "619 people submitted a similar problem across 22 delta & southern districts.",
    districts_count: 22,
    category_id: "agriculture",
    category_name: "Agriculture",
    category_color: "#16A34A",
    category_bg: "#F0FDF4",
    title: "Uzhavar Direct — Direct Farmers' Market Price & Storage Portal",
    title_tamil: "விவசாயிகள் நேரடி சந்தை விலை & குளிர்பதன முன்பதிவு தளம்",
    problem_description:
      "Smallholder vegetable and grain farmers face opaque middleman pricing and lack real-time market rate visibility across nearby Uzhavar Sandhais.",
    district: "Thanjavur, Madurai, Trichy & Delta Region",
    why_it_matters:
      "Ensures transparent remuneration, reduces distress harvest sales, and links rural farmers directly to bulk buyers.",
    submitters_count: 619,
  },
];

// Default campaign config — can be overridden dynamically by database or environment
export const DEFAULT_CAMPAIGN = {
  name: "Build Tamil Nadu",
  tagline: "What should we build for Tamil Nadu?",
  status: "VOTING" as CampaignStatus,
  collection_start: new Date("2026-08-17"),
  collection_end: new Date("2026-09-01"),
  voting_start: new Date("2026-09-01"),
  voting_end: new Date("2026-09-05"),
  allow_results_before_close: false,
  shortlisted_ideas: DEFAULT_SHORTLISTED_IDEAS,
};

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://buildtamilnadu.in";

