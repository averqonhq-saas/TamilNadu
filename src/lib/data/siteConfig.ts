/**
 * lib/data/siteConfig.ts
 *
 * Fetches campaign status and site settings server-side in one call.
 * Used by the root layout / page server components so we never make
 * redundant client-side API calls for campaign status or settings.
 */

import { getCampaignStateAsync } from "@/lib/data/campaign";
import { getStoredSettings } from "@/lib/data/settings";
import type { CampaignStatus } from "@/lib/constants/campaign";

export interface SiteConfig {
  campaignStatus: CampaignStatus;
  siteName: string;
  supportEmail: string;
  enableVoiceInput: boolean;
}

export async function getSiteConfig(): Promise<SiteConfig> {
  const campaign = await getCampaignStateAsync();
  const settings = getStoredSettings();

  return {
    campaignStatus: campaign.status as CampaignStatus,
    siteName: settings.siteName ?? "Build Tamil Nadu",
    supportEmail: settings.supportEmail ?? "vanakkam@buildtamilnadu.in",
    enableVoiceInput: settings.enableVoiceInput ?? true,
  };
}
