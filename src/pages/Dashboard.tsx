import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Eye
} from "lucide-react";
import { useState } from "react";
import { AddClientModal } from "@/components/modals/AddClientModal";
import { AddContactModal } from "@/components/modals/AddContactModal";

function DashboardContent() {
  const { user, loading } = useAuth();
  const [addClientOpen, setAddClientOpen] = useState(false);
  const [addContactOpen, setAddContactOpen] = useState(false);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to auth if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Mock data for demo purposes
  const stats = [
    {
      title: "Total Revenue",
      value: "2,847,500 MAD",
      change: "+12.5%",
      trend: "up",
      description: "vs last month"
    },
    {
      title: "Active Clients",
      value: "247",
      change: "+3.2%",
      trend: "up",
      description: "vs last month"
    },
    {
      title: "Deals in Pipeline",
      value: "89",
      change: "-2.1%",
      trend: "down",
      description: "vs last month"
    },
    {
      title: "Tasks Due Today",
      value: "12",
      change: "+5",
      trend: "up",
      description: "vs yesterday"
    }
  ];

  const recentDeals = [
    { id: 1, client: "Acme Corp", value: "125,000 MAD", status: "Negotiation", probability: 75 },
    { id: 2, client: "Tech Solutions", value: "87,500 MAD", status: "Proposal", probability: 60 },
    { id: 3, client: "Global Industries", value: "245,000 MAD", status: "Qualified", probability: 90 },
    { id: 4, client: "StartupXYZ", value: "52,000 MAD", status: "Discovery", probability: 40 }
  ];

  const upcomingTasks = [
    { id: 1, title: "Follow up with Acme Corp", due: "Today, 2:00 PM", priority: "high" },
    { id: 2, title: "Prepare proposal for Tech Solutions", due: "Tomorrow, 10:00 AM", priority: "medium" },
    { id: 3, title: "Schedule demo call", due: "Dec 16, 3:00 PM", priority: "low" },
    { id: 4, title: "Send contract to Global Industries", due: "Dec 17, 9:00 AM", priority: "high" }
  ];

  const recentActivities = [
    { id: 1, action: "New deal created", details: "Acme Corp - Enterprise License", time: "2 hours ago" },
    { id: 2, action: "Contact updated", details: "John Smith - Acme Corp", time: "4 hours ago" },
    { id: 3, action: "Task completed", details: "Send proposal to Tech Solutions", time: "6 hours ago" },
    { id: 4, action: "Meeting scheduled", details: "Demo call with StartupXYZ", time: "1 day ago" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Negotiation": return "bg-orange-100 text-orange-800";
      case "Proposal": return "bg-blue-100 text-blue-800";
      case "Qualified": return "bg-green-100 text-green-800";
      case "Discovery": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <div className="space-y-6 animate-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Here's what's happening with your business today.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setAddContactOpen(true)}>
              <Plus size={16} className="mr-2" />
              Add Contact
            </Button>
            <Button onClick={() => setAddClientOpen(true)}>
              <Plus size={16} className="mr-2" />
              Add Client
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-2 rounded-full ${stat.trend === 'up' ? 'bg-green-100' : 'bg-red-100'}`}>
                    {stat.trend === 'up' ? 
                      <ArrowUpRight className="h-4 w-4 text-green-600" /> : 
                      <ArrowDownRight className="h-4 w-4 text-red-600" />
                    }
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className={`text-xs font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-muted-foreground">{stat.description}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Deals */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Recent Deals
              </CardTitle>
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentDeals.map((deal) => (
                  <div key={deal.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div className="flex-1">
                      <p className="font-medium">{deal.client}</p>
                      <p className="text-sm text-muted-foreground">{deal.value}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(deal.status)} variant="secondary">
                        {deal.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{deal.probability}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Tasks
              </CardTitle>
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div className="flex-1">
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-muted-foreground">{task.due}</p>
                    </div>
                    <Badge className={getPriorityColor(task.priority)} variant="secondary">
                      {task.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg border border-border">
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.details}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <AddClientModal open={addClientOpen} onOpenChange={setAddClientOpen} />
      <AddContactModal open={addContactOpen} onOpenChange={setAddContactOpen} />
    </>
  );
}

export default function Dashboard() {
  return (
    <DashboardLayout>
      <DashboardContent />
    </DashboardLayout>
  );
}
