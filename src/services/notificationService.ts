
import { supabase } from '@/integrations/supabase/client';
import { ActivityLog } from '@/types/activity';

export interface NotificationData {
  id: string;
  type:
    | 'contact_added'  | 'client_added'  | 'deal_added'  | 'task_added'
    | 'contact_updated'| 'client_updated'| 'deal_updated'| 'task_updated'
    | 'contact_deleted'| 'client_deleted'| 'deal_deleted'| 'task_deleted';
  title: string;
  description: string;
  user_id: string;
  target_user_id: string; // Who should receive this notification
  entity_id: string; // ID of the contact/client/deal
  entity_type: 'contact' | 'client' | 'deal';
  data?: Record<string, any>; // Additional data
  is_read: boolean;
  created_at: string;
  updated_at?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface NotificationInput {
  type: NotificationData['type'];
  title: string;
  description: string;
  entity_id: string;
  entity_type: NotificationData['entity_type'];
  data?: Record<string, any>;
  priority?: NotificationData['priority'];
}

export interface UserContext {
  userId: string;
  userRole: 'admin' | 'manager' | 'team_leader' | 'user';
}

class NotificationService {
  /**
   * Create notifications for an action
   * Admins get notifications for all actions
   * Users only get notifications for their own actions
   */
  async createNotifications(
    input: NotificationInput,
    userContext: UserContext
  ): Promise<void> {
    try {
      console.log('🔔 Creating notifications for:', input.type, 'by user:', userContext.userId, 'role:', userContext.userRole);
      
      const notifications: Omit<NotificationData, 'id' | 'created_at'>[] = [];
      
      // ALWAYS get user information - we need it for all notifications
      const { data: userInfo, error: userError } = await supabase
        .from('users')
        .select('first_name, last_name, email, role')
        .eq('id', userContext.userId)
        .single();
      
      if (userError || !userInfo) {
        console.error('❌ Could not fetch user information:', userError);
        return;
      }

      const userName = `${userInfo.first_name || ''} ${userInfo.last_name || ''}`.trim() || 
                      userInfo.email?.split('@')[0] || 'Unknown User';

      console.log('👤 Performer:', userName, '(', userInfo.role, ')');

      // Enhanced data with complete user context
      const enhancedData = {
        ...input.data,
        performerName: userName,
        performerEmail: userInfo.email,
        performerRole: userInfo.role,
        performerId: userContext.userId,
        timestamp: new Date().toISOString()
      };
      
      // Create notification for the user who performed the action
      notifications.push({
        type: input.type,
        title: input.title,
        description: input.description, // Keep original description for user's own notification
        user_id: userContext.userId,
        target_user_id: userContext.userId,
        entity_id: input.entity_id,
        entity_type: input.entity_type,
        data: enhancedData,
        is_read: false,
        priority: input.priority || 'medium'
      });

      // Create notifications for admins (they should know about ALL actions)
      console.log('🔍 Fetching admins for notifications...');
      const { data: admins, error: adminError } = await supabase
        .from('users')
        .select('id, first_name, last_name, email')
        .eq('role', 'admin');

      if (adminError) {
        console.error('Error fetching admins:', adminError);
      } else if (admins && admins.length > 0) {
        console.log('👑 Found', admins.length, 'admins');
        
        // Create notification for each admin (EXCLUDING the performer to avoid duplicates)
        admins.forEach(admin => {
          // Skip if this admin is the one who performed the action (they already have their own notification)
          if (admin.id !== userContext.userId) {
            // Replace "You" with the actual user name in the description
            const adminDescription = input.description.replace(/^You/, userName);
            
            notifications.push({
              type: input.type,
              title: `${userName} - ${input.title}`,
              description: adminDescription,
              user_id: userContext.userId, // Who performed the action
              target_user_id: admin.id, // Admin who should see it
              entity_id: input.entity_id,
              entity_type: input.entity_type,
              data: enhancedData,
              is_read: false,
              priority: 'high' // Higher priority for admin oversight
            });
          }
        });
      }

      // Save notifications to Supabase database and activity logs
      await this.saveNotificationsToDatabase(notifications);
      this.saveToActivityLogs(input, userContext, userInfo);
      
      console.log(`✅ Created ${notifications.length} notifications for ${input.type}`);
      console.log('📋 Notification details:', notifications.map(n => ({
        type: n.type,
        title: n.title,
        description: n.description,
        target_user: n.target_user_id,
        performer: n.user_id,
        priority: n.priority
      })));
    } catch (error) {
      console.error('❌ Error creating notifications:', error);
    }
  }

