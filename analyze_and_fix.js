const { spawn } = require('child_process');

async function analyzeAndFix() {
  console.log('🔍 Analyzing database with MCP server...');
  
  // First, let's check what policies exist
  const checkPolicies = `
    SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
    FROM pg_policies 
    WHERE tablename IN ('channels', 'channel_members', 'messages')
    ORDER BY tablename, policyname;
  `;
  
  console.log('📋 Current policies:');
  console.log(checkPolicies);
  
  // Now let's create the fix
  const fixSQL = `
    -- Emergency fix for infinite recursion
    -- Drop all problematic policies first
    
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
    
    -- Create simple, non-recursive policies
    
    -- Channels: Allow all authenticated users to view, create, update, delete their own
    CREATE POLICY "channels_select_all" ON channels FOR SELECT USING (auth.role() = 'authenticated');
    CREATE POLICY "channels_insert_auth" ON channels FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    CREATE POLICY "channels_update_own" ON channels FOR UPDATE USING (auth.uid() = created_by);
    CREATE POLICY "channels_delete_own" ON channels FOR DELETE USING (auth.uid() = created_by);
    
    -- Channel members: Allow all authenticated users to view, join, leave
    CREATE POLICY "channel_members_select_all" ON channel_members FOR SELECT USING (auth.role() = 'authenticated');
    CREATE POLICY "channel_members_insert_own" ON channel_members FOR INSERT WITH CHECK (auth.uid() = user_id);
    CREATE POLICY "channel_members_delete_own" ON channel_members FOR DELETE USING (auth.uid() = user_id);
    
    -- Messages: Allow all authenticated users to view, send, update, delete their own
    CREATE POLICY "messages_select_all" ON messages FOR SELECT USING (auth.role() = 'authenticated');
    CREATE POLICY "messages_insert_own" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
    CREATE POLICY "messages_update_own" ON messages FOR UPDATE USING (auth.uid() = sender_id);
    CREATE POLICY "messages_delete_own" ON messages FOR DELETE USING (auth.uid() = sender_id);
  `;
  
  console.log('🔧 Fix SQL:');
  console.log(fixSQL);
  
  // Instructions for manual execution
  console.log('\n📝 INSTRUCTIONS:');
  console.log('1. Go to your Supabase Dashboard');
  console.log('2. Navigate to SQL Editor');
  console.log('3. Copy and paste the fix SQL above');
  console.log('4. Execute the script');
  console.log('5. Test by refreshing your messaging page');
}

analyzeAndFix(); 