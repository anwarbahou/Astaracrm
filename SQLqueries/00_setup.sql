
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types/enums
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'user');
CREATE TYPE user_status AS ENUM ('active', 'inactive');
CREATE TYPE client_stage AS ENUM ('lead', 'prospect', 'active', 'inactive');
CREATE TYPE contact_status AS ENUM ('active', 'inactive');
CREATE TYPE deal_stage AS ENUM ('prospect', 'lead', 'qualified', 'negotiation', 'won', 'lost');
CREATE TYPE deal_priority AS ENUM ('low', 'medium', 'high');
CREATE TYPE task_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');
CREATE TYPE email_type AS ENUM ('received', 'sent', 'draft');
CREATE TYPE note_type AS ENUM ('general', 'meeting', 'task', 'idea');
CREATE TYPE note_visibility AS ENUM ('public', 'private', 'team');
CREATE TYPE activity_type AS ENUM ('deal_created', 'deal_updated', 'contact_created', 'contact_updated', 'client_created', 'client_updated', 'task_created', 'task_completed', 'email_sent', 'note_created', 'meeting_scheduled');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
