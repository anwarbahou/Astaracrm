-- =====================================================
-- Message Reactions Table Migration
-- =====================================================
-- This migration creates the message_reactions table to support emoji reactions
-- on messages in the chat system

-- Create the message_reactions table
CREATE TABLE IF NOT EXISTS message_reactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    emoji TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure a user can only react once with the same emoji to a message
    UNIQUE(message_id, user_id, emoji)
);

-- =====================================================
-- Enable Row Level Security (RLS)
-- =====================================================
ALTER TABLE message_reactions ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS Policies
-- =====================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "message_reactions_select_policy" ON message_reactions;
DROP POLICY IF EXISTS "message_reactions_insert_policy" ON message_reactions;
DROP POLICY IF EXISTS "message_reactions_delete_policy" ON message_reactions;

-- Simplified policies - everyone can react to everyone's messages
CREATE POLICY "message_reactions_select_policy" ON message_reactions
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "message_reactions_insert_policy" ON message_reactions
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' AND
        auth.uid() = user_id
    );

CREATE POLICY "message_reactions_delete_policy" ON message_reactions
    FOR DELETE USING (
        auth.role() = 'authenticated' AND
        auth.uid() = user_id
    );

-- =====================================================
-- Indexes for Performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_message_reactions_message_id ON message_reactions(message_id);
CREATE INDEX IF NOT EXISTS idx_message_reactions_user_id ON message_reactions(user_id);
CREATE INDEX IF NOT EXISTS idx_message_reactions_emoji ON message_reactions(emoji);
CREATE INDEX IF NOT EXISTS idx_message_reactions_created_at ON message_reactions(created_at);

-- =====================================================
-- Grant Permissions
-- =====================================================
GRANT ALL ON message_reactions TO authenticated;

-- =====================================================
-- Helper Functions
-- =====================================================

-- Function to get reaction counts for a message
CREATE OR REPLACE FUNCTION get_message_reaction_counts(message_uuid UUID)
RETURNS TABLE(emoji TEXT, count BIGINT, user_reacted BOOLEAN) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        mr.emoji,
        COUNT(*)::BIGINT as count,
        EXISTS(
            SELECT 1 FROM message_reactions mr2
            WHERE mr2.message_id = message_uuid 
            AND mr2.user_id = auth.uid() 
            AND mr2.emoji = mr.emoji
        ) as user_reacted
    FROM message_reactions mr
    WHERE mr.message_id = message_uuid
    GROUP BY mr.emoji
    ORDER BY count DESC, mr.emoji;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_message_reaction_counts(UUID) TO authenticated;

-- =====================================================
-- Verification
-- =====================================================
SELECT 'Message reactions table created successfully' as status; 