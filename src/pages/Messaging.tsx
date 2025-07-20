import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Search, Send, Paperclip, MoreVertical, Phone, Video, Plus, Hash, Users, Trash2, Info, X, MessageSquare, ChevronLeft, Smile } from "lucide-react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useEffect, useLayoutEffect, useState, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { Database } from "@/types/supabase";
import { chatService } from "@/services/chatService";
import { UnreadIndicator } from "@/components/ui/unread-indicator";

type MessageWithUser = {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  users: {
    id: string;
    email: string;
  }[];
};

type Message = {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
  created_at: string;
  channel_id: string;
};

type ChannelResponse = {
  id: string;
  name: string;
  is_private: boolean;
  created_by: string;
  channel_members: Array<{
    user_id: string;
    users: {
      id: string;
      email: string;
    };
  }>;
};

type Channel = {
  id: string;
  name: string;
  is_private: boolean;
  created_by: string;
  members: Array<{
    id: string;
    name: string;
    avatar: string;
  }>;
  unreadCount?: number;
};

// Helper to get display name from user object
function getUserDisplayName(user) {
  if (user?.first_name && user?.last_name) {
    return `${user.first_name} ${user.last_name}`;
  } else if (user?.first_name) {
    return user.first_name;
  } else if (user?.email) {
    return user.email.split('@')[0];
  } else {
    return 'User';
  }
}

// Helper to generate consistent DM channel names
function generateDMChannelName(userId1: string, userId2: string): string {
  const ids = [userId1, userId2].sort();
  return `dm-${ids[0]}-${ids[1]}`;
}

function getUserInitials(user) {
  if (user?.first_name && user?.last_name) {
    return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
  } else if (user?.first_name) {
    return user.first_name[0].toUpperCase();
  } else if (user?.email) {
    return user.email[0].toUpperCase();
  } else {
    return 'U';
  }
}

