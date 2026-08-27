import { NextRequest, NextResponse } from "next/server";
import { addInquiry } from "@/lib/data/inquiries";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { organization, name, email, role, phone, message, district, track } = body;

    if (!organization || !organization.trim()) {
      return NextResponse.json({ error: "Please provide your organization or department name." }, { status: 400 });
    }

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Please provide the primary contact person's name." }, { status: 400 });
    }

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Please provide a valid official email address." }, { status: 400 });
    }

    if (!message || message.trim().length < 5) {
      return NextResponse.json({ error: "Please describe your partnership interest or proposal." }, { status: 400 });
    }

    const newInquiry = addInquiry({
      type: "PARTNER",
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || undefined,
      organization: organization.trim(),
      role: role?.trim() || "Representative",
      subject: track ? `Partnership Track: ${track}` : `Partnership Proposal from ${organization.trim()}`,
      message: message.trim(),
      district: district?.trim() || undefined,
    });

    if (isSupabaseConfigured()) {
      try {
        const supabase = createServiceClient();
        await supabase.from("inquiries").insert({
          id: newInquiry.id,
          type: "PARTNER",
          name: newInquiry.name,
          email: newInquiry.email,
          phone: newInquiry.phone,
          organization: newInquiry.organization,
          role: newInquiry.role,
          subject: newInquiry.subject,
          message: newInquiry.message,
          district: newInquiry.district,
          status: "NEW",
        });
      } catch (dbErr) {
        console.warn("DB partner insert fallback:", dbErr);
      }
    }

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
