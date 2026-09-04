import { CATEGORIES, getCategoryById } from "@/lib/constants/categories";

export type GroupStatus = "DRAFT" | "READY" | "SHORTLISTED";

export interface GroupMemberIdea {
  id: string;
  public_id: string;
  title: string;
  description?: string;
  district: string;
  status: string;
  category_id?: string;
  category_name?: string;
  submitter_email?: string;
  created_at: string;
}

export interface ManualGroup {
  id: string;
  title: string;
  description: string;
  category_id: string;
  category_name: string;
  category_color: string;
  category_bg: string;
  status: GroupStatus;
  product_concept: string;
  tagline?: string;
  emoji?: string;
  created_at: string;
  updated_at: string;
  member_idea_ids: string[];
  submissions_count: number;
  districts_count: number;
  top_districts: string[];
}

export interface GroupableIdea {
  id: string;
  public_id: string;
  title: string;
  description?: string;
  district: string;
  status: string;
  category_id: string;
  category_name: string;
  category_color: string;
  submitter_email?: string;
  created_at: string;
  assigned_group_id: string | null;
  assigned_group_title: string | null;
}

// Initial default seed ideas across various categories and districts
export const INITIAL_CITIZEN_IDEAS: GroupableIdea[] = [
  // Transport ideas
  {
    id: "idea-101",
    public_id: "TN-2026-00108",
    title: "Where is my bus? Live arrival tracking app",
    description: "Citizens waiting at bus stops in Chennai don't know when the next 21G or 570 bus will arrive.",
    district: "Chennai",
    status: "APPROVED",
    category_id: "transport",
    category_name: "Transport",
    category_color: "#F59E0B",
    submitter_email: "rajesh.kumar@gmail.com",
    created_at: "2026-08-18T10:30:00Z",
    assigned_group_id: "grp-1",
    assigned_group_title: "Real-time Bus Tracking",
  },
  {
    id: "idea-102",
    public_id: "TN-2026-00114",
    title: "Live bus location and delay notices in Madurai",
    description: "Town bus routes in Madurai to Mattuthavani have random delays. Need real-time GPS tracking.",
    district: "Madurai",
    status: "PUBLIC",
    category_id: "transport",
    category_name: "Transport",
    category_color: "#F59E0B",
    submitter_email: "anand.madurai@yahoo.com",
    created_at: "2026-08-18T14:15:00Z",
    assigned_group_id: "grp-1",
    assigned_group_title: "Real-time Bus Tracking",
  },
  {
    id: "idea-103",
    public_id: "TN-2026-00122",
    title: "Bus arrival tracking & crowd occupancy indicator",
    description: "Coimbatore Gandhipuram bus stand is overcrowded. Tell passengers how packed the bus is before boarding.",
    district: "Coimbatore",
    status: "PUBLIC",
    category_id: "transport",
    category_name: "Transport",
    category_color: "#F59E0B",
    submitter_email: "priya.cbe@outlook.com",
    created_at: "2026-08-19T09:00:00Z",
    assigned_group_id: "grp-1",
    assigned_group_title: "Real-time Bus Tracking",
  },
  {
    id: "idea-104",
    public_id: "TN-2026-00135",
    title: "Real-time GPS tracker for Salem mofussil government buses",
    description: "Need ETA alerts for village route buses from Salem new bus stand.",
    district: "Salem",
    status: "APPROVED",
    category_id: "transport",
    category_name: "Transport",
    category_color: "#F59E0B",
    submitter_email: "saravanan.salem@gmail.com",
    created_at: "2026-08-19T16:20:00Z",
    assigned_group_id: "grp-1",
    assigned_group_title: "Real-time Bus Tracking",
  },
  {
    id: "idea-105",
    public_id: "TN-2026-00148",
    title: "Trichy Chathiram bus stand timetable and live tracking",
    description: "College students wait 45 mins without knowing if bus broke down.",
    district: "Tiruchirappalli",
    status: "APPROVED",
    category_id: "transport",
    category_name: "Transport",
    category_color: "#F59E0B",
    submitter_email: "kavitha.trichy@gmail.com",
    created_at: "2026-08-20T11:10:00Z",
    assigned_group_id: "grp-1",
    assigned_group_title: "Real-time Bus Tracking",
  },
  {
    id: "idea-106",
    public_id: "TN-2026-00159",
    title: "Night bus schedule and emergency SOS for solo commuters",
    description: "Late night buses from Tambaram to Chengalpattu have erratic timings.",
    district: "Chengalpattu",
    status: "SUBMITTED",
    category_id: "transport",
    category_name: "Transport",
    category_color: "#F59E0B",
    submitter_email: "divya.n@gmail.com",
    created_at: "2026-08-21T21:40:00Z",
    assigned_group_id: null,
    assigned_group_title: null,
  },
  {
    id: "idea-107",
    public_id: "TN-2026-00171",
    title: "Suburban train & MTC bus single QR ticket integration",
    description: "Commuters in Chennai need to buy separate tickets for train and bus daily.",
    district: "Chennai",
    status: "APPROVED",
    category_id: "transport",
    category_name: "Transport",
    category_color: "#F59E0B",
    submitter_email: "karthik.r@techcorp.in",
    created_at: "2026-08-22T08:30:00Z",
    assigned_group_id: null,
    assigned_group_title: null,
  },

  // Healthcare ideas
  {
    id: "idea-201",
    public_id: "TN-2026-00491",
    title: "PHC medicine stock availability on mobile portal",
    description: "Rural families travel 15 km to Salem rural PHC only to find diabetes drugs are out of stock.",
    district: "Salem",
    status: "APPROVED",
    category_id: "healthcare",
    category_name: "Healthcare",
    category_color: "#EF4444",
    submitter_email: "murugan.farmer@gmail.com",
    created_at: "2026-08-19T07:45:00Z",
    assigned_group_id: "grp-2",
    assigned_group_title: "PHC Essential Medicine Stock & Doctor Availability",
  },
  {
    id: "idea-202",
    public_id: "TN-2026-00498",
    title: "Doctor duty roster & specialist visiting hours in Tirunelveli PHCs",
    description: "Pregnant women visit PHC when gynaecologist is away on camp duties.",
    district: "Tirunelveli",
    status: "PUBLIC",
    category_id: "healthcare",
    category_name: "Healthcare",
    category_color: "#EF4444",
    submitter_email: "selvi.nellai@gmail.com",
    created_at: "2026-08-20T13:20:00Z",
    assigned_group_id: "grp-2",
    assigned_group_title: "PHC Essential Medicine Stock & Doctor Availability",
  },
  {
    id: "idea-203",
    public_id: "TN-2026-00507",
    title: "Dindigul primary health sub-centre paracetamol and insulin live stock check",
    description: "Daily wage earners lose day's wages when PHC medicine window is closed.",
    district: "Dindigul",
    status: "APPROVED",
    category_id: "healthcare",
    category_name: "Healthcare",
    category_color: "#EF4444",
    submitter_email: "mani.dindigul@gmail.com",
    created_at: "2026-08-21T09:15:00Z",
    assigned_group_id: "grp-2",
    assigned_group_title: "PHC Essential Medicine Stock & Doctor Availability",
  },
  {
    id: "idea-204",
    public_id: "TN-2026-00519",
    title: "Government GH token queue tracking via SMS",
    description: "Avoid standing in 4-hour queues at Kilpauk Medical College hospital.",
    district: "Chennai",
    status: "SUBMITTED",
    category_id: "healthcare",
    category_name: "Healthcare",
    category_color: "#EF4444",
    submitter_email: "arun.kumar@gmail.com",
    created_at: "2026-08-22T15:00:00Z",
    assigned_group_id: null,
    assigned_group_title: null,
  },

  // Education ideas
  {
    id: "idea-301",
    public_id: "TN-2026-00620",
    title: "Unified TN scholarship discovery engine for 1st-generation students",
    description: "Students miss out on post-matric scholarships because notifications are scattered across 8 separate department websites.",
    district: "Madurai",
    status: "APPROVED",
    category_id: "education",
    category_name: "Education",
    category_color: "#3B82F6",
    submitter_email: "balaji.student@annauniv.edu",
    created_at: "2026-08-20T10:00:00Z",
    assigned_group_id: "grp-3",
    assigned_group_title: "Student Scholarship & Government Benefit Discovery",
  },
  {
    id: "idea-302",
    public_id: "TN-2026-00632",
    title: "Simple Tamil eligibility quiz for college fee waivers and stipends",
    description: "First generation college learners in Tiruvannamalai struggle with complex English scholarship forms.",
    district: "Tiruvannamalai",
    status: "PUBLIC",
    category_id: "education",
    category_name: "Education",
    category_color: "#3B82F6",
    submitter_email: "kamal.tvm@gmail.com",
    created_at: "2026-08-21T11:45:00Z",
    assigned_group_id: "grp-3",
    assigned_group_title: "Student Scholarship & Government Benefit Discovery",
  },
  {
    id: "idea-303",
    public_id: "TN-2026-00645",
    title: "Vocational mentorship and skill training directory for rural graduates",
    description: "Polytechnic students in Thanjavur need direct links to nearby industrial apprenticeships.",
    district: "Thanjavur",
    status: "SUBMITTED",
    category_id: "education",
    category_name: "Education",
    category_color: "#3B82F6",
    submitter_email: "vignesh.poly@gmail.com",
    created_at: "2026-08-22T14:30:00Z",
    assigned_group_id: null,
    assigned_group_title: null,
  },

  // Agriculture ideas
  {
    id: "idea-401",
    public_id: "TN-2026-00342",
    title: "Real-time Uzhavar Sandhai daily mandi pricing for paddy and vegetables",
    description: "Delta region farmers in Thanjavur face opaque middleman pricing and lack real-time price info at nearby markets.",
    district: "Thanjavur",
    status: "APPROVED",
    category_id: "agriculture",
    category_name: "Agriculture",
    category_color: "#22C55E",
    submitter_email: "veera.farmer@delta.org",
    created_at: "2026-08-19T06:30:00Z",
    assigned_group_id: "grp-5",
    assigned_group_title: "Uzhavar Sandhai Daily Crop Pricing & Direct Buyer Portal",
  },
  {
    id: "idea-402",
    public_id: "TN-2026-00355",
    title: "Tiruvarur direct farm-gate bulk sale connect for organic farmers",
    description: "Farmer producer groups want to sell vegetables directly to Chennai apartment associations.",
    district: "Tiruvarur",
    status: "PUBLIC",
    category_id: "agriculture",
    category_name: "Agriculture",
    category_color: "#22C55E",
    submitter_email: "senthamil.organic@gmail.com",
    created_at: "2026-08-20T08:00:00Z",
    assigned_group_id: "grp-5",
    assigned_group_title: "Uzhavar Sandhai Daily Crop Pricing & Direct Buyer Portal",
  },
  {
    id: "idea-403",
    public_id: "TN-2026-00368",
    title: "Cold storage booking and vacancy dashboard across TN district godowns",
    description: "Tomato growers in Krishnagiri incur huge loss during harvest season due to lack of cold storage booking.",
    district: "Krishnagiri",
    status: "APPROVED",
    category_id: "agriculture",
    category_name: "Agriculture",
    category_color: "#22C55E",
    submitter_email: "krishnagiri.agri@gmail.com",
    created_at: "2026-08-21T17:15:00Z",
    assigned_group_id: null,
    assigned_group_title: null,
  },

  // Emergency & Safety ideas
  {
    id: "idea-501",
    public_id: "TN-2026-00788",
    title: "1-tap verified rare blood donor and ambulance dispatch network",
    description: "During highway accidents in Madurai, locating rare blood groups (O-negative) and nearest ambulance takes critical minutes.",
    district: "Madurai",
    status: "APPROVED",
    category_id: "safety",
    category_name: "Safety",
    category_color: "#EF4444",
    submitter_email: "dr.suresh@redcross-tn.org",
    created_at: "2026-08-18T18:00:00Z",
    assigned_group_id: "grp-4",
    assigned_group_title: "Instant Emergency Ambulance & Blood Donor Dispatch",
  },
  {
    id: "idea-502",
    public_id: "TN-2026-00799",
    title: "Highway emergency response volunteer mesh network for NH45 & NH44",
    description: "Fast notification of certified first responders along major national highway stretches.",
    district: "Kanchipuram",
    status: "PUBLIC",
    category_id: "safety",
    category_name: "Safety",
    category_color: "#EF4444",
    submitter_email: "firstresponder.kanchi@gmail.com",
    created_at: "2026-08-19T22:10:00Z",
    assigned_group_id: "grp-4",
    assigned_group_title: "Instant Emergency Ambulance & Blood Donor Dispatch",
  },

  // Civic / Municipal ideas
  {
    id: "idea-601",
    public_id: "TN-2026-00812",
    title: "Ward pothole and non-functional street light photo complaint tracker",
    description: "Corporation complaint numbers close tickets without fixing roads. Need geotagged photo proof on repair.",
    district: "Chennai",
    status: "APPROVED",
    category_id: "cities",
    category_name: "Cities & Communities",
    category_color: "#64748B",
    submitter_email: "resident.anna_nagar@gmail.com",
    created_at: "2026-08-20T12:00:00Z",
    assigned_group_id: "grp-6",
    assigned_group_title: "Ward Pothole & Streetlight Municipal Repair Tracker",
  },
  {
    id: "idea-602",
    public_id: "TN-2026-00825",
    title: "Coimbatore municipal ward garbage clearance live vehicle tracking",
    description: "Sanitation trucks skip streets randomly. Public tracking ensures regular waste collection.",
    district: "Coimbatore",
    status: "PUBLIC",
    category_id: "cities",
    category_name: "Cities & Communities",
    category_color: "#64748B",
    submitter_email: "swachh.cbe@gmail.com",
    created_at: "2026-08-21T07:30:00Z",
    assigned_group_id: "grp-6",
    assigned_group_title: "Ward Pothole & Streetlight Municipal Repair Tracker",
  },
];