  /**
   * Save notifications to Supabase database
   */
  private async saveNotificationsToDatabase(notifications: Omit<NotificationData, 'id' | 'created_at'>[]): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications' as any)
        .insert(notifications.map(notif => ({
          type: notif.type,
          title: notif.title,
          description: notif.description,
          user_id: notif.user_id,
          target_user_id: notif.target_user_id,
          entity_id: notif.entity_id,
          entity_type: notif.entity_type,
          data: notif.data || {},
          is_read: notif.is_read,
          priority: notif.priority
        })));

      if (error) {
        console.error('Error saving notifications to database:', error);
        throw error;
      }

      console.log('✅ Notifications saved to database successfully');
    } catch (error) {
      console.error('Error saving notifications to database:', error);
      // Fallback to localStorage if database fails
      this.saveNotificationsToStorage(notifications);
    }
  }

  /**
   * Save notifications to localStorage (fallback solution)
   */
  private saveNotificationsToStorage(notifications: Omit<NotificationData, 'id' | 'created_at'>[]): void {
    try {
      const existingNotifications = this.getStoredNotifications();
      
      const newNotifications: NotificationData[] = notifications.map(notif => ({
        ...notif,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString()
      }));

      const allNotifications = [...existingNotifications, ...newNotifications];
      
      localStorage.setItem('crm_notifications', JSON.stringify(allNotifications));
    } catch (error) {
      console.error('Error saving notifications to storage:', error);
    }
  }

  /**
   * Save activity to activity logs
   */
  private saveToActivityLogs(
    input: NotificationInput, 
    userContext: UserContext, 
    userInfo: any
  ): void {
    try {
      const userName = userInfo 
        ? `${userInfo.first_name} ${userInfo.last_name}`.trim() || userInfo.email
        : 'Unknown User';
      
      const userInitials = userInfo
        ? `${userInfo.first_name?.[0] || ''}${userInfo.last_name?.[0] || ''}`.toUpperCase() || userInfo.email?.[0]?.toUpperCase()
        : 'U';

      const activity: ActivityLog = {
        id: Date.now(),
        type: input.type,
        action: this.getActionText(input.type),
        details: input.description,
        user: userName,
        userAvatar: userInitials,
        timestamp: new Date().toISOString(),
        entity: this.getEntityText(input.entity_type),
        entityId: input.entity_id,
        relatedTo: this.getRelatedToText(input),
        changes: this.getChangesFromData(input)
      };

      // Save to localStorage with other activities
      const existingActivities = this.getStoredActivities();
      const allActivities = [activity, ...existingActivities];
      localStorage.setItem('crm_activities', JSON.stringify(allActivities));
      
      console.log('💾 Activity saved to logs:', activity);
    } catch (error) {
      console.error('Error saving to activity logs:', error);
    }
  }

  /**
   * Get stored activities from localStorage
   */
  getStoredActivities(): ActivityLog[] {
    try {
      const stored = localStorage.getItem('crm_activities');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error parsing stored activities:', error);
      return [];
    }
  }

  /**
   * Helper methods for activity log formatting
   */
  private getActionText(type: string): string {
    const actionMap: Record<string, string> = {
      'contact_added': 'Added new contact',
      'client_added': 'Added new client', 
      'deal_added': 'Created new deal',
      'contact_updated': 'Updated contact',
      'client_updated': 'Updated client',
      'deal_updated': 'Updated deal'
    };
    return actionMap[type] || 'Unknown action';
  }

  private getEntityText(entityType: string): string {
    const entityMap: Record<string, string> = {
      'contact': 'Contact',
      'client': 'Client',
      'deal': 'Deal'
    };
    return entityMap[entityType] || 'Unknown';
  }

  private getRelatedToText(input: NotificationInput): string {
    if (input.data?.clientName) return input.data.clientName;
    if (input.data?.contactName) return input.data.contactName;
    if (input.data?.dealName) return input.data.dealName;
    return 'System';
  }

  private getChangesFromData(input: NotificationInput): Record<string, string> {
    const changes: Record<string, string> = {};
    
    if (input.entity_type === 'contact') {
      changes.status = 'Active';
      changes.created_at = new Date().toISOString();
    } else if (input.entity_type === 'client') {
      changes.status = 'Active';
      changes.stage = 'Lead';
    } else if (input.entity_type === 'deal') {
      changes.stage = 'Prospect';
      if (input.data?.value) changes.value = `$${input.data.value}`;
    }
    
    return changes;
  }

  /**
   * Get notifications for a user from Supabase
   */
  async getNotificationsForUser(userId: string): Promise<NotificationData[]> {
    try {
      const { data, error } = await supabase
        .from('notifications' as any)
        .select('*')
        .eq('target_user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching notifications from database:', error);
        
        // Check if it's a table not found error
        if (error.message?.includes('relation "public.notifications" does not exist')) {
          console.warn('⚠️ Notifications table does not exist yet. Please run the SQL migration.');
          return [];
        }
        
        // Fallback to localStorage
        return this.getStoredNotifications()
          .filter(notif => notif.target_user_id === userId)
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      }

      return (data as unknown as NotificationData[]) || [];
    } catch (error) {
      console.error('❌ Error getting notifications for user:', error);
      // Fallback to localStorage
      console.log('📦 Falling back to localStorage due to error');
      return this.getStoredNotifications()
        .filter(notif => notif.target_user_id === userId)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
  }

  /**
   * Get stored notifications for a user (localStorage fallback)
   */
  getStoredNotificationsForUser(userId: string): NotificationData[] {
    try {
      const notifications = this.getStoredNotifications();
      return notifications
        .filter(notif => notif.target_user_id === userId)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } catch (error) {
      console.error('Error getting notifications for user:', error);
      return [];
    }
  }

  /**
   * Get all stored notifications
   */
  private getStoredNotifications(): NotificationData[] {
    try {
      const stored = localStorage.getItem('crm_notifications');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error parsing stored notifications:', error);
      return [];
    }
  }

  /**
   * Mark notification as read in Supabase
   */
  async markAsRead(notificationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications' as any)
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) {
        console.error('Error marking notification as read in database:', error);
        // Fallback to localStorage
        this.markAsReadInStorage(notificationId);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Fallback to localStorage
      this.markAsReadInStorage(notificationId);
    }
  }

  /**
   * Mark notification as read in localStorage (fallback)
   */
  private markAsReadInStorage(notificationId: string): void {
    try {
      const notifications = this.getStoredNotifications();
      const updated = notifications.map(notif => 
        notif.id === notificationId ? { ...notif, is_read: true } : notif
      );
      localStorage.setItem('crm_notifications', JSON.stringify(updated));
    } catch (error) {
      console.error('Error marking notification as read in storage:', error);
    }
  }

  /**
   * Mark all notifications as read for a user in Supabase
   */
  async markAllAsRead(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications' as any)
        .update({ is_read: true })
        .eq('target_user_id', userId)
        .eq('is_read', false);

      if (error) {
        console.error('Error marking all notifications as read in database:', error);
        // Fallback to localStorage
        this.markAllAsReadInStorage(userId);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      // Fallback to localStorage
      this.markAllAsReadInStorage(userId);
    }
  }

  /**
   * Mark all notifications as read for a user in localStorage (fallback)
   */
  private markAllAsReadInStorage(userId: string): void {
    try {
      const notifications = this.getStoredNotifications();
      const updated = notifications.map(notif => 
        notif.target_user_id === userId ? { ...notif, is_read: true } : notif
      );
      localStorage.setItem('crm_notifications', JSON.stringify(updated));
    } catch (error) {
      console.error('Error marking all notifications as read in storage:', error);
    }
  }

  /**
   * Clear all notifications for a user in Supabase
   */
  async clearAllForUser(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications' as any)
        .delete()
        .eq('target_user_id', userId);

      if (error) {
        console.error('Error clearing notifications in database:', error);
        // Fallback to localStorage
        this.clearAllForUserInStorage(userId);
      }
    } catch (error) {
      console.error('Error clearing notifications:', error);
      // Fallback to localStorage
      this.clearAllForUserInStorage(userId);
    }
  }

  /**
   * Clear all notifications for a user in localStorage (fallback)
   */
  private clearAllForUserInStorage(userId: string): void {
    try {
      const notifications = this.getStoredNotifications();
      const filtered = notifications.filter(notif => notif.target_user_id !== userId);
      localStorage.setItem('crm_notifications', JSON.stringify(filtered));
    } catch (error) {
      console.error('Error clearing notifications in storage:', error);
    }
  }

  /**
   * Get unread count for a user from Supabase
   */
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('notifications' as any)
        .select('*', { count: 'exact', head: true })
        .eq('target_user_id', userId)
        .eq('is_read', false);

      if (error) {
        console.error('❌ Error fetching unread count from database:', error);
        
        // Check if it's a table not found error
        if (error.message?.includes('relation "public.notifications" does not exist')) {
          console.warn('⚠️ Notifications table does not exist yet. Returning 0.');
          return 0;
        }
        
        // Fallback to localStorage
        const notifications = this.getStoredNotificationsForUser(userId);
        return notifications.filter(notif => !notif.is_read).length;
      }

      return count || 0;
    } catch (error) {
      console.error('❌ Error getting unread count:', error);
      // Fallback to localStorage
      console.log('📦 Falling back to localStorage for unread count due to error');
      const notifications = this.getStoredNotificationsForUser(userId);
      return notifications.filter(notif => !notif.is_read).length;
    }
  }

  // Helper methods for creating specific notification types
  
  /**
   * Create notification when a contact is added
   */
  async notifyContactAdded(
    contactName: string,
    contactId: string,
    userContext: UserContext
  ): Promise<void> {
    await this.createNotifications({
      type: 'contact_added',
      title: 'New Contact Added',
      description: `added contact ${contactName}`,
      entity_id: contactId,
      entity_type: 'contact',
      data: { contactName, entityName: contactName },
      priority: 'medium'
    }, userContext);
  }

  /**
   * Create notification when a client is added
   */
  async notifyClientAdded(
    clientName: string,
    clientId: string,
    userContext: UserContext
  ): Promise<void> {
    await this.createNotifications({
      type: 'client_added',
      title: 'New Client Added',
      description: `added client ${clientName}`,
      entity_id: clientId,
      entity_type: 'client',
      data: { clientName, entityName: clientName },
      priority: 'high'
    }, userContext);
  }

  /**
   * Create notification when a deal is added
   */
  async notifyDealAdded(
    dealTitle: string,
    dealId: string,
    dealValue: number,
    userContext: UserContext,
    translations: {
      title: string;
      description: string;
    }
  ): Promise<void> {
    await this.createNotifications({
      type: 'deal_added',
      title: translations.title,
      description: translations.description,
      entity_id: dealId,
      entity_type: 'deal',
      data: { dealName: dealTitle, value: dealValue, entityName: dealTitle },
      priority: 'high'
    }, userContext);
  }

  /**
   * Create notification when multiple deals are added in bulk
   */
  async notifyBulkDealsAdded(
    dealCount: number,
    totalValue: number,
    userContext: UserContext,
    translations: {
      title: string;
      description: string;
    }
  ): Promise<void> {
    await this.createNotifications({
      type: 'deal_added',
      title: translations.title,
      description: translations.description,
      entity_id: `bulk_${Date.now()}`, // Unique identifier for bulk operation
      entity_type: 'deal',
      data: { 
        dealCount, 
        totalValue, 
        entityName: `${dealCount} deals`,
        isBulkOperation: true 
      },
      priority: 'high'
    }, userContext);
  }

  /**
   * Create notification when multiple deals are deleted in bulk
   */
  async notifyBulkDealsDeleted(
    dealCount: number,
    totalValue: number,
    userContext: UserContext,
    translations: {
      title: string;
      description: string;
    }
  ): Promise<void> {
    await this.createNotifications({
      type: 'deal_deleted',
      title: translations.title,
      description: translations.description,
      entity_id: `bulk_${Date.now()}`, // Unique identifier for bulk operation
      entity_type: 'deal',
      data: { 
        dealCount, 
        totalValue, 
        entityName: `${dealCount} deals`,
        isBulkOperation: true 
      },
      priority: 'high'
    }, userContext);
  }

  /**
   * Create notification when a deal is updated
   */
  async notifyDealUpdated(
    dealName: string,
    dealId: string,
    userContext: UserContext,
    translations: {
      title: string;
      description: string;
    }
  ): Promise<void> {
    await this.createNotifications({
      type: 'deal_updated',
      title: translations.title,
      description: translations.description,
      entity_id: dealId,
      entity_type: 'deal',
      data: { dealName, entityName: dealName },
      priority: 'medium'
    }, userContext);
  }

  /**
   * Create notification when a deal is deleted
   */
  async notifyDealDeleted(
    dealName: string,
    dealId: string,
    userContext: UserContext,
    translations: {
      title: string;
      description: string;
    }
  ): Promise<void> {
    await this.createNotifications({
      type: 'deal_deleted',
      title: translations.title,
      description: translations.description,
      entity_id: dealId,
      entity_type: 'deal',
      data: { dealName, entityName: dealName },
      priority: 'high'
    }, userContext);
  }

  /**
   * Create notification when a client is updated
   */
  async notifyClientUpdated(
    clientName: string,
    clientId: string,
    userContext: UserContext
  ): Promise<void> {
    await this.createNotifications({
      type: 'client_updated',
      title: 'Client Updated',
      description: `updated client ${clientName}`,
      entity_id: clientId,
      entity_type: 'client',
      data: { clientName, entityName: clientName },
      priority: 'medium'
    }, userContext);
  }

  /**
   * Create notification when a client is deleted
   */
  async notifyClientDeleted(
    clientName: string,
    clientId: string,
    userContext: UserContext
  ): Promise<void> {
    await this.createNotifications({
      type: 'client_deleted',
      title: 'Client Deleted',
      description: `deleted client ${clientName}`,
      entity_id: clientId,
      entity_type: 'client',
      data: { clientName, entityName: clientName },
      priority: 'high'
    }, userContext);
  }

  /**
   * Create notification when a contact is updated
   */
  async notifyContactUpdated(
    contactName: string,
    contactId: string,
    userContext: UserContext
  ): Promise<void> {
    await this.createNotifications({
      type: 'contact_updated',
      title: 'Contact Updated',
      description: `updated contact ${contactName}`,
      entity_id: contactId,
      entity_type: 'contact',
      data: { contactName, entityName: contactName },
      priority: 'medium'
    }, userContext);
  }

  /**
   * Create notification when a contact is deleted
   */
  async notifyContactDeleted(
    contactName: string,
    contactId: string,
    userContext: UserContext
  ): Promise<void> {
    await this.createNotifications({
      type: 'contact_deleted',
      title: 'Contact Deleted',
      description: `deleted contact ${contactName}`,
      entity_id: contactId,
      entity_type: 'contact',
      data: { contactName, entityName: contactName },
      priority: 'high'
    }, userContext);
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
export default notificationService; 