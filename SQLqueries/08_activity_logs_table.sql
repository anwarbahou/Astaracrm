
-- Activity logs table for tracking all CRM activities
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    activity_type TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    user_avatar TEXT,
    entity_type TEXT,
    entity_id UUID,
    related_to TEXT,
    changes JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    owner UUID DEFAULT auth.uid() REFERENCES users(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view activity logs they own" ON activity_logs
    FOR SELECT USING (owner = auth.uid());

CREATE POLICY "Users can insert their own activity logs" ON activity_logs
    FOR INSERT WITH CHECK (owner = auth.uid());

-- Indexes for performance
CREATE INDEX idx_activity_logs_owner ON activity_logs(owner);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);
CREATE INDEX idx_activity_logs_entity_type ON activity_logs(entity_type);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