export default function Messaging() {
  const { user } = useAuth();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newChannelName, setNewChannelName] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [tablesExist, setTablesExist] = useState<boolean | null>(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [pendingDMUser, setPendingDMUser] = useState<any>(null);
  const PAGE_SIZE = 20;
  const [paginationLoading, setPaginationLoading] = useState(false);
  const isLoadingRef = useRef(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  // Ref for the scrollable viewport
  const scrollViewportRef = useRef<HTMLDivElement | null>(null);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const [showChannelInfo, setShowChannelInfo] = useState(false);
  const [addUserId, setAddUserId] = useState<string | undefined>(undefined);
  const [addUserLoading, setAddUserLoading] = useState(false);
  const [channelDialogOpen, setChannelDialogOpen] = useState(false);
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);

  // Helper to set the ref to the Viewport
  const setScrollViewportRef = useCallback((node: HTMLDivElement | null) => {
    if (node) scrollViewportRef.current = node;
  }, []);

  const scrollToBottom = () => {
    if (scrollViewportRef.current) {
      scrollViewportRef.current.scrollTop = scrollViewportRef.current.scrollHeight;
    }
  };

  // Ask for notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Fetch channels
  useEffect(() => {
    const fetchChannels = async () => {
      try {
        // Check if tables exist
        const tablesExist = await chatService.checkTablesExist();
        if (!tablesExist) {
          console.log('Chat tables not found. Please run the migration first.');
          toast({
            title: "Setup Required",
            description: "Chat tables need to be created. Please run the database migration.",
            variant: "destructive"
          });
          setTablesExist(false);
          return;
        }

        // Fetch channels with unread counts using chatService
        const channelsWithUnread = await chatService.fetchChannels(user?.id || '');
        setChannels(channelsWithUnread);
        setTablesExist(true);

        // Calculate total unread count
        const totalUnread = channelsWithUnread.reduce((sum, channel) => sum + (channel.unreadCount || 0), 0);
        setTotalUnreadCount(totalUnread);
      } catch (error) {
        console.error('Error fetching channels:', error);
          toast({
            title: "Error",
            description: "Failed to fetch channels",
            variant: "destructive"
          });
      }
    };

    if (user) {
      fetchChannels();
    }
  }, [user]);

  // Update total unread count when channels change
  useEffect(() => {
    if (!user || channels.length === 0) return;
    
    const updateUnreadCounts = async () => {
      const updatedUnreadCounts = await chatService.fetchUnreadCounts(user.id, channels.map(c => c.id));
      setChannels(prev => prev.map(channel => ({
        ...channel,
        unreadCount: updatedUnreadCounts.find(uc => uc.channel_id === channel.id)?.count || 0
      })));
      
      const totalUnread = updatedUnreadCounts.reduce((sum, uc) => sum + uc.count, 0);
      setTotalUnreadCount(totalUnread);
    };

    updateUnreadCounts();
  }, [user, channels]);

  // Mark selected channel as read when it changes
  useEffect(() => {
    if (!selectedChannel || !user) return;
    
    const markAsRead = async () => {
      if (selectedChannel.unreadCount && selectedChannel.unreadCount > 0) {
        await chatService.markChannelAsRead(user.id, selectedChannel.id);
        // Update local state immediately
        setChannels(prev => prev.map(ch => 
          ch.id === selectedChannel.id ? { ...ch, unreadCount: 0 } : ch
        ));
        setTotalUnreadCount(prev => prev - (selectedChannel.unreadCount || 0));
      }
    };

    markAsRead();
  }, [selectedChannel, user]);

  // Fetch messages with pagination
  const fetchMessages = async (channelId: string, before?: string) => {
    if (isLoadingRef.current) return [];
    
    isLoadingRef.current = true;
    setPaginationLoading(true);
    
    try {
      let query = supabase
        .from('messages')
        .select('id, content, created_at, sender_id, channel_id')
        .eq('channel_id', channelId)
        .order('created_at', { ascending: false })
        .limit(PAGE_SIZE);
      if (before) {
        query = query.lt('created_at', before);
      }
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching messages:', error);
        return [];
      }
      return data || [];
    } finally {
      setPaginationLoading(false);
      isLoadingRef.current = false;
    }
  };

  // Always fetch latest messages when selectedChannel changes
  useEffect(() => {
    if (!selectedChannel) return;
    setMessages([]);
    setHasMoreMessages(true);
    
    // Mark channel as read when selected
    if (user && selectedChannel.unreadCount && selectedChannel.unreadCount > 0) {
      chatService.markChannelAsRead(user.id, selectedChannel.id);
      // Update local state to remove unread count
      setChannels(prev => prev.map(ch => 
        ch.id === selectedChannel.id 
          ? { ...ch, unreadCount: 0 }
          : ch
      ));
      // Update total unread count
      setTotalUnreadCount(prev => prev - (selectedChannel.unreadCount || 0));
    }
    
    (async () => {
      const data = await fetchMessages(selectedChannel.id);
      if (data.length < PAGE_SIZE) setHasMoreMessages(false);
      // Reverse to show oldest at top
      const mapped = data.reverse().map(msg => {
        const sender = users.find((u: any) => u.id === msg.sender_id);
        return {
          id: msg.id,
          content: msg.content,
          created_at: msg.created_at,
          channel_id: msg.channel_id,
          sender: {
            id: msg.sender_id,
            name: sender ? getUserDisplayName(sender) : 'Unknown',
            avatar: sender ? sender.email[0].toUpperCase() : 'U'
          }
        };
      });
      setMessages(mapped);
    })();
  }, [selectedChannel, users, user]);

  // Load more messages on scroll top
  const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
    if (isLoadingRef.current || paginationLoading || !hasMoreMessages) return;
    if (e.currentTarget.scrollTop === 0 && messages.length > 0 && selectedChannel) {
      const oldest = messages[0];
      const data = await fetchMessages(selectedChannel.id, oldest.created_at);
      if (data.length < PAGE_SIZE) setHasMoreMessages(false);
      // Reverse to show oldest at top
      const mapped = data.reverse().map(msg => {
        const sender = users.find((u: any) => u.id === msg.sender_id);
        return {
          id: msg.id,
          content: msg.content,
          created_at: msg.created_at,
          channel_id: msg.channel_id,
          sender: {
            id: msg.sender_id,
            name: sender ? getUserDisplayName(sender) : 'Unknown',
            avatar: sender ? sender.email[0].toUpperCase() : 'U'
          }
        };
      });
      setMessages(prev => [...mapped, ...prev]);
    }
  };

  const createChannel = async () => {
    if (!newChannelName.trim() || !user) return;

    const channelName = newChannelName.toLowerCase().replace(/\s+/g, '-');
    
    // Check if channel already exists
    const { data: existingChannels } = await supabase
      .from('channels')
      .select('id, name')
      .eq('name', channelName);

    if (existingChannels && existingChannels.length > 0) {
      toast({ 
        title: "Error", 
        description: "A channel with this name already exists", 
        variant: "destructive" 
      });
      return;
    }

    // Optimistically add to UI
    const optimisticId = `optimistic-${Date.now()}`;
    const optimisticChannel = {
      id: optimisticId,
      name: channelName,
      is_private: false,
      created_by: user.id,
      members: [{
        id: user.id,
        name: user.email?.split('@')[0] || 'User',
        avatar: user.email?.[0].toUpperCase() || 'U'
      }]
    };
    setChannels(prev => [...prev, optimisticChannel]);
    setNewChannelName('');
    setChannelDialogOpen(false);
    setLoading(true);

    try {
      // Insert channel
      const { data: channelData, error: channelError } = await supabase
        .from('channels')
        .insert({
          name: channelName,
          created_by: user.id,
          is_private: false
        })
        .select()
        .single();

      if (channelError) {
        if (channelError.code === '23505') {
          toast({ 
            title: "Error", 
            description: "A channel with this name already exists", 
            variant: "destructive" 
          });
        } else {
          throw channelError;
        }
        return;
      }

      // Insert member
      const { error: memberError } = await supabase
        .from('channel_members')
        .insert({
          channel_id: channelData.id,
          user_id: user.id
        });

      if (memberError) throw memberError;

      // Replace optimistic channel with real one
      setChannels(prev =>
        prev.map(ch => ch.id === optimisticId
          ? { ...optimisticChannel, id: channelData.id }
          : ch
        )
      );
      toast({ title: "Success", description: "Channel created successfully" });
    } catch (error) {
      console.error('Error creating channel:', error);
      // Remove optimistic channel
      setChannels(prev => prev.filter(ch => ch.id !== optimisticId));
      toast({ title: "Error", description: "Failed to create channel", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const deleteChannel = async (channelId: string) => {
    if (!user) return;

    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('channels')
        .delete()
        .eq('id', channelId)
        .eq('created_by', user.id);

      if (error) throw error;

      setChannels(prev => prev.filter(channel => channel.id !== channelId));
      if (selectedChannel?.id === channelId) {
        setSelectedChannel(null);
      }

      toast({
        title: "Success",
        description: "Channel deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting channel:', error);
      toast({
        title: "Error",
        description: "Failed to delete channel",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!messageInput.trim() || loading || !user) return;

    // If in a pending DM (no selectedChannel, but pendingDMUser is set), create the channel first
    if (!selectedChannel && pendingDMUser) {
      setLoading(true);
      try {
        // Generate consistent channel name for this DM
        const channelName = generateDMChannelName(user.id, pendingDMUser.id);
        
        // First, try to find an existing channel with this name
        const { data: existingChannels, error: findError } = await supabase
          .from('channels')
          .select('id, name, is_private, created_by')
          .eq('is_private', true)
          .eq('name', channelName);

        let channelId: string;
        
        if (!findError && existingChannels && existingChannels.length > 0) {
          // Use existing channel
          channelId = existingChannels[0].id;
        } else {
          // Create new channel
        const { data: newChannelData, error: channelError } = await supabase
          .from('channels')
          .insert({
            name: channelName,
            is_private: true,
            created_by: user.id
          })
          .select()
          .single();
          
          if (channelError) {
            // If insert failed due to duplicate, try to find the channel again
            if (channelError.code === '23505') {
              const { data: retryChannels } = await supabase
                .from('channels')
                .select('id, name, is_private, created_by')
                .eq('is_private', true)
                .eq('name', channelName);
              
              if (retryChannels && retryChannels.length > 0) {
                channelId = retryChannels[0].id;
              } else {
                throw channelError;
              }
            } else {
              throw channelError;
            }
          } else {
            channelId = newChannelData.id;
          }
        }

        // Ensure both users are members
        const { data: existingMembers } = await supabase
          .from('channel_members')
          .select('user_id')
          .eq('channel_id', channelId);

        const existingUserIds = existingMembers?.map(m => m.user_id) || [];
        
        if (!existingUserIds.includes(user.id)) {
          await supabase.from('channel_members').insert({
            channel_id: channelId,
            user_id: user.id
          });
        }
        
        if (!existingUserIds.includes(pendingDMUser.id)) {
          await supabase.from('channel_members').insert({
            channel_id: channelId,
            user_id: pendingDMUser.id
          });
        }

        // Create channel object for local state
        const newChannel = {
          id: channelId,
          name: channelName,
          is_private: true,
          created_by: user.id,
          members: [
            {
              id: user.id,
              name: user.email?.split('@')[0] || 'User',
              avatar: user.email?.[0] ? user.email?.[0].toUpperCase() : 'U'
            },
            {
              id: pendingDMUser.id,
              name: pendingDMUser.email?.split('@')[0] || 'User',
              avatar: pendingDMUser.email?.[0] ? pendingDMUser.email?.[0].toUpperCase() : 'U'
            }
          ]
        };
        
        setChannels((prev) => [...prev, newChannel]);
        setSelectedChannel(newChannel);
        setSelectedUser(pendingDMUser);
        setPendingDMUser(null);
        
        // Now send the message to the new channel
        setTimeout(() => {
          setMessageInput(messageInput); // restore input
          setTimeout(sendMessage, 0); // call sendMessage again with new selectedChannel
        }, 0);
        setLoading(false);
        return;
      } catch (err) {
        console.error('Error creating DM channel:', err);
        toast({ title: 'Error', description: 'Failed to start conversation', variant: 'destructive' });
        setLoading(false);
        return;
      }
    }

    if (!selectedChannel) return;

    // Optimistically add the message
    const optimisticMessage = {
      id: `optimistic-${Date.now()}`,
      content: messageInput,
      created_at: new Date().toISOString(),
      channel_id: selectedChannel.id,
      sender: {
        id: user.id,
        name: getUserDisplayName(user),
        avatar: user.email?.[0] ? user.email[0].toUpperCase() : 'U'
      }
    };
    setMessages(prev => [...prev, optimisticMessage]);
    setMessageInput('');
    setTimeout(scrollToBottom, 0);

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .insert({
          content: optimisticMessage.content,
          channel_id: selectedChannel.id,
          sender_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      // Replace the optimistic message with the real one (by ID)
      setMessages(prev =>
        prev
          .filter(msg => msg.id !== optimisticMessage.id)
          .concat({
            id: data.id,
            content: data.content,
            created_at: data.created_at,
            channel_id: data.channel_id,
            sender: optimisticMessage.sender
          })
      );
      setTimeout(scrollToBottom, 0);
    } catch (error) {
      setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      // Fetch id, email, first_name, last_name, avatar_url for user display
      const { data, error } = await supabase.from('users').select('id, email, first_name, last_name, avatar_url');
      if (!error) setUsers(data || []);
    };
    fetchUsers();
  }, []);

  // Helper to find a DM channel (do not create if not found)
  const openDirectMessage = async (targetUser: any) => {
    if (!user || !targetUser) return;
    setLoading(true);
    try {
      // Generate consistent channel name for this DM
      const channelName = generateDMChannelName(user.id, targetUser.id);

      // Try to find an existing private channel with this name
      const { data: existingChannels, error: findError } = await supabase
        .from('channels')
        .select('id, name, is_private, created_by')
        .eq('is_private', true)
        .eq('name', channelName);

      if (!findError && existingChannels && existingChannels.length > 0) {
        // Use the first found channel
        const dmChannel = channels.find((c) => c.id === existingChannels[0].id);
        if (dmChannel) {
          setSelectedChannel(dmChannel);
          setSelectedUser(targetUser);
          setPendingDMUser(null);
        } else {
          // Fetch channel details if not in state
          const channelData = existingChannels[0];
          const newChannel = {
            id: channelData.id,
            name: channelData.name,
            is_private: channelData.is_private,
            created_by: channelData.created_by,
            members: [
              {
                id: user.id,
                name: user.email?.split('@')[0] || 'User',
                avatar: user.email?.[0].toUpperCase() || 'U'
              },
              {
                id: targetUser.id,
                name: targetUser.email?.split('@')[0] || 'User',
                avatar: targetUser.email?.[0].toUpperCase() || 'U'
              }
            ]
          };
          setChannels((prev) => [...prev, newChannel]);
          setSelectedChannel(newChannel);
          setSelectedUser(targetUser);
          setPendingDMUser(null);
        }
      } else {
        // No channel exists, set pending DM user
        setSelectedChannel(null);
        setSelectedUser(targetUser);
        setPendingDMUser(targetUser);
      }
    } catch (err) {
      console.error('Error opening direct message:', err);
      toast({ title: 'Error', description: 'Failed to open direct message', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  function getChannelDisplayName(channel: Channel, user: any, users: any[]) {
    if (channel.is_private && channel.name.startsWith('dm-')) {
      // Remove 'dm-' prefix and split only on the first dash
      const idsPart = channel.name.slice(3); // remove 'dm-'
      // Find the split point between the two UUIDs
      // Both UUIDs are 36 chars, so split at 36
      const id1 = idsPart.slice(0, 36);
      const id2 = idsPart.slice(37); // skip the dash
      const otherUserId = id1 === user.id ? id2 : id1;
      const otherUser = users.find(u => u.id === otherUserId);
      return otherUser ? getUserDisplayName(otherUser) : `User-${otherUserId.slice(0, 4)}`;
    }
    return channel.name;
  }

  // In the subscription handler, deduplicate by ID and scroll to bottom
  useEffect(() => {
    if (!selectedChannel) return;
    const subscription = supabase
      .channel(`channel-${selectedChannel.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `channel_id=eq.${selectedChannel.id}`
      }, async payload => {
        const newMessage = payload.new as any;
        const sender = users.find((u: any) => u.id === newMessage.sender_id);
        setMessages(prev => {
          if (prev.some(msg => msg.id === newMessage.id)) return prev;
          return [
            ...prev,
            {
              id: newMessage.id,
              content: newMessage.content,
              created_at: newMessage.created_at,
              channel_id: newMessage.channel_id,
              sender: {
                id: newMessage.sender_id,
                name: sender ? getUserDisplayName(sender) : 'Unknown',
                avatar: sender ? sender.email[0].toUpperCase() : 'U'
              }
            }
          ];
        });
        setTimeout(scrollToBottom, 0);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [selectedChannel, users]);

  // Global message subscription for all channels (for notifications and unread updates)
  useEffect(() => {
    if (!user || channels.length === 0) return;

    const channelIds = channels.map(c => c.id);
    
    // Create separate subscriptions for each channel to avoid filter issues
    const subscriptions = channelIds.map(channelId => 
      supabase
        .channel(`global-messages-${channelId}-${Date.now()}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `channel_id=eq.${channelId}`
        }, async payload => {
          const newMessage = payload.new as any;
          
          // Only handle messages from other users
          if (newMessage.sender_id === user.id) return;
          
          // Play sound notification if user is not in the channel where message was sent
          if (selectedChannel?.id !== newMessage.channel_id) {
            if (audioRef.current && (!('Notification' in window) || Notification.permission === 'granted')) {
              audioRef.current.currentTime = 0;
              audioRef.current.play().catch(() => {});
            }
            
            // Show browser notification if permission granted
            if ('Notification' in window && Notification.permission === 'granted') {
              const sender = users.find((u: any) => u.id === newMessage.sender_id);
              const channel = channels.find(c => c.id === newMessage.channel_id);
              const channelName = channel?.is_private && channel?.name.startsWith('dm-') 
                ? getUserDisplayName(sender) 
                : channel?.name || 'Unknown Channel';
              
              new Notification(`New message in ${channelName}`, {
                body: newMessage.content,
                icon: '/favicon.ico'
              });
            }
          }
          
          // Only update unread counts if not in the current channel
          if (selectedChannel?.id !== newMessage.channel_id) {
            const updatedUnreadCounts = await chatService.fetchUnreadCounts(user.id, channelIds);
            setChannels(prev => prev.map(channel => ({
              ...channel,
              unreadCount: updatedUnreadCounts.find(uc => uc.channel_id === channel.id)?.count || 0
            })));
            
            const totalUnread = updatedUnreadCounts.reduce((sum, uc) => sum + uc.count, 0);
            setTotalUnreadCount(totalUnread);
          }
        })
        .subscribe()
    );

    return () => {
      subscriptions.forEach(subscription => subscription.unsubscribe());
    };
  }, [user, channels, selectedChannel, users]);

  useLayoutEffect(() => {
    if (selectedChannel && messages.length > 0) {
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [messages, selectedChannel]);

  useEffect(() => {
    if (lastMessageRef.current && selectedChannel) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, selectedChannel]);

  // Helper to refresh channel members from Supabase
  const refreshChannelMembers = async (channelId: string) => {
    const { data, error } = await supabase
      .from('channel_members')
      .select('user_id')
      .eq('channel_id', channelId);
    if (!error && data) {
      setSelectedChannel(prev =>
        prev && prev.id === channelId
          ? { ...prev, members: data.map(row => ({ id: row.user_id, name: '', avatar: '' })) }
          : prev
      );
      setChannels(prev =>
        prev.map(ch =>
          ch.id === channelId
            ? { ...ch, members: data.map(row => ({ id: row.user_id, name: '', avatar: '' })) }
            : ch
        )
      );
    }
  };

  // Refresh members when opening the channel info sidebar
  useEffect(() => {
    if (showChannelInfo && selectedChannel) {
      refreshChannelMembers(selectedChannel.id);
    }
  }, [showChannelInfo, selectedChannel]);

  return (
    <div className="h-[calc(100vh-4rem)] sm:h-[calc(100vh-4rem)] flex flex-col sm:flex-row bg-background">
      <audio ref={audioRef} src="/notificationsound.mp3" preload="auto" />
      {tablesExist === false ? (
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <Card className="w-full max-w-md p-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Info className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Chat Setup Required</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  The chat system needs to be initialized. Please run the database migration to create the required tables.
                </p>
              </div>
              <Button 
                onClick={() => window.location.reload()} 
                className="w-full"
              >
                Refresh After Setup
              </Button>
            </div>
          </Card>
        </div>
      ) : (
        <>
          {/* Sidebar with channels and users */}
          <Card className={`${selectedChannel ? 'hidden sm:flex' : 'flex'} w-full sm:w-80 h-full border-r flex-col`}>
            {/* Conversations section */}
            <div className="p-3 sm:p-6 border-b">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                <h2 className="font-semibold text-sm sm:text-base">Conversations</h2>
                  {totalUnreadCount > 0 && (
                    <UnreadIndicator 
                      count={totalUnreadCount} 
                      size="sm"
                      variant="destructive"
                    />
                  )}
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon" disabled={loading} className="h-8 w-8">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Conversation</DialogTitle>
                    </DialogHeader>
                    <div className="flex gap-2 mt-4">
                      <Input
                        placeholder="Conversation name..."
                        value={''}
                        onChange={() => {}}
                        disabled
                      />
                      <Button disabled>
                        Create
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">(Coming soon)</div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="space-y-2">
                {channels.filter(c => c.is_private && c.name.startsWith('dm-')).length === 0 && (
                  <div className="text-muted-foreground text-sm italic">No conversations yet.</div>
                )}
                {channels.filter(c => c.is_private && c.name.startsWith('dm-')).map((channel) => {
                  // Find the other user in the DM
                  const idsPart = channel.name.slice(3);
                  const id1 = idsPart.slice(0, 36);
                  const id2 = idsPart.slice(37);
                  const otherUserId = id1 === user.id ? id2 : id1;
                  const dmUser = users.find(u => u.id === otherUserId);
                  return (
                    <div
                      key={channel.id}
                      className={`flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer group ${selectedChannel?.id === channel.id ? 'bg-muted' : ''}`}
                      onClick={async () => {
                        setSelectedChannel(channel);
                        setSelectedUser(dmUser);
                        
                        // Mark channel as read when selected
                        if (channel.unreadCount && channel.unreadCount > 0 && user) {
                          await chatService.markChannelAsRead(user.id, channel.id);
                          // Update local state immediately
                          setChannels(prev => prev.map(ch => 
                            ch.id === channel.id ? { ...ch, unreadCount: 0 } : ch
                          ));
                          setTotalUnreadCount(prev => prev - (channel.unreadCount || 0));
                        }
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={dmUser?.avatar_url} alt={getUserDisplayName(dmUser)} />
                          <AvatarFallback>{getUserInitials(dmUser)}</AvatarFallback>
                        </Avatar>
                        <span>{dmUser ? getUserDisplayName(dmUser) : `User-${otherUserId.slice(0, 4)}`}</span>
                      </div>
                      <UnreadIndicator 
                        count={channel.unreadCount || 0} 
                        size="lg"
                        variant="default"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Channels section */}
            <div className="p-6 border-b">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold">Channels</h2>
                {user?.user_metadata?.role === 'admin' && (
                <Dialog open={channelDialogOpen} onOpenChange={setChannelDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon" disabled={loading}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Channel</DialogTitle>
                    </DialogHeader>
                    <div className="flex gap-2 mt-4">
                      <Input
                        placeholder="Channel name..."
                        value={newChannelName}
                        onChange={(e) => setNewChannelName(e.target.value)}
                        disabled={loading}
                      />
                      <Button onClick={createChannel} disabled={loading || !newChannelName.trim()}>
                        Create
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                )}
              </div>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search channels..." className="pl-8" />
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-6 space-y-2">
                {loading && channels.length === 0 ? (
                  <div className="text-center text-xs text-muted-foreground py-4">Loading channels...</div>
                ) : (
                  channels
                  .filter(channel => !(channel.is_private && channel.name.startsWith('dm-')))
                  .map((channel) => {
                    const isDM = channel.is_private && channel.name.startsWith('dm-');
                    let dmUser = null;
                    if (isDM) {
                      const idsPart = channel.name.slice(3);
                      const id1 = idsPart.slice(0, 36);
                      const id2 = idsPart.slice(37);
                      const otherUserId = id1 === user.id ? id2 : id1;
                      dmUser = users.find(u => u.id === otherUserId);
                    }
                    return (
                      <div
                        key={channel.id}
                        className={`flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer group ${
                          selectedChannel?.id === channel.id ? 'bg-muted' : ''
                        }`}
                        onClick={async () => {
                          setSelectedChannel(channel);
                          setSelectedUser(null);
                          
                          // Mark channel as read when selected
                          if (channel.unreadCount && channel.unreadCount > 0 && user) {
                            await chatService.markChannelAsRead(user.id, channel.id);
                            // Update local state immediately
                            setChannels(prev => prev.map(ch => 
                              ch.id === channel.id ? { ...ch, unreadCount: 0 } : ch
                            ));
                            setTotalUnreadCount(prev => prev - (channel.unreadCount || 0));
                          }
                        }}
                      >
                        <div className="flex items-center gap-2">
                          {/* Only show icon/avatar for non-DM channels */}
                          {!isDM ? (
                            <Hash className="h-4 w-4 text-muted-foreground" />
                          ) : null}
                          {/* For non-DM, show channel name; for DM, show user name */}
                          <span>{getChannelDisplayName(channel, user, users)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {/* Unread indicator */}
                          <UnreadIndicator 
                            count={channel.unreadCount || 0} 
                            size="lg"
                            variant="default"
                            className="ml-auto"
                          />
                          {/* Only show trash icon, and only on hover (group-hover:opacity-100) */}
                          {channel.created_by === user?.id && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteChannel(channel.id);
                              }}
                              disabled={loading}
                            >
                              <Trash2 className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          )}
                          {/* Only show users icon for non-DM channels */}
                          {!isDM && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                            >
                              <Users className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
                <Separator className="my-4" />
                <h2 className="font-semibold text-sm mb-2">Users</h2>
                {users.filter(u => u.id !== user?.id).map((u) => (
                  <div
                    key={u.id}
                    className={`flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 cursor-pointer ${selectedUser?.id === u.id ? 'bg-muted' : ''}`}
                    onClick={() => openDirectMessage(u)}
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={u.avatar_url} alt={getUserDisplayName(u)} />
                      <AvatarFallback>{getUserInitials(u)}</AvatarFallback>
                    </Avatar>
                    <span>{getUserDisplayName(u)}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>

          {/* Main chat and info sidebar layout */}
          <div className={`${selectedChannel ? 'flex' : 'hidden sm:flex'} flex-1 flex overflow-hidden`}>
            {/* Chat area (flex-1) */}
            <div className={`flex-1 flex flex-col ${showChannelInfo ? 'border-r' : ''}`}>
              {/* Chat header */}
              {selectedChannel && (
                <Card className="border-b rounded-none p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      {/* Back button for mobile */}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="sm:hidden"
                        onClick={() => setSelectedChannel(null)}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      {selectedChannel.is_private && selectedChannel.name.startsWith('dm-') ? (() => {
                        const idsPart = selectedChannel.name.slice(3);
                        const id1 = idsPart.slice(0, 36);
                        const id2 = idsPart.slice(37);
                        const otherUserId = id1 === user.id ? id2 : id1;
                        const dmUser = users.find(u => u.id === otherUserId);
                        return (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={dmUser?.avatar_url} alt={getUserDisplayName(dmUser)} />
                            <AvatarFallback>{getUserInitials(dmUser)}</AvatarFallback>
                          </Avatar>
                        );
                      })() : (
                        <Hash className="h-5 w-5" />
                      )}
                      <div>
                        <h2 className="font-semibold">{getChannelDisplayName(selectedChannel, user, users)}</h2>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm text-muted-foreground">
                            {selectedChannel.members.length} members
                          </p>
                          <div className="flex -space-x-2">
                            {selectedChannel.members.slice(0, 5).map((member) => {
                              const userObj = users.find(u => u.id === member.id);
                              return (
                                <Avatar key={member.id} className="h-6 w-6 border-2 border-background">
                                  <AvatarImage src={userObj?.avatar_url || undefined} alt={getUserDisplayName(userObj)} />
                                  <AvatarFallback>{getUserInitials(userObj)}</AvatarFallback>
                                </Avatar>
                              );
                            })}
                            {selectedChannel.members.length > 5 && (
                              <span className="text-xs text-muted-foreground ml-2">+{selectedChannel.members.length - 5}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Users className="h-5 w-5" />
                      </Button>
                      {/* Info icon only for channels, not DMs */}
                      {!selectedChannel.is_private || !selectedChannel.name.startsWith('dm-') ? (
                        <Button variant="ghost" size="icon" onClick={() => setShowChannelInfo((v) => !v)}>
                          <Info className="h-5 w-5" />
                        </Button>
                      ) : null}
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
              {pendingDMUser && !selectedChannel && (
                <Card className="border-b rounded-none p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={pendingDMUser.avatar_url} alt={getUserDisplayName(pendingDMUser)} />
                      <AvatarFallback>{getUserInitials(pendingDMUser)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="font-semibold">{getUserDisplayName(pendingDMUser)}</h2>
                      <p className="text-sm text-muted-foreground">Start a new conversation</p>
                    </div>
                  </div>
                </Card>
              )}
              {/* Messages area */}
              {selectedChannel ? (
                <ScrollArea className="flex-1 p-4" onScroll={handleScroll} ref={setScrollViewportRef}>
                  <div className="space-y-4">
                    {paginationLoading && selectedChannel && (
                      <div className="text-center text-xs text-muted-foreground">Loading more messages...</div>
                    )}
                    {messages
                      .filter((message) => selectedChannel && message.channel_id === selectedChannel.id)
                      .map((message, idx, arr) => {
                        const senderUser = users.find(u => u.id === message.sender.id);
                        return (
                          <div
                            key={message.id}
                            ref={idx === arr.length - 1 ? lastMessageRef : null}
                            className={`flex ${message.sender.id === user?.id ? 'justify-end' : 'justify-start'}`}
                            onMouseEnter={() => setHoveredMessageId(message.id)}
                            onMouseLeave={() => setHoveredMessageId(null)}
                          >
                            <div className={`flex gap-2 max-w-[70%] ${message.sender.id === user?.id ? 'flex-row-reverse' : ''}`}>
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={senderUser?.avatar_url || undefined} alt={getUserDisplayName(senderUser)} />
                                <AvatarFallback>{getUserInitials(senderUser)}</AvatarFallback>
                              </Avatar>
                              <div className="relative">
                                <div
                                  className={`rounded-lg p-3 ${
                                    message.sender.id === user?.id
                                      ? 'bg-primary text-primary-foreground'
                                      : 'bg-muted'
                                  }`}
                                >
                                  {message.content}
                                </div>
                                {/* Emoji reaction button - only show on hover */}
                                {hoveredMessageId === message.id && (
                                  <div className={`absolute top-1 ${message.sender.id === user?.id ? 'left-1' : 'right-1'}`}>
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-6 w-6 bg-background/80 hover:bg-background/90"
                                        >
                                          <Smile className="h-3 w-3" />
                                        </Button>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-64 p-2" align="start">
                                        <div className="grid grid-cols-8 gap-1">
                                          {['😀', '😂', '😍', '🥰', '😎', '🤔', '👍', '❤️', '🔥', '🎉', '👏', '🙏', '😢', '😡', '🤮', '💩'].map((emoji) => (
                                            <button
                                              key={emoji}
                                              className="p-2 hover:bg-muted rounded text-lg transition-colors"
                                              onClick={() => {
                                                // TODO: Implement emoji reaction functionality
                                                console.log(`Reacted with ${emoji} to message ${message.id}`);
                                              }}
                                            >
                                              {emoji}
                                            </button>
                                          ))}
                                        </div>
                                      </PopoverContent>
                                    </Popover>
                                  </div>
                                )}
                                <p className="text-xs text-muted-foreground mt-1">
                                  {new Date(message.created_at).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </ScrollArea>
              ) : (
                <ScrollArea className="flex-1 p-4">
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center space-y-6 max-w-md">
                      <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center">
                        <MessageSquare className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold">Welcome to Messaging</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          Select a conversation from the sidebar to start chatting. You can join public channels or start direct messages with your team members.
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Hash className="h-4 w-4" />
                          <span>Join public channels to collaborate with your team</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>Start direct messages for private conversations</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          <span>All your conversations will appear here</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              )}
              {pendingDMUser && !selectedChannel && (
                <ScrollArea className="flex-1 p-4">
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No messages yet. Say hello!
                  </div>
                </ScrollArea>
              )}
              {/* Message input */}
              {(selectedChannel || (pendingDMUser && !selectedChannel)) && (
                <Card className="border-t rounded-none p-4">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Paperclip className="h-5 w-5" />
                    </Button>
                    <Input
                      placeholder="Type a message..."
                      className="flex-1"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                    />
                    <Button onClick={sendMessage} disabled={loading}>
                      <Send className="h-5 w-5 mr-2" />
                      Send
                    </Button>
                  </div>
                </Card>
              )}
            </div>
            {/* Channel info sidebar */}
            {showChannelInfo && selectedChannel && (!selectedChannel.is_private || !selectedChannel.name.startsWith('dm-')) && (
              <div className="w-80 bg-card border-l p-6 flex flex-col gap-4 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Channel Info</h3>
                  <Button variant="ghost" size="icon" onClick={() => setShowChannelInfo(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div>
                  <div className="font-semibold text-base mb-1">{selectedChannel.name}</div>
                  <div className="text-xs text-muted-foreground mb-2">
                    {selectedChannel.is_private ? 'Private' : 'Public'} channel
                  </div>
                  <div className="text-xs mb-2">
                    Created by: {(() => {
                      const creator = users.find(u => u.id === selectedChannel.created_by);
                      return creator ? getUserDisplayName(creator) : selectedChannel.created_by;
                    })()}
                  </div>
                </div>
                {/* Members list restored */}
                <div>
                  <div className="font-semibold text-sm mb-2">Members ({selectedChannel.members.length})</div>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedChannel.members.map(member => {
                      const userObj = users.find(u => u.id === member.id);
                      return (
                        <div key={member.id} className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={userObj?.avatar_url || undefined} alt={getUserDisplayName(userObj)} />
                            <AvatarFallback>{getUserInitials(userObj)}</AvatarFallback>
                          </Avatar>
                          <span className="truncate text-sm">{getUserDisplayName(userObj)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* Add user dropdown and button - Admin only */}
                {user?.user_metadata?.role === 'admin' && (
                <div className="flex gap-2 items-end mt-4">
                  <div className="flex-1">
                    <Select
                      value={addUserId}
                      onValueChange={setAddUserId}
                      disabled={addUserLoading || users.length === 0}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select user..." />
                      </SelectTrigger>
                      <SelectContent>
                        {users
                          .filter(u => !selectedChannel.members.some(m => m.id === u.id))
                          .map(u => (
                            <SelectItem key={u.id} value={u.id}>{getUserDisplayName(u)}</SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    size="sm"
                    className="h-9"
                    disabled={!addUserId || addUserLoading}
                    onClick={async () => {
                      if (!addUserId) return;
                      setAddUserLoading(true);
                      try {
                        const { error } = await supabase
                          .from('channel_members')
                          .insert({ channel_id: selectedChannel.id, user_id: addUserId });
                        if (error) {
                          console.error('Supabase insert error:', error);
                          if (error.code === '23505') {
                            toast({ title: "Already a member", description: "This user is already in the channel.", variant: "destructive" });
                          } else {
                            toast({ title: "Error", description: "Failed to add user.", variant: "destructive" });
                          }
                          setAddUserLoading(false);
                          // Always refresh members in case of race condition
                          await refreshChannelMembers(selectedChannel.id);
                          return;
                        }
                        // Always refresh members after add
                        await refreshChannelMembers(selectedChannel.id);
                        setAddUserId(undefined);
                        toast({ title: "User added", description: "User was added to the channel." });
                      } catch (err) {
                        toast({ title: "Error", description: "Failed to add user.", variant: "destructive" });
                      } finally {
                        setAddUserLoading(false);
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}