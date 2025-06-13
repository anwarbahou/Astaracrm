
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Plus, 
  Calendar, 
  Mail, 
  Clock,
  TrendingUp,
  DollarSign,
  Target
} from "lucide-react";

export default function Dashboard() {
  // Mock data for the dashboard
  const stats = [
    { title: "Total Clients", value: "247", change: "+12%", icon: Users, color: "text-blue-500" },
    { title: "Active Deals", value: "43", change: "+8%", icon: Target, color: "text-green-500" },
    { title: "Revenue This Month", value: "$127,480", change: "+23%", icon: DollarSign, color: "text-purple-500" },
    { title: "Tasks Completed", value: "89%", change: "+5%", icon: Clock, color: "text-orange-500" },
  ];

  const recentDeals = [
    { id: 1, client: "Acme Corp", value: "$45,000", stage: "Negotiation", probability: 75 },
    { id: 2, client: "Tech Solutions", value: "$32,000", stage: "Proposal", probability: 60 },
    { id: 3, client: "Global Industries", value: "$78,000", stage: "Qualified", probability: 40 },
    { id: 4, client: "StartupXYZ", value: "$12,000", stage: "Closed Won", probability: 100 },
  ];

  const upcomingTasks = [
    { id: 1, task: "Follow up with Acme Corp", due: "Today 2:00 PM", priority: "High" },
    { id: 2, task: "Prepare proposal for Tech Solutions", due: "Tomorrow 10:00 AM", priority: "Medium" },
    { id: 3, task: "Contract review meeting", due: "Dec 15, 3:00 PM", priority: "High" },
    { id: 4, task: "Monthly team sync", due: "Dec 16, 9:00 AM", priority: "Low" },
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-500";
      case "Medium": return "bg-yellow-500";
      case "Low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, John! 👋</h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your business today.
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="gap-2">
            <Plus size={16} />
            Add Deal
          </Button>
          <Button variant="outline" className="gap-2">
            <Calendar size={16} />
            Schedule Meeting
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="crm-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <Badge variant="secondary" className="text-xs">
                      {stat.change}
                    </Badge>
                  </div>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Deals */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Deals
              <Button variant="outline" size="sm">View All</Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDeals.map((deal) => (
                <div key={deal.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium">{deal.client}</p>
                        <p className="text-sm text-muted-foreground">{deal.value}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={`${getStageColor(deal.stage)} text-white`}>
                      {deal.stage}
                    </Badge>
                    <div className="text-right min-w-[60px]">
                      <p className="text-sm font-medium">{deal.probability}%</p>
                      <Progress value={deal.probability} className="w-16 h-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Upcoming Tasks
              <Button variant="outline" size="sm">View All</Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="space-y-2">
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${getPriorityColor(task.priority)}`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{task.task}</p>
                      <p className="text-xs text-muted-foreground">{task.due}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {task.priority}
                    </Badge>
                  </div>
                  {task.id !== upcomingTasks.length && <div className="border-b border-border" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { type: "deal", message: "New deal created with Acme Corp - $45,000", time: "2 hours ago", icon: Target },
              { type: "email", message: "Email sent to 15 prospects in the SaaS pipeline", time: "4 hours ago", icon: Mail },
              { type: "meeting", message: "Meeting completed with Tech Solutions", time: "1 day ago", icon: Calendar },
              { type: "client", message: "New client Global Industries added", time: "2 days ago", icon: Users },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <activity.icon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
