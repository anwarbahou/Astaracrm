import { supabase } from '@/integrations/supabase/client';
import { ActivityLog } from '@/types/activity';

export interface ActivityLogsServiceOptions {
  userId: string;
  userRole: string;
}

interface NotificationWithUser {
  id: string;
  type: string;
  title: string;
  description: string;
  user_id: string;
  target_user_id: string;
  entity_id: string;
  entity_type: string;
  data: any;
  created_at: string;
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

class ActivityLogsService {
  /**
   * Get activity logs from notifications table
   */
  async getActivityLogs(options: ActivityLogsServiceOptions): Promise<ActivityLog[]> {
    const { userId, userRole } = options;
    
    try {
      console.log('🔍 Fetching activity logs from notifications table...');
      
      // Query notifications table directly
      let query = supabase
        .from('notifications' as any)
        .select('*')
        .order('created_at', { ascending: false });
      
      // Apply role-based filtering for non-admins
      if (userRole !== 'admin') {
        query = query.or(`user_id.eq.${userId},target_user_id.eq.${userId}`);
      }
      
      const { data: notificationsData, error } = await query;
      
      if (error) {
        console.error('❌ Error fetching notifications for activity logs:', error);
        throw error;
      }

      // Get user data for each notification
      const userIds = [...new Set([
        ...notificationsData.map((n: any) => n.user_id),
        ...notificationsData.map((n: any) => n.target_user_id)
      ].filter(Boolean))];

      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, first_name, last_name, email')
        .in('id', userIds);

      if (usersError) {
        console.warn('⚠️ Could not fetch user data for activity logs:', usersError);
      }

      // Create user lookup map
      const usersMap = new Map();
      (usersData || []).forEach((user: any) => {
        usersMap.set(user.id, user);
      });

      console.log(`✅ Successfully fetched ${(notificationsData || []).length} notifications for activity logs`);
      
      // Convert notifications to activity logs format
      const activityLogs: ActivityLog[] = (notificationsData || []).map((notification: any) => {
        const user = usersMap.get(notification.user_id);
        const userName = user && user.first_name && user.last_name
          ? `${user.first_name} ${user.last_name}`.trim()
          : user?.email || 'Unknown User';
        
        const userInitials = user && user.first_name && user.last_name
          ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
          : user?.email?.[0]?.toUpperCase() || 'U';

        return {
          id: this.hashCode(notification.id), // Convert UUID to number for compatibility
          type: notification.type,
          action: this.getActionText(notification.type),
          details: notification.description,
          user: userName,
          userAvatar: userInitials,
          timestamp: notification.created_at,
          entity: this.getEntityText(notification.entity_type),
          entityId: notification.entity_id,
          relatedTo: this.getRelatedToFromData(notification.data),
          changes: this.getChangesFromData(notification.data)
        };
      });

      console.log(`📊 Converted ${activityLogs.length} notifications to activity logs`);
      return activityLogs;
      
    } catch (error) {
      console.error('❌ Error getting activity logs:', error);
      throw error;
    }
  }

  /**
   * Hash function to convert UUID to number
   */
  private hashCode(str: string): number {
    let hash = 0;
    if (str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
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

  private getRelatedToFromData(data: any): string {
    if (!data) return 'Unknown';
    
    // Try to get the name from various possible fields
    return data.name || 
           data.client_name || 
           data.contact_name || 
           data.deal_name || 
           data.company ||
           'Unknown';
  }

  private getChangesFromData(data: any): Record<string, string> {
    if (!data) return {};
    
    // Convert notification data to changes format
    const changes: Record<string, string> = {};
    
    if (data.value) changes.value = data.value;
    if (data.stage) changes.stage = data.stage;
    if (data.priority) changes.priority = data.priority;
    if (data.email) changes.email = data.email;
    if (data.phone) changes.phone = data.phone;
    if (data.industry) changes.industry = data.industry;
    if (data.status) changes.status = data.status;
    
    return changes;
  }
}

export const activityLogsService = new ActivityLogsService(); 