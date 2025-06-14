
-- Deals table for sales opportunities
CREATE TABLE IF NOT EXISTS deals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    value DECIMAL(15,2) NOT NULL DEFAULT 0,
    currency TEXT DEFAULT 'MAD',
    stage TEXT DEFAULT 'discovery' CHECK (stage IN ('discovery', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost')),
    probability INTEGER DEFAULT 0 CHECK (probability >= 0 AND probability <= 100),
    expected_close_date DATE,
    source TEXT,
    owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
    tags TEXT[],
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    owner UUID DEFAULT auth.uid() REFERENCES users(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view deals they own" ON deals
    FOR SELECT USING (owner = auth.uid());

CREATE POLICY "Users can insert their own deals" ON deals
    FOR INSERT WITH CHECK (owner = auth.uid());

CREATE POLICY "Users can update deals they own" ON deals
    FOR UPDATE USING (owner = auth.uid());

CREATE POLICY "Users can delete deals they own" ON deals
    FOR DELETE USING (owner = auth.uid());

-- Trigger for updated_at
CREATE TRIGGER update_deals_updated_at
    BEFORE UPDATE ON deals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_deals_owner ON deals(owner);
CREATE INDEX idx_deals_client_id ON deals(client_id);
CREATE INDEX idx_deals_stage ON deals(stage);
CREATE INDEX idx_deals_expected_close_date ON deals(expected_close_date);
