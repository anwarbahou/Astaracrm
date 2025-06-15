
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Search, 
  Plus, 
  Filter,
  MoreHorizontal,
  Calendar,
  User,
  Clock
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Tasks() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock tasks data
  const tasks = [
    {
      id: 1,
      title: "Follow up with Acme Corp",
      description: "Send proposal follow-up email and schedule demo",
      priority: "High",
      status: "In Progress",
      assignee: "John Doe",
      dueDate: "2024-12-15",
      relatedTo: "Acme Corporation",
      type: "Follow-up",
      completed: false,
      createdDate: "2024-12-10"
    },
    {
      id: 2,
      title: "Prepare Q4 sales report",
      description: "Compile quarterly sales data and performance metrics",
      priority: "Medium",
      status: "Not Started",
      assignee: "Sarah Smith",
      dueDate: "2024-12-20",
      relatedTo: "Internal",
      type: "Report",
      completed: false,
      createdDate: "2024-12-12"
    },
    {
      id: 3,
      title: "Contract review with Legal",
      description: "Review enterprise contract terms with legal team",
      priority: "High",
      status: "In Review",
      assignee: "Mike Johnson",
      dueDate: "2024-12-16",
      relatedTo: "Global Industries",
      type: "Legal",
      completed: false,
      createdDate: "2024-12-11"
    },
    {
      id: 4,
      title: "Product demo for StartupXYZ",
      description: "Deliver 30-minute product demonstration",
      priority: "Medium",
      status: "Completed",
      assignee: "Emily Davis",
      dueDate: "2024-12-14",
      relatedTo: "StartupXYZ",
      type: "Demo",
      completed: true,
      createdDate: "2024-12-08"
    },
    {
      id: 5,
      title: "Update CRM database",
      description: "Clean and update contact information in CRM",
      priority: "Low",
      status: "In Progress",
      assignee: "David Wilson",
      dueDate: "2024-12-22",
      relatedTo: "Internal",
      type: "Maintenance",
      completed: false,
      createdDate: "2024-12-13"
    },
    {
      id: 6,
      title: "Send pricing proposal",
      description: "Prepare and send custom pricing proposal",
      priority: "High",
      status: "Not Started",
      assignee: "John Doe",
      dueDate: "2024-12-17",
      relatedTo: "Tech Solutions Ltd",
      type: "Proposal",
      completed: false,
      createdDate: "2024-12-13"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-500";
      case "In Progress": return "bg-blue-500";
      case "In Review": return "bg-purple-500";
      case "Not Started": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Follow-up": return "bg-blue-100 text-blue-800";
      case "Demo": return "bg-purple-100 text-purple-800";
      case "Proposal": return "bg-orange-100 text-orange-800";
      case "Legal": return "bg-red-100 text-red-800";
      case "Report": return "bg-green-100 text-green-800";
      case "Maintenance": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.assignee.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.relatedTo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const overdueTasks = filteredTasks.filter(task => 
    new Date(task.dueDate) < new Date() && !task.completed
  );
  
  const todayTasks = filteredTasks.filter(task => 
    new Date(task.dueDate).toDateString() === new Date().toDateString()
  );

  const upcomingTasks = filteredTasks.filter(task => 
    new Date(task.dueDate) > new Date() && 
    new Date(task.dueDate).getTime() - new Date().getTime() <= 7 * 24 * 60 * 60 * 1000
  );

  const TaskCard = ({ task }: { task: any }) => (
    <div className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
      <Checkbox 
        checked={task.completed}
        className="mt-1"
      />
      
      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h4 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
              {task.title}
            </h4>
            <p className="text-sm text-muted-foreground">{task.description}</p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit Task</DropdownMenuItem>
              <DropdownMenuItem>Assign to Someone</DropdownMenuItem>
              <DropdownMenuItem>Set Reminder</DropdownMenuItem>
              <DropdownMenuItem>Mark Complete</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className={getPriorityColor(task.priority)}>
            {task.priority}
          </Badge>
          <Badge className={`${getStatusColor(task.status)} text-white`}>
            {task.status}
          </Badge>
          <Badge variant="outline" className={getTypeColor(task.type)}>
            {task.type}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span className={new Date(task.dueDate) < new Date() && !task.completed ? 'text-red-600 font-medium' : ''}>
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{task.assignee}</span>
            </div>
          </div>
          <span className="text-xs">Related to: {task.relatedTo}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Task Management</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage all your sales activities and follow-ups.
          </p>
        </div>
        <Button className="gap-2">
          <Plus size={16} />
          Add Task
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search tasks by title, description, assignee, or related entity..."
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
              <p className="text-2xl font-bold">{filteredTasks.length}</p>
              <p className="text-sm text-muted-foreground">Total Tasks</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{overdueTasks.length}</p>
              <p className="text-sm text-muted-foreground">Overdue</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{todayTasks.length}</p>
              <p className="text-sm text-muted-foreground">Due Today</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{filteredTasks.filter(t => t.completed).length}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Task Lists */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          <TabsTrigger value="overdue">Overdue ({overdueTasks.length})</TabsTrigger>
          <TabsTrigger value="today">Today ({todayTasks.length})</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming ({upcomingTasks.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Tasks ({filteredTasks.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="overdue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Overdue Tasks ({overdueTasks.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {overdueTasks.length > 0 ? (
                  overdueTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium text-lg mb-2">No overdue tasks</h3>
                    <p className="text-muted-foreground">Great job staying on top of your tasks!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="today" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-orange-600">Due Today ({todayTasks.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayTasks.length > 0 ? (
                  todayTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium text-lg mb-2">No tasks due today</h3>
                    <p className="text-muted-foreground">Enjoy your lighter workload!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Tasks ({upcomingTasks.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingTasks.length > 0 ? (
                  upcomingTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium text-lg mb-2">No upcoming tasks</h3>
                    <p className="text-muted-foreground">Time to plan your next week!</p>
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
