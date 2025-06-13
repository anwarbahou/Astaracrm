
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Search, 
  Plus, 
  Filter,
  MoreHorizontal,
  Mail,
  Phone,
  User
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Contacts() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock contact data
  const contacts = [
    {
      id: 1,
      name: "John Smith",
      email: "john@acme.com",
      phone: "+1 (555) 123-4567",
      company: "Acme Corporation",
      position: "CEO",
      status: "Active",
      lastContact: "2 days ago",
      tags: ["Decision Maker", "VIP"],
      avatar: "JS"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@techsolutions.com",
      phone: "+1 (555) 987-6543",
      company: "Tech Solutions Ltd",
      position: "CTO",
      status: "Active",
      lastContact: "1 week ago",
      tags: ["Technical"],
      avatar: "SJ"
    },
    {
      id: 3,
      name: "Mike Chen",
      email: "mike@global.com",
      phone: "+1 (555) 456-7890",
      company: "Global Industries",
      position: "Procurement Manager",
      status: "Inactive",
      lastContact: "3 weeks ago",
      tags: ["Procurement"],
      avatar: "MC"
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily@startupxyz.com",
      phone: "+1 (555) 321-0987",
      company: "StartupXYZ",
      position: "Founder",
      status: "Active",
      lastContact: "Yesterday",
      tags: ["Founder", "Startup"],
      avatar: "ED"
    },
    {
      id: 5,
      name: "David Wilson",
      email: "david@enterprise.com",
      phone: "+1 (555) 654-3210",
      company: "Enterprise Corp",
      position: "VP Sales",
      status: "Prospect",
      lastContact: "1 month ago",
      tags: ["Sales"],
      avatar: "DW"
    },
    {
      id: 6,
      name: "Lisa Anderson",
      email: "lisa@acme.com",
      phone: "+1 (555) 789-0123",
      company: "Acme Corporation",
      position: "CTO",
      status: "Active",
      lastContact: "3 days ago",
      tags: ["Technical", "Decision Maker"],
      avatar: "LA"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-500";
      case "Inactive": return "bg-red-500";
      case "Prospect": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  const getTagColor = (tag: string) => {
    switch (tag) {
      case "Decision Maker": return "bg-purple-100 text-purple-800";
      case "VIP": return "bg-gold-100 text-yellow-800";
      case "Technical": return "bg-blue-100 text-blue-800";
      case "Founder": return "bg-green-100 text-green-800";
      case "Startup": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contact Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage all your business contacts and relationships.
          </p>
        </div>
        <Button className="gap-2">
          <Plus size={16} />
          Add Contact
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search contacts by name, company, email, or position..."
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
              <p className="text-2xl font-bold">{contacts.length}</p>
              <p className="text-sm text-muted-foreground">Total Contacts</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{contacts.filter(c => c.status === "Active").length}</p>
              <p className="text-sm text-muted-foreground">Active Contacts</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{contacts.filter(c => c.tags.includes("Decision Maker")).length}</p>
              <p className="text-sm text-muted-foreground">Decision Makers</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{new Set(contacts.map(c => c.company)).size}</p>
              <p className="text-sm text-muted-foreground">Companies</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact List */}
      <Card>
        <CardHeader>
          <CardTitle>All Contacts ({filteredContacts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredContacts.map((contact) => (
              <div key={contact.id} className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {contact.avatar}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="md:col-span-2">
                    <h4 className="font-medium">{contact.name}</h4>
                    <p className="text-sm text-muted-foreground">{contact.position}</p>
                    <p className="text-sm text-muted-foreground">{contact.company}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{contact.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{contact.phone}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {contact.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className={`${getTagColor(tag)} text-xs`}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">Last contact: {contact.lastContact}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge className={`${getStatusColor(contact.status)} text-white text-xs`}>
                      {contact.status}
                    </Badge>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Contact</DropdownMenuItem>
                        <DropdownMenuItem>Send Email</DropdownMenuItem>
                        <DropdownMenuItem>Schedule Meeting</DropdownMenuItem>
                        <DropdownMenuItem>Add Note</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
