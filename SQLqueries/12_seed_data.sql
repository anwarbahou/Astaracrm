-- Sample data for development and testing
-- Insert sample users (these will need to be created through Supabase Auth)
INSERT INTO users (id, email, first_name, last_name, role) VALUES
('11111111-1111-1111-1111-111111111111', 'admin@wolfhunt.com', 'Admin', 'User', 'admin'),
('22222222-2222-2222-2222-222222222222', 'john@wolfhunt.com', 'John', 'Doe', 'manager'),
('33333333-3333-3333-3333-333333333333', 'jane@wolfhunt.com', 'Jane', 'Smith', 'user')
ON CONFLICT (email) DO NOTHING;

-- Insert sample clients
INSERT INTO clients (name, email, phone, industry, stage, tags, country, notes, owner_id) VALUES
('Acme Corporation', 'contact@acme.com', '+212 661 234567', 'Technology', 'active', ARRAY['VIP', 'Enterprise'], 'Morocco', 'Key client in technology sector', '22222222-2222-2222-2222-222222222222'),
('Tech Solutions Ltd', 'info@techsolutions.com', '+33 1 42 86 83 02', 'Technology', 'active', ARRAY['High Value', 'SMB'], 'France', 'Growing tech company', '22222222-2222-2222-2222-222222222222'),
('Global Industries', 'contact@global.com', '+34 91 123 4567', 'Manufacturing', 'prospect', ARRAY['International'], 'Spain', 'Manufacturing company with European operations', '33333333-3333-3333-3333-333333333333')
ON CONFLICT DO NOTHING;

-- Insert sample contacts
INSERT INTO contacts (first_name, last_name, email, phone, role, company, tags, country, status, owner_id) VALUES
('John', 'Smith', 'john@acme.com', '+212 661 234567', 'CEO', 'Acme Corporation', ARRAY['Decision Maker', 'VIP'], 'Morocco', 'active', '22222222-2222-2222-2222-222222222222'),
('Sarah', 'Johnson', 'sarah@techsolutions.com', '+33 1 42 86 83 02', 'CTO', 'Tech Solutions Ltd', ARRAY['Technical', 'Decision Maker'], 'France', 'active', '22222222-2222-2222-2222-222222222222'),
('Mike', 'Wilson', 'mike@global.com', '+34 91 123 4567', 'Procurement Manager', 'Global Industries', ARRAY['Procurement'], 'Spain', 'active', '33333333-3333-3333-3333-333333333333')
ON CONFLICT (email) DO NOTHING;

-- Insert sample deals
INSERT INTO deals (name, value, currency, stage, probability, expected_close_date, source, tags, priority, notes, owner_id) VALUES
('Enterprise Software License', 125000, 'MAD', 'negotiation', 75, '2024-07-15', 'Website', ARRAY['Enterprise', 'Software'], 'high', 'Major enterprise deal', '22222222-2222-2222-2222-222222222222'),
('Tech Consultation Project', 87500, 'EUR', 'qualified', 60, '2024-06-30', 'Referral', ARRAY['Consulting'], 'medium', 'Multi-phase consulting project', '22222222-2222-2222-2222-222222222222'),
('Manufacturing Automation', 245000, 'EUR', 'prospect', 40, '2024-08-20', 'Trade Show', ARRAY['Automation', 'Manufacturing'], 'high', 'Large automation project', '33333333-3333-3333-3333-333333333333')
ON CONFLICT DO NOTHING;

-- Insert sample tasks
INSERT INTO public.tasks (title, description, due_date, priority, status, assigned_to, owner)
VALUES
('Plan Q4 Marketing Campaign', 'Outline strategies and budget for next quarter.', NOW() + INTERVAL '10 days', 'high', 'todo', '22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222'),
('Review Client Feedback', 'Go through recent feedback and compile action points.', NOW() + INTERVAL '2 days', 'medium', 'in_progress', '22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222'),
('Debug Login Issue', 'Investigate and fix the intermittent login problem reported by users.', NOW() + INTERVAL '5 hours', 'high', 'blocked', '33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222'),
('Update User Documentation', 'Add new features and common FAQs to the help docs.', NOW() + INTERVAL '7 days', 'low', 'pending', '33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222'),
('Prepare Presentation for Stakeholders', 'Create slides and talking points for the quarterly update.', NOW() + INTERVAL '1 day', 'high', 'in_progress', '22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222'),
('Archive Old Data', 'Move inactive client data to archive storage.', NOW() - INTERVAL '3 days', 'low', 'completed', '22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222'),
('Address Security Vulnerability', 'Patch critical security flaw identified in recent audit.', NOW() + INTERVAL '1 hour', 'high', 'blocked', '33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222'),
('Cancel Subscription for Test Account', 'Deactivate the trial subscription for the expired test account.', NOW() - INTERVAL '1 day', 'medium', 'cancelled', '22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222')
ON CONFLICT DO NOTHING;

-- Insert sample notes
INSERT INTO notes (title, content, tags, type, visibility, owner_id) VALUES
('Meeting Notes - Acme Corp', 'Discussed Q4 expansion plans and budget allocation for new software systems.', ARRAY['meeting', 'acme'], 'meeting', 'private', '22222222-2222-2222-2222-222222222222'),
('Tech Solutions Requirements', 'Technical requirements for the consulting project including preferred technologies and timeline.', ARRAY['requirements', 'tech'], 'general', 'team', '22222222-2222-2222-2222-222222222222'),
('Industry Trends 2024', 'Key trends in manufacturing automation and digital transformation initiatives.', ARRAY['trends', 'research'], 'idea', 'public', '33333333-3333-3333-3333-333333333333')
ON CONFLICT DO NOTHING;
