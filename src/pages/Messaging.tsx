import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Search, Send, Paperclip, MoreVertical, Phone, Video, Plus, Hash, Users, Trash2 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Message {
  id: string;
  content: string;
  sender: {
    name: string;
    avatar: string;
  };
  timestamp: string;
  isOwn: boolean;
}

interface Channel {
  id: string;
  name: string;
  members: string[];
  isPrivate: boolean;
}

const mockChannels: Channel[] = [
  {
    id: '1',
    name: 'general',
    members: ['Sarah Johnson', 'Mike Chen', 'Emily Davis'],
    isPrivate: false,
  },
  {
    id: '2',
    name: 'sales-team',
    members: ['Sarah Johnson', 'Mike Chen'],
    isPrivate: true,
  },
];

const mockChats = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: 'SJ',
    lastMessage: 'I\'ll send over the proposal shortly',
    timestamp: '2 min ago',
    unread: 2,
  },
  {
    id: '2',
    name: 'Mike Chen',
    avatar: 'MC',
    lastMessage: 'The client meeting went well',
    timestamp: '1 hour ago',
    unread: 0,
  },
  {
    id: '3',
    name: 'Emily Davis',
    avatar: 'ED',
    lastMessage: 'Can we discuss the project timeline?',
    timestamp: '3 hours ago',
    unread: 1,
  },
];

const mockMessages: Message[] = [
  {
    id: '1',
    content: 'Hi there! I\'ve reviewed the latest changes to the proposal.',
    sender: {
      name: 'Sarah Johnson',
      avatar: 'SJ'
    },
    timestamp: '10:30 AM',
    isOwn: false
  },
  {
    id: '2',
    content: 'Great! What do you think about the pricing structure?',
    sender: {
      name: 'You',
      avatar: 'YO'
    },
    timestamp: '10:32 AM',
    isOwn: true
  },
  {
    id: '3',
    content: 'I think it\'s competitive and aligns well with the market. The client should be pleased with the value proposition.',
    sender: {
      name: 'Sarah Johnson',
      avatar: 'SJ'
    },
    timestamp: '10:35 AM',
    isOwn: false
  }
];

export default function Messaging() {
  const [channels, setChannels] = useState<Channel[]>(mockChannels);
  const [newChannelName, setNewChannelName] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

  const createChannel = () => {
    if (!newChannelName.trim()) return;
    
    const newChannel: Channel = {
      id: (channels.length + 1).toString(),
      name: newChannelName.toLowerCase().replace(/\s+/g, '-'),
      members: ['You'],
      isPrivate: false,
    };
    
    setChannels([...channels, newChannel]);
    setNewChannelName('');
  };

  const deleteChannel = (channelId: string) => {
    setChannels(channels.filter(channel => channel.id !== channelId));
    if (selectedChannel?.id === channelId) {
      setSelectedChannel(null);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Sidebar with channels and chat list */}
      <Card className="w-80 h-full border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Channels</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
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
                  <Button onClick={createChannel}>Create</Button>
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
                onClick={() => setSelectedChannel(channel)}
              >
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span>{channel.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChannel(channel.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
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
          </div>
          <Separator className="my-2" />
          <div className="p-2">
            <h3 className="font-semibold px-2 mb-2">Direct Messages</h3>
            {mockChats.map((chat) => (
              <div
                key={chat.id}
                className="p-2 hover:bg-muted/50 cursor-pointer flex items-center gap-3"
              >
                <Avatar>
                  <div className="bg-primary h-full w-full flex items-center justify-center text-primary-foreground">
                    {chat.avatar}
                  </div>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="font-medium truncate">{chat.name}</p>
                    <span className="text-xs text-muted-foreground">{chat.timestamp}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                </div>
                {chat.unread > 0 && (
                  <div className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {chat.unread}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <Card className="border-b rounded-none p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              {selectedChannel ? (
                <>
                  <Hash className="h-5 w-5" />
                  <div>
                    <h2 className="font-semibold">{selectedChannel.name}</h2>
                    <p className="text-sm text-muted-foreground">{selectedChannel.members.length} members</p>
                  </div>
                </>
              ) : (
                <>
                  <Avatar>
                    <div className="bg-primary h-full w-full flex items-center justify-center text-primary-foreground">
                      SJ
                    </div>
                  </Avatar>
                  <div>
                    <h2 className="font-semibold">Sarah Johnson</h2>
                    <p className="text-sm text-muted-foreground">Online</p>
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Users className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Phone className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Messages area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {mockMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-[70%] ${message.isOwn ? 'flex-row-reverse' : ''}`}>
                  <Avatar className="h-8 w-8">
                    <div className="bg-primary h-full w-full flex items-center justify-center text-primary-foreground text-xs">
                      {message.sender.avatar}
                    </div>
                  </Avatar>
                  <div>
                    <div
                      className={`rounded-lg p-3 ${
                        message.isOwn
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {message.content}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Message input */}
        <Card className="border-t rounded-none p-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Paperclip className="h-5 w-5" />
            </Button>
            <Input placeholder="Type a message..." className="flex-1" />
            <Button>
              <Send className="h-5 w-5 mr-2" />
              Send
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
