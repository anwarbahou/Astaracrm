
-- Deal activities table for tracking deal-related activities
CREATE TABLE IF NOT EXISTS deal_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('call', 'email', 'meeting', 'note', 'task')),
    title TEXT NOT NULL,
    description TEXT,
    activity_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    owner UUID DEFAULT auth.uid() REFERENCES users(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE deal_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view deal activities they own" ON deal_activities
    FOR SELECT USING (owner = auth.uid());

CREATE POLICY "Users can insert their own deal activities" ON deal_activities
    FOR INSERT WITH CHECK (owner = auth.uid());

CREATE POLICY "Users can update deal activities they own" ON deal_activities
    FOR UPDATE USING (owner = auth.uid());

CREATE POLICY "Users can delete deal activities they own" ON deal_activities
    FOR DELETE USING (owner = auth.uid());

-- Trigger for updated_at
CREATE TRIGGER update_deal_activities_updated_at
    BEFORE UPDATE ON deal_activities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_deal_activities_deal_id ON deal_activities(deal_id);
CREATE INDEX idx_deal_activities_owner ON deal_activities(owner);
CREATE INDEX idx_deal_activities_type ON deal_activities(type);
