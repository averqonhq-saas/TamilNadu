-- Build Tamil Nadu — Comprehensive Security Hardening Migration
-- 003_security_hardening.sql

-- =============================================
-- 1. ADMIN USERS TABLE UPDATES
-- =============================================
ALTER TABLE admin_users 
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;

-- Update role constraint to include SUPER_ADMIN
ALTER TABLE admin_users 
  DROP CONSTRAINT IF EXISTS admin_users_role_check;

ALTER TABLE admin_users 
  ADD CONSTRAINT admin_users_role_check 
  CHECK (role IN ('SUPER_ADMIN', 'ADMIN', 'REVIEWER', 'EDITOR'));

-- =============================================
-- 2. INQUIRIES TABLE (Contact & Partner Forms)
-- =============================================
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('CONTACT', 'PARTNER')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  organization TEXT,
  role TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  district TEXT,
  status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'IN_REVIEW', 'RESPONDED', 'ARCHIVED')),
  admin_notes TEXT,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for inquiries
CREATE INDEX IF NOT EXISTS idx_inquiries_type_status ON inquiries(type, status, created_at DESC);

-- =============================================
-- 3. CAMPAIGN VOTING SETTINGS STATUS CHECK
-- =============================================
ALTER TABLE campaigns 
  ADD COLUMN IF NOT EXISTS allow_results_before_close BOOLEAN NOT NULL DEFAULT FALSE;

-- =============================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES HARDENING
-- =============================================

-- Enable RLS on all public schema tables
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE problem_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE idea_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE idea_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE vote_verification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_voting_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Drop insecure legacy policies if present
DROP POLICY IF EXISTS "Public can read active campaign" ON campaigns;
DROP POLICY IF EXISTS "Public can read active categories" ON categories;
DROP POLICY IF EXISTS "Public can read active problem options" ON problem_options;
DROP POLICY IF EXISTS "Public can read public ideas" ON ideas;
DROP POLICY IF EXISTS "Public can insert ideas" ON ideas;
DROP POLICY IF EXISTS "Public can insert users" ON users;
DROP POLICY IF EXISTS "Public read voting settings" ON campaign_voting_settings;

-- CAMPAIGNS
CREATE POLICY "Public read active campaigns" ON campaigns 
  FOR SELECT TO anon, authenticated USING (true);

-- CATEGORIES
CREATE POLICY "Public read active categories" ON categories 
  FOR SELECT TO anon, authenticated USING (active = true);

-- PROBLEM OPTIONS
CREATE POLICY "Public read active problem options" ON problem_options 
  FOR SELECT TO anon, authenticated USING (active = true);

-- IDEAS
-- Public can only read ideas explicitly published
CREATE POLICY "Public read public ideas" ON ideas 
  FOR SELECT TO anon, authenticated 
  USING (visibility = 'PUBLIC' AND status = 'PUBLIC');

-- Public can submit ideas, but MUST submit with status SUBMITTED, visibility PRIVATE, no internal fields
CREATE POLICY "Public submit ideas" ON ideas 
  FOR INSERT TO anon, authenticated 
  WITH CHECK (
    status = 'SUBMITTED' 
    AND visibility = 'PRIVATE' 
    AND admin_notes IS NULL 
    AND similarity_group_id IS NULL
  );

-- USERS
CREATE POLICY "Public register users on submit" ON users 
  FOR INSERT TO anon, authenticated 
  WITH CHECK (email IS NOT NULL AND length(email) > 3);

-- CAMPAIGN VOTING SETTINGS
CREATE POLICY "Public read voting settings" ON campaign_voting_settings 
  FOR SELECT TO anon, authenticated USING (true);

-- INQUIRIES
CREATE POLICY "Public insert inquiries" ON inquiries 
  FOR INSERT TO anon, authenticated 
  WITH CHECK (type IN ('CONTACT', 'PARTNER'));

-- AUDIT LOGS
-- Append-only policy: service role inserts logs, nobody can update or delete audit logs
CREATE POLICY "System insert audit logs" ON audit_logs 
  FOR INSERT TO authenticated 
  WITH CHECK (true);

-- =============================================
-- 5. SECURE PUBLIC VIEWS
-- =============================================
-- Create public_ideas_view with security_invoker to ensure RLS compliance and mask submitter email
CREATE OR REPLACE VIEW public_ideas_view WITH (security_invoker = true) AS
SELECT 
  i.id,
  i.public_id,
  i.title,
  i.description,
  i.district,
  i.status,
  i.category_id,
  i.created_at,
  c.name AS category_name,
  c.slug AS category_slug,
  c.icon AS category_icon,
  c.color AS category_color
FROM ideas i
LEFT JOIN categories c ON i.category_id = c.id
WHERE i.visibility = 'PUBLIC' AND i.status = 'PUBLIC';

-- =============================================
-- 6. COMPOSITE PERFORMANCE & INTEGRITY INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_ideas_public_browse ON ideas(status, visibility, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_users_email_active ON admin_users(email, is_active);
CREATE INDEX IF NOT EXISTS idx_public_votes_lookup ON public_votes(campaign_id, voter_hash);
