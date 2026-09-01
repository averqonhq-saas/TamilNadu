-- Build Tamil Nadu — Admin Two-Factor Authentication (2FA) Schema
-- 004_admin_2fa.sql

-- =============================================
-- ADMIN 2FA TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS admin_2fa (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_user_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  admin_email TEXT NOT NULL UNIQUE,
  enabled BOOLEAN NOT NULL DEFAULT FALSE,
  secret_encrypted TEXT NOT NULL,
  recovery_codes JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  verified_at TIMESTAMPTZ,
  last_used_at TIMESTAMPTZ
);

-- Index for fast lookup by email or user_id
CREATE INDEX IF NOT EXISTS idx_admin_2fa_email ON admin_2fa(admin_email);
CREATE INDEX IF NOT EXISTS idx_admin_2fa_user_id ON admin_2fa(admin_user_id);

-- Enable RLS (Direct public/anon access denied; only accessible via service role)
ALTER TABLE admin_2fa ENABLE ROW LEVEL SECURITY;
