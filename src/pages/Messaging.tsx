import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Search, Send, Paperclip, MoreVertical, Phone, Video, Plus, Hash, Users, Trash2 } from "lucide-react";
import { useEffect, useLayoutEffect, useState, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { Database } from "@/types/supabase";

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
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  // Ref for the scrollable viewport
  const scrollViewportRef = useRef<HTMLDivElement | null>(null);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

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
        // First check if tables exist by trying a simple query
        const { data: tableCheck, error: tableError } = await supabase
          .from('channels')
          .select('id')
          .limit(1);

        if (tableError && tableError.code === 'PGRST200') {
          // Tables don't exist yet, show setup message
          console.log('Chat tables not found. Please run the migration first.');
          toast({
            title: "Setup Required",
            description: "Chat tables need to be created. Please run the database migration.",
            variant: "destructive"
          });
          setTablesExist(false);
          return;
        }

        // First fetch public channels (simplified query to avoid RLS recursion)
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

        // Then fetch private channels the user is a member of
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
              .eq('user_id', user?.id)
              .then(result => result.data?.map(row => row.channel_id) || [])
          );

        if (privateError) throw privateError;

        // For now, we'll use placeholder user details since we can't access admin API
        // In a real implementation, you'd need to create a separate users table or use RPC
        const userDetailsMap = new Map<string, { id: string; email: string }>();
        
        // Add current user to the map
        if (user) {
          userDetailsMap.set(user.id, {
            id: user.id,
            email: user.email || 'unknown@example.com'
          });
        }

        const allChannels = [...(publicChannels || []), ...(privateChannels || [])];
        
        const formattedChannels: Channel[] = allChannels.map(channel => ({
          id: channel.id,
          name: channel.name,
          is_private: channel.is_private,
          created_by: channel.created_by,
          members: [{
            id: user?.id || 'unknown',
            name: user?.email?.split('@')[0] || 'User',
            avatar: user?.email?.[0].toUpperCase() || 'U'
          }]
        }));

        setChannels(formattedChannels);
        setTablesExist(true);
      } catch (error: any) {
        console.error('Error fetching channels:', error);
        
        // Check for infinite recursion error
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
      }
    };

    if (user) {
      fetchChannels();
    }
  }, [user]);

  // Fetch messages with pagination
  const fetchMessages = async (channelId: string, before?: string) => {
    setPaginationLoading(true);
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
    setPaginationLoading(false);
    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
    return data || [];
  };

  // Always fetch latest messages when selectedChannel changes
  useEffect(() => {
    if (!selectedChannel) return;
    setMessages([]);
    setHasMoreMessages(true);
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
  }, [selectedChannel, users]);

  // Load more messages on scroll top
  const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
    if (paginationLoading || !hasMoreMessages) return;
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

    try {
      setLoading(true);
      
      // Create channel
      const { data: channelData, error: channelError } = await supabase
        .from('channels')
        .insert({
          name: newChannelName.toLowerCase().replace(/\s+/g, '-'),
          created_by: user.id,
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
          user_id: user.id
        });

      if (memberError) throw memberError;

      // Add to local state
      setChannels(prev => [...prev, {
        id: channelData.id,
        name: channelData.name,
        is_private: channelData.is_private,
        created_by: channelData.created_by,
        members: [{
          id: user.id,
          name: user.email?.split('@')[0] || 'User',
          avatar: user.email?.[0].toUpperCase() || 'U'
        }]
      }]);

      setNewChannelName('');
      toast({
        title: "Success",
        description: "Channel created successfully"
      });
    } catch (error) {
      console.error('Error creating channel:', error);
      toast({
        title: "Error",
        description: "Failed to create channel",
        variant: "destructive"
      });
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
        // Normalize channel name for this DM
        const ids = [user.id, pendingDMUser.id].sort();
        const channelName = `dm-${ids[0]}-${ids[1]}`;
        // Create the channel
        const { data: newChannelData, error: channelError } = await supabase
          .from('channels')
          .insert({
            name: channelName,
            is_private: true,
            created_by: user.id
          })
          .select()
          .single();
        if (channelError) throw channelError;
        // Add both users as members
        await supabase.from('channel_members').insert([
          { channel_id: newChannelData.id, user_id: user.id },
          { channel_id: newChannelData.id, user_id: pendingDMUser.id }
        ]);
        // Add to local state
        const newChannel = {
          id: newChannelData.id,
          name: newChannelData.name,
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
      // Normalize channel name for this DM
      const ids = [user.id, targetUser.id].sort();
      const channelName = `dm-${ids[0]}-${ids[1]}`;

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
      return otherUser ? getUserDisplayName(otherUser) : 'Direct Message';
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
          // Play sound if message is from another user and permission is granted
          if (
            newMessage.sender_id !== user?.id &&
            audioRef.current &&
            (!('Notification' in window) || Notification.permission === 'granted')
          ) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {});
          }
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

  useLayoutEffect(() => {
    setTimeout(() => {
      scrollToBottom();
    }, 0);
  }, [messages, selectedChannel]);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [messages, selectedChannel]);

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      <audio ref={audioRef} src="/notificationsound.mp3" preload="auto" />
      {tablesExist === false ? (
        <div className="flex-1 flex items-center justify-center">
          <Card className="w-96 p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Chat Setup Required</h2>
              <p className="text-muted-foreground mb-6">
                The chat system requires database tables to be created. Please run the following SQL migration in your Supabase dashboard:
              </p>
              <div className="bg-muted p-4 rounded-lg mb-6 text-left text-sm font-mono overflow-x-auto">
                <pre className="whitespace-pre-wrap">
{`-- Create channels table
CREATE TABLE IF NOT EXISTS public.channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    is_private BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create channel_members table
CREATE TABLE IF NOT EXISTS public.channel_members (
    channel_id UUID REFERENCES public.channels(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    PRIMARY KEY (channel_id, user_id)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_id UUID NOT NULL REFERENCES public.channels(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);`}
                </pre>
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
          <Card className="w-80 h-full border-r flex flex-col">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold">Channels</h2>
                <Dialog>
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
                      />
                      <Button onClick={createChannel} disabled={loading}>
                        Create
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search channels..." className="pl-8" />
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-6 space-y-2">
                {channels.map((channel) => {
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
                      className={`flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer ${
                        selectedChannel?.id === channel.id ? 'bg-muted' : ''
                      }`}
                      onClick={() => {
                        setSelectedChannel(channel);
                        setSelectedUser(null);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {isDM && dmUser ? (
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={dmUser.avatar_url} alt={getUserDisplayName(dmUser)} />
                            <AvatarFallback>{getUserInitials(dmUser)}</AvatarFallback>
                          </Avatar>
                        ) : (
                          <Hash className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span>{getChannelDisplayName(channel, user, users)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {channel.created_by === user?.id && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteChannel(channel.id);
                            }}
                            disabled={loading}
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                        >
                          <Users className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
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

          {/* Main chat area */}
          <div className="flex-1 flex flex-col">
            {/* Chat header */}
            {selectedChannel && (
              <Card className="border-b rounded-none p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
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
                      <p className="text-sm text-muted-foreground">
                        {selectedChannel.members.length} members
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Users className="h-5 w-5" />
                    </Button>
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
            <ScrollArea className="flex-1 p-4" onScroll={handleScroll} ref={setScrollViewportRef}>
              <div className="space-y-4">
                {paginationLoading && (
                  <div className="text-center text-xs text-muted-foreground">Loading...</div>
                )}
                {messages
                  .filter((message) => selectedChannel && message.channel_id === selectedChannel.id)
                  .map((message, idx, arr) => (
                    <div
                      key={message.id}
                      ref={idx === arr.length - 1 ? lastMessageRef : null}
                      className={`flex ${message.sender.id === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex gap-2 max-w-[70%] ${message.sender.id === user?.id ? 'flex-row-reverse' : ''}`}>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
                          <AvatarFallback>{getUserInitials(message.sender)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div
                            className={`rounded-lg p-3 ${
                              message.sender.id === user?.id
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            {message.content}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(message.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </ScrollArea>
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
        </>
      )}
    </div>
  );
}
