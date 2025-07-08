-- Fix infinite recursion in channel_members policies
-- Run this in the Supabase SQL Editor

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Anyone can view public channel members" ON channel_members;
DROP POLICY IF EXISTS "Members can view private channel members" ON channel_members;

-- Create fixed policies that avoid infinite recursion
CREATE POLICY "Users can view channel members for public channels" ON channel_members
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM channels 
            WHERE id = channel_members.channel_id 
            AND NOT is_private
        )
    );

CREATE POLICY "Users can view channel members for private channels they belong to" ON channel_members
    FOR SELECT USING (
        channel_members.user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM channels 
            WHERE id = channel_members.channel_id 
            AND is_private
            AND created_by = auth.uid()
        )
    );

-- Add missing delete policy
CREATE POLICY "Users can leave channels they belong to" ON channel_members
    FOR DELETE USING (
        channel_members.user_id = auth.uid()
    );

-- Verify the fix by testing a simple query
SELECT COUNT(*) FROM channel_members LIMIT 1; 