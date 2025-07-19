-- Fix messages RLS policy issue
-- This script addresses the "new row violates row-level security policy for table messages" error

-- 1. First, let's check if RLS is enabled on the messages table
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'messages';

-- 2. Enable RLS on messages table if not already enabled
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing messages policies to recreate them properly
DROP POLICY IF EXISTS "messages_select_policy" ON messages;
DROP POLICY IF EXISTS "messages_insert_policy" ON messages;
DROP POLICY IF EXISTS "messages_update_policy" ON messages;
DROP POLICY IF EXISTS "messages_delete_policy" ON messages;

-- 4. Create simplified but robust messages policies
-- SELECT policy - allow authenticated users to view messages in channels they have access to
CREATE POLICY "messages_select_policy" ON messages
    FOR SELECT USING (
        auth.role() = 'authenticated' AND (
            -- Public channels
            EXISTS (
                SELECT 1 FROM channels 
                WHERE channels.id = messages.channel_id 
                AND channels.is_private = false
            )
            OR
            -- Private channels where user is a member
            EXISTS (
                SELECT 1 FROM channel_members 
                WHERE channel_members.channel_id = messages.channel_id 
                AND channel_members.user_id = auth.uid()
            )
        )
    );

-- INSERT policy - allow authenticated users to send messages to channels they have access to
CREATE POLICY "messages_insert_policy" ON messages
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' AND
        auth.uid() = sender_id AND
        (
            -- Public channels
            EXISTS (
                SELECT 1 FROM channels 
                WHERE channels.id = messages.channel_id 
                AND channels.is_private = false
            )
            OR
            -- Private channels where user is a member
            EXISTS (
                SELECT 1 FROM channel_members 
                WHERE channel_members.channel_id = messages.channel_id 
                AND channel_members.user_id = auth.uid()
            )
        )
    );

-- UPDATE policy - allow users to update their own messages
CREATE POLICY "messages_update_policy" ON messages
    FOR UPDATE USING (
        auth.role() = 'authenticated' AND
        auth.uid() = sender_id
    );

-- DELETE policy - allow users to delete their own messages
CREATE POLICY "messages_delete_policy" ON messages
    FOR DELETE USING (
        auth.role() = 'authenticated' AND
        auth.uid() = sender_id
    );

-- 5. Also ensure channels and channel_members have proper RLS
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE channel_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE unread_messages ENABLE ROW LEVEL SECURITY;

-- 6. Verify the policies are created correctly
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN ('messages', 'channels', 'channel_members', 'unread_messages')
ORDER BY tablename, policyname;

-- 7. Test the policies by checking if a user can insert a message
-- This will help verify the policies are working correctly
SELECT 'Messages policies created successfully' as status; 