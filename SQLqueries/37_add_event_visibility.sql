-- =====================================================
-- Add Event Visibility (Public/Private) Migration
-- =====================================================
-- This migration adds a visibility field to calendar events
-- to control whether events are public or private

-- Add visibility column to calendar_events table
ALTER TABLE calendar_events 
ADD COLUMN visibility TEXT DEFAULT 'private' 
CHECK (visibility IN ('public', 'private'));

-- Update RLS policies to handle visibility
DROP POLICY IF EXISTS "Users can view their own events or events they attend" ON calendar_events;

-- New RLS policy that considers visibility
CREATE POLICY "Users can view events based on ownership, attendance, and visibility" ON calendar_events
    FOR SELECT USING (
        owner_id = auth.uid() OR 
        attendees::jsonb @> jsonb_build_array(auth.jwt() ->> 'email') OR
        visibility = 'public'
    );

-- Add index for visibility queries
CREATE INDEX idx_calendar_events_visibility ON calendar_events(visibility);

-- Add comment for documentation
COMMENT ON COLUMN calendar_events.visibility IS 'Event visibility: public (visible to all users) or private (visible only to owner and attendees)';

-- =====================================================
-- Migration Complete
-- =====================================================
-- The calendar_events table now has:
-- ✅ visibility field with 'public' or 'private' values
-- ✅ Default value of 'private' for security
-- ✅ Updated RLS policy that considers visibility
-- ✅ Performance index for visibility queries
-- ✅ Proper documentation 