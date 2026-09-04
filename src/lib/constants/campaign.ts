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

// 10 Shortlisted Product Candidates shortlisted from citizen submissions across Tamil Nadu
export const DEFAULT_SHORTLISTED_IDEAS: ShortlistedIdea[] = [
  {
    id: "finalist-1",
    public_id: "TN-2026-00101",
    product_number: "01",
    product_name: "Government Scheme & Scholarship Finder",
    emoji: "📜",
    tagline: "Enter age, occupation, and income to find matching TN govt schemes with step-by-step guidance in Tamil.",
    why_is_this_here: "982 citizen submissions across 38 districts.",
    districts_count: 38,
    category_id: "education",
    category_name: "Govt Schemes & Benefits",
    category_color: "#3B82F6",
    category_bg: "#EFF6FF",
    title: "01 — Government Scheme & Scholarship Finder",
    title_tamil: "அரசு நலத்திட்டங்கள் & கல்வி உதவித்தொகை தேடல் தளம்",
    problem_description:
      "Enter age, occupation/student status, and income to get matching TN govt schemes (pension, agri subsidy, scholarships, first-graduate benefits) with step-by-step guidance in Tamil.",
    district: "Across 38 Districts in Tamil Nadu",
    why_it_matters:
      "Target Audience: All TN people + Students • Type: App/Website",
    submitters_count: 982,
  },
  {
    id: "finalist-2",
    public_id: "TN-2026-00102",
    product_number: "02",
    product_name: "Local Bus/Train Live Tracker",
    emoji: "🚌",
    tagline: "Real-time tracking of TNSTC & town bus timings plus local train schedules for tier-2/3 towns.",
    why_is_this_here: "845 citizen submissions across 32 districts.",
    districts_count: 32,
    category_id: "transport",
    category_name: "Transport",
    category_color: "#F59E0B",
    category_bg: "#FFFBEB",
    title: "02 — Local Bus/Train Live Tracker",
    title_tamil: "நேரலை பேருந்து & ரயில் இருப்பிடம் கண்காணிப்பு",
    problem_description:
      "Real-time-ish tracking of TNSTC and town bus timings plus local train schedules, focused on tier-2/3 towns that lack good coverage today.",
    district: "Across 32 Districts in Tamil Nadu",
    why_it_matters:
      "Target Audience: Daily commuters, workers, students • Type: App",
    submitters_count: 845,
  },
  {
    id: "finalist-3",
    public_id: "TN-2026-00103",
    product_number: "03",
    product_name: "Ration Shop Stock & Water Tanker Tracker",
    emoji: "🌾",
    tagline: "Check nearby ration shop stock availability and request/track municipal water tanker delivery.",
    why_is_this_here: "764 citizen submissions across 29 districts.",
    districts_count: 29,
    category_id: "public-services",
    category_name: "Public Services",
    category_color: "#0891B2",
    category_bg: "#ECFEFF",
    title: "03 — Ration Shop Stock & Water Tanker Tracker",
    title_tamil: "ரேஷன் கடை பொருள் இருப்பு & குடிநீர் லாரி கண்காணிப்பு",
    problem_description:
      "Check nearby ration shop stock availability and request/track municipal water tanker delivery instead of blind visits or phone calls.",
    district: "Across 29 Districts in Tamil Nadu",
    why_it_matters:
      "Target Audience: Households, elderly, daily-wage families • Type: App",
    submitters_count: 764,
  },
  {
    id: "finalist-4",
    public_id: "TN-2026-00104",
    product_number: "04",
    product_name: "Tamil-Medium Doubt Solving + Exam Prep",
    emoji: "📚",
    tagline: "Photo-based doubt solving in Tamil for school/college subjects, plus TNPSC/TET/bank exam prep.",
    why_is_this_here: "689 citizen submissions across 35 districts.",
    districts_count: 35,
    category_id: "education",
    category_name: "Education & Exams",
    category_color: "#8B5CF6",
    category_bg: "#F5F3FF",
    title: "04 — Tamil-Medium Doubt Solving + Exam Prep",
    title_tamil: "தமிழ் வழி பாட சந்தேகம் தீர்ப்பு & அரசு தேர்வு பயிற்சி",
    problem_description:
      "Photo-based doubt solving in Tamil for school/college subjects, plus TNPSC/TET/bank exam prep material for competitive exam aspirants.",
    district: "Across 35 Districts in Tamil Nadu",
    why_it_matters:
      "Target Audience: Students + TN youth preparing for govt exams • Type: App",
    submitters_count: 689,
  },
  {
    id: "finalist-5",
    public_id: "TN-2026-00105",
    product_number: "05",
    product_name: "Farmer Price & Weather Voice Alert",
    emoji: "🧑‍🌾",
    tagline: "Daily mandi prices & weather via WhatsApp or voice calls in Tamil for farmers.",
    why_is_this_here: "612 citizen submissions across 24 districts.",
    districts_count: 24,
    category_id: "agriculture",
    category_name: "Agriculture",
    category_color: "#16A34A",
    category_bg: "#F0FDF4",
    title: "05 — Farmer Price & Weather Voice Alert",
    title_tamil: "விவசாயிகள் சந்தை விலை & வானிலை குரல் எச்சரிக்கை",
    problem_description:
      "Daily mandi/uzhavar sandhai prices and hyperlocal weather delivered via WhatsApp or voice call in Tamil, built for farmers who aren't smartphone-fluent.",
    district: "Across 24 Districts in Tamil Nadu",
    why_it_matters:
      "Target Audience: Farmers • Type: SMS/Voice/WhatsApp Bot",
    submitters_count: 612,
  },
  {
    id: "finalist-6",
    public_id: "TN-2026-00106",
    product_number: "06",
    product_name: "Local Job & Part-Time Gig Finder",
    emoji: "💼",
    tagline: "One board combining blue-collar jobs and student part-time gigs filtered by town/college area.",
    why_is_this_here: "578 citizen submissions across 30 districts.",
    districts_count: 30,
    category_id: "employment",
    category_name: "Jobs & Careers",
    category_color: "#E85D26",
    category_bg: "#FFFAF7",
    title: "06 — Local Job & Part-Time Gig Finder",
    title_tamil: "உள்ளூர் வேலைவாய்ப்பு & பகுதிநேர பணி தேடல்",
    problem_description:
      "One board combining blue-collar jobs (driver, electrician, tailor) and student part-time gigs (tuition, event work), filtered by town/college area.",
    district: "Across 30 Districts in Tamil Nadu",
    why_it_matters:
      "Target Audience: General public + Students • Type: App/Website",
    submitters_count: 578,
  },
  {
    id: "finalist-7",
    public_id: "TN-2026-00107",
    product_number: "07",
    product_name: "Health & Govt Hospital Wait-Time App",
    emoji: "🏥",
    tagline: "Shows nearest govt hospital/PHC doctor availability, wait times, and Amma clinic bookings.",
    why_is_this_here: "542 citizen submissions across 26 districts.",
    districts_count: 26,
    category_id: "healthcare",
    category_name: "Healthcare",
    category_color: "#EF4444",
    category_bg: "#FEF2F2",
    title: "07 — Health & Govt Hospital Wait-Time App",
    title_tamil: "அரசு மருத்துவமனை காத்திருப்பு நேரம் & மருத்துவர் விவரம்",
    problem_description:
      "Shows nearest govt hospital/PHC, doctor availability, approximate wait time, and lets users book Amma clinic slots.",
    district: "Across 26 Districts in Tamil Nadu",
    why_it_matters:
      "Target Audience: All families • Type: App",
    submitters_count: 542,
  },
  {
    id: "finalist-8",
    public_id: "TN-2026-00108",
    product_number: "08",
    product_name: "Attendance/Bunk Calculator & Fee Reimbursement Checker",
    emoji: "🎒",
    tagline: "Calculates safe bunk percentage for college attendance and checks scholarship/reimbursement eligibility.",
    why_is_this_here: "493 citizen submissions across 28 districts.",
    districts_count: 28,
    category_id: "education",
    category_name: "Student Tools",
    category_color: "#0284C7",
    category_bg: "#F0F9FF",
    title: "08 — Attendance/Bunk Calculator + Fee Reimbursement Checker",
    title_tamil: "கல்லூரி வருகைப்பதிவு கணக்கிடுவான் & கல்விக் கட்டணம் திரும்பப்பெறல்",
    problem_description:
      "Calculates safe bunk percentage to stay above attendance requirements, and checks scholarship/fee reimbursement eligibility in the same tool.",
    district: "Across 28 Districts in Tamil Nadu",
    why_it_matters:
      "Target Audience: Students • Type: App",
    submitters_count: 493,
  },
  {
    id: "finalist-9",
    public_id: "TN-2026-00109",
    product_number: "09",
    product_name: "Marriage Hall & Local Vendor Finder",
    emoji: "🏛️",
    tagline: "Aggregates kalyana mandapams, caterers, and decorators with transparent local pricing.",
    why_is_this_here: "431 citizen submissions across 25 districts.",
    districts_count: 25,
    category_id: "services",
    category_name: "Local Services",
    category_color: "#D97706",
    category_bg: "#FFFBEB",
    title: "09 — Marriage Hall & Local Vendor Finder",
    title_tamil: "கல்யாண மண்டபம் & உள்ளூர் விழா ஏற்பாட்டாளர்கள் தேடல்",
    problem_description:
      "Aggregates kalyana mandapams, caterers, and decorators with real local pricing, replacing word-of-mouth discovery.",
    district: "Across 25 Districts in Tamil Nadu",
    why_it_matters:
      "Target Audience: General public • Type: App/Website",
    submitters_count: 431,
  },
  {
    id: "finalist-10",
    public_id: "TN-2026-00110",
    product_number: "10",
    product_name: "Elderly Check-in & Local Caregiver Connect",
    emoji: "👴",
    tagline: "Lets families arrange verified local help for elderly parents: medicine reminders, doctor visits, groceries.",
    why_is_this_here: "395 citizen submissions across 20 districts.",
    districts_count: 20,
    category_id: "eldercare",
    category_name: "Elder Care & Family",
    category_color: "#EC4899",
    category_bg: "#FDF2F8",
    title: "10 — Elderly Check-in & Local Caregiver Connect",
    title_tamil: "முதியோர் பராமரிப்பு & உள்ளூர் உதவியாளர் இணைப்பு",
    problem_description:
      "Lets families, including NRI children, arrange verified local help for elderly parents: medicine reminders, doctor visits, groceries.",
    district: "Across 20 Districts in Tamil Nadu",
    why_it_matters:
      "Target Audience: Families with elderly parents • Type: App",
    submitters_count: 395,
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
  process.env.NEXT_PUBLIC_SITE_URL || "https://tamil-nadu-five.vercel.app";

