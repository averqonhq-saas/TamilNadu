import { CampaignStatus, DEFAULT_CAMPAIGN } from "@/lib/constants/campaign";

export interface CampaignState {
  name: string;
  tagline: string;
  status: CampaignStatus;
  collection_start: string;
  collection_end: string;
  voting_start: string;
  voting_end: string;
  allow_results_before_close: boolean;
  updated_at: string;
}

let campaignStore: CampaignState = {
  name: DEFAULT_CAMPAIGN.name,
  tagline: DEFAULT_CAMPAIGN.tagline,
  status: (process.env.NEXT_PUBLIC_CAMPAIGN_STATUS as CampaignStatus) || "COLLECTING",
  collection_start: DEFAULT_CAMPAIGN.collection_start.toISOString(),
  collection_end: DEFAULT_CAMPAIGN.collection_end.toISOString(),
  voting_start: DEFAULT_CAMPAIGN.voting_start.toISOString(),
  voting_end: DEFAULT_CAMPAIGN.voting_end.toISOString(),
  allow_results_before_close: DEFAULT_CAMPAIGN.allow_results_before_close,
  updated_at: new Date().toISOString(),
};

export function getCampaignState(): CampaignState {
  return { ...campaignStore };
}

export function updateCampaignState(updates: Partial<CampaignState>): CampaignState {
  campaignStore = {
    ...campaignStore,
    ...updates,
    updated_at: new Date().toISOString(),
  };
  return { ...campaignStore };
}
