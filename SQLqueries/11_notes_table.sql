
-- Notes table for general note-taking
CREATE TABLE IF NOT EXISTS notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    tags TEXT[],
    is_pinned BOOLEAN DEFAULT false,
    related_entity_type TEXT,
    related_entity_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    owner UUID DEFAULT auth.uid() REFERENCES users(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view notes they own" ON notes
    FOR SELECT USING (owner = auth.uid());

CREATE POLICY "Users can insert their own notes" ON notes
    FOR INSERT WITH CHECK (owner = auth.uid());

CREATE POLICY "Users can update notes they own" ON notes
    FOR UPDATE USING (owner = auth.uid());

CREATE POLICY "Users can delete notes they own" ON notes
    FOR DELETE USING (owner = auth.uid());

-- Trigger for updated_at
CREATE TRIGGER update_notes_updated_at
    BEFORE UPDATE ON notes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_notes_owner ON notes(owner);
CREATE INDEX idx_notes_is_pinned ON notes(is_pinned);
CREATE INDEX idx_notes_related_entity ON notes(related_entity_type, related_entity_id);
