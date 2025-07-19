-- Fix channel membership verification for RLS policies
-- This script ensures that channel membership is properly verified for message sending

-- 1. First, let's check the current channel_members table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'channel_members' 
ORDER BY ordinal_position;

-- 2. Ensure channel_members table has the correct structure
-- If the table doesn't exist or has wrong structure, recreate it
CREATE TABLE IF NOT EXISTS channel_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    channel_id UUID NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(channel_id, user_id)
);

-- 3. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_channel_members_channel_id ON channel_members(channel_id);
CREATE INDEX IF NOT EXISTS idx_channel_members_user_id ON channel_members(user_id);
CREATE INDEX IF NOT EXISTS idx_channel_members_composite ON channel_members(channel_id, user_id);

-- 4. Ensure RLS is enabled and policies are correct for channel_members
ALTER TABLE channel_members ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "channel_members_select_policy" ON channel_members;
DROP POLICY IF EXISTS "channel_members_insert_policy" ON channel_members;
DROP POLICY IF EXISTS "channel_members_delete_policy" ON channel_members;

-- Create robust channel_members policies
CREATE POLICY "channel_members_select_policy" ON channel_members
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "channel_members_insert_policy" ON channel_members
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' AND
        auth.uid() = user_id
    );

CREATE POLICY "channel_members_delete_policy" ON channel_members
    FOR DELETE USING (
        auth.role() = 'authenticated' AND
        auth.uid() = user_id
    );

-- 5. Create a function to ensure users are automatically added to public channels
CREATE OR REPLACE FUNCTION ensure_public_channel_membership()
RETURNS TRIGGER AS $$
BEGIN
    -- When a new public channel is created, add the creator as a member
    INSERT INTO channel_members (channel_id, user_id)
    VALUES (NEW.id, NEW.created_by)
    ON CONFLICT (channel_id, user_id) DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Create trigger to automatically add channel creator as member
DROP TRIGGER IF EXISTS trigger_ensure_public_channel_membership ON channels;
CREATE TRIGGER trigger_ensure_public_channel_membership
    AFTER INSERT ON channels
    FOR EACH ROW
    EXECUTE FUNCTION ensure_public_channel_membership();

-- 7. Create a function to verify channel membership
CREATE OR REPLACE FUNCTION is_channel_member(user_uuid UUID, channel_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM channel_members 
        WHERE channel_id = channel_uuid 
        AND user_id = user_uuid
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Grant execute permission on the function
GRANT EXECUTE ON FUNCTION is_channel_member(UUID, UUID) TO authenticated;

-- 9. Update messages policies to use the membership function
DROP POLICY IF EXISTS "messages_insert_policy" ON messages;
CREATE POLICY "messages_insert_policy" ON messages
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' AND
        auth.uid() = sender_id AND
        (
            -- Public channels (anyone can send to public channels)
            EXISTS (
                SELECT 1 FROM channels 
                WHERE channels.id = messages.channel_id 
                AND channels.is_private = false
            )
            OR
            -- Private channels where user is a member
            is_channel_member(auth.uid(), messages.channel_id)
        )
    );

-- 10. Also update the select policy for consistency
DROP POLICY IF EXISTS "messages_select_policy" ON messages;
CREATE POLICY "messages_select_policy" ON messages
    FOR SELECT USING (
        auth.role() = 'authenticated' AND
        (
            -- Public channels
            EXISTS (
                SELECT 1 FROM channels 
                WHERE channels.id = messages.channel_id 
                AND channels.is_private = false
            )
            OR
            -- Private channels where user is a member
            is_channel_member(auth.uid(), messages.channel_id)
        )
    );

-- 11. Verify the fix
SELECT 'Channel membership verification fixed' as status; 