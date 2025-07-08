import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Search, Send, Paperclip, MoreVertical, Phone, Video, Plus, Hash, Users, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
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

  // Subscribe to channel messages
  useEffect(() => {
    if (!selectedChannel) return;

    // Fetch existing messages
    const fetchMessages = async () => {
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
        .eq('channel_id', selectedChannel.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      if (!data) return;

      const messages: Message[] = (data as MessageWithUser[]).map(msg => ({
        id: msg.id,
        content: msg.content,
        created_at: msg.created_at,
        sender: {
          id: msg.sender_id,
          name: msg.users[0]?.email.split('@')[0] || 'Unknown',
          avatar: msg.users[0]?.email[0].toUpperCase() || 'U'
        }
      }));

      setMessages(messages);
    };

    fetchMessages();

    // Subscribe to new messages
    const subscription = supabase
      .channel(`channel-${selectedChannel.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `channel_id=eq.${selectedChannel.id}`
      }, async payload => {
        const newMessage = payload.new as any;
        
        // Use a more robust approach for sender details
        // Since we can't reliably access the users table, use the current user's info as fallback
        const senderName = user?.id === newMessage.sender_id 
          ? (user?.email?.split('@')[0] || 'You')
          : `User-${newMessage.sender_id.slice(0, 4)}`;
        
        const senderAvatar = user?.id === newMessage.sender_id
          ? (user?.email?.[0].toUpperCase() || 'U')
          : 'U';

        setMessages(prev => [...prev, {
          id: newMessage.id,
          content: newMessage.content,
          created_at: newMessage.created_at,
          sender: {
            id: newMessage.sender_id,
            name: senderName,
            avatar: senderAvatar
          }
        }]);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [selectedChannel]);

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
    if (!messageInput.trim() || loading) return;
    if (selectedChannel) {
      if (!user) return;
      try {
        setLoading(true);
        const { error } = await supabase
          .from('messages')
          .insert({
            content: messageInput,
            channel_id: selectedChannel.id,
            sender_id: user.id
          });
        if (error) throw error;
        setMessageInput('');
      } catch (error) {
        console.error('Error sending message:', error);
        toast({
          title: 'Error',
          description: 'Failed to send message',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    } else if (pendingDMUser && user) {
      // Create the DM channel and send the first message
      try {
        setLoading(true);
        const channelName = `dm-${user.id}-${pendingDMUser.id}`;
        const { data: newChannel, error: createError } = await supabase
          .from('channels')
          .insert({
            name: channelName,
            created_by: user.id,
            is_private: true
          })
          .select()
          .single();
        if (createError) throw createError;
        const channelId = newChannel.id;
        await supabase.from('channel_members').insert([
          { channel_id: channelId, user_id: user.id },
          { channel_id: channelId, user_id: pendingDMUser.id }
        ]);
        await supabase.from('messages').insert({
          content: messageInput,
          channel_id: channelId,
          sender_id: user.id
        });
        // Add to local state and select
        const dmChannel = {
          id: newChannel.id,
          name: newChannel.name,
          is_private: newChannel.is_private,
          created_by: newChannel.created_by,
          members: [
            {
              id: user.id,
              name: user.email?.split('@')[0] || 'User',
              avatar: user.email?.[0].toUpperCase() || 'U'
            },
            {
              id: pendingDMUser.id,
              name: pendingDMUser.email?.split('@')[0] || 'User',
              avatar: pendingDMUser.email?.[0].toUpperCase() || 'U'
            }
          ]
        };
        setChannels((prev) => [...prev, dmChannel]);
        setSelectedChannel(dmChannel);
        setSelectedUser(pendingDMUser);
        setPendingDMUser(null);
        setMessageInput('');
      } catch (error) {
        console.error('Error sending message:', error);
        toast({
          title: 'Error',
          description: 'Failed to send message',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from('users').select('id, email');
      if (!error) setUsers(data || []);
    };
    fetchUsers();
  }, []);

  // Helper to find a DM channel (do not create if not found)
  const openDirectMessage = async (targetUser: any) => {
    if (!user || !targetUser) return;
    setLoading(true);
    try {
      // Try to find an existing private channel between these two users
      const { data: existingChannels, error: findError } = await supabase
        .from('channels')
        .select('id, name, is_private, created_by, channel_members!inner(user_id)')
        .eq('is_private', true)
        .contains('channel_members', [{ user_id: user.id }, { user_id: targetUser.id }]);
      if (!findError && existingChannels && existingChannels.length > 0) {
        // Use the first found channel
        const dmChannel = channels.find((c) => c.id === existingChannels[0].id);
        if (dmChannel) {
          setSelectedChannel(dmChannel);
          setSelectedUser(targetUser);
          setPendingDMUser(null);
        } else {
          // Fetch channel details if not in state
          const { data: channelData } = await supabase
            .from('channels')
            .select('id, name, is_private, created_by')
            .eq('id', existingChannels[0].id)
            .single();
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

  return (
    <div className="h-[calc(100vh-4rem)] flex">
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
            <div className="p-4 border-b">
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
              <div className="space-y-2 p-2">
                {channels.map((channel) => (
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
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <span>{channel.name}</span>
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
                ))}
                <Separator className="my-4" />
                <h2 className="font-semibold text-sm mb-2">Users</h2>
                {users.filter(u => u.id !== user?.id).map((u) => (
                  <div
                    key={u.id}
                    className={`flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 cursor-pointer ${selectedUser?.id === u.id ? 'bg-muted' : ''}`}
                    onClick={() => openDirectMessage(u)}
                  >
                    <Avatar className="h-6 w-6">
                      <div className="bg-primary h-full w-full flex items-center justify-center text-primary-foreground text-xs">
                        {u.email?.[0]?.toUpperCase() || 'U'}
                      </div>
                    </Avatar>
                    <span>{u.email}</span>
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
                    <Hash className="h-5 w-5" />
                    <div>
                      <h2 className="font-semibold">{selectedChannel.name}</h2>
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
                    <div className="bg-primary h-full w-full flex items-center justify-center text-primary-foreground text-xs">
                      {pendingDMUser.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                  </Avatar>
                  <div>
                    <h2 className="font-semibold">{pendingDMUser.email}</h2>
                    <p className="text-sm text-muted-foreground">Start a new conversation</p>
                  </div>
                </div>
              </Card>
            )}
            {/* Messages area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender.id === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-2 max-w-[70%] ${message.sender.id === user?.id ? 'flex-row-reverse' : ''}`}>
                      <Avatar className="h-8 w-8">
                        <div className="bg-primary h-full w-full flex items-center justify-center text-primary-foreground text-xs">
                          {message.sender.avatar}
                        </div>
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
