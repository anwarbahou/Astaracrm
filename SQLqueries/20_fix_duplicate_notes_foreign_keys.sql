-- Drop both existing foreign key constraints
ALTER TABLE notes DROP CONSTRAINT IF EXISTS notes_owner_fkey;
ALTER TABLE notes DROP CONSTRAINT IF EXISTS notes_owner_id_fkey;

-- Add back a single foreign key constraint with a consistent name
ALTER TABLE notes ADD CONSTRAINT notes_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE CASCADE; 