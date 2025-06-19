# 🔔 Notifications System Setup

## Quick Setup

### 1. Create the Notifications Table

Copy and paste this SQL into your **Supabase SQL Editor**:

```sql
-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN (
        'contact_added', 
        'client_added', 
        'deal_added', 
        'contact_updated', 
        'client_updated', 
        'deal_updated'
    )),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    target_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    entity_id TEXT NOT NULL,
    entity_type TEXT NOT NULL CHECK (entity_type IN ('contact', 'client', 'deal')),
    data JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT FALSE,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_target_user_id ON public.notifications(target_user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(type);

-- Enable RLS (Row Level Security)
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (target_user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING (target_user_id = auth.uid());

CREATE POLICY "Authenticated users can create notifications" ON public.notifications
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own notifications" ON public.notifications
    FOR DELETE USING (target_user_id = auth.uid());

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_notifications_updated_at 
    BEFORE UPDATE ON public.notifications
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
```

### 2. Test the Setup

After running the SQL, test by:

1. **Add a contact/client/deal** in your app
2. **Check the notification bell** in the top navigation
3. **Open the notification sidebar** to see the notification
4. **Check browser console** for logs like:
   ```
   🔔 Creating notifications for: contact_added by user: [user-id]
   👤 Performer: John Doe ( user )
   ✅ Created 2 notifications for contact_added
   ```

### 3. What You'll See

#### For Regular Users:
- ✅ Notifications for their own actions: "You added contact John Doe"
- ✅ Admins get notified: "Jane Smith (user) added contact John Doe"

#### For Admins:
- ✅ Notifications for their own actions: "You added contact John Doe"
- ✅ Notifications for ALL user actions: "John Smith (user) added contact Jane Doe"
- ✅ Higher priority notifications for oversight

#### Real-time Features:
- ✅ Instant notifications across browser tabs
- ✅ Live unread count updates
- ✅ Real-time mark as read/clear all

## Troubleshooting

### Infinite Loading in Sidebar

If you see infinite loading, check the browser console for:

```
⚠️ Notifications table does not exist yet. Please run the SQL migration.
```

**Solution**: Run the SQL above in Supabase SQL Editor.

### No Notifications Appearing

1. **Check user role**: Make sure users have proper roles (admin/user)
2. **Check console logs**: Look for notification creation logs
3. **Verify table exists**: Run `SELECT * FROM public.notifications;` in Supabase

### Real-time Not Working

1. **Check Supabase settings**: Ensure Realtime is enabled for the notifications table
2. **Check browser console**: Look for WebSocket connection errors
3. **Refresh the page**: Sometimes helps re-establish the connection

## Features Included

### 🎯 Smart Notifications
- **User Context**: Always shows who did what
- **Role-based**: Admins see everything, users see their own
- **Rich Data**: Includes performer name, email, role, timestamp

### ⚡ Real-time Updates
- **Instant Delivery**: Notifications appear immediately
- **Cross-tab Sync**: Works across multiple browser tabs
- **Live Counts**: Unread count updates in real-time

### 🛡️ Security
- **RLS Policies**: Users only see their own notifications
- **Data Protection**: Secure user information handling
- **Proper Permissions**: Controlled access to notification data

### 📊 Performance
- **Optimized Queries**: Proper database indexes
- **Efficient Updates**: Optimistic UI updates
- **Fallback Support**: localStorage backup if database fails

The system is now ready for production use! 🚀 