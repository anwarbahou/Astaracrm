
-- Sample data insertion for development/testing
-- This file contains initial data to populate the tables

-- Insert sample email templates
INSERT INTO email_templates (name, subject, body, template_type) VALUES
('Follow-up After Demo', 'Thank you for the demo - {{client_name}}', 'Hi {{contact_name}},

Thank you for taking the time to see our product demonstration yesterday. I hope you found it valuable and that it addressed your key requirements.

I wanted to follow up and see if you have any additional questions about the features we discussed. I''m here to help clarify anything that might be unclear.

Next steps:
- Review the proposal we sent
- Schedule a technical deep-dive if needed
- Discuss implementation timeline

Please let me know if you''d like to schedule another call to discuss further.

Best regards,
{{user_name}}', 'follow_up'),

('Proposal Submission', 'Proposal for {{client_name}} - {{project_name}}', 'Dear {{contact_name}},

Please find attached our comprehensive proposal for {{project_name}}.

The proposal includes:
- Technical specifications
- Implementation timeline  
- Pricing breakdown
- Support packages

Key highlights:
- {{highlight_1}}
- {{highlight_2}}
- {{highlight_3}}

I''m available to discuss any questions you may have about the proposal. We''re excited about the opportunity to work with {{client_name}}.

Best regards,
{{user_name}}', 'proposal'),

('Meeting Reminder', 'Reminder: Meeting tomorrow at {{meeting_time}}', 'Hi {{contact_name}},

This is a friendly reminder about our meeting scheduled for tomorrow at {{meeting_time}} to discuss {{meeting_topic}}.

Meeting details:
- Date: {{meeting_date}}
- Time: {{meeting_time}}
- Location: {{meeting_location}}
- Agenda: {{meeting_agenda}}

Please let me know if you need to reschedule or if you have any questions before our meeting.

Looking forward to speaking with you!

Best regards,
{{user_name}}', 'meeting');
