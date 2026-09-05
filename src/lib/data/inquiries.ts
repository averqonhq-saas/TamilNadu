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

let inquiriesStore: Inquiry[] = [];

export function getStoredInquiries(): Inquiry[] {
  return [...inquiriesStore];
}

export function addInquiry(
  inquiryData: Omit<Inquiry, "id" | "created_at" | "status">,
  customId?: string
): Inquiry {
  const newInquiry: Inquiry = {
    ...inquiryData,
    id: customId || crypto.randomUUID(),
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
