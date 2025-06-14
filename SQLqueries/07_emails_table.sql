
-- Emails table for email communication tracking
CREATE TABLE IF NOT EXISTS emails (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    from_email TEXT NOT NULL,
    from_name TEXT,
    to_email TEXT NOT NULL,
    to_name TEXT,
    cc_emails TEXT[],
    bcc_emails TEXT[],
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    html_body TEXT,
    type email_type DEFAULT 'received',
    is_read BOOLEAN DEFAULT false,
    is_starred BOOLEAN DEFAULT false,
    thread_id UUID,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
    deal_id UUID REFERENCES deals(id) ON DELETE SET NULL,
    tags TEXT[],
    attachments JSONB DEFAULT '[]',
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    owner_id UUID DEFAULT auth.uid() REFERENCES users(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view emails they own" ON emails
    FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Users can insert their own emails" ON emails
    FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update emails they own" ON emails
    FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Users can delete emails they own" ON emails
    FOR DELETE USING (owner_id = auth.uid());

-- Trigger for updated_at
CREATE TRIGGER update_emails_updated_at
    BEFORE UPDATE ON emails
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_emails_owner ON emails(owner_id);
CREATE INDEX idx_emails_type ON emails(type);
CREATE INDEX idx_emails_thread_id ON emails(thread_id);
CREATE INDEX idx_emails_client_id ON emails(client_id);
CREATE INDEX idx_emails_contact_id ON emails(contact_id);
CREATE INDEX idx_emails_deal_id ON emails(deal_id);
CREATE INDEX idx_emails_sent_at ON emails(sent_at);
