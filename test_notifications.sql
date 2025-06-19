-- Test the notifications table functionality

-- First, let's create the table (run the main SQL first)
-- This file assumes the notifications table already exists

-- Test 1: Insert a test notification
INSERT INTO public.notifications (
    type,
    title,
    description,
    user_id,
    target_user_id,
    entity_id,
    entity_type,
    data,
    priority
) VALUES (
    'contact_added',
    'New Contact Added',
    'John Doe added a new contact: Jane Smith',
    (SELECT id FROM auth.users LIMIT 1), -- Use first user as creator
    (SELECT id FROM auth.users LIMIT 1), -- Use first user as recipient
    'test-contact-123',
    'contact',
    '{"contactName": "Jane Smith", "email": "jane@example.com"}',
    'medium'
);

-- Test 2: Query notifications
SELECT 
    id,
    type,
    title,
    description,
    user_id,
    target_user_id,
    entity_id,
    entity_type,
    data,
    is_read,
    priority,
    created_at,
    updated_at
FROM public.notifications
ORDER BY created_at DESC;

-- Test 3: Update notification (mark as read)
UPDATE public.notifications 
SET is_read = true 
WHERE is_read = false 
LIMIT 1;

-- Test 4: Count unread notifications
SELECT COUNT(*) as unread_count
FROM public.notifications
WHERE is_read = false;

-- Test 5: Delete old notifications (optional cleanup)
-- DELETE FROM public.notifications 
-- WHERE created_at < NOW() - INTERVAL '30 days';

-- Test 6: Check indexes are working
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM public.notifications 
WHERE target_user_id = (SELECT id FROM auth.users LIMIT 1)
ORDER BY created_at DESC; 