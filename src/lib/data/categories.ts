export interface AdminCategory {
  id: string;
  name: string;
  nameTamil: string;
  slug: string;
  icon: string;
  color: string;
  count: number;
  percentage: number;
  topProblem: string;
  description?: string;
  created_at: string;
}

export const INITIAL_CATEGORIES_DATA: AdminCategory[] = [
  {
    id: "cat-1",
    name: "Transport & Mobility",
    nameTamil: "போக்குவரத்து & பயணம்",
    slug: "transport",
    icon: "🚌",
    color: "#F59E0B",
    count: 642,
    percentage: 26,
    topProblem: "Government bus GPS delay visibility & seat crowding",
    description: "Buses, trains, traffic, routes, public mobility",
    created_at: "2026-08-15T10:00:00Z",
  },
  {
    id: "cat-2",
    name: "Healthcare & PHC",
    nameTamil: "மருத்துவம் & ஆரம்ப சுகாதாரம்",
    slug: "healthcare",
    icon: "🏥",
    color: "#EF4444",
    count: 489,
    percentage: 20,
    topProblem: "PHC essential medicine out-of-stock notices & specialist doctors",
    description: "Hospital access, medicine stocks, health centers, doctor hours",
    created_at: "2026-08-15T10:00:00Z",
  },
  {
    id: "cat-3",
    name: "Agriculture & Farmers",
    nameTamil: "விவசாயம் & சந்தை விலை",
    slug: "agriculture",
    icon: "🌾",
    color: "#16A34A",
    count: 412,
    percentage: 17,
    topProblem: "Daily Uzhavar Sandhai pricing opacity & cold storage booking",
    description: "Farmers, markets, mandi pricing, harvest logistics",
    created_at: "2026-08-15T10:00:00Z",
  },
  {
    id: "cat-4",
    name: "Education & Skills",
    nameTamil: "கல்வி & திறன் பயிற்சி",
    slug: "education",
    icon: "🎓",
    color: "#3B82F6",
    count: 378,
    percentage: 15,
    topProblem: "First-generation student scholarship eligibility discovery",
    description: "Students, scholarships, colleges, career discovery",
    created_at: "2026-08-15T10:00:00Z",
  },
  {
    id: "cat-5",
    name: "Emergency & Safety",
    nameTamil: "அவசர உதவி & பாதுகாப்பு",
    slug: "emergency",
    icon: "🚨",
    color: "#0891B2",
    count: 284,
    percentage: 11,
    topProblem: "1-tap verified ambulance dispatch and immediate local blood donor network",
    description: "Emergency care, ambulances, blood bank dispatch, disaster alerts",
    created_at: "2026-08-15T10:00:00Z",
  },
  {
    id: "cat-6",
    name: "Public Services & Civic",
    nameTamil: "நகராட்சி & மக்கள் சேவை",
    slug: "public-services",
    icon: "🏛️",
    color: "#8B5CF6",
    count: 276,
    percentage: 11,
    topProblem: "Pothole repair, drainage overflow, and ward complaint photo verification",
    description: "Civic complaints, municipal repair, drinking water, streetlights",
    created_at: "2026-08-15T10:00:00Z",
  },
  {
    id: "cat-7",
    name: "Jobs & Employment",
    nameTamil: "வேலைவாய்ப்பு & தொழில்",
    slug: "jobs",
    icon: "💼",
    color: "#EC4899",
    count: 198,
    percentage: 8,
    topProblem: "Direct local district employment listings and skill-matched apprenticeships",
    description: "Employment schemes, local hiring, MSME registration",
    created_at: "2026-08-15T10:00:00Z",
  },
  {
    id: "cat-8",
    name: "Environment & Green TN",
    nameTamil: "சுற்றுச்சூழல் & தூய்மை",
    slug: "environment",
    icon: "🌱",
    color: "#10B981",
    count: 145,
    percentage: 6,
    topProblem: "Lake encroachment reporting and ward-level plastic waste recycling",
    description: "Pollution monitoring, water body rejuvenation, urban greenery",
    created_at: "2026-08-15T10:00:00Z",
  },
];

let categoriesStore: AdminCategory[] = JSON.parse(JSON.stringify(INITIAL_CATEGORIES_DATA));

export function getStoredCategories(): AdminCategory[] {
  recalculatePercentages();
  return categoriesStore;
}

export function addStoredCategory(payload: {
  name: string;
  nameTamil?: string;
  slug?: string;
  icon?: string;
  color?: string;
  description?: string;
  topProblem?: string;
}): AdminCategory {
  const name = payload.name.trim();
  const slug =
    payload.slug?.trim().toLowerCase() ||
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const newCat: AdminCategory = {
    id: `cat-${Date.now()}`,
    name,
    nameTamil: payload.nameTamil?.trim() || name,
    slug,
    icon: payload.icon || "📁",
    color: payload.color || "#e85d26",
    count: 0,
    percentage: 0,
    topProblem: payload.topProblem?.trim() || "Civic issues submitted by residents in this sector",
    description: payload.description?.trim() || "",
    created_at: new Date().toISOString(),
  };

  categoriesStore.unshift(newCat);
  recalculatePercentages();
  return newCat;
}

export function deleteStoredCategory(id: string): boolean {
  const index = categoriesStore.findIndex((c) => c.id === id || c.slug === id);
  if (index === -1) return false;
  categoriesStore.splice(index, 1);
  recalculatePercentages();
  return true;
}

function recalculatePercentages() {
  const total = categoriesStore.reduce((acc, c) => acc + (c.count || 0), 0);
  categoriesStore.forEach((c) => {
    c.percentage = total > 0 ? Math.round((c.count / total) * 100) : 0;
  });
}
