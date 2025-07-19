-- Test chat permissions and identify issues
-- This script helps diagnose the RLS policy problems

-- 1. Check if all required tables exist
SELECT 
    t.table_name,
    CASE WHEN it.table_name IS NOT NULL THEN 'EXISTS' ELSE 'MISSING' END as status
FROM (
    SELECT 'channels' as table_name
    UNION ALL SELECT 'channel_members'
    UNION ALL SELECT 'messages'
    UNION ALL SELECT 'unread_messages'
) t
LEFT JOIN information_schema.tables it ON it.table_name = t.table_name
WHERE it.table_schema = 'public';

-- 2. Check RLS status on all tables
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('channels', 'channel_members', 'messages', 'unread_messages')
ORDER BY tablename;

-- 3. Check existing policies
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

-- 4. Check if there are any channels and members
SELECT 'Channels count:' as info, COUNT(*) as count FROM channels
UNION ALL
SELECT 'Channel members count:', COUNT(*) FROM channel_members
UNION ALL
SELECT 'Messages count:', COUNT(*) FROM messages
UNION ALL
SELECT 'Unread messages count:', COUNT(*) FROM unread_messages;

-- 5. Check if the current user (if authenticated) has any channel memberships
-- This will help identify if the user is properly added to channels
SELECT 
    'User channel memberships:' as info,
    COUNT(*) as count
FROM channel_members cm
JOIN channels c ON c.id = cm.channel_id
WHERE cm.user_id = auth.uid();

-- 6. Test the membership function if it exists
SELECT 
    'Membership function exists:' as info,
    CASE WHEN EXISTS (
        SELECT 1 FROM pg_proc 
        WHERE proname = 'is_channel_member'
    ) THEN 'YES' ELSE 'NO' END as status;

-- 7. Show sample data to help debug
SELECT 'Sample channels:' as info;
SELECT id, name, is_private, created_by FROM channels LIMIT 5;

SELECT 'Sample channel members:' as info;
SELECT channel_id, user_id FROM channel_members LIMIT 5;

-- 8. Check if the user is authenticated and has proper permissions
SELECT 
    'Current user:' as info,
    auth.uid() as user_id,
    auth.role() as role; 