// Initial Manual Groups
export const INITIAL_MANUAL_GROUPS: ManualGroup[] = [
  {
    id: "grp-1",
    title: "Real-time Bus Tracking",
    description: "People across Tamil Nadu wait at bus stops with zero visibility on government bus arrival times, delay notices, or bus crowding levels.",
    category_id: "transport",
    category_name: "Transport",
    category_color: "#F59E0B",
    category_bg: "#FFFBEB",
    status: "SHORTLISTED",
    product_concept: "01 — Smart Bus TN 🚌",
    tagline: "Know where your bus is, when it will arrive, and how crowded it is.",
    emoji: "🚌",
    created_at: "2026-08-18T10:00:00Z",
    updated_at: "2026-08-26T15:00:00Z",
    member_idea_ids: ["idea-101", "idea-102", "idea-103", "idea-104", "idea-105"],
    submissions_count: 5,
    districts_count: 5,
    top_districts: ["Chennai", "Madurai", "Coimbatore", "Salem", "Tiruchirappalli"],
  },
  {
    id: "grp-2",
    title: "PHC Essential Medicine Stock & Doctor Availability",
    description: "Rural families travel long distances to local PHCs only to discover essential medicines are out of stock or specialists are unavailable.",
    category_id: "healthcare",
    category_name: "Healthcare",
    category_color: "#EF4444",
    category_bg: "#FEF2F2",
    status: "SHORTLISTED",
    product_concept: "02 — HealthAccess TN 🏥",
    tagline: "Find nearby hospitals, available services, medicine stocks, and doctor info in one place.",
    emoji: "🏥",
    created_at: "2026-08-19T07:00:00Z",
    updated_at: "2026-08-26T15:00:00Z",
    member_idea_ids: ["idea-201", "idea-202", "idea-203"],
    submissions_count: 3,
    districts_count: 3,
    top_districts: ["Salem", "Tirunelveli", "Dindigul"],
  },
  {
    id: "grp-3",
    title: "Student Scholarship & Government Benefit Discovery",
    description: "Eligible first-generation college students miss out on state and central scholarships due to fragmented portals and language barriers.",
    category_id: "education",
    category_name: "Education",
    category_color: "#3B82F6",
    category_bg: "#EFF6FF",
    status: "SHORTLISTED",
    product_concept: "03 — Scholarship Finder 🎓",
    tagline: "Find scholarships and government education benefits you're eligible for.",
    emoji: "🎓",
    created_at: "2026-08-20T09:30:00Z",
    updated_at: "2026-08-26T15:00:00Z",
    member_idea_ids: ["idea-301", "idea-302"],
    submissions_count: 2,
    districts_count: 2,
    top_districts: ["Madurai", "Tiruvannamalai"],
  },
  {
    id: "grp-4",
    title: "Instant Emergency Ambulance & Blood Donor Dispatch",
    description: "Finding verified local ambulances, immediate rare blood donors, and nearest hospital trauma teams during critical accidents takes too long.",
    category_id: "safety",
    category_name: "Emergency & Safety",
    category_color: "#0891B2",
    category_bg: "#ECFEFF",
    status: "SHORTLISTED",
    product_concept: "04 — Emergency Connect 🚨",
    tagline: "One place to find and quickly connect with emergency services, blood banks, and nearby help.",
    emoji: "🚨",
    created_at: "2026-08-18T17:30:00Z",
    updated_at: "2026-08-26T15:00:00Z",
    member_idea_ids: ["idea-501", "idea-502"],
    submissions_count: 2,
    districts_count: 2,
    top_districts: ["Madurai", "Kanchipuram"],
  },
  {
    id: "grp-5",
    title: "Uzhavar Sandhai Daily Crop Pricing & Direct Buyer Portal",
    description: "Smallholder farmers lack real-time market price visibility across nearby Uzhavar Sandhais and face middleman exploitation.",
    category_id: "agriculture",
    category_name: "Agriculture",
    category_color: "#16A34A",
    category_bg: "#F0FDF4",
    status: "SHORTLISTED",
    product_concept: "05 — Uzhavar Direct 🌾",
    tagline: "Real-time Uzhavar Sandhai market rates, cold storage booking, and direct buyer connections.",
    emoji: "🌾",
    created_at: "2026-08-19T06:00:00Z",
    updated_at: "2026-08-26T15:00:00Z",
    member_idea_ids: ["idea-401", "idea-402"],
    submissions_count: 2,
    districts_count: 2,
    top_districts: ["Thanjavur", "Tiruvarur"],
  },
  {
    id: "grp-6",
    title: "Ward Pothole & Streetlight Municipal Repair Tracker",
    description: "Street infrastructure and sanitation complaints have no public tracking ID or photo verification upon resolution.",
    category_id: "cities",
    category_name: "Cities & Communities",
    category_color: "#8B5CF6",
    category_bg: "#F5F3FF",
    status: "READY",
    product_concept: "WardFix TN 🛠️",
    tagline: "Citizen photo-verified ward civic complaints and municipal action tracker.",
    emoji: "🛠️",
    created_at: "2026-08-20T11:00:00Z",
    updated_at: "2026-08-26T15:00:00Z",
    member_idea_ids: ["idea-601", "idea-602"],
    submissions_count: 2,
    districts_count: 2,
    top_districts: ["Chennai", "Coimbatore"],
  },
  {
    id: "grp-7",
    title: "Fishermen Weather Alert & Coastal Safety VHF Relay",
    description: "Deep sea artisanal fishermen lose cellular reception and miss localized high wind or rough sea alerts.",
    category_id: "safety",
    category_name: "Emergency & Safety",
    category_color: "#0284C7",
    category_bg: "#F0F9FF",
    status: "DRAFT",
    product_concept: "Kadal Guard TN ⚓",
    tagline: "Offshore weather relay and safety alerts for artisanal fishermen.",
    emoji: "⚓",
    created_at: "2026-08-21T14:00:00Z",
    updated_at: "2026-08-26T15:00:00Z",
    member_idea_ids: [],
    submissions_count: 0,
    districts_count: 0,
    top_districts: [],
  },
];

