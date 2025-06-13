
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
  FileText,
  Filter,
  MoreHorizontal,
  Star,
  Pin,
  Calendar,
  User,
  Tag
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Notes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNote, setSelectedNote] = useState<any>(null);

  // Mock notes data
  const notes = [
    {
      id: 1,
      title: "Q4 Strategy Discussion - Acme Corp",
      content: "Had a great discussion with John Smith about their Q4 strategy. Key points:\n\n• They're looking to expand their team by 30%\n• Budget approved for new software tools\n• Decision timeline: End of December\n• Main concerns: integration with existing systems\n\nNext steps:\n- Send detailed integration plan\n- Schedule technical demo\n- Follow up with pricing options",
      author: "You",
      authorAvatar: "YU",
      client: "Acme Corporation",
      tags: ["strategy", "q4", "expansion"],
      category: "Meeting Notes",
      priority: "High",
      pinned: true,
      starred: false,
      date: "2024-12-15T14:30:00",
      lastEdited: "2024-12-15T15:45:00"
    },
    {
      id: 2,
      title: "Tech Solutions - Implementation Requirements",
      content: "Requirements gathering session with Sarah Johnson:\n\n• Current CRM: Salesforce (pain points with reporting)\n• Team size: 25 users\n• Main use cases: Lead tracking, sales pipeline, customer support\n• Integration needs: Email marketing platform, accounting software\n• Timeline: Q1 2025 implementation\n\nTechnical Requirements:\n- SSO integration\n- Custom fields for industry-specific data\n- Advanced reporting capabilities\n- Mobile access for field sales team",
      author: "Sarah Davis",
      authorAvatar: "SD",
      client: "Tech Solutions Ltd",
      tags: ["requirements", "implementation", "crm"],
      category: "Technical",
      priority: "Medium",
      pinned: false,
      starred: true,
      date: "2024-12-14T11:00:00",
      lastEdited: "2024-12-14T16:20:00"
    },
    {
      id: 3,
      title: "StartupXYZ - Onboarding Checklist",
      content: "Onboarding checklist for new client StartupXYZ:\n\n✓ Initial setup meeting completed\n✓ User accounts created\n✓ Data migration scheduled\n□ Training sessions planned\n□ Go-live date confirmed\n□ Support contacts established\n\nTraining Plan:\n- Admin training: Dec 18\n- End user training: Dec 20\n- Go-live support: Dec 22\n\nContact: Emily Davis (emily@startupxyz.com)",
      author: "Mike Johnson",
      authorAvatar: "MJ",
      client: "StartupXYZ",
      tags: ["onboarding", "training", "checklist"],
      category: "Process",
      priority: "Medium",
      pinned: false,
      starred: false,
      date: "2024-12-13T09:15:00",
      lastEdited: "2024-12-15T10:30:00"
    },
    {
      id: 4,
      title: "Global Industries - Contract Negotiations",
      content: "Contract negotiation notes with Mike Chen:\n\nKey Discussion Points:\n• Service level agreements - 99.9% uptime requirement\n• Data security and compliance requirements\n• Pricing structure - volume discounts requested\n• Payment terms - quarterly vs annual\n\nConcerns Raised:\n- Data backup and recovery procedures\n- GDPR compliance documentation\n- Escalation procedures for support issues\n\nProposed Solutions:\n- Provide detailed SLA documentation\n- Schedule security review session\n- Offer 10% discount for annual payment",
      author: "David Wilson",
      authorAvatar: "DW",
      client: "Global Industries",
      tags: ["contract", "negotiation", "sla"],
      category: "Legal",
      priority: "High",
      pinned: true,
      starred: true,
      date: "2024-12-12T16:45:00",
      lastEdited: "2024-12-13T09:00:00"
    },
    {
      id: 5,
      title: "Internal: Weekly Sales Team Sync",
      content: "Weekly sales team sync notes:\n\nTeam Updates:\n• John: 3 new demos scheduled, Acme Corp moving to proposal stage\n• Sarah: Tech Solutions contract signed, onboarding next week\n• Mike: Global Industries negotiation in progress\n• Emily: StartupXYZ implementation going well\n\nAction Items:\n- Review Q4 targets (Due: Dec 20)\n- Update sales collateral (Owner: Marketing)\n- Schedule product training for new features (Owner: Product)\n\nNext Meeting: Dec 22, 2024",
      author: "Sales Manager",
      authorAvatar: "SM",
      client: "Internal",
      tags: ["team-sync", "sales", "internal"],
      category: "Internal",
      priority: "Low",
      pinned: false,
      starred: false,
      date: "2024-12-11T10:00:00",
      lastEdited: "2024-12-11T11:30:00"
    },
    {
      id: 6,
      title: "Enterprise Corp - Discovery Call Notes",
      content: "Discovery call with David Wilson:\n\nCompany Background:\n• 500+ employees\n• Multiple locations (US, Europe)\n• Current solution: Custom built system (legacy)\n• Pain points: No integration, manual processes\n\nRequirements:\n• Multi-tenant architecture\n• Role-based access control\n• Advanced reporting and analytics\n• API access for integrations\n• White-label options\n\nBudget: $50k-100k annually\nDecision makers: David Wilson (VP Sales), IT Director\nTimeline: Q2 2025",
      author: "You",
      authorAvatar: "YU",
      client: "Enterprise Corp",
      tags: ["discovery", "enterprise", "requirements"],
      category: "Meeting Notes",
      priority: "High",
      pinned: false,
      starred: false,
      date: "2024-12-10T15:00:00",
      lastEdited: "2024-12-10T16:15:00"
    }
  ];

  const categories = ["All", "Meeting Notes", "Technical", "Process", "Legal", "Internal"];
  const priorities = ["All", "High", "Medium", "Low"];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Meeting Notes": return "bg-blue-100 text-blue-800";
      case "Technical": return "bg-purple-100 text-purple-800";
      case "Process": return "bg-green-100 text-green-800";
      case "Legal": return "bg-red-100 text-red-800";
      case "Internal": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const pinnedNotes = filteredNotes.filter(note => note.pinned);
  const starredNotes = filteredNotes.filter(note => note.starred);
  const recentNotes = filteredNotes.sort((a, b) => 
    new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime()
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const NoteCard = ({ note }: { note: any }) => (
    <div 
      className={`p-4 rounded-lg border cursor-pointer transition-colors hover:bg-accent/50 ${
        selectedNote?.id === note.id ? 'bg-accent/50 border-primary' : 'border-border'
      }`}
      onClick={() => setSelectedNote(note)}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {note.pinned && <Pin className="h-4 w-4 text-orange-500" />}
            {note.starred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
            <h4 className="font-medium text-sm line-clamp-2">{note.title}</h4>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit Note</DropdownMenuItem>
              <DropdownMenuItem>Pin Note</DropdownMenuItem>
              <DropdownMenuItem>Add to Starred</DropdownMenuItem>
              <DropdownMenuItem>Share Note</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <p className="text-xs text-muted-foreground line-clamp-3">
          {note.content}
        </p>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className={getCategoryColor(note.category)}>
            {note.category}
          </Badge>
          <Badge variant="secondary" className={getPriorityColor(note.priority)}>
            {note.priority}
          </Badge>
          <Badge variant="outline" className="text-xs">{note.client}</Badge>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {note.tags.map((tag, index) => (
            <span key={index} className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Avatar className="h-5 w-5">
              <AvatarFallback className="text-xs">{note.authorAvatar}</AvatarFallback>
            </Avatar>
            <span>{note.author}</span>
          </div>
          <span>Edited {formatDate(note.lastEdited)}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notes & Internal Comments</h1>
          <p className="text-muted-foreground mt-1">
            Capture and organize important information about your clients and deals.
          </p>
        </div>
        <Button className="gap-2">
          <Plus size={16} />
          New Note
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search notes by title, content, client, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter size={16} />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{notes.length}</p>
              <p className="text-sm text-muted-foreground">Total Notes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{pinnedNotes.length}</p>
              <p className="text-sm text-muted-foreground">Pinned</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{starredNotes.length}</p>
              <p className="text-sm text-muted-foreground">Starred</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{notes.filter(n => n.priority === "High").length}</p>
              <p className="text-sm text-muted-foreground">High Priority</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes Interface */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Notes List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>All Notes</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-3 m-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pinned">Pinned</TabsTrigger>
                <TabsTrigger value="starred">Starred</TabsTrigger>
              </TabsList>
              
              <div className="px-3 pb-3 space-y-3">
                <TabsContent value="all" className="mt-0">
                  <div className="space-y-3">
                    {recentNotes.map((note) => (
                      <NoteCard key={note.id} note={note} />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="pinned" className="mt-0">
                  <div className="space-y-3">
                    {pinnedNotes.length > 0 ? (
                      pinnedNotes.map((note) => (
                        <NoteCard key={note.id} note={note} />
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Pin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground text-sm">No pinned notes</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="starred" className="mt-0">
                  <div className="space-y-3">
                    {starredNotes.length > 0 ? (
                      starredNotes.map((note) => (
                        <NoteCard key={note.id} note={note} />
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Star className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground text-sm">No starred notes</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        {/* Note Content */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {selectedNote ? selectedNote.title : "Select a note to view"}
              </CardTitle>
              {selectedNote && (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    Share
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Pin Note</DropdownMenuItem>
                      <DropdownMenuItem>Add to Starred</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuItem>Export</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {selectedNote ? (
              <div className="space-y-6">
                {/* Note Metadata */}
                <div className="flex items-center justify-between pb-4 border-b">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{selectedNote.authorAvatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{selectedNote.author}</p>
                      <p className="text-xs text-muted-foreground">
                        Created {formatDate(selectedNote.date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getCategoryColor(selectedNote.category)}>
                      {selectedNote.category}
                    </Badge>
                    <Badge variant="secondary" className={getPriorityColor(selectedNote.priority)}>
                      {selectedNote.priority}
                    </Badge>
                  </div>
                </div>

                {/* Note Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>Client: {selectedNote.client}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Last edited: {formatDate(selectedNote.lastEdited)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {selectedNote.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="gap-1">
                        <Tag className="h-3 w-3" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Note Content */}
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {selectedNote.content}
                  </div>
                </div>

                {/* Add Comment Section */}
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Add Comment</h4>
                  <div className="space-y-3">
                    <Textarea 
                      placeholder="Add a comment to this note..." 
                      className="min-h-[80px]"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">Add Tag</Button>
                        <Button variant="outline" size="sm">Mention Team</Button>
                      </div>
                      <Button size="sm">Add Comment</Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-lg mb-2">No note selected</h3>
                <p className="text-muted-foreground">Choose a note from the list to view its content</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
