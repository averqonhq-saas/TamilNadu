export type InquiryType = "CONTACT" | "PARTNER";
export type InquiryStatus = "NEW" | "IN_REVIEW" | "RESPONDED" | "ARCHIVED";

export interface Inquiry {
  id: string;
  type: InquiryType;
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  role?: string;
  subject?: string;
  message: string;
  district?: string;
  status: InquiryStatus;
  admin_notes?: string;
  created_at: string;
  responded_at?: string;
}

let inquiriesStore: Inquiry[] = [
  {
    id: "PRT-2026-8812",
    type: "PARTNER",
    name: "Dr. K. Swaminathan",
    email: "k.swaminathan@annauniv.edu",
    phone: "+91 94441 82910",
    organization: "Anna University (Dept of Urban Informatics)",
    role: "Professor & Lab Director",
    subject: "Co-development & Open Transit Data Integration for Smart Bus Tracker",
    message:
      "We have existing GIS bus route mappings for Chennai MTC and Madurai TNSTC corridors. Our research lab would love to collaborate as an academic partner to supply real-time GTFS transit feeds and student developer mentorship for the winning transit project.",
    district: "Chennai",
    status: "NEW",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hrs ago
  },
  {
    id: "INQ-2026-4421",
    type: "CONTACT",
    name: "Ananya Murali",
    email: "ananya.murali98@gmail.com",
    phone: "+91 98842 10293",
    subject: "District Workshop in Coimbatore",
    message:
      "Vanakkam team! We run a civic tech meetup group in Gandhipuram, Coimbatore. Are you hosting in-person idea collection workshops or hackathons for students here in Kongu region?",
    district: "Coimbatore",
    status: "NEW",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hrs ago
  },
  {
    id: "PRT-2026-7204",
    type: "PARTNER",
    name: "Sundar Rajan",
    email: "sundar@tamilagri.org",
    phone: "+91 97902 44331",
    organization: "Cauvery Delta Farmers Association",
    role: "Secretary",
    subject: "Mandi Price Transparency Pilot in Thanjavur & Tiruvarur",
    message:
      "Our farmers across 14 taluks would benefit immensely from the Agri Price Tracker. We are eager to facilitate field usability testing with rural paddy and banana farmers.",
    district: "Thanjavur",
    status: "IN_REVIEW",
    admin_notes: "Followed up via call. Scheduled pilot scoping for next Tuesday.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // 1 day ago
  },
  {
    id: "INQ-2026-3190",
    type: "CONTACT",
    name: "M. Karthikeyan",
    email: "karthik.mdu@outlook.com",
    subject: "Tamil Speech Input on Mobile Safari",
    message:
      "I tested the spoken Tamil audio recording feature on my iPhone in Madurai. It worked smoothly and transcribed my voice accurately into Tamil text. Kudos to the engineering team!",
    district: "Madurai",
    status: "RESPONDED",
    admin_notes: "Thanked user and shared community link.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    responded_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

export function getStoredInquiries(): Inquiry[] {
  return [...inquiriesStore];
}

export function addInquiry(inquiryData: Omit<Inquiry, "id" | "created_at" | "status">): Inquiry {
  const prefix = inquiryData.type === "PARTNER" ? "PRT" : "INQ";
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const newInquiry: Inquiry = {
    ...inquiryData,
    id: `${prefix}-2026-${randomSuffix}`,
    status: "NEW",
    created_at: new Date().toISOString(),
  };

  inquiriesStore = [newInquiry, ...inquiriesStore];
  return newInquiry;
}

export function updateInquiry(id: string, updates: Partial<Inquiry>): Inquiry | null {
  const index = inquiriesStore.findIndex((inq) => inq.id === id);
  if (index === -1) return null;

  inquiriesStore[index] = {
    ...inquiriesStore[index],
    ...updates,
  };

  return inquiriesStore[index];
}

export function deleteInquiry(id: string): boolean {
  const initialLength = inquiriesStore.length;
  inquiriesStore = inquiriesStore.filter((inq) => inq.id !== id);
  return inquiriesStore.length < initialLength;
}