// Global in-memory stores for runtime lifecycle
let groupsStore: ManualGroup[] = JSON.parse(JSON.stringify(INITIAL_MANUAL_GROUPS));
let ideasStore: GroupableIdea[] = JSON.parse(JSON.stringify(INITIAL_CITIZEN_IDEAS));

export function getStoredGroups(): ManualGroup[] {
  return groupsStore;
}

export function getStoredGroupById(id: string): ManualGroup | undefined {
  return groupsStore.find((g) => g.id === id);
}

export function getStoredIdeas(): GroupableIdea[] {
  return ideasStore;
}

export function createStoredGroup(payload: {
  title: string;
  description: string;
  category_id?: string;
  status?: GroupStatus;
  product_concept?: string;
  tagline?: string;
  emoji?: string;
  initial_idea_ids?: string[];
}): ManualGroup {
  const cat = getCategoryById(payload.category_id || "general") || CATEGORIES[0];
  const newId = `grp-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const now = new Date().toISOString();

  const memberIds = payload.initial_idea_ids || [];

  // Recalculate districts and counts from member ideas
  const memberIdeas = ideasStore.filter((i) => memberIds.includes(i.id));
  const uniqueDistricts = Array.from(new Set(memberIdeas.map((i) => i.district).filter(Boolean)));

  const newGroup: ManualGroup = {
    id: newId,
    title: payload.title.trim(),
    description: payload.description.trim(),
    category_id: payload.category_id || "general",
    category_name: cat.name,
    category_color: cat.color,
    category_bg: cat.bgColor,
    status: payload.status || "DRAFT",
    product_concept: payload.product_concept || payload.title,
    tagline: payload.tagline || "",
    emoji: payload.emoji || "💡",
    created_at: now,
    updated_at: now,
    member_idea_ids: memberIds,
    submissions_count: memberIds.length > 0 ? memberIds.length : 0,
    districts_count: uniqueDistricts.length,
    top_districts: uniqueDistricts.slice(0, 5),
  };

  groupsStore.unshift(newGroup);

  // Assign ideas to this new group (and detach from any previous group)
  if (memberIds.length > 0) {
    ideasStore = ideasStore.map((idea) => {
      if (memberIds.includes(idea.id)) {
        // If it was in another group, remove it from that group's member_idea_ids
        if (idea.assigned_group_id && idea.assigned_group_id !== newId) {
          const oldGrp = groupsStore.find((g) => g.id === idea.assigned_group_id);
          if (oldGrp) {
            oldGrp.member_idea_ids = oldGrp.member_idea_ids.filter((mid) => mid !== idea.id);
            syncGroupCounts(oldGrp);
          }
        }
        return {
          ...idea,
          assigned_group_id: newId,
          assigned_group_title: newGroup.title,
        };
      }
      return idea;
    });
  }

  return newGroup;
}

export function updateStoredGroup(
  id: string,
  updates: Partial<ManualGroup>
): ManualGroup | null {
  const grp = groupsStore.find((g) => g.id === id);
  if (!grp) return null;

  if (updates.title !== undefined) grp.title = updates.title.trim();
  if (updates.description !== undefined) grp.description = updates.description.trim();
  if (updates.category_id !== undefined) {
    const cat = getCategoryById(updates.category_id);
    if (cat) {
      grp.category_id = cat.id;
      grp.category_name = cat.name;
      grp.category_color = cat.color;
      grp.category_bg = cat.bgColor;
    }
  }
  if (updates.status !== undefined) grp.status = updates.status;
  if (updates.product_concept !== undefined) grp.product_concept = updates.product_concept;
  if (updates.tagline !== undefined) grp.tagline = updates.tagline;
  if (updates.emoji !== undefined) grp.emoji = updates.emoji;
  if (updates.submissions_count !== undefined) grp.submissions_count = updates.submissions_count;

  grp.updated_at = new Date().toISOString();

  // If title changed, update assigned_group_title for member ideas
  if (updates.title) {
    ideasStore = ideasStore.map((idea) =>
      idea.assigned_group_id === id
        ? { ...idea, assigned_group_title: grp.title }
        : idea
    );
  }

  return grp;
}

export function deleteStoredGroup(id: string): boolean {
  const index = groupsStore.findIndex((g) => g.id === id);
  if (index === -1) return false;

  groupsStore.splice(index, 1);

  // Unassign all ideas from this group
  ideasStore = ideasStore.map((idea) =>
    idea.assigned_group_id === id
      ? { ...idea, assigned_group_id: null, assigned_group_title: null }
      : idea
  );

  return true;
}

export function addIdeasToStoredGroup(
  groupId: string,
  ideaIds: string[]
): { group: ManualGroup; addedCount: number } | null {
  const grp = groupsStore.find((g) => g.id === groupId);
  if (!grp) return null;

  let addedCount = 0;

  ideaIds.forEach((ideaId) => {
    // Check if not already in this group
    if (!grp.member_idea_ids.includes(ideaId)) {
      grp.member_idea_ids.push(ideaId);
      addedCount++;
    }

    // Update the idea in ideasStore & unassign from prior group if any
    ideasStore = ideasStore.map((idea) => {
      if (idea.id === ideaId || idea.public_id === ideaId) {
        if (idea.assigned_group_id && idea.assigned_group_id !== groupId) {
          const oldGrp = groupsStore.find((g) => g.id === idea.assigned_group_id);
          if (oldGrp) {
            oldGrp.member_idea_ids = oldGrp.member_idea_ids.filter((mid) => mid !== idea.id);
            syncGroupCounts(oldGrp);
          }
        }
        return {
          ...idea,
          assigned_group_id: groupId,
          assigned_group_title: grp.title,
        };
      }
      return idea;
    });
  });

  syncGroupCounts(grp);
  grp.updated_at = new Date().toISOString();

  return { group: grp, addedCount };
}

export function removeIdeasFromStoredGroup(
  groupId: string,
  ideaIds: string[]
): { group: ManualGroup; removedCount: number } | null {
  const grp = groupsStore.find((g) => g.id === groupId);
  if (!grp) return null;

  const prevLen = grp.member_idea_ids.length;
  grp.member_idea_ids = grp.member_idea_ids.filter((id) => !ideaIds.includes(id));
  const removedCount = prevLen - grp.member_idea_ids.length;

  // Unassign in ideasStore
  ideasStore = ideasStore.map((idea) => {
    if (ideaIds.includes(idea.id) && idea.assigned_group_id === groupId) {
      return {
        ...idea,
        assigned_group_id: null,
        assigned_group_title: null,
      };
    }
    return idea;
  });

  syncGroupCounts(grp);
  grp.updated_at = new Date().toISOString();

  return { group: grp, removedCount };
}

function syncGroupCounts(grp: ManualGroup) {
  const memberIdeas = ideasStore.filter((i) => grp.member_idea_ids.includes(i.id));
  const uniqueDistricts = Array.from(new Set(memberIdeas.map((i) => i.district).filter(Boolean)));

  grp.submissions_count = grp.member_idea_ids.length;
  grp.districts_count = uniqueDistricts.length;
  grp.top_districts = uniqueDistricts.slice(0, 5);
}

export function updateStoredIdea(id: string, updates: Partial<GroupableIdea>): GroupableIdea | null {
  const idx = ideasStore.findIndex((i) => i.id === id || i.public_id === id);
  if (idx === -1) return null;

  ideasStore[idx] = {
    ...ideasStore[idx],
    ...updates,
  };
  return ideasStore[idx];
}

export function deleteStoredIdea(id: string): boolean {
  const initialLength = ideasStore.length;
  ideasStore = ideasStore.filter((i) => i.id !== id && i.public_id !== id);

  // Remove from any groups that contain it
  groupsStore.forEach((grp) => {
    if (grp.member_idea_ids.includes(id)) {
      grp.member_idea_ids = grp.member_idea_ids.filter((memberId) => memberId !== id);
      syncGroupCounts(grp);
      grp.updated_at = new Date().toISOString();
    }
  });

  return ideasStore.length < initialLength;
}

export function addStoredIdea(payload: Partial<GroupableIdea>): GroupableIdea {
  const newId = payload.id || `idea-${Date.now()}`;
  const publicId = payload.public_id || `TN-2026-${Math.floor(10000 + Math.random() * 90000)}`;
  const cat = getCategoryById(payload.category_id || "general") || CATEGORIES[0];

  const newIdea: GroupableIdea = {
    id: newId,
    public_id: publicId,
    title: payload.title || "Citizen submission",
    description: payload.description || "",
    district: payload.district || "Tamil Nadu",
    status: payload.status || "SUBMITTED",
    category_id: payload.category_id || cat.id,
    category_name: cat.name,
    category_color: cat.color,
    submitter_email: payload.submitter_email || "",
    created_at: payload.created_at || new Date().toISOString(),
    assigned_group_id: payload.assigned_group_id || null,
    assigned_group_title: payload.assigned_group_title || null,
  };

  ideasStore.unshift(newIdea);
  return newIdea;
}

export function getPublicStoredIdeas(): GroupableIdea[] {
  return ideasStore.filter(
    (i) =>
      i.status === "PUBLIC" ||
      i.status === "APPROVED" ||
      i.status === "SHORTLISTED"
  );
}


