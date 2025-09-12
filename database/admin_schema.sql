-- Admin Authentication & Role Management Schema
-- Run these commands in your Supabase SQL editor

-- 1. Create admin_users table
CREATE TABLE admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin', 'moderator')),
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES admin_users(id)
);

-- 2. Create admin_sessions table for secure session management
CREATE TABLE admin_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create admin_activity_log table
CREATE TABLE admin_activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Insert your super admin account (replace with your details)
INSERT INTO admin_users (email, password_hash, full_name, role, permissions) VALUES (
  'faisal@murbati.ai',
  crypt('your_secure_password_here', gen_salt('bf')), 
  'Faisal Al-Rashid',
  'super_admin',
  '{
    "questions": {"read": true, "write": true, "delete": true},
    "users": {"read": true, "write": true, "delete": true},
    "analytics": {"read": true, "export": true},
    "admin_management": {"read": true, "write": true, "delete": true},
    "system": {"read": true, "write": true, "backup": true}
  }'
);

-- 5. Add team members (example)
INSERT INTO admin_users (email, password_hash, full_name, role, permissions, created_by) VALUES (
  'team@salahuddin-softech.com',
  crypt('team_password_here', gen_salt('bf')),
  'Salahuddin Team',
  'admin',
  '{
    "questions": {"read": true, "write": true, "delete": false},
    "users": {"read": true, "write": false, "delete": false},
    "analytics": {"read": true, "export": false},
    "admin_management": {"read": true, "write": false, "delete": false}
  }',
  (SELECT id FROM admin_users WHERE email = 'faisal@murbati.ai')
);

-- 6. Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS policies
CREATE POLICY "Admin users can view their own data" ON admin_users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Super admins can manage all users" ON admin_users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- 8. Create functions for admin authentication
CREATE OR REPLACE FUNCTION authenticate_admin(
  email_input TEXT,
  password_input TEXT
) RETURNS TABLE(
  admin_id UUID,
  session_token TEXT,
  role TEXT,
  permissions JSONB,
  expires_at TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
  admin_record admin_users%ROWTYPE;
  new_session_token TEXT;
  session_expires TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Check credentials
  SELECT * INTO admin_record
  FROM admin_users
  WHERE email = email_input 
    AND password_hash = crypt(password_input, password_hash)
    AND is_active = true;

  IF NOT FOUND THEN
    RETURN;
  END IF;

  -- Generate session token
  new_session_token := encode(gen_random_bytes(32), 'hex');
  session_expires := NOW() + INTERVAL '24 hours';

  -- Create session
  INSERT INTO admin_sessions (admin_id, session_token, expires_at)
  VALUES (admin_record.id, new_session_token, session_expires);

  -- Update last login
  UPDATE admin_users SET last_login = NOW() WHERE id = admin_record.id;

  -- Log activity
  INSERT INTO admin_activity_log (admin_id, action, details)
  VALUES (admin_record.id, 'login', '{"method": "password"}');

  -- Return session data
  RETURN QUERY SELECT 
    admin_record.id,
    new_session_token,
    admin_record.role,
    admin_record.permissions,
    session_expires;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Function to validate session
CREATE OR REPLACE FUNCTION validate_admin_session(token TEXT)
RETURNS TABLE(
  admin_id UUID,
  role TEXT,
  permissions JSONB,
  full_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.role,
    u.permissions,
    u.full_name
  FROM admin_sessions s
  JOIN admin_users u ON s.admin_id = u.id
  WHERE s.session_token = token
    AND s.expires_at > NOW()
    AND u.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
