
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Search, 
  Plus, 
  Mail,
  Send,
  Inbox,
  Archive,
  Star,
  Paperclip,
  Reply,
  Forward,
  MoreHorizontal
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function EmailCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmail, setSelectedEmail] = useState<any>(null);

  // Mock email data
  const emails = [
    {
      id: 1,
      from: "john@acme.com",
      fromName: "John Smith",
      to: "you@wolfhunt.com",
      subject: "Re: Q4 Proposal Discussion",
      preview: "Thanks for the detailed proposal. I have a few questions about the implementation timeline...",
      body: "Hi there,\n\nThanks for the detailed proposal. I have a few questions about the implementation timeline and the pricing structure. Could we schedule a call to discuss?\n\nBest regards,\nJohn Smith",
      date: "2024-12-15T10:30:00",
      read: false,
      starred: true,
      client: "Acme Corporation",
      thread: 3,
      attachments: [],
      type: "Received"
    },
    {
      id: 2,
      from: "you@wolfhunt.com",
      fromName: "You",
      to: "sarah@techsolutions.com",
      subject: "Product Demo Follow-up",
      preview: "I wanted to follow up on our product demonstration last week...",
      body: "Hi Sarah,\n\nI wanted to follow up on our product demonstration last week. Did you have any additional questions about the features we discussed?\n\nI'm happy to schedule another call if needed.\n\nBest regards,\nYour Name",
      date: "2024-12-14T16:45:00",
      read: true,
      starred: false,
      client: "Tech Solutions Ltd",
      thread: 1,
      attachments: ["demo-recording.mp4"],
      type: "Sent"
    },
    {
      id: 3,
      from: "mike@global.com",
      fromName: "Mike Chen",
      to: "you@wolfhunt.com",
      subject: "Contract Terms Review",
      preview: "I've reviewed the contract terms and have some feedback...",
      body: "Hello,\n\nI've reviewed the contract terms and have some feedback on the service level agreements. Can we discuss the details?\n\nRegards,\nMike Chen",
      date: "2024-12-13T14:20:00",
      read: true,
      starred: false,
      client: "Global Industries",
      thread: 1,
      attachments: ["contract-feedback.pdf"],
      type: "Received"
    },
    {
      id: 4,
      from: "you@wolfhunt.com",
      fromName: "You",
      to: "team@wolfhunt.com",
      subject: "Weekly Sales Update",
      preview: "Here's our weekly sales summary for the team...",
      body: "Team,\n\nHere's our weekly sales summary:\n- 5 new leads\n- 3 demos scheduled\n- 2 deals closed\n\nGreat work everyone!\n\nBest,\nYour Name",
      date: "2024-12-12T09:00:00",
      read: true,
      starred: false,
      client: "Internal",
      thread: 1,
      attachments: [],
      type: "Sent"
    },
    {
      id: 5,
      from: "emily@startupxyz.com",
      fromName: "Emily Davis",
      to: "you@wolfhunt.com",
      subject: "Partnership Opportunity",
      preview: "I'd like to discuss a potential partnership between our companies...",
      body: "Hi,\n\nI'd like to discuss a potential partnership between our companies. We're looking for a CRM solution and your platform seems like a great fit.\n\nWould you be available for a call next week?\n\nBest,\nEmily Davis",
      date: "2024-12-11T11:30:00",
      read: false,
      starred: false,
      client: "StartupXYZ",
      thread: 1,
      attachments: ["company-overview.pdf"],
      type: "Received"
    }
  ];

  const templates = [
    {
      id: 1,
      name: "Follow-up After Demo",
      subject: "Thank you for your time - Next steps",
      body: "Hi {{contact_name}},\n\nThank you for taking the time to see our product demonstration today. I hope you found it valuable and that our solution addresses your business needs.\n\nAs discussed, I'm attaching the pricing information and implementation timeline. Please let me know if you have any questions or if you'd like to schedule a follow-up call.\n\nBest regards,\n{{your_name}}"
    },
    {
      id: 2,
      name: "Proposal Submission",
      subject: "Proposal for {{company_name}} - {{project_name}}",
      body: "Dear {{contact_name}},\n\nPlease find attached our detailed proposal for {{project_name}}. We've carefully considered your requirements and believe our solution will deliver significant value to {{company_name}}.\n\nI'm available to discuss any questions you may have and look forward to the next steps.\n\nBest regards,\n{{your_name}}"
    },
    {
      id: 3,
      name: "Meeting Reminder",
      subject: "Reminder: Meeting tomorrow at {{time}}",
      body: "Hi {{contact_name}},\n\nThis is a friendly reminder about our meeting scheduled for tomorrow at {{time}}.\n\nWe'll be discussing:\n- {{topic_1}}\n- {{topic_2}}\n- {{topic_3}}\n\nPlease let me know if you need to reschedule.\n\nBest regards,\n{{your_name}}"
    }
  ];

  const filteredEmails = emails.filter(email =>
    email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.fromName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const receivedEmails = filteredEmails.filter(e => e.type === "Received");
  const sentEmails = filteredEmails.filter(e => e.type === "Sent");
  const unreadEmails = filteredEmails.filter(e => !e.read);
  const starredEmails = filteredEmails.filter(e => e.starred);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const EmailListItem = ({ email }: { email: any }) => (
    <div 
      className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors hover:bg-accent/50 ${
        selectedEmail?.id === email.id ? 'bg-accent/50 border-primary' : 'border-border'
      } ${!email.read ? 'bg-blue-50/50' : ''}`}
      onClick={() => setSelectedEmail(email)}
    >
      <div className="flex items-center gap-2">
        {email.starred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
        {!email.read && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
      </div>
      
      <Avatar className="h-8 w-8">
        <AvatarFallback className="text-xs">
          {email.fromName.split(' ').map(n => n[0]).join('')}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className={`font-medium truncate ${!email.read ? 'font-semibold' : ''}`}>
            {email.fromName}
          </span>
          <span className="text-xs text-muted-foreground">{formatDate(email.date)}</span>
        </div>
        <div className="space-y-1">
          <p className={`text-sm truncate ${!email.read ? 'font-medium' : ''}`}>
            {email.subject}
          </p>
          <p className="text-xs text-muted-foreground truncate">{email.preview}</p>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">{email.client}</Badge>
            {email.attachments.length > 0 && (
              <Paperclip className="h-3 w-3 text-muted-foreground" />
            )}
            {email.thread > 1 && (
              <span className="text-xs text-muted-foreground">({email.thread})</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Email Communication Center</h1>
          <p className="text-muted-foreground mt-1">
            Manage all your client communications in one place.
          </p>
        </div>
        <Button className="gap-2">
          <Plus size={16} />
          Compose Email
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{emails.length}</p>
              <p className="text-sm text-muted-foreground">Total Emails</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{unreadEmails.length}</p>
              <p className="text-sm text-muted-foreground">Unread</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{sentEmails.length}</p>
              <p className="text-sm text-muted-foreground">Sent Today</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{starredEmails.length}</p>
              <p className="text-sm text-muted-foreground">Starred</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Email Interface */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Email List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Emails</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search emails..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-60"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-4 m-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="inbox">Inbox</TabsTrigger>
                <TabsTrigger value="sent">Sent</TabsTrigger>
                <TabsTrigger value="starred">Starred</TabsTrigger>
              </TabsList>
              
              <div className="px-3 pb-3">
                <TabsContent value="all" className="space-y-2 mt-0">
                  {filteredEmails.map((email) => (
                    <EmailListItem key={email.id} email={email} />
                  ))}
                </TabsContent>
                
                <TabsContent value="inbox" className="space-y-2 mt-0">
                  {receivedEmails.map((email) => (
                    <EmailListItem key={email.id} email={email} />
                  ))}
                </TabsContent>
                
                <TabsContent value="sent" className="space-y-2 mt-0">
                  {sentEmails.map((email) => (
                    <EmailListItem key={email.id} email={email} />
                  ))}
                </TabsContent>
                
                <TabsContent value="starred" className="space-y-2 mt-0">
                  {starredEmails.map((email) => (
                    <EmailListItem key={email.id} email={email} />
                  ))}
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        {/* Email Content */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {selectedEmail ? selectedEmail.subject : "Select an email to view"}
              </CardTitle>
              {selectedEmail && (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Reply size={16} />
                    Reply
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Forward size={16} />
                    Forward
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Mark as unread</DropdownMenuItem>
                      <DropdownMenuItem>Add to starred</DropdownMenuItem>
                      <DropdownMenuItem>Archive</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {selectedEmail ? (
              <div className="space-y-6">
                {/* Email Header */}
                <div className="space-y-4 pb-4 border-b">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {selectedEmail.fromName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{selectedEmail.fromName}</p>
                        <p className="text-sm text-muted-foreground">{selectedEmail.from}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {new Date(selectedEmail.date).toLocaleString()}
                      </p>
                      <Badge variant="outline">{selectedEmail.client}</Badge>
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <p><span className="text-muted-foreground">To:</span> {selectedEmail.to}</p>
                  </div>
                  
                  {selectedEmail.attachments.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Paperclip className="h-4 w-4 text-muted-foreground" />
                      <div className="flex gap-2">
                        {selectedEmail.attachments.map((attachment, index) => (
                          <Badge key={index} variant="secondary" className="gap-1">
                            <span>{attachment}</span>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Email Body */}
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-sm">
                    {selectedEmail.body}
                  </div>
                </div>

                {/* Quick Reply */}
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Quick Reply</h4>
                  <div className="space-y-3">
                    <Textarea 
                      placeholder="Type your reply..." 
                      className="min-h-[100px]"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Paperclip size={16} />
                        </Button>
                        <Button variant="outline" size="sm">Template</Button>
                      </div>
                      <Button className="gap-2">
                        <Send size={16} />
                        Send Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <Mail className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-lg mb-2">No email selected</h3>
                <p className="text-muted-foreground">Choose an email from the list to view its contents</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Email Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Email Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {templates.map((template) => (
              <div key={template.id} className="p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer">
                <h4 className="font-medium mb-2">{template.name}</h4>
                <p className="text-sm text-muted-foreground mb-3">{template.subject}</p>
                <p className="text-xs text-muted-foreground line-clamp-3">{template.body}</p>
                <Button variant="outline" size="sm" className="mt-3">
                  Use Template
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
