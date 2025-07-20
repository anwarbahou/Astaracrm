-- =====================================================
-- Fix Calendar Events RLS Policies
-- =====================================================
-- This migration updates the RLS policies to allow users to view events they're attending
-- while ensuring only event owners can modify their events

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own calendar events" ON calendar_events;
DROP POLICY IF EXISTS "Users can create their own calendar events" ON calendar_events;
DROP POLICY IF EXISTS "Users can update their own calendar events" ON calendar_events;
DROP POLICY IF EXISTS "Users can delete their own calendar events" ON calendar_events;

-- =====================================================
-- New RLS Policies
-- =====================================================

-- Users can view calendar events they own OR events they're attending
CREATE POLICY "Users can view their own events or events they attend" ON calendar_events
    FOR SELECT USING (
        owner_id = auth.uid() OR 
        attendees::text[] @> ARRAY[auth.jwt() ->> 'email']
    );

-- Users can insert calendar events for themselves only
CREATE POLICY "Users can create their own calendar events" ON calendar_events
    FOR INSERT WITH CHECK (owner_id = auth.uid());

-- Users can update calendar events they own only
CREATE POLICY "Users can update their own calendar events" ON calendar_events
    FOR UPDATE USING (owner_id = auth.uid());

-- Users can delete calendar events they own only
CREATE POLICY "Users can delete their own calendar events" ON calendar_events
    FOR DELETE USING (owner_id = auth.uid());

-- =====================================================
-- Additional Security Policies
-- =====================================================

-- Ensure owner_id cannot be changed to another user
CREATE POLICY "Users cannot change event ownership" ON calendar_events
    FOR UPDATE USING (owner_id = auth.uid())
    WITH CHECK (owner_id = auth.uid());

-- =====================================================
-- Migration Complete
-- =====================================================
-- The calendar_events table now has proper RLS policies:
-- ✅ Users can view events they own OR events they're attending
-- ✅ Users can only create events for themselves
-- ✅ Users can only update events they own
-- ✅ Users can only delete events they own
-- ✅ Event ownership cannot be transferred to other users
-- ✅ Admins cannot modify other users' events 