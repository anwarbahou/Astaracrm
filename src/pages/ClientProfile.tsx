
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Globe,
  Calendar,
  DollarSign,
  Users,
  FileText,
  Plus,
  Edit
} from "lucide-react";

export default function ClientProfile() {
  const { id } = useParams();

  // Mock client data - in real app, this would be fetched based on ID
  const client = {
    id: 1,
    name: "Acme Corporation",
    contact: "John Smith",
    email: "john@acme.com",
    phone: "+1 (555) 123-4567",
    website: "www.acme.com",
    location: "New York, NY",
    address: "123 Business Ave, Suite 500, New York, NY 10001",
    status: "Active",
    industry: "Technology",
    employeeCount: "50-100",
    revenue: "$145,000",
    lastContact: "2 days ago",
    joinDate: "Jan 15, 2023",
    avatar: "AC"
  };

  const deals = [
    { id: 1, name: "Q4 Software License", value: "$45,000", stage: "Negotiation", probability: 75, closeDate: "Dec 31, 2024" },
    { id: 2, name: "Consulting Services", value: "$25,000", stage: "Proposal", probability: 60, closeDate: "Jan 15, 2025" },
    { id: 3, name: "Support Package", value: "$15,000", stage: "Closed Won", probability: 100, closeDate: "Nov 15, 2024" },
  ];

  const contacts = [
    { id: 1, name: "John Smith", role: "CEO", email: "john@acme.com", phone: "+1 (555) 123-4567", primary: true },
    { id: 2, name: "Sarah Wilson", role: "CTO", email: "sarah@acme.com", phone: "+1 (555) 123-4568", primary: false },
    { id: 3, name: "Mike Johnson", role: "Procurement", email: "mike@acme.com", phone: "+1 (555) 123-4569", primary: false },
  ];

  const activities = [
    { id: 1, type: "Email", description: "Sent proposal for Q4 license", date: "Dec 13, 2024 2:30 PM", user: "You" },
    { id: 2, type: "Call", description: "Discovery call with John Smith", date: "Dec 12, 2024 10:00 AM", user: "You" },
    { id: 3, type: "Meeting", description: "Product demo session", date: "Dec 10, 2024 3:00 PM", user: "Sarah Davis" },
    { id: 4, type: "Note", description: "Client interested in enterprise features", date: "Dec 9, 2024 11:15 AM", user: "You" },
  ];

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Closed Won": return "bg-green-500";
      case "Negotiation": return "bg-blue-500";
      case "Proposal": return "bg-yellow-500";
      case "Qualified": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/clients">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft size={16} />
            Back to Clients
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{client.name}</h1>
          <p className="text-muted-foreground">Client Profile & Details</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Edit size={16} />
            Edit Client
          </Button>
          <Button className="gap-2">
            <Plus size={16} />
            Add Deal
          </Button>
        </div>
      </div>

      {/* Client Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
                {client.avatar}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg">{client.contact}</h3>
                  <p className="text-muted-foreground">Primary Contact</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{client.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span>{client.website}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium">Company Details</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{client.address}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Industry: </span>
                    <span>{client.industry}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Employees: </span>
                    <span>{client.employeeCount}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Member since: </span>
                    <span>{client.joinDate}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium">Business Metrics</h4>
                </div>
                <div className="space-y-3">
                  <div className="text-center p-3 bg-primary/5 rounded-lg">
                    <p className="text-2xl font-bold text-primary">{client.revenue}</p>
                    <p className="text-xs text-muted-foreground">Total Revenue</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2 bg-muted/50 rounded">
                      <p className="font-semibold">{deals.length}</p>
                      <p className="text-xs text-muted-foreground">Active Deals</p>
                    </div>
                    <div className="p-2 bg-muted/50 rounded">
                      <Badge className={`bg-green-500 text-white`}>
                        {client.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Tabs */}
      <Tabs defaultValue="deals" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="deals">Deals</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="deals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Active Deals
                <Button size="sm" className="gap-2">
                  <Plus size={16} />
                  New Deal
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deals.map((deal) => (
                  <div key={deal.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-medium">{deal.name}</h4>
                      <p className="text-sm text-muted-foreground">Close date: {deal.closeDate}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">{deal.value}</p>
                        <p className="text-sm text-muted-foreground">{deal.probability}% probability</p>
                      </div>
                      <Badge className={`${getStageColor(deal.stage)} text-white`}>
                        {deal.stage}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contacts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Company Contacts
                <Button size="sm" className="gap-2">
                  <Plus size={16} />
                  Add Contact
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contacts.map((contact) => (
                  <div key={contact.id} className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                    <Avatar>
                      <AvatarFallback>{contact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{contact.name}</h4>
                        {contact.primary && <Badge variant="secondary">Primary</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{contact.role}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-sm">{contact.email}</p>
                      <p className="text-sm text-muted-foreground">{contact.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg border border-border">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{activity.type}</Badge>
                        <span className="text-sm text-muted-foreground">by {activity.user}</span>
                      </div>
                      <p className="font-medium text-sm">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Documents & Files
                <Button size="sm" className="gap-2">
                  <Plus size={16} />
                  Upload File
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-lg mb-2">No documents yet</h3>
                <p className="text-muted-foreground mb-4">Upload contracts, proposals, or other important files</p>
                <Button>Upload First Document</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
