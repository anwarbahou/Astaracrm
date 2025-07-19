-- Comprehensive fix for chat system issues
-- This script addresses missing policies, infinite recursion, and ensures proper functionality

-- 1. Drop all existing problematic policies
DROP POLICY IF EXISTS "Users can view all channels" ON channels;
DROP POLICY IF EXISTS "Authenticated users can create channels" ON channels;
DROP POLICY IF EXISTS "Channel creator can update their channels" ON channels;
DROP POLICY IF EXISTS "Channel creator can delete their channels" ON channels;
DROP POLICY IF EXISTS "Any authenticated user can create public channels" ON channels;

DROP POLICY IF EXISTS "Users can view channel members" ON channel_members;
DROP POLICY IF EXISTS "Users can join channels" ON channel_members;
DROP POLICY IF EXISTS "Users can leave channels" ON channel_members;
DROP POLICY IF EXISTS "Users can view channel members for public channels" ON channel_members;
DROP POLICY IF EXISTS "Users can view channel members for private channels they belong to" ON channel_members;
DROP POLICY IF EXISTS "Users can leave channels they belong to" ON channel_members;

DROP POLICY IF EXISTS "Users can view messages" ON messages;
DROP POLICY IF EXISTS "Users can send messages" ON messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON messages;
DROP POLICY IF EXISTS "Users can delete their own messages" ON messages;
DROP POLICY IF EXISTS "Anyone can view public channel messages" ON messages;
DROP POLICY IF EXISTS "Channel members can read messages" ON messages;
DROP POLICY IF EXISTS "Users can manage their own messages" ON messages;

-- 2. Create robust channels policies
CREATE POLICY "channels_select_policy" ON channels
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "channels_insert_policy" ON channels
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "channels_update_policy" ON channels
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "channels_delete_policy" ON channels
    FOR DELETE USING (auth.uid() = created_by);

-- 3. Create robust channel_members policies (previously missing)
CREATE POLICY "channel_members_select_policy" ON channel_members
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "channel_members_insert_policy" ON channel_members
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "channel_members_delete_policy" ON channel_members
    FOR DELETE USING (auth.uid() = user_id);

-- 4. Create robust messages policies
CREATE POLICY "messages_select_policy" ON messages
    FOR SELECT USING (
        auth.role() = 'authenticated' AND (
            -- Public channels
            EXISTS (
                SELECT 1 FROM channels 
                WHERE channels.id = messages.channel_id 
                AND NOT channels.is_private
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

CREATE POLICY "messages_insert_policy" ON messages
    FOR INSERT WITH CHECK (
        auth.uid() = sender_id AND
        (
            -- Public channels
            EXISTS (
                SELECT 1 FROM channels 
                WHERE channels.id = messages.channel_id 
                AND NOT channels.is_private
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

CREATE POLICY "messages_update_policy" ON messages
    FOR UPDATE USING (auth.uid() = sender_id);

CREATE POLICY "messages_delete_policy" ON messages
    FOR DELETE USING (auth.uid() = sender_id);

-- 5. Create unread_messages policies (if not exists)
CREATE POLICY "unread_messages_select_policy" ON unread_messages
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "unread_messages_insert_policy" ON unread_messages
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "unread_messages_update_policy" ON unread_messages
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "unread_messages_delete_policy" ON unread_messages
    FOR DELETE USING (auth.uid() = user_id);

-- 6. Create function to handle unread message tracking
CREATE OR REPLACE FUNCTION handle_new_message()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert or update unread count for all channel members except sender
    INSERT INTO unread_messages (user_id, channel_id, count)
    SELECT 
        cm.user_id,
        NEW.channel_id,
        1
    FROM channel_members cm
    WHERE cm.channel_id = NEW.channel_id
    AND cm.user_id != NEW.sender_id
    ON CONFLICT (user_id, channel_id)
    DO UPDATE SET count = unread_messages.count + 1;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Create trigger for unread message tracking
DROP TRIGGER IF EXISTS trigger_handle_new_message ON messages;
CREATE TRIGGER trigger_handle_new_message
    AFTER INSERT ON messages
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_message();

-- 8. Create function to reset unread count when user views channel
CREATE OR REPLACE FUNCTION reset_unread_count(user_uuid UUID, channel_uuid UUID)
RETURNS VOID AS $$
BEGIN
    DELETE FROM unread_messages 
    WHERE user_id = user_uuid 
    AND channel_id = channel_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Grant necessary permissions
GRANT EXECUTE ON FUNCTION reset_unread_count(UUID, UUID) TO authenticated;

-- 10. Create indexes for better performance (if not exists)
CREATE INDEX IF NOT EXISTS idx_messages_channel_created ON messages(channel_id, created_at);
CREATE INDEX IF NOT EXISTS idx_channel_members_user ON channel_members(user_id);
CREATE INDEX IF NOT EXISTS idx_unread_messages_user ON unread_messages(user_id);

-- 11. Verify the fix
SELECT 'Channels policies:' as info, COUNT(*) as count FROM pg_policies WHERE tablename = 'channels'
UNION ALL
SELECT 'Channel members policies:', COUNT(*) FROM pg_policies WHERE tablename = 'channel_members'
UNION ALL
SELECT 'Messages policies:', COUNT(*) FROM pg_policies WHERE tablename = 'messages'
UNION ALL
SELECT 'Unread messages policies:', COUNT(*) FROM pg_policies WHERE tablename = 'unread_messages'; 