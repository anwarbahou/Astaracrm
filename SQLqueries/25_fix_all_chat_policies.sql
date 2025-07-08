-- Comprehensive fix for all chat table policies
-- This script resolves infinite recursion issues in RLS policies

-- Drop all existing problematic policies
DROP POLICY IF EXISTS "Users can view public channels" ON channels;
DROP POLICY IF EXISTS "Users can view private channels they are members of" ON channels;
DROP POLICY IF EXISTS "Any authenticated user can create channels" ON channels;
DROP POLICY IF EXISTS "Channel creator can delete their channels" ON channels;

DROP POLICY IF EXISTS "Users can view channel members for public channels" ON channel_members;
DROP POLICY IF EXISTS "Users can view channel members for private channels they belong to" ON channel_members;
DROP POLICY IF EXISTS "Channel creator can manage members" ON channel_members;
DROP POLICY IF EXISTS "Users can join public channels" ON channel_members;
DROP POLICY IF EXISTS "Users can leave channels they belong to" ON channel_members;

DROP POLICY IF EXISTS "Anyone can view public channel messages" ON messages;
DROP POLICY IF EXISTS "Members can view private channel messages" ON messages;
DROP POLICY IF EXISTS "Members can send messages" ON messages;
DROP POLICY IF EXISTS "Users can manage their own messages" ON messages;

-- Create simplified channels policies
CREATE POLICY "Users can view all channels" ON channels
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create channels" ON channels
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Channel creator can update their channels" ON channels
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Channel creator can delete their channels" ON channels
    FOR DELETE USING (auth.uid() = created_by);

-- Create simplified channel_members policies
CREATE POLICY "Users can view channel members" ON channel_members
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can join channels" ON channel_members
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave channels" ON channel_members
    FOR DELETE USING (auth.uid() = user_id);

-- Create simplified messages policies
CREATE POLICY "Users can view messages" ON messages
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can send messages" ON messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their own messages" ON messages
    FOR UPDATE USING (auth.uid() = sender_id);

CREATE POLICY "Users can delete their own messages" ON messages
    FOR DELETE USING (auth.uid() = sender_id);

-- Verify the fix by testing simple queries
SELECT COUNT(*) FROM channels LIMIT 1;
SELECT COUNT(*) FROM channel_members LIMIT 1;
SELECT COUNT(*) FROM messages LIMIT 1; 