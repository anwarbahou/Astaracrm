
-- Create enums first
CREATE TYPE deal_stage AS ENUM ('prospect', 'qualified', 'proposal', 'negotiation', 'won', 'lost');
CREATE TYPE deal_priority AS ENUM ('low', 'medium', 'high');

-- Deals table for sales opportunities
CREATE TABLE IF NOT EXISTS deals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    contact_id UUID, -- Will add foreign key constraint when contacts table exists
    value DECIMAL(15,2) NOT NULL DEFAULT 0,
    currency TEXT DEFAULT 'MAD',
    stage deal_stage DEFAULT 'prospect',
    probability INTEGER DEFAULT 0 CHECK (probability >= 0 AND probability <= 100),
    expected_close_date DATE,
    actual_close_date DATE,
    source TEXT,
    tags TEXT[],
    priority deal_priority DEFAULT 'medium',
    notes TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    owner_id UUID DEFAULT auth.uid() REFERENCES users(id) ON DELETE CASCADE,
    website TEXT, -- New: website for the deal
    rating INTEGER CHECK (rating >= 0 AND rating <= 5), -- New: rating for the deal (0-5)
    assignee_id UUID REFERENCES users(id) ON DELETE SET NULL -- New: assignee for the deal
);

-- Enable RLS
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view deals they own" ON deals
    FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Users can insert their own deals" ON deals
    FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update deals they own" ON deals
    FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Users can delete deals they own" ON deals
    FOR DELETE USING (owner_id = auth.uid());

CREATE POLICY "Admins can access all deals" ON deals
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Trigger for updated_at
CREATE TRIGGER update_deals_updated_at
    BEFORE UPDATE ON deals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_deals_owner ON deals(owner_id);
CREATE INDEX idx_deals_client_id ON deals(client_id);
CREATE INDEX idx_deals_contact_id ON deals(contact_id);
CREATE INDEX idx_deals_stage ON deals(stage);
CREATE INDEX idx_deals_expected_close_date ON deals(expected_close_date);
CREATE INDEX idx_deals_priority ON deals(priority);
CREATE INDEX idx_deals_assignee_id ON deals(assignee_id);
