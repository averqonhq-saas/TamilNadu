-- Build Tamil Nadu — Public Voting & Security Schema
-- Phase 2/3 Democratic Poll System

-- =============================================
-- PUBLIC VOTES
-- =============================================
CREATE TABLE IF NOT EXISTS public_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  idea_id TEXT NOT NULL, -- finalist id or idea UUID
  voter_hash TEXT NOT NULL, -- SHA-256 HMAC of email/identifier
  voter_email_masked TEXT, -- e.g. "m***@gmail.com"
  district TEXT,
  client_ip_hash TEXT,
  user_agent_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (campaign_id, voter_hash)
);

-- =============================================
-- VOTE VERIFICATION TOKENS (One-time Passcodes)
-- =============================================
CREATE TABLE IF NOT EXISTS vote_verification_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  token_hash TEXT NOT NULL,
  idea_id TEXT NOT NULL,
  district TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  consumed BOOLEAN NOT NULL DEFAULT FALSE,
  attempts INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- VOTING CAMPAIGN CONFIG OVERRIDES (Optional Dynamic DB Config)
-- =============================================
CREATE TABLE IF NOT EXISTS campaign_voting_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  status TEXT NOT NULL DEFAULT 'COLLECTING'
    CHECK (status IN ('PRE_LAUNCH', 'COLLECTING', 'REVIEWING', 'VOTING', 'WINNER', 'RESULTS', 'BUILDING', 'COMPLETED')),
  voting_start TIMESTAMPTZ,
  voting_end TIMESTAMPTZ,
  allow_results_before_close BOOLEAN NOT NULL DEFAULT FALSE,
  shortlisted_ideas JSONB,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE & INTEGRITY
-- =============================================
CREATE INDEX IF NOT EXISTS idx_public_votes_campaign_idea ON public_votes(campaign_id, idea_id);
CREATE INDEX IF NOT EXISTS idx_public_votes_created_at ON public_votes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_public_votes_voter_hash ON public_votes(voter_hash);
CREATE INDEX IF NOT EXISTS idx_vote_tokens_email ON vote_verification_tokens(email, expires_at);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================
ALTER TABLE public_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE vote_verification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_voting_settings ENABLE ROW LEVEL SECURITY;

-- Anonymous public read for campaign voting status
CREATE POLICY "Public read voting settings" ON campaign_voting_settings FOR SELECT USING (true);
