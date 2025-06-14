
-- Contacts table for individual people
CREATE TABLE IF NOT EXISTS contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    role TEXT,
    company TEXT,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    tags TEXT[],
    country TEXT,
    status contact_status DEFAULT 'active',
    avatar_url TEXT,
    notes TEXT,
    address TEXT,
    linkedin_url TEXT,
    twitter_url TEXT,
    last_contacted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    owner_id UUID DEFAULT auth.uid() REFERENCES users(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view contacts they own" ON contacts
    FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Users can insert their own contacts" ON contacts
    FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update contacts they own" ON contacts
    FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Users can delete contacts they own" ON contacts
    FOR DELETE USING (owner_id = auth.uid());

CREATE POLICY "Admins can access all contacts" ON contacts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Trigger for updated_at
CREATE TRIGGER update_contacts_updated_at
    BEFORE UPDATE ON contacts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_contacts_owner ON contacts(owner_id);
CREATE INDEX idx_contacts_client_id ON contacts(client_id);
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_company ON contacts(company);
CREATE INDEX idx_contacts_status ON contacts(status);
