-- Create channels table
CREATE TABLE IF NOT EXISTS channels (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    is_private BOOLEAN DEFAULT false,
    UNIQUE(name)
);

-- Create channel_members table for managing channel membership
CREATE TABLE IF NOT EXISTS channel_members (
    channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (channel_id, user_id)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE channel_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Channel policies - SIMPLIFIED to avoid infinite recursion
CREATE POLICY "Users can view all channels" ON channels
    FOR SELECT USING (
        auth.role() = 'authenticated'
    );

CREATE POLICY "Authenticated users can create channels" ON channels
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated'
    );

CREATE POLICY "Channel creator can update their channels" ON channels
    FOR UPDATE USING (
        auth.uid() = created_by
    );

CREATE POLICY "Channel creator can delete their channels" ON channels
    FOR DELETE USING (
        auth.uid() = created_by
    );

-- Channel members policies - SIMPLIFIED to avoid infinite recursion
CREATE POLICY "Users can view channel members" ON channel_members
    FOR SELECT USING (
        auth.role() = 'authenticated'
    );

CREATE POLICY "Users can join channels" ON channel_members
    FOR INSERT WITH CHECK (
        auth.uid() = user_id
    );

CREATE POLICY "Users can leave channels" ON channel_members
    FOR DELETE USING (
        auth.uid() = user_id
    );

-- Messages policies - SIMPLIFIED to avoid infinite recursion
CREATE POLICY "Users can view messages" ON messages
    FOR SELECT USING (
        auth.role() = 'authenticated'
    );

CREATE POLICY "Users can send messages" ON messages
    FOR INSERT WITH CHECK (
        auth.uid() = sender_id
    );

CREATE POLICY "Users can update their own messages" ON messages
    FOR UPDATE USING (
        auth.uid() = sender_id
    );

CREATE POLICY "Users can delete their own messages" ON messages
    FOR DELETE USING (
        auth.uid() = sender_id
    );

-- Create indexes for better performance
CREATE INDEX idx_channels_created_by ON channels(created_by);
CREATE INDEX idx_channels_is_private ON channels(is_private);
CREATE INDEX idx_channel_members_user_id ON channel_members(user_id);
CREATE INDEX idx_messages_channel_id ON messages(channel_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- Grant permissions to authenticated users
GRANT ALL ON channels TO authenticated;
GRANT ALL ON channel_members TO authenticated;
GRANT ALL ON messages TO authenticated; 