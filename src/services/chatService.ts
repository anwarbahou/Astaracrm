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
}

export interface MessageWithUser {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  users: {
    id: string;
    email: string;
  }[];
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
   * Fetch all channels for a user
   */
  async fetchChannels(userId: string): Promise<Channel[]> {
    try {
      // Fetch public channels
      const { data: publicChannels, error: publicError } = await supabase
        .from('channels')
        .select(`
          id,
          name,
          is_private,
          created_by
        `)
        .eq('is_private', false);

      if (publicError) throw publicError;

      // Fetch private channels the user is a member of
      const { data: privateChannels, error: privateError } = await supabase
        .from('channels')
        .select(`
          id,
          name,
          is_private,
          created_by
        `)
        .eq('is_private', true)
        .in(
          'id',
          await supabase
            .from('channel_members')
            .select('channel_id')
            .eq('user_id', userId)
            .then(result => result.data?.map(row => row.channel_id) || [])
        );

      if (privateError) throw privateError;

      const allChannels = [...(publicChannels || []), ...(privateChannels || [])];
      
      return allChannels.map(channel => ({
        id: channel.id,
        name: channel.name,
        is_private: channel.is_private,
        created_by: channel.created_by,
        members: [{
          id: userId,
          name: 'User', // Will be enhanced with user details
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
   * Fetch messages for a channel
   */
  async fetchMessages(channelId: string): Promise<Message[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          created_at,
          sender_id,
          users:sender_id (
            id,
            email
          )
        `)
        .eq('channel_id', channelId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return [];
      }

      if (!data) return [];

      return (data as MessageWithUser[]).map(msg => ({
        id: msg.id,
        content: msg.content,
        created_at: msg.created_at,
        sender: {
          id: msg.sender_id,
          name: msg.users[0]?.email.split('@')[0] || 'Unknown',
          avatar: msg.users[0]?.email[0].toUpperCase() || 'U'
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
}

export const chatService = new ChatService(); 