import { NextRequest, NextResponse } from "next/server";
import { updateInquiry, deleteInquiry } from "@/lib/data/inquiries";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, admin_notes } = body;

    const updates: any = {};
    if (status) updates.status = status;
    if (admin_notes !== undefined) updates.admin_notes = admin_notes;
    if (status === "RESPONDED") updates.responded_at = new Date().toISOString();

    const updated = updateInquiry(id, updates);

    if (isSupabaseConfigured()) {
      try {
        const supabase = createServiceClient();
        await supabase.from("inquiries").update(updates).eq("id", id);
      } catch (dbErr) {
        console.warn("DB update inquiry fallback:", dbErr);
      }
    }

    if (!updated) {
      return NextResponse.json({ error: "Inquiry not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      inquiry: updated,
    });
  } catch (error: any) {
    console.error("Inquiry PATCH error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update inquiry." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = deleteInquiry(id);

    if (isSupabaseConfigured()) {
      try {
        const supabase = createServiceClient();
        await supabase.from("inquiries").delete().eq("id", id);
      } catch (dbErr) {
        console.warn("DB delete inquiry fallback:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Inquiry ${id} deleted.`,
    });
  } catch (error: any) {
    console.error("Inquiry DELETE error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete inquiry." },
      { status: 500 }
    );
  }
}
