
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types/enums
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'user');
CREATE TYPE user_status AS ENUM ('active', 'inactive');
CREATE TYPE client_stage AS ENUM ('lead', 'prospect', 'active', 'inactive');
CREATE TYPE contact_status AS ENUM ('active', 'inactive');
CREATE TYPE deal_stage AS ENUM ('prospect', 'qualified', 'proposal', 'negotiation', 'won', 'lost');
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

-- Users table for authentication and user management
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'user',
    status user_status DEFAULT 'active',
    phone TEXT,
    timezone TEXT DEFAULT 'UTC',
    preferences JSONB DEFAULT '{}',
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Trigger for users updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Indexes for users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

-- Clients table for company/organization management
CREATE TABLE IF NOT EXISTS clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    industry TEXT,
    stage client_stage DEFAULT 'lead',
    tags TEXT[],
    country TEXT,
    contacts_count INTEGER DEFAULT 0,
    total_deal_value DECIMAL(15,2) DEFAULT 0,
    status user_status DEFAULT 'active',
    avatar_url TEXT,
    notes TEXT,
    address TEXT,
    website TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    owner_id UUID DEFAULT auth.uid() REFERENCES users(id) ON DELETE CASCADE
);

-- Enable RLS for clients
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- RLS Policies for clients
CREATE POLICY "Users can view clients they own" ON clients
    FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Users can insert their own clients" ON clients
    FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update clients they own" ON clients
    FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Users can delete clients they own" ON clients
    FOR DELETE USING (owner_id = auth.uid());

CREATE POLICY "Admins can access all clients" ON clients
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Trigger for clients updated_at
CREATE TRIGGER update_clients_updated_at
    BEFORE UPDATE ON clients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Indexes for clients
CREATE INDEX idx_clients_owner ON clients(owner_id);
CREATE INDEX idx_clients_stage ON clients(stage);
CREATE INDEX idx_clients_industry ON clients(industry);
CREATE INDEX idx_clients_country ON clients(country);
