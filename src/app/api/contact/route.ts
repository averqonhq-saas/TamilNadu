import { NextRequest, NextResponse } from "next/server";
import { addInquiry } from "@/lib/data/inquiries";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : undefined;
    const subject = typeof body.subject === "string" && body.subject.trim() ? body.subject.trim() : "General Inquiry";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const district = typeof body.district === "string" ? body.district.trim() : undefined;

    if (!name) {
      return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
    }

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    if (!message) {
      return NextResponse.json({ error: "Please enter your message." }, { status: 400 });
    }

    let dbInquiryId: string | undefined = undefined;

    if (isSupabaseConfigured()) {
      try {
        const supabase = createServiceClient();
        const { data: dbData, error: dbErr } = await supabase
          .from("inquiries")
          .insert({
            type: "CONTACT",
            name,
            email,
            phone: phone || null,
            subject,
            message,
            district: district || null,
            status: "NEW",
          })
          .select("id")
          .single();

        if (dbErr) {
          console.error("Supabase contact insert error:", dbErr);
        } else if (dbData?.id) {
          dbInquiryId = dbData.id;
        }
      } catch (dbErr) {
        console.warn("DB contact insert fallback:", dbErr);
      }
    }

    const newInquiry = addInquiry({
      type: "CONTACT",
      name,
      email,
      phone: phone || undefined,
      subject,
      message,
      district: district || undefined,
    }, dbInquiryId);

    return NextResponse.json({
      success: true,
      message: "Your message has been received! Our team will respond shortly.",
      inquiry: newInquiry,
    });
  } catch (error: any) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to send contact inquiry." },
      { status: 500 }
    );
  }
}
