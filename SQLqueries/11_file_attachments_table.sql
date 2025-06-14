
-- File attachments table for storing file references
CREATE TABLE IF NOT EXISTS file_attachments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    filename TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type TEXT NOT NULL,
    file_url TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    owner_id UUID DEFAULT auth.uid() REFERENCES users(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE file_attachments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view file attachments they own" ON file_attachments
    FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Users can view public file attachments" ON file_attachments
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can insert their own file attachments" ON file_attachments
    FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update file attachments they own" ON file_attachments
    FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Users can delete file attachments they own" ON file_attachments
    FOR DELETE USING (owner_id = auth.uid());

-- Trigger for updated_at
CREATE TRIGGER update_file_attachments_updated_at
    BEFORE UPDATE ON file_attachments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_file_attachments_owner ON file_attachments(owner_id);
CREATE INDEX idx_file_attachments_entity ON file_attachments(entity_type, entity_id);
CREATE INDEX idx_file_attachments_mime_type ON file_attachments(mime_type);
