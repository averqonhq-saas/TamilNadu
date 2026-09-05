import { NextRequest, NextResponse } from "next/server";
import { addInquiry } from "@/lib/data/inquiries";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const organization = typeof body.organization === "string" ? body.organization.trim() : "";
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const role = typeof body.role === "string" ? body.role.trim() : "Representative";
    const phone = typeof body.phone === "string" ? body.phone.trim() : undefined;
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const district = typeof body.district === "string" ? body.district.trim() : undefined;
    const track = typeof body.track === "string" ? body.track.trim() : "";

    if (!organization) {
      return NextResponse.json({ error: "Please provide your organization or department name." }, { status: 400 });
    }

    if (!name) {
      return NextResponse.json({ error: "Please provide the primary contact person's name." }, { status: 400 });
    }

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Please provide a valid official email address." }, { status: 400 });
    }

    if (!message) {
      return NextResponse.json({ error: "Please describe your partnership interest or proposal." }, { status: 400 });
    }

    let dbInquiryId: string | undefined = undefined;

    if (isSupabaseConfigured()) {
      try {
        const supabase = createServiceClient();
        const { data: dbData, error: dbErr } = await supabase
          .from("inquiries")
          .insert({
            type: "PARTNER",
            name,
            email,
            phone: phone || null,
            organization,
            role,
            subject: track ? `Partnership Track: ${track}` : `Partnership Proposal from ${organization}`,
            message,
            district: district || null,
            status: "NEW",
          })
          .select("id")
          .single();

        if (dbErr) {
          console.error("Supabase partner insert error:", dbErr);
        } else if (dbData?.id) {
          dbInquiryId = dbData.id;
        }
      } catch (dbErr) {
        console.warn("DB partner insert fallback:", dbErr);
      }
    }

    const newInquiry = addInquiry({
      type: "PARTNER",
      name,
      email,
      phone: phone || undefined,
      organization,
      role,
      subject: track ? `Partnership Track: ${track}` : `Partnership Proposal from ${organization}`,
      message,
      district: district || undefined,
    }, dbInquiryId);

    return NextResponse.json({
      success: true,
      message: "Partnership inquiry submitted successfully! Our leadership will reach out within 2–3 business days.",
      inquiry: newInquiry,
    });
  } catch (error: any) {
    console.error("Partner API error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to submit partnership application." },
      { status: 500 }
    );
  }
}
