
-- Workflows table for automation
CREATE TABLE IF NOT EXISTS workflows (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    trigger_type TEXT NOT NULL,
    trigger_conditions JSONB DEFAULT '{}',
    actions JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    execution_count INTEGER DEFAULT 0,
    last_executed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    owner_id UUID DEFAULT auth.uid() REFERENCES users(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view workflows they own" ON workflows
    FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Users can insert their own workflows" ON workflows
    FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update workflows they own" ON workflows
    FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Users can delete workflows they own" ON workflows
    FOR DELETE USING (owner_id = auth.uid());

-- Trigger for updated_at
CREATE TRIGGER update_workflows_updated_at
    BEFORE UPDATE ON workflows
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_workflows_owner ON workflows(owner_id);
CREATE INDEX idx_workflows_is_active ON workflows(is_active);
CREATE INDEX idx_workflows_trigger_type ON workflows(trigger_type);
