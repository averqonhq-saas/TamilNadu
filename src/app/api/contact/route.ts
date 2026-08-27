import { NextRequest, NextResponse } from "next/server";
import { addInquiry } from "@/lib/data/inquiries";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message, district } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
    }

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    if (!message || message.trim().length < 5) {
      return NextResponse.json({ error: "Message must be at least 5 characters long." }, { status: 400 });
    }

    const newInquiry = addInquiry({
      type: "CONTACT",
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || undefined,
      subject: subject?.trim() || "General Inquiry",
      message: message.trim(),
      district: district?.trim() || undefined,
    });

    if (isSupabaseConfigured()) {
      try {
        const supabase = createServiceClient();
        await supabase.from("inquiries").insert({
          id: newInquiry.id,
          type: "CONTACT",
          name: newInquiry.name,
          email: newInquiry.email,
          phone: newInquiry.phone,
          subject: newInquiry.subject,
          message: newInquiry.message,
          district: newInquiry.district,
          status: "NEW",
        });
      } catch (dbErr) {
        console.warn("DB contact insert fallback:", dbErr);
      }
    }

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
