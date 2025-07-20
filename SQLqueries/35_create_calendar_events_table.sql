-- =====================================================
-- Calendar Events Table Migration
-- =====================================================
-- This migration creates the calendar_events table with all necessary fields
-- for a comprehensive calendar system integrated with the CRM

-- Create the calendar_events table
CREATE TABLE IF NOT EXISTS calendar_events (
    -- Primary key
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Basic event information
    title TEXT NOT NULL,
    description TEXT,
    
    -- Date and time fields
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    all_day BOOLEAN DEFAULT false,
    
    -- Location and attendees
    location TEXT,
    attendees JSONB DEFAULT '[]'::jsonb,
    
    -- Related entities (foreign keys)
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
    deal_id UUID REFERENCES deals(id) ON DELETE SET NULL,
    
    -- Event categorization and status
    tags TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'cancelled', 'completed')),
    
    -- Reminder and recurrence settings
    reminder_minutes INTEGER DEFAULT 15 CHECK (reminder_minutes >= 0),
    is_recurring BOOLEAN DEFAULT false,
    recurrence_rule TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    owner_id UUID DEFAULT auth.uid() REFERENCES users(id) ON DELETE CASCADE
);

-- =====================================================
-- Enable Row Level Security (RLS)
-- =====================================================
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS Policies
-- =====================================================

-- Users can view calendar events they own
CREATE POLICY "Users can view their own calendar events" ON calendar_events
    FOR SELECT USING (owner_id = auth.uid());

-- Users can insert calendar events for themselves
CREATE POLICY "Users can create their own calendar events" ON calendar_events
    FOR INSERT WITH CHECK (owner_id = auth.uid());

-- Users can update calendar events they own
CREATE POLICY "Users can update their own calendar events" ON calendar_events
    FOR UPDATE USING (owner_id = auth.uid());

-- Users can delete calendar events they own
CREATE POLICY "Users can delete their own calendar events" ON calendar_events
    FOR DELETE USING (owner_id = auth.uid());

-- =====================================================
-- Triggers
-- =====================================================

-- Trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_calendar_events_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_calendar_events_updated_at
    BEFORE UPDATE ON calendar_events
    FOR EACH ROW
    EXECUTE FUNCTION update_calendar_events_updated_at();

-- =====================================================
-- Indexes for Performance
-- =====================================================

-- Index for owner-based queries (most common)
CREATE INDEX idx_calendar_events_owner ON calendar_events(owner_id);

-- Indexes for date range queries
CREATE INDEX idx_calendar_events_start_time ON calendar_events(start_time);
CREATE INDEX idx_calendar_events_end_time ON calendar_events(end_time);

-- Composite index for date range queries with owner
CREATE INDEX idx_calendar_events_owner_start_time ON calendar_events(owner_id, start_time);
CREATE INDEX idx_calendar_events_owner_end_time ON calendar_events(owner_id, end_time);

-- Indexes for related entities
CREATE INDEX idx_calendar_events_client_id ON calendar_events(client_id);
CREATE INDEX idx_calendar_events_contact_id ON calendar_events(contact_id);
CREATE INDEX idx_calendar_events_deal_id ON calendar_events(deal_id);

-- Index for status queries
CREATE INDEX idx_calendar_events_status ON calendar_events(status);

-- Index for tags (using GIN for array operations)
CREATE INDEX idx_calendar_events_tags ON calendar_events USING GIN(tags);

-- Index for attendees (JSONB operations)
CREATE INDEX idx_calendar_events_attendees ON calendar_events USING GIN(attendees);

-- =====================================================
-- Constraints and Validations
-- =====================================================

-- Ensure end_time is after start_time
ALTER TABLE calendar_events 
ADD CONSTRAINT check_event_times 
CHECK (end_time > start_time);

-- Ensure reminder_minutes is reasonable (max 1 week = 10080 minutes)
ALTER TABLE calendar_events 
ADD CONSTRAINT check_reminder_minutes 
CHECK (reminder_minutes <= 10080);

-- =====================================================
-- Comments for Documentation
-- =====================================================

COMMENT ON TABLE calendar_events IS 'Calendar events for the CRM system';
COMMENT ON COLUMN calendar_events.id IS 'Unique identifier for the calendar event';
COMMENT ON COLUMN calendar_events.title IS 'Event title (required)';
COMMENT ON COLUMN calendar_events.description IS 'Event description and notes';
COMMENT ON COLUMN calendar_events.start_time IS 'Event start time (required)';
COMMENT ON COLUMN calendar_events.end_time IS 'Event end time (required)';
COMMENT ON COLUMN calendar_events.all_day IS 'Whether this is an all-day event';
COMMENT ON COLUMN calendar_events.location IS 'Event location (physical or virtual)';
COMMENT ON COLUMN calendar_events.attendees IS 'Array of attendee emails/names in JSONB format';
COMMENT ON COLUMN calendar_events.client_id IS 'Reference to related client (optional)';
COMMENT ON COLUMN calendar_events.contact_id IS 'Reference to related contact (optional)';
COMMENT ON COLUMN calendar_events.deal_id IS 'Reference to related deal (optional)';
COMMENT ON COLUMN calendar_events.tags IS 'Array of tags for event categorization';
COMMENT ON COLUMN calendar_events.status IS 'Event status: scheduled, confirmed, cancelled, completed';
COMMENT ON COLUMN calendar_events.reminder_minutes IS 'Minutes before event to send reminder (0 = no reminder)';
COMMENT ON COLUMN calendar_events.is_recurring IS 'Whether this is a recurring event';
COMMENT ON COLUMN calendar_events.recurrence_rule IS 'iCalendar recurrence rule (RRULE)';
COMMENT ON COLUMN calendar_events.created_at IS 'Timestamp when event was created';
COMMENT ON COLUMN calendar_events.updated_at IS 'Timestamp when event was last updated';
COMMENT ON COLUMN calendar_events.owner_id IS 'User who created the event (defaults to current user)';

-- =====================================================
-- Sample Data (Optional - for testing)
-- =====================================================

-- Uncomment the following lines to insert sample data for testing
/*
INSERT INTO calendar_events (
    title, 
    description, 
    start_time, 
    end_time, 
    location, 
    attendees, 
    tags, 
    status, 
    reminder_minutes
) VALUES 
(
    'Product Demo - Acme Corp',
    'Quarterly product demonstration for Acme Corporation',
    NOW() + INTERVAL '1 day',
    NOW() + INTERVAL '1 day' + INTERVAL '1 hour',
    'Conference Room A',
    '["john.smith@acme.com", "sarah.wilson@acme.com"]',
    ARRAY['meeting', 'demo'],
    'confirmed',
    15
),
(
    'Q4 Sales Review',
    'Internal quarterly sales review meeting',
    NOW() + INTERVAL '2 days',
    NOW() + INTERVAL '2 days' + INTERVAL '2 hours',
    'Virtual - Zoom',
    '["sales@company.com", "marketing@company.com"]',
    ARRAY['internal', 'review'],
    'scheduled',
    30
);
*/

-- =====================================================
-- Migration Complete
-- =====================================================
-- The calendar_events table is now ready for use with:
-- ✅ Complete field set matching the event creation drawer
-- ✅ Proper RLS policies for security
-- ✅ Performance indexes for fast queries
-- ✅ Data validation constraints
-- ✅ Automatic timestamp management
-- ✅ Foreign key relationships to existing tables 