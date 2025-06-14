
-- Email templates table for reusable email content
CREATE TABLE IF NOT EXISTS email_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    subject TEXT,
    body TEXT NOT NULL,
    template_type TEXT DEFAULT 'general' CHECK (template_type IN ('general', 'follow_up', 'proposal', 'meeting')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    owner UUID DEFAULT auth.uid() REFERENCES users(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view email templates they own" ON email_templates
    FOR SELECT USING (owner = auth.uid());

CREATE POLICY "Users can insert their own email templates" ON email_templates
    FOR INSERT WITH CHECK (owner = auth.uid());

CREATE POLICY "Users can update email templates they own" ON email_templates
    FOR UPDATE USING (owner = auth.uid());

CREATE POLICY "Users can delete email templates they own" ON email_templates
    FOR DELETE USING (owner = auth.uid());

-- Trigger for updated_at
CREATE TRIGGER update_email_templates_updated_at
    BEFORE UPDATE ON email_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_email_templates_owner ON email_templates(owner);
CREATE INDEX idx_email_templates_template_type ON email_templates(template_type);
