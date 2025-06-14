
-- Deal files table for file attachments
CREATE TABLE IF NOT EXISTS deal_files (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    file_size BIGINT,
    file_type TEXT,
    file_url TEXT NOT NULL,
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    owner UUID DEFAULT auth.uid() REFERENCES users(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE deal_files ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view deal files they own" ON deal_files
    FOR SELECT USING (owner = auth.uid());

CREATE POLICY "Users can insert their own deal files" ON deal_files
    FOR INSERT WITH CHECK (owner = auth.uid());

CREATE POLICY "Users can delete deal files they own" ON deal_files
    FOR DELETE USING (owner = auth.uid());

-- Indexes for performance
CREATE INDEX idx_deal_files_deal_id ON deal_files(deal_id);
CREATE INDEX idx_deal_files_owner ON deal_files(owner);
