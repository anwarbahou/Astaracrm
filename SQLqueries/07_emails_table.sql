
-- Emails table for email management
CREATE TABLE IF NOT EXISTS emails (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    from_email TEXT NOT NULL,
    from_name TEXT NOT NULL,
    to_email TEXT NOT NULL,
    cc_emails TEXT[],
    bcc_emails TEXT[],
    subject TEXT NOT NULL,
    preview TEXT,
    body TEXT NOT NULL,
    email_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_read BOOLEAN DEFAULT false,
    is_starred BOOLEAN DEFAULT false,
    client_name TEXT,
    thread_id INTEGER DEFAULT 1,
    attachments TEXT[],
    email_type TEXT DEFAULT 'received' CHECK (email_type IN ('received', 'sent')),
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    owner UUID DEFAULT auth.uid() REFERENCES users(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view emails they own" ON emails
    FOR SELECT USING (owner = auth.uid());

CREATE POLICY "Users can insert their own emails" ON emails
    FOR INSERT WITH CHECK (owner = auth.uid());

CREATE POLICY "Users can update emails they own" ON emails
    FOR UPDATE USING (owner = auth.uid());

CREATE POLICY "Users can delete emails they own" ON emails
    FOR DELETE USING (owner = auth.uid());

-- Trigger for updated_at
CREATE TRIGGER update_emails_updated_at
    BEFORE UPDATE ON emails
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_emails_owner ON emails(owner);
CREATE INDEX idx_emails_email_date ON emails(email_date);
CREATE INDEX idx_emails_email_type ON emails(email_type);
CREATE INDEX idx_emails_is_read ON emails(is_read);
CREATE INDEX idx_emails_thread_id ON emails(thread_id);
