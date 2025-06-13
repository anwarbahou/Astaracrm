
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
  MapPin
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

export default function Clients() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock client data
  const clients = [
    {
      id: 1,
      name: "Acme Corporation",
      contact: "John Smith",
      email: "john@acme.com",
      phone: "+1 (555) 123-4567",
      location: "New York, NY",
      status: "Active",
      deals: 3,
      revenue: "$145,000",
      lastContact: "2 days ago",
      avatar: "AC"
    },
    {
      id: 2,
      name: "Tech Solutions Ltd",
      contact: "Sarah Johnson",
      email: "sarah@techsolutions.com",
      phone: "+1 (555) 987-6543",
      location: "San Francisco, CA",
      status: "Active",
      deals: 2,
      revenue: "$89,500",
      lastContact: "1 week ago",
      avatar: "TS"
    },
    {
      id: 3,
      name: "Global Industries",
      contact: "Mike Chen",
      email: "mike@global.com",
      phone: "+1 (555) 456-7890",
      location: "Chicago, IL",
      status: "Inactive",
      deals: 1,
      revenue: "$23,000",
      lastContact: "3 weeks ago",
      avatar: "GI"
    },
    {
      id: 4,
      name: "StartupXYZ",
      contact: "Emily Davis",
      email: "emily@startupxyz.com",
      phone: "+1 (555) 321-0987",
      location: "Austin, TX",
      status: "Active",
      deals: 4,
      revenue: "$67,200",
      lastContact: "Yesterday",
      avatar: "SX"
    },
    {
      id: 5,
      name: "Enterprise Corp",
      contact: "David Wilson",
      email: "david@enterprise.com",
      phone: "+1 (555) 654-3210",
      location: "Boston, MA",
      status: "Prospect",
      deals: 0,
      revenue: "$0",
      lastContact: "1 month ago",
      avatar: "EC"
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

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Client Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage your client relationships and track business growth.
          </p>
        </div>
        <Button className="gap-2">
          <Plus size={16} />
          Add Client
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search clients by name, contact, or email..."
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
              <p className="text-2xl font-bold">{clients.length}</p>
              <p className="text-sm text-muted-foreground">Total Clients</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{clients.filter(c => c.status === "Active").length}</p>
              <p className="text-sm text-muted-foreground">Active Clients</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{clients.filter(c => c.status === "Prospect").length}</p>
              <p className="text-sm text-muted-foreground">Prospects</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold">$324,700</p>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Client List */}
      <Card>
        <CardHeader>
          <CardTitle>All Clients ({filteredClients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredClients.map((client) => (
              <div key={client.id} className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {client.avatar}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4">
                  <div className="md:col-span-2">
                    <Link 
                      to={`/clients/${client.id}`}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {client.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">{client.contact}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{client.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{client.phone}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{client.location}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Last contact: {client.lastContact}</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="font-medium">{client.deals}</p>
                    <p className="text-xs text-muted-foreground">Active Deals</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{client.revenue}</p>
                      <Badge className={`${getStatusColor(client.status)} text-white text-xs`}>
                        {client.status}
                      </Badge>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Client</DropdownMenuItem>
                        <DropdownMenuItem>Send Email</DropdownMenuItem>
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
