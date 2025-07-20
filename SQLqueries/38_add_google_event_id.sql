-- Add google_event_id column to calendar_events table
ALTER TABLE calendar_events 
ADD COLUMN google_event_id TEXT UNIQUE;

-- Create index for better performance
CREATE INDEX idx_calendar_events_google_id ON calendar_events(google_event_id);

-- Add comment for documentation
COMMENT ON COLUMN calendar_events.google_event_id IS 'Google Calendar event ID for sync purposes'; 