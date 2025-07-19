import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Calendar,
  User,
  Building,
  Edit,
  MessageSquare,
  FileText,
  DollarSign
} from "lucide-react";

export default function ContactProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock contact data - in real app, this would come from an API
  const contact = {
    id: parseInt(id || "1"),
    name: "John Smith",
    email: "john@acme.com",
    phone: "+1 (555) 123-4567",
    company: "Acme Corporation",
    position: "CEO",
    status: "Active",
    avatar: "JS",
    address: "123 Business Ave, New York, NY 10001",
    joinDate: "2023-01-15",
    lastContact: "2 days ago",
    tags: ["Decision Maker", "VIP"],
    notes: "Key contact for major enterprise deals. Prefers email communication.",
    deals: [
      { id: 1, title: "Enterprise Software License", value: "25,000 MAD", status: "In Progress" },
      { id: 2, title: "Annual Support Contract", value: "12,000 MAD", status: "Closed Won" }
    ],
    activities: [
      { id: 1, type: "Email", description: "Sent proposal for Q4 expansion", date: "2 days ago" },
      { id: 2, type: "Meeting", description: "Product demo call", date: "1 week ago" },
      { id: 3, type: "Note", description: "Expressed interest in premium features", date: "2 weeks ago" }
    ]
  };

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
      case "VIP": return "bg-yellow-100 text-yellow-800";
      case "Technical": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2 w-full sm:w-auto"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} />
          Back
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold truncate">{contact.name}</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Contact Profile & Details</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button variant="outline" className="gap-2 w-full sm:w-auto text-sm">
            <Edit size={16} />
            Edit Contact
          </Button>
          <Button className="gap-2 w-full sm:w-auto text-sm">
            <MessageSquare size={16} />
            Send Message
          </Button>
        </div>
      </div>

      {/* Contact Overview */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
            <Avatar className="h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary font-medium text-lg sm:text-xl">
                {contact.avatar}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold">{contact.name}</h2>
                  <p className="text-base sm:text-lg text-muted-foreground">{contact.position}</p>
                  <p className="text-muted-foreground text-sm sm:text-base">{contact.company}</p>
                </div>
                <Badge className={`${getStatusColor(contact.status)} text-white w-fit`}>
                  {contact.status}
                </Badge>
              </div>
              
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                  <span className="truncate">{contact.email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                  <span className="truncate">{contact.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                  <span className="truncate">{contact.address}</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                  <span>Joined: {contact.joinDate}</span>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {contact.tags.map((tag, index) => (
                    <Badge key={index} className={getTagColor(tag)} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="deals">Deals</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Full Name</p>
                  <p className="text-sm text-muted-foreground">{contact.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{contact.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{contact.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">{contact.address}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Last Contact</p>
                  <p className="text-sm text-muted-foreground">{contact.lastContact}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Company</p>
                  <p className="text-sm text-muted-foreground">{contact.company}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Position</p>
                  <p className="text-sm text-muted-foreground">{contact.position}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <Badge className={`${getStatusColor(contact.status)} text-white text-xs`}>
                    {contact.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium">Join Date</p>
                  <p className="text-sm text-muted-foreground">{contact.joinDate}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="deals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Associated Deals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contact.deals.map((deal) => (
                  <div key={deal.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <h4 className="font-medium">{deal.title}</h4>
                      <p className="text-sm text-muted-foreground">{deal.value}</p>
                    </div>
                    <Badge variant={deal.status === "Closed Won" ? "default" : "secondary"}>
                      {deal.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contact.activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 p-4 border border-border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{activity.type}</Badge>
                        <span className="text-sm text-muted-foreground">{activity.date}</span>
                      </div>
                      <p className="text-sm">{activity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-border rounded-lg">
                  <p className="text-sm">{contact.notes}</p>
                  <p className="text-xs text-muted-foreground mt-2">Added 1 month ago</p>
                </div>
                <Button variant="outline" className="w-full">
                  Add New Note
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
