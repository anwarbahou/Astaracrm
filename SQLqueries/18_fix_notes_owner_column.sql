-- First, check if the 'owner' column exists and rename it to 'owner_id' if it does
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'notes'
        AND column_name = 'owner'
    ) THEN
        ALTER TABLE notes RENAME COLUMN owner TO owner_id;
    END IF;
END $$;

-- Make sure the owner_id column exists and has the correct foreign key
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'notes'
        AND column_name = 'owner_id'
    ) THEN
        ALTER TABLE notes ADD COLUMN owner_id UUID DEFAULT auth.uid() REFERENCES users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Update RLS policies to use owner_id consistently
DROP POLICY IF EXISTS "Users can view notes they own" ON notes;
DROP POLICY IF EXISTS "Users can insert their own notes" ON notes;
DROP POLICY IF EXISTS "Users can update notes they own" ON notes;
DROP POLICY IF EXISTS "Users can delete notes they own" ON notes;

CREATE POLICY "Users can view notes they own" ON notes
    FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Users can insert their own notes" ON notes
    FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update notes they own" ON notes
    FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Users can delete notes they own" ON notes
    FOR DELETE USING (owner_id = auth.uid());

-- Create index for performance
DROP INDEX IF EXISTS idx_notes_owner;
CREATE INDEX idx_notes_owner_id ON notes(owner_id); 