
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

-- Enable RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- RLS Policies
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

-- Trigger for updated_at
CREATE TRIGGER update_clients_updated_at
    BEFORE UPDATE ON clients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_clients_owner ON clients(owner_id);
CREATE INDEX idx_clients_stage ON clients(stage);
CREATE INDEX idx_clients_industry ON clients(industry);
CREATE INDEX idx_clients_country ON clients(country);
