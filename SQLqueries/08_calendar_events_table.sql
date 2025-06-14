
-- Calendar events table for scheduling
CREATE TABLE IF NOT EXISTS calendar_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    all_day BOOLEAN DEFAULT false,
    location TEXT,
    attendees JSONB DEFAULT '[]',
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
    deal_id UUID REFERENCES deals(id) ON DELETE SET NULL,
    reminder_minutes INTEGER DEFAULT 15,
    is_recurring BOOLEAN DEFAULT false,
    recurrence_rule TEXT,
    tags TEXT[],
    status TEXT DEFAULT 'scheduled',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    owner_id UUID DEFAULT auth.uid() REFERENCES users(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view calendar events they own" ON calendar_events
    FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Users can insert their own calendar events" ON calendar_events
    FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update calendar events they own" ON calendar_events
    FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Users can delete calendar events they own" ON calendar_events
    FOR DELETE USING (owner_id = auth.uid());

-- Trigger for updated_at
CREATE TRIGGER update_calendar_events_updated_at
    BEFORE UPDATE ON calendar_events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_calendar_events_owner ON calendar_events(owner_id);
CREATE INDEX idx_calendar_events_start_time ON calendar_events(start_time);
CREATE INDEX idx_calendar_events_end_time ON calendar_events(end_time);
CREATE INDEX idx_calendar_events_client_id ON calendar_events(client_id);
CREATE INDEX idx_calendar_events_contact_id ON calendar_events(contact_id);
CREATE INDEX idx_calendar_events_deal_id ON calendar_events(deal_id);
