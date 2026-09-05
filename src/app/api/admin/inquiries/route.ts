import { NextRequest, NextResponse } from "next/server";
import { getStoredInquiries, Inquiry, InquiryStatus, InquiryType } from "@/lib/data/inquiries";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { verifyAdminSession } from "@/lib/auth/admin-auth";

export async function GET(req: NextRequest) {
  const auth = await verifyAdminSession(req, "REVIEWER", false);
  if (!auth.authorized) return auth.response;

  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") as InquiryType | null;
    const status = searchParams.get("status") as InquiryStatus | null;
    const search = searchParams.get("search")?.toLowerCase().trim();

    let allInquiries: Inquiry[] = [];

    if (isSupabaseConfigured()) {
      try {
        const supabase = createServiceClient();
        const { data, error } = await supabase
          .from("inquiries")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data) {
          allInquiries = data as Inquiry[];
        }
      } catch (dbErr) {
        console.warn("DB inquiries fetch fallback:", dbErr);
      }
    }

    if (allInquiries.length === 0) {
      allInquiries = getStoredInquiries();
    }

    const counts = {
      total: allInquiries.length,
      contact: allInquiries.filter((i) => i.type === "CONTACT").length,
      partner: allInquiries.filter((i) => i.type === "PARTNER").length,
      new: allInquiries.filter((i) => i.status === "NEW").length,
      in_review: allInquiries.filter((i) => i.status === "IN_REVIEW").length,
      responded: allInquiries.filter((i) => i.status === "RESPONDED").length,
    };

    let filtered = [...allInquiries];

    if (type) {
      filtered = filtered.filter((i) => i.type === type);
    }

    if (status) {
      filtered = filtered.filter((i) => i.status === status);
    }

    if (search) {
      filtered = filtered.filter(
        (i) =>
          i.name?.toLowerCase().includes(search) ||
          i.email?.toLowerCase().includes(search) ||
          i.organization?.toLowerCase().includes(search) ||
          i.subject?.toLowerCase().includes(search) ||
          i.message?.toLowerCase().includes(search) ||
          i.id?.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({
      inquiries: filtered,
      counts,
    });
  } catch (error: any) {
    console.error("Admin inquiries GET error:", error);
    const list = getStoredInquiries();
    return NextResponse.json({
      inquiries: list,
      counts: {
        total: list.length,
        contact: list.filter((i) => i.type === "CONTACT").length,
        partner: list.filter((i) => i.type === "PARTNER").length,
        new: list.filter((i) => i.status === "NEW").length,
        in_review: list.filter((i) => i.status === "IN_REVIEW").length,
        responded: list.filter((i) => i.status === "RESPONDED").length,
      },
    });
  }
}
