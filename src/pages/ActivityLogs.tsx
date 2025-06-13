
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Search, 
  Filter,
  Download,
  Calendar,
  User,
  FileText,
  Mail,
  Phone,
  DollarSign,
  Clock,
  Eye
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ActivityLogs() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock activity logs data
  const activities = [
    {
      id: 1,
      type: "deal_created",
      action: "Created new deal",
      details: "Q4 Software License deal created for Acme Corporation",
      user: "John Doe",
      userAvatar: "JD",
      timestamp: "2024-12-15T14:30:00",
      entity: "Deal",
      entityId: "DEAL-001",
      relatedTo: "Acme Corporation",
      changes: {
        deal_name: "Q4 Software License",
        deal_value: "$45,000",
        stage: "Discovery"
      }
    },
    {
      id: 2,
      type: "email_sent",
      action: "Sent email",
      details: "Follow-up email sent to Tech Solutions regarding proposal",
      user: "Sarah Smith",
      userAvatar: "SS",
      timestamp: "2024-12-15T13:15:00",
      entity: "Email",
      entityId: "EMAIL-123",
      relatedTo: "Tech Solutions Ltd",
      changes: {
        subject: "Follow-up on Proposal",
        recipient: "sarah@techsolutions.com"
      }
    },
    {
      id: 3,
      type: "task_completed",
      action: "Completed task",
      details: "Demo preparation task marked as complete",
      user: "Mike Johnson",
      userAvatar: "MJ",
      timestamp: "2024-12-15T12:45:00",
      entity: "Task",
      entityId: "TASK-456",
      relatedTo: "Global Industries",
      changes: {
        status: "Completed",
        completion_date: "2024-12-15"
      }
    },
    {
      id: 4,
      type: "client_added",
      action: "Added new client",
      details: "New client StartupXYZ added to system",
      user: "Emily Davis",
      userAvatar: "ED",
      timestamp: "2024-12-15T11:20:00",
      entity: "Client",
      entityId: "CLIENT-789",
      relatedTo: "StartupXYZ",
      changes: {
        company_name: "StartupXYZ",
        industry: "Technology",
        status: "Active"
      }
    },
    {
      id: 5,
      type: "deal_stage_changed",
      action: "Updated deal stage",
      details: "Deal moved from Proposal to Negotiation",
      user: "John Doe",
      userAvatar: "JD",
      timestamp: "2024-12-15T10:30:00",
      entity: "Deal",
      entityId: "DEAL-002",
      relatedTo: "Tech Solutions Ltd",
      changes: {
        previous_stage: "Proposal",
        new_stage: "Negotiation",
        probability: "75%"
      }
    },
    {
      id: 6,
      type: "call_logged",
      action: "Logged phone call",
      details: "30-minute discovery call with Enterprise Corp",
      user: "David Wilson",
      userAvatar: "DW",
      timestamp: "2024-12-15T09:15:00",
      entity: "Call",
      entityId: "CALL-101",
      relatedTo: "Enterprise Corp",
      changes: {
        duration: "30 minutes",
        outcome: "Interested in enterprise package",
        next_action: "Send proposal"
      }
    },
    {
      id: 7,
      type: "note_created",
      action: "Created note",
      details: "Added meeting notes from client discussion",
      user: "Sarah Smith",
      userAvatar: "SS",
      timestamp: "2024-12-15T08:45:00",
      entity: "Note",
      entityId: "NOTE-999",
      relatedTo: "Acme Corporation",
      changes: {
        note_type: "Meeting Notes",
        priority: "High"
      }
    },
    {
      id: 8,
      type: "user_login",
      action: "User logged in",
      details: "User accessed the system",
      user: "Mike Johnson",
      userAvatar: "MJ",
      timestamp: "2024-12-15T08:00:00",
      entity: "System",
      entityId: null,
      relatedTo: "System Access",
      changes: {
        login_time: "08:00:00",
        ip_address: "192.168.1.100"
      }
    },
    {
      id: 9,
      type: "report_generated",
      action: "Generated report",
      details: "Monthly sales report generated and sent to stakeholders",
      user: "System",
      userAvatar: "SY",
      timestamp: "2024-12-15T07:00:00",
      entity: "Report",
      entityId: "RPT-001",
      relatedTo: "Monthly Reporting",
      changes: {
        report_type: "Sales Summary",
        period: "November 2024",
        recipients: "5 stakeholders"
      }
    },
    {
      id: 10,
      type: "task_assigned",
      action: "Assigned task",
      details: "Follow-up task assigned to sales team member",
      user: "John Doe",
      userAvatar: "JD",
      timestamp: "2024-12-14T16:30:00",
      entity: "Task",
      entityId: "TASK-789",
      relatedTo: "Global Industries",
      changes: {
        assigned_to: "Sarah Smith",
        due_date: "2024-12-18",
        priority: "Medium"
      }
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "deal_created":
      case "deal_stage_changed":
        return DollarSign;
      case "email_sent":
        return Mail;
      case "call_logged":
        return Phone;
      case "task_completed":
      case "task_assigned":
        return Clock;
      case "client_added":
        return User;
      case "note_created":
        return FileText;
      case "user_login":
        return User;
      case "report_generated":
        return FileText;
      default:
        return Clock;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "deal_created":
      case "deal_stage_changed":
        return "bg-green-100 text-green-800";
      case "email_sent":
        return "bg-blue-100 text-blue-800";
      case "call_logged":
        return "bg-purple-100 text-purple-800";
      case "task_completed":
      case "task_assigned":
        return "bg-orange-100 text-orange-800";
      case "client_added":
        return "bg-cyan-100 text-cyan-800";
      case "note_created":
        return "bg-yellow-100 text-yellow-800";
      case "user_login":
        return "bg-gray-100 text-gray-800";
      case "report_generated":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredActivities = activities.filter(activity =>
    activity.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.relatedTo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const todayActivities = filteredActivities.filter(activity => 
    new Date(activity.timestamp).toDateString() === new Date().toDateString()
  );

  const systemActivities = filteredActivities.filter(activity => 
    activity.type === "user_login" || activity.type === "report_generated"
  );

  const businessActivities = filteredActivities.filter(activity => 
    !["user_login", "report_generated"].includes(activity.type)
  );

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const ActivityItem = ({ activity }: { activity: any }) => {
    const ActivityIcon = getActivityIcon(activity.type);
    
    return (
      <div className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <ActivityIcon className="h-5 w-5 text-primary" />
        </div>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-sm">{activity.action}</h4>
                <Badge variant="outline" className={getActivityColor(activity.type)}>
                  {activity.type.replace('_', ' ')}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{activity.details}</p>
            </div>
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Avatar className="h-5 w-5">
                <AvatarFallback className="text-xs">{activity.userAvatar}</AvatarFallback>
              </Avatar>
              <span>{activity.user}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatTime(activity.timestamp)}</span>
            </div>
            <span>Related to: {activity.relatedTo}</span>
            {activity.entityId && <span>ID: {activity.entityId}</span>}
          </div>
          
          {Object.keys(activity.changes).length > 0 && (
            <div className="pt-2 border-t border-border">
              <p className="text-xs font-medium text-muted-foreground mb-1">Changes:</p>
              <div className="flex flex-wrap gap-1">
                {Object.entries(activity.changes).slice(0, 3).map(([key, value], index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {key}: {value}
                  </Badge>
                ))}
                {Object.keys(activity.changes).length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{Object.keys(activity.changes).length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Activity Logs & Audit Trail</h1>
          <p className="text-muted-foreground mt-1">
            Track all system activities and user actions across your CRM.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter size={16} />
            Filter
          </Button>
          <Button className="gap-2">
            <Download size={16} />
            Export Logs
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search activities by action, user, or related entity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{activities.length}</p>
              <p className="text-sm text-muted-foreground">Total Activities</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{todayActivities.length}</p>
              <p className="text-sm text-muted-foreground">Today's Activities</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{new Set(activities.map(a => a.user)).size}</p>
              <p className="text-sm text-muted-foreground">Active Users</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{businessActivities.length}</p>
              <p className="text-sm text-muted-foreground">Business Actions</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Activities</TabsTrigger>
          <TabsTrigger value="today">Today ({todayActivities.length})</TabsTrigger>
          <TabsTrigger value="business">Business Actions</TabsTrigger>
          <TabsTrigger value="system">System Events</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Activities ({filteredActivities.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredActivities.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="today" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Activities ({todayActivities.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayActivities.length > 0 ? (
                  todayActivities.map((activity) => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium text-lg mb-2">No activities today</h3>
                    <p className="text-muted-foreground">Activities will appear here as they happen</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Business Activities ({businessActivities.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {businessActivities.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Events ({systemActivities.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemActivities.length > 0 ? (
                  systemActivities.map((activity) => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium text-lg mb-2">No system events</h3>
                    <p className="text-muted-foreground">System events will appear here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
