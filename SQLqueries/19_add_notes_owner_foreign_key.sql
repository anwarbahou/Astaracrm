-- Add foreign key constraint from notes.owner_id to public.users.id
ALTER TABLE notes ADD CONSTRAINT notes_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Create index for better join performance
CREATE INDEX IF NOT EXISTS idx_notes_owner_id ON notes(owner_id); 