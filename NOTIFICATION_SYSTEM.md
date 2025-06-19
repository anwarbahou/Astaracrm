# CRM Notification System

## Overview

This CRM application implements a centralized notification system that notifies users about important actions such as adding contacts, clients, and deals.

## Features

- **Role-based notifications**: 
  - Admins receive notifications for all users' actions
  - Regular users only receive notifications for their own actions
- **Real-time updates**: Notification count updates dynamically
- **Centralized service**: All notification logic is handled in a single service
- **Scalable architecture**: Easy to add new notification types

## Architecture

### Core Components

1. **NotificationService** (`src/services/notificationService.ts`)
   - Manages all notification creation and retrieval
   - Implements role-based notification logic
   - Currently uses localStorage (can be upgraded to database)

2. **NotificationSidebar** (`src/components/layout/NotificationSidebar.tsx`)
   - Displays notifications in a sidebar
   - Supports marking as read, clearing all notifications
   - Shows notification icons based on type

3. **TopNavigation** (`src/components/layout/TopNavigation.tsx`)
   - Shows notification bell with unread count
   - Updates count dynamically

## Integration Points

The notification service is integrated into the following components:

### Contact Creation
- **File**: `src/components/contacts/AddContactForm.tsx`
- **Trigger**: When a new contact is successfully created
- **Notification**: "New Contact Added - [Contact Name] has been added to your contacts"

### Client Creation
- **File**: `src/components/clients/AddClientForm.tsx`
- **Trigger**: When a new client is successfully created
- **Notification**: "New Client Added - [Client Name] has been added as a new client"

### Deal Creation
- **File**: `src/hooks/useDeals.ts`
- **Trigger**: When a new deal is successfully created
- **Notification**: "New Deal Created - [Deal Name] - $[Value] has been created"

## Notification Types

Current supported notification types:
- `contact_added`: When a contact is created
- `client_added`: When a client is created
- `deal_added`: When a deal is created
- `contact_updated`: When a contact is updated (ready for future use)
- `client_updated`: When a client is updated (ready for future use)
- `deal_updated`: When a deal is updated (ready for future use)

## Usage

### Creating Notifications

```typescript
import { notificationService } from '@/services/notificationService';

// For contacts
await notificationService.notifyContactAdded(
  contactName,
  contactId,
  { userId: user.id, userRole: userProfile.role }
);

// For clients
await notificationService.notifyClientAdded(
  clientName,
  clientId,
  { userId: user.id, userRole: userProfile.role }
);

// For deals
await notificationService.notifyDealAdded(
  dealTitle,
  dealId,
  dealValue,
  { userId: user.id, userRole: userProfile.role }
);
```

### Retrieving Notifications

```typescript
// Get notifications for a specific user
const notifications = notificationService.getNotificationsForUser(userId);

// Get unread count
const unreadCount = notificationService.getUnreadCount(userId);

// Mark as read
notificationService.markAsRead(notificationId);

// Mark all as read
notificationService.markAllAsRead(userId);
```

## Storage

Currently, notifications are stored in localStorage with the key `crm_notifications`. This provides:
- Persistence across browser sessions
- Quick access without network requests
- Easy implementation for development

### Future Database Migration

The service is designed to easily migrate to database storage. To implement:

1. Create a `notifications` table in Supabase
2. Replace localStorage methods with Supabase queries
3. Add real-time subscriptions for live updates

## Configuration

### Role-based Logic

The notification system implements the following logic:

```typescript
// User performs action
if (userRole !== 'admin') {
  // Create notification for user
  // Also create notifications for all admins
} else {
  // Admin only gets their own notification
}
```

This ensures:
- Admins see all activity across the system
- Users only see their own activity
- No duplicate notifications for admins

## Adding New Notification Types

To add a new notification type:

1. **Add to NotificationData interface**:
```typescript
type: 'contact_added' | 'client_added' | 'deal_added' | 'your_new_type'
```

2. **Add helper method to NotificationService**:
```typescript
async notifyYourNewAction(
  entityName: string,
  entityId: string,
  userContext: UserContext
): Promise<void> {
  await this.createNotifications({
    type: 'your_new_type',
    title: 'Your Action Title',
    description: `${entityName} description`,
    entity_id: entityId,
    entity_type: 'entity',
    priority: 'medium'
  }, userContext);
}
```

3. **Add icon mapping in NotificationSidebar**:
```typescript
case "your_new_type":
  return <YourIcon className="h-4 w-4 text-color-500" />;
```

4. **Integrate into relevant component**:
```typescript
await notificationService.notifyYourNewAction(
  entityName,
  entityId,
  { userId: user.id, userRole: userProfile.role }
);
```

## Performance Considerations

- Notifications are loaded only when the sidebar is opened
- Unread count is cached and updated on user actions
- localStorage provides fast access without network overhead
- Service implements error handling to prevent notification failures from blocking user actions

## Testing

To test the notification system:

1. **Create test data**: Add contacts, clients, or deals
2. **Check notifications**: Open notification sidebar
3. **Test role behavior**: 
   - Login as regular user, add items, check notifications
   - Login as admin, check if you see all notifications
4. **Test interactions**: Mark as read, clear all, etc.

## Troubleshooting

Common issues:

1. **Notifications not showing**: Check browser localStorage for `crm_notifications`
2. **Wrong role behavior**: Verify user role in AuthContext
3. **Count not updating**: Check useEffect dependencies in TopNavigation
4. **Icons not displaying**: Verify icon imports in NotificationSidebar 