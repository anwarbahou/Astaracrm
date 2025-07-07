-- Add priority and status columns to notes table
ALTER TABLE notes 
  ADD COLUMN priority TEXT CHECK (priority IN ('low', 'medium', 'high')),
  ADD COLUMN status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'completed'));

-- Create indexes for better query performance
CREATE INDEX idx_notes_priority ON notes(priority);
CREATE INDEX idx_notes_status ON notes(status); 