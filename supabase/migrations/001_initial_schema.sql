-- Build Tamil Nadu — Full Database Schema
-- PostgreSQL / Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- CAMPAIGNS
-- =============================================
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL DEFAULT 'Build Tamil Nadu',
  tagline TEXT NOT NULL DEFAULT 'What should we build for Tamil Nadu?',
  status TEXT NOT NULL DEFAULT 'COLLECTING'
    CHECK (status IN ('PRE_LAUNCH', 'COLLECTING', 'REVIEWING', 'VOTING', 'WINNER', 'BUILDING', 'COMPLETED')),
  collection_start TIMESTAMPTZ,
  collection_end TIMESTAMPTZ,
  voting_start TIMESTAMPTZ,
  voting_end TIMESTAMPTZ,
  submission_limit INTEGER,
  announcement_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default campaign
INSERT INTO campaigns (name, tagline, status, collection_start, collection_end)
VALUES (
  'Build Tamil Nadu',
  'What should we build for Tamil Nadu?',
  'COLLECTING',
  NOW(),
  NOW() + INTERVAL '90 days'
);

-- =============================================
-- CATEGORIES
-- =============================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#64748B',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- PROBLEM OPTIONS
-- =============================================
CREATE TABLE problem_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- =============================================
-- USERS (submitters)
-- =============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  email TEXT NOT NULL UNIQUE,
  email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  district TEXT,
  consent BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- IDEAS
-- =============================================
CREATE SEQUENCE idea_sequence START 1;

CREATE TABLE ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  public_id TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  category_id UUID NOT NULL REFERENCES categories(id),
  problem_option_id UUID REFERENCES problem_options(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  solution_description TEXT,
  district TEXT NOT NULL,
  scope TEXT,
  status TEXT NOT NULL DEFAULT 'SUBMITTED'
    CHECK (status IN ('SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'PUBLIC', 'DUPLICATE', 'REJECTED', 'SHORTLISTED', 'SELECTED', 'BUILDING', 'COMPLETED')),
  visibility TEXT NOT NULL DEFAULT 'PRIVATE'
    CHECK (visibility IN ('PRIVATE', 'PUBLIC', 'HIDDEN')),
  admin_notes TEXT,
  similarity_group_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Function to generate public_id
CREATE OR REPLACE FUNCTION generate_idea_public_id()
RETURNS TRIGGER AS $$
DECLARE
  seq_val INTEGER;
  year_val TEXT;
BEGIN
  seq_val := nextval('idea_sequence');
  year_val := EXTRACT(YEAR FROM NOW())::TEXT;
  NEW.public_id := 'TN-' || year_val || '-' || LPAD(seq_val::TEXT, 5, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_idea_public_id
BEFORE INSERT ON ideas
FOR EACH ROW
WHEN (NEW.public_id IS NULL OR NEW.public_id = '')
EXECUTE FUNCTION generate_idea_public_id();

-- =============================================
-- IDEA GROUPS (for duplicate management)
-- =============================================
CREATE TABLE idea_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE idea_group_members (
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  group_id UUID NOT NULL REFERENCES idea_groups(id) ON DELETE CASCADE,
  PRIMARY KEY (idea_id, group_id)
);

-- =============================================
-- VOTES (Phase 3 — disabled in Phase 1)
-- =============================================
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  voter_identifier TEXT NOT NULL, -- hashed email or session token
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (idea_id, voter_identifier)
);

-- =============================================
-- EMAIL EVENTS
-- =============================================
CREATE TABLE email_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  type TEXT NOT NULL
    CHECK (type IN ('CONFIRMATION', 'SHORTLISTED', 'VOTING_OPEN', 'VOTING_REMINDER', 'WINNER_ANNOUNCED', 'BUILD_UPDATE')),
  status TEXT NOT NULL DEFAULT 'PENDING'
    CHECK (status IN ('PENDING', 'SENT', 'FAILED', 'BOUNCED')),
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- ADMIN USERS
-- =============================================
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'REVIEWER'
    CHECK (role IN ('ADMIN', 'REVIEWER', 'EDITOR')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- AUDIT LOGS
-- =============================================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX idx_ideas_category ON ideas(category_id);
CREATE INDEX idx_ideas_district ON ideas(district);
CREATE INDEX idx_ideas_status ON ideas(status);
CREATE INDEX idx_ideas_visibility ON ideas(visibility);
CREATE INDEX idx_ideas_created_at ON ideas(created_at DESC);
CREATE INDEX idx_ideas_user_id ON ideas(user_id);
CREATE INDEX idx_email_events_user_id ON email_events(user_id);
CREATE INDEX idx_audit_logs_admin_id ON audit_logs(admin_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);

-- =============================================
-- UPDATED_AT TRIGGER
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER campaigns_updated_at BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER ideas_updated_at BEFORE UPDATE ON ideas FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE problem_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE idea_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE idea_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public can read active campaign" ON campaigns FOR SELECT USING (true);
CREATE POLICY "Public can read active categories" ON categories FOR SELECT USING (active = true);
CREATE POLICY "Public can read active problem options" ON problem_options FOR SELECT USING (active = true);
CREATE POLICY "Public can read public ideas" ON ideas FOR SELECT USING (visibility = 'PUBLIC' AND status = 'PUBLIC');
CREATE POLICY "Public can insert ideas" ON ideas FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can insert users" ON users FOR INSERT WITH CHECK (true);

-- Service role has full access (used by server-side API)
-- (Supabase service role key bypasses RLS by default)

-- =============================================
-- SEED: Categories
-- =============================================
INSERT INTO categories (name, slug, description, icon, color, sort_order) VALUES
('Healthcare', 'healthcare', 'Hospital access, appointments, medicines, health information', 'HeartPulse', '#EF4444', 1),
('Education', 'education', 'Students, schools, scholarships, learning, career discovery', 'GraduationCap', '#3B82F6', 2),
('Transport', 'transport', 'Buses, trains, traffic, parking, routes, public mobility', 'Bus', '#F59E0B', 3),
('Agriculture', 'agriculture', 'Farmers, markets, weather, crop information, logistics', 'Wheat', '#22C55E', 4),
('Jobs & Business', 'jobs', 'Employment, local businesses, entrepreneurship', 'Briefcase', '#8B5CF6', 5),
('Safety', 'safety', 'Emergency response, public safety, disaster preparedness', 'Shield', '#EF4444', 6),
('Public Services', 'public-services', 'Government services, civic issues, municipal systems', 'Building2', '#06B6D4', 7),
('Cities & Communities', 'cities', 'Waste, water, infrastructure, neighbourhood issues', 'Building', '#64748B', 8),
('AI & Technology', 'technology', 'Useful AI and technology applications for everyday life', 'Cpu', '#EC4899', 9),
('Environment', 'environment', 'Pollution, waste management, water, sustainability', 'Leaf', '#10B981', 10),
('Everyday Life', 'everyday', 'Anything that makes everyday life harder in Tamil Nadu', 'Smile', '#F97316', 11),
('Other', 'other', 'An idea that does not fit the categories above', 'MoreHorizontal', '#94A3B8', 12);
