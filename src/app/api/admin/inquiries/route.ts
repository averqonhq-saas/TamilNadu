import { NextRequest, NextResponse } from "next/server";
import { getStoredInquiries, InquiryStatus, InquiryType } from "@/lib/data/inquiries";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { verifyAdminSession } from "@/lib/auth/admin-auth";

export async function GET(req: NextRequest) {
  const auth = await verifyAdminSession(req, "ADMIN");
  if (!auth.authorized) return auth.response;

  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") as InquiryType | null;
    const status = searchParams.get("status") as InquiryStatus | null;
    const search = searchParams.get("search")?.toLowerCase().trim();

    let list = getStoredInquiries();

    if (isSupabaseConfigured()) {
      try {
        const supabase = createServiceClient();
        let query = supabase.from("inquiries").select("*").order("created_at", { ascending: false });
        if (type) query = query.eq("type", type);
        if (status) query = query.eq("status", status);

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          list = data;
        }
      } catch (dbErr) {
        console.warn("DB inquiries fetch fallback:", dbErr);
      }
    }

    if (type) {
      list = list.filter((i) => i.type === type);
    }

    if (status) {
      list = list.filter((i) => i.status === status);
    }

    if (search) {
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(search) ||
          i.email.toLowerCase().includes(search) ||
          i.organization?.toLowerCase().includes(search) ||
          i.subject?.toLowerCase().includes(search) ||
          i.message.toLowerCase().includes(search) ||
          i.id.toLowerCase().includes(search)
      );
    }

    const counts = {
      total: list.length,
      contact: list.filter((i) => i.type === "CONTACT").length,
      partner: list.filter((i) => i.type === "PARTNER").length,
      new: list.filter((i) => i.status === "NEW").length,
      in_review: list.filter((i) => i.status === "IN_REVIEW").length,
      responded: list.filter((i) => i.status === "RESPONDED").length,
    };

    return NextResponse.json({
      inquiries: list,
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
