import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
  created_at: string;
  reactions?: Array<{
    emoji: string;
    count: number;
    userReacted: boolean;
  }>;
}

export interface Channel {
  id: string;
  name: string;
  is_private: boolean;
  created_by: string;
  members: Array<{
    id: string;
    name: string;
    avatar: string;
  }>;
  unreadCount?: number; // Add unread count to channel interface
}

export interface MessageWithUser {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  users: {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  }[];
}

export interface UnreadMessage {
  user_id: string;
  channel_id: string;
  count: number;
}

class ChatService {
  /**
   * Check if chat tables exist
   */
  async checkTablesExist(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('channels')
        .select('id')
        .limit(1);

      if (error && error.code === 'PGRST200') {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking tables:', error);
      return false;
    }
  }

  /**
   * Fetch all channels for a user with unread counts
   */
  async fetchChannels(userId: string): Promise<Channel[]> {
    try {
      // Fetch only channels where the user is a member
      const { data: userChannels, error } = await supabase
        .from('channel_members')
        .select(`
          channel_id,
          channels (
            id,
            name,
            is_private,
            created_by
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;

      if (!userChannels) return [];

      const channels = userChannels.map(item => item.channels).filter(Boolean) as any[];
      
      // Fetch unread counts for all channels
      const unreadCounts = await this.fetchUnreadCounts(userId, channels.map(c => c.id));
      
      // Return channels with basic member info
      return channels.map(channel => ({
        id: channel.id,
        name: channel.name,
        is_private: channel.is_private,
        created_by: channel.created_by,
        unreadCount: unreadCounts.find(uc => uc.channel_id === channel.id)?.count || 0,
        members: [{
          id: userId,
          name: 'User',
          avatar: 'U'
        }]
      }));
    } catch (error: any) {
      console.error('Error fetching channels:', error);
      
      if (error?.message?.includes('infinite recursion detected in policy')) {
        toast({
          title: "Database Policy Error",
          description: "Chat system needs database policy fix. Please contact administrator.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch channels",
          variant: "destructive"
        });
      }
      
      return [];
    }
  }

  /**
   * Fetch unread message counts for channels
   */
  async fetchUnreadCounts(userId: string, channelIds: string[]): Promise<UnreadMessage[]> {
    try {
      if (channelIds.length === 0) return [];

      const { data, error } = await supabase
        .from('unread_messages')
        .select('user_id, channel_id, count')
        .eq('user_id', userId)
        .in('channel_id', channelIds);

      if (error) {
        console.error('Error fetching unread counts:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching unread counts:', error);
      return [];
    }
  }

  /**
   * Mark messages as read for a channel
   */
  async markChannelAsRead(userId: string, channelId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('unread_messages')
        .delete()
        .eq('user_id', userId)
        .eq('channel_id', channelId);

      if (error) {
        console.error('Error marking channel as read:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error marking channel as read:', error);
      return false;
    }
  }

  /**
   * Get total unread count for a user
   */
  async getTotalUnreadCount(userId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('unread_messages')
        .select('count')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching total unread count:', error);
        return 0;
      }

      return data?.reduce((total, item) => total + item.count, 0) || 0;
    } catch (error) {
      console.error('Error fetching total unread count:', error);
      return 0;
    }
  }

  /**
   * Subscribe to unread message changes
   */
  subscribeToUnreadChanges(userId: string, onUnreadChange: (unreadCount: number) => void) {
    const channelName = `unread-${userId}-${Date.now()}`;
    return supabase
      .channel(channelName)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'unread_messages',
        filter: `user_id=eq.${userId}`
      }, async (payload) => {
        // Immediately update with the payload data if available
        if (payload.eventType === 'INSERT' && payload.new) {
          const newUnread = payload.new as any;
          // For immediate feedback, we can calculate the change
          // But for accuracy, we'll still fetch the total
        }
        
        const totalUnread = await this.getTotalUnreadCount(userId);
        onUnreadChange(totalUnread);
      })
      .subscribe();
  }

  /**
   * Fetch messages for a channel
   */
  async fetchMessages(channelId: string): Promise<Message[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('id, content, created_at, sender_id')
        .eq('channel_id', channelId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return [];
      }

      if (!data) return [];

      return data.map(msg => ({
        id: msg.id,
        content: msg.content,
        created_at: msg.created_at,
        sender: {
          id: msg.sender_id,
          name: `User-${msg.sender_id.slice(0, 4)}`,
          avatar: 'U'
        }
      }));
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }

  /**
   * Create a new channel
   */
  async createChannel(name: string, userId: string): Promise<Channel | null> {
    try {
      // Create channel
      const { data: channelData, error: channelError } = await supabase
        .from('channels')
        .insert({
          name: name.toLowerCase().replace(/\s+/g, '-'),
          created_by: userId,
          is_private: false
        })
        .select()
        .single();

      if (channelError) throw channelError;

      // Add creator as member
      const { error: memberError } = await supabase
        .from('channel_members')
        .insert({
          channel_id: channelData.id,
          user_id: userId
        });

      if (memberError) throw memberError;

      return {
        id: channelData.id,
        name: channelData.name,
        is_private: channelData.is_private,
        created_by: channelData.created_by,
        members: [{
          id: userId,
          name: 'User',
          avatar: 'U'
        }]
      };
    } catch (error) {
      console.error('Error creating channel:', error);
      toast({
        title: "Error",
        description: "Failed to create channel",
        variant: "destructive"
      });
      return null;
    }
  }

  /**
   * Delete a channel
   */
  async deleteChannel(channelId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('channels')
        .delete()
        .eq('id', channelId)
        .eq('created_by', userId);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error deleting channel:', error);
      toast({
        title: "Error",
        description: "Failed to delete channel",
        variant: "destructive"
      });
      return false;
    }
  }

  /**
   * Send a message
   */
  async sendMessage(content: string, channelId: string, senderId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          content,
          channel_id: channelId,
          sender_id: senderId
        });

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
      return false;
    }
  }

  /**
   * Subscribe to channel messages
   */
  subscribeToMessages(channelId: string, onMessage: (message: Message) => void) {
    return supabase
      .channel(`channel-${channelId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `channel_id=eq.${channelId}`
      }, async payload => {
        const newMessage = payload.new as any;
        
        // Use a more robust approach for sender details
        const senderName = `User-${newMessage.sender_id.slice(0, 4)}`;
        const senderAvatar = 'U';

        onMessage({
          id: newMessage.id,
          content: newMessage.content,
          created_at: newMessage.created_at,
          sender: {
            id: newMessage.sender_id,
            name: senderName,
            avatar: senderAvatar
          }
        });
      })
      .subscribe();
  }

  /**
   * Add a reaction to a message
   */
  async addReaction(messageId: string, userId: string, emoji: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('message_reactions')
        .insert({
          message_id: messageId,
          user_id: userId,
          emoji: emoji
        });

      if (error) {
        // If it's a unique constraint violation, the user already reacted with this emoji
        if (error.code === '23505') {
          return true; // Consider this a success since the reaction already exists
        }
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error adding reaction:', error);
      toast({
        title: "Error",
        description: "Failed to add reaction",
        variant: "destructive"
      });
      return false;
    }
  }

  /**
   * Remove a reaction from a message
   */
  async removeReaction(messageId: string, userId: string, emoji: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('message_reactions')
        .delete()
        .eq('message_id', messageId)
        .eq('user_id', userId)
        .eq('emoji', emoji);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error removing reaction:', error);
      toast({
        title: "Error",
        description: "Failed to remove reaction",
        variant: "destructive"
      });
      return false;
    }
  }

  /**
   * Get reaction counts for a message
   */
  async getMessageReactions(messageId: string): Promise<Array<{emoji: string, count: number, userReacted: boolean}>> {
    try {
      const { data, error } = await supabase
        .rpc('get_message_reaction_counts', { message_uuid: messageId });

      if (error) throw error;

      return data?.map(item => ({
        emoji: item.emoji,
        count: item.count,
        userReacted: item.user_reacted
      })) || [];
    } catch (error) {
      console.error('Error fetching message reactions:', error);
      return [];
    }
  }

  /**
   * Subscribe to reaction changes for a message
   */
  subscribeToReactions(messageId: string, onReactionChange: (reactions: Array<{emoji: string, count: number, userReacted: boolean}>) => void) {
    return supabase
      .channel(`reactions-${messageId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'message_reactions',
        filter: `message_id=eq.${messageId}`
      }, async () => {
        // Fetch updated reaction counts
        const reactions = await this.getMessageReactions(messageId);
        onReactionChange(reactions);
      })
      .subscribe();
  }
}

export const chatService = new ChatService(); 