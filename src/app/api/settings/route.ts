import { NextResponse } from "next/server";
import { getPlatformSettings } from "@/lib/data/settings";

export async function GET() {
  try {
    const settings = getPlatformSettings();
    return NextResponse.json({
      siteName: settings.siteName,
      supportEmail: settings.supportEmail,
      enableVoiceInput: settings.enableVoiceInput,
      requireEmailOtp: settings.requireEmailOtp,
      maintenanceMode: settings.maintenanceMode,
    });
  } catch (error) {
    console.error("Public settings GET error:", error);
    return NextResponse.json({
      siteName: "Build Tamil Nadu",
      supportEmail: "vanakkam@buildtamilnadu.in",
      enableVoiceInput: true,
      requireEmailOtp: false,
      maintenanceMode: false,
    });
  }
}
