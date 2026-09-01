import { CampaignStatus, DEFAULT_CAMPAIGN } from "@/lib/constants/campaign";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";

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

export async function getCampaignStateAsync(): Promise<CampaignState> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createServiceClient();
      const { data: campaign } = await supabase
        .from("campaigns")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (campaign) {
        campaignStore = {
          name: campaign.name || campaignStore.name,
          tagline: campaign.tagline || campaignStore.tagline,
          status: (campaign.status as CampaignStatus) || campaignStore.status,
          collection_start: campaign.collection_start
            ? new Date(campaign.collection_start).toISOString()
            : campaignStore.collection_start,
          collection_end: campaign.collection_end
            ? new Date(campaign.collection_end).toISOString()
            : campaignStore.collection_end,
          voting_start: campaign.voting_start
            ? new Date(campaign.voting_start).toISOString()
            : campaignStore.voting_start,
          voting_end: campaign.voting_end
            ? new Date(campaign.voting_end).toISOString()
            : campaignStore.voting_end,
          allow_results_before_close:
            campaign.allow_results_before_close ?? campaignStore.allow_results_before_close,
          updated_at: campaign.updated_at
            ? new Date(campaign.updated_at).toISOString()
            : new Date().toISOString(),
        };
      }
    } catch (err) {
      console.warn("getCampaignStateAsync query fallback:", err);
    }
  }

  return { ...campaignStore };
}

export async function updateCampaignStateAsync(updates: Partial<CampaignState>): Promise<CampaignState> {
  campaignStore = {
    ...campaignStore,
    ...updates,
    updated_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    try {
      const supabase = createServiceClient();
      const { data: existing } = await supabase
        .from("campaigns")
        .select("id")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      const payload: Record<string, any> = {};
      if (updates.name !== undefined) payload.name = updates.name;
      if (updates.tagline !== undefined) payload.tagline = updates.tagline;
      if (updates.status !== undefined) payload.status = updates.status;
      if (updates.collection_start !== undefined) payload.collection_start = updates.collection_start;
      if (updates.collection_end !== undefined) payload.collection_end = updates.collection_end;
      if (updates.voting_start !== undefined) payload.voting_start = updates.voting_start;
      if (updates.voting_end !== undefined) payload.voting_end = updates.voting_end;
      if (updates.allow_results_before_close !== undefined)
        payload.allow_results_before_close = updates.allow_results_before_close;

      if (existing?.id) {
        await supabase.from("campaigns").update(payload).eq("id", existing.id);
      } else {
        await supabase.from("campaigns").insert({
          name: campaignStore.name,
          tagline: campaignStore.tagline,
          status: campaignStore.status,
          collection_start: campaignStore.collection_start,
          collection_end: campaignStore.collection_end,
          voting_start: campaignStore.voting_start,
          voting_end: campaignStore.voting_end,
          allow_results_before_close: campaignStore.allow_results_before_close,
          ...payload,
        });
      }
    } catch (err) {
      console.warn("updateCampaignStateAsync database error:", err);
    }
  }

  return { ...campaignStore };
}
