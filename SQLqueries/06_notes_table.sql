
-- Notes table for general note-taking
CREATE TABLE IF NOT EXISTS notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    tags TEXT[],
    type note_type DEFAULT 'general',
    visibility note_visibility DEFAULT 'private',
    is_pinned BOOLEAN DEFAULT false,
    has_reminder BOOLEAN DEFAULT false,
    reminder_date TIMESTAMP WITH TIME ZONE,
    linked_entity_type TEXT,
    linked_entity_id UUID,
    attachments JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    owner_id UUID DEFAULT auth.uid() REFERENCES users(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view notes they own" ON notes
    FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Users can view public notes" ON notes
    FOR SELECT USING (visibility = 'public');

CREATE POLICY "Users can insert their own notes" ON notes
    FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update notes they own" ON notes
    FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Users can delete notes they own" ON notes
    FOR DELETE USING (owner_id = auth.uid());

-- Trigger for updated_at
CREATE TRIGGER update_notes_updated_at
    BEFORE UPDATE ON notes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_notes_owner ON notes(owner_id);
CREATE INDEX idx_notes_type ON notes(type);
CREATE INDEX idx_notes_visibility ON notes(visibility);
CREATE INDEX idx_notes_is_pinned ON notes(is_pinned);
CREATE INDEX idx_notes_linked_entity ON notes(linked_entity_type, linked_entity_id);
