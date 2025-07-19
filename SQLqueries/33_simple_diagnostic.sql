-- Simple diagnostic script for chat system
-- This script checks the basic status without ambiguous column references

-- 1. Check if tables exist (simplified)
SELECT 'channels' as table_name, 
       CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'channels') THEN 'EXISTS' ELSE 'MISSING' END as status
UNION ALL
SELECT 'channel_members', 
       CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'channel_members') THEN 'EXISTS' ELSE 'MISSING' END
UNION ALL
SELECT 'messages', 
       CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'messages') THEN 'EXISTS' ELSE 'MISSING' END
UNION ALL
SELECT 'unread_messages', 
       CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'unread_messages') THEN 'EXISTS' ELSE 'MISSING' END;

-- 2. Check RLS status
SELECT 'channels' as table_name, rowsecurity as rls_enabled FROM pg_tables WHERE tablename = 'channels'
UNION ALL
SELECT 'channel_members', rowsecurity FROM pg_tables WHERE tablename = 'channel_members'
UNION ALL
SELECT 'messages', rowsecurity FROM pg_tables WHERE tablename = 'messages'
UNION ALL
SELECT 'unread_messages', rowsecurity FROM pg_tables WHERE tablename = 'unread_messages';

-- 3. Count records in each table
SELECT 'channels' as table_name, COUNT(*) as record_count FROM channels
UNION ALL
SELECT 'channel_members', COUNT(*) FROM channel_members
UNION ALL
SELECT 'messages', COUNT(*) FROM messages
UNION ALL
SELECT 'unread_messages', COUNT(*) FROM unread_messages;

-- 4. Check policies
SELECT tablename, policyname, cmd FROM pg_policies 
WHERE tablename IN ('messages', 'channels', 'channel_members', 'unread_messages')
ORDER BY tablename, policyname;

-- 5. Check current user
SELECT 'Current user ID:' as info, auth.uid() as user_id
UNION ALL
SELECT 'Current role:', auth.role()::text; 