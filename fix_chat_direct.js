const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://purgvbzgbdinporjahra.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1cmd2YnpnYmRpbXBvcmphaHJhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDY5NzI5MCwiZXhwIjoyMDUwMjc0ODkwfQ.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8'; // This is a placeholder - you'll need the actual service role key

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixChatPolicies() {
  try {
    console.log('🔧 Starting chat policies fix...');
    
    // SQL to fix the infinite recursion issue
    const fixSQL = `
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
    `;

    console.log('📝 Executing SQL fix...');
    
    // Execute the SQL using RPC
    const { data, error } = await supabase.rpc('exec_sql', { sql: fixSQL });
    
    if (error) {
      console.error('❌ Error executing SQL:', error);
      
      // Try alternative approach - execute each statement separately
      console.log('🔄 Trying alternative approach...');
      
      const statements = fixSQL.split(';').filter(stmt => stmt.trim());
      
      for (const statement of statements) {
        if (statement.trim()) {
          try {
            const { error: stmtError } = await supabase.rpc('exec_sql', { sql: statement + ';' });
            if (stmtError) {
              console.error('❌ Error in statement:', statement, stmtError);
            } else {
              console.log('✅ Executed:', statement.substring(0, 50) + '...');
            }
          } catch (e) {
            console.error('❌ Statement failed:', e);
          }
        }
      }
    } else {
      console.log('✅ Chat policies fixed successfully!');
    }
    
    // Test the fix
    console.log('🧪 Testing the fix...');
    const { data: testData, error: testError } = await supabase
      .from('channels')
      .select('id')
      .limit(1);
    
    if (testError) {
      console.error('❌ Test failed:', testError);
    } else {
      console.log('✅ Test successful! Channels can be queried.');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixChatPolicies(); 