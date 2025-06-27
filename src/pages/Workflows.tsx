import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  Filter,
  MoreHorizontal,
  Play,
  Pause,
  Settings,
  GitBranch,
  Clock,
  Zap,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { withPageTitle } from '@/components/withPageTitle';

function Workflows() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock workflows data
  const workflows = [
    {
      id: 1,
      name: "New Lead Welcome Sequence",
      description: "Automatically send welcome emails to new leads and assign to sales rep",
      status: "Active",
      trigger: "New lead created",
      actions: [
        "Send welcome email",
        "Assign to sales rep",
        "Create follow-up task",
        "Add to nurture campaign"
      ],
      lastRun: "2024-12-15T10:30:00",
      totalRuns: 245,
      successRate: 98.5,
      category: "Lead Management"
    },
    {
      id: 2,
      name: "Deal Stage Notifications",
      description: "Notify team when deals move through pipeline stages",
      status: "Active",
      trigger: "Deal stage changed",
      actions: [
        "Send Slack notification",
        "Update team dashboard",
        "Log activity"
      ],
      lastRun: "2024-12-15T14:15:00",
      totalRuns: 156,
      successRate: 100,
      category: "Deal Management"
    },
    {
      id: 3,
      name: "Overdue Task Reminders",
      description: "Send reminders for overdue tasks to assignees and managers",
      status: "Active",
      trigger: "Task becomes overdue",
      actions: [
        "Send email reminder",
        "Create escalation task",
        "Notify manager"
      ],
      lastRun: "2024-12-15T09:00:00",
      totalRuns: 89,
      successRate: 95.2,
      category: "Task Management"
    },
    {
      id: 4,
      name: "Client Onboarding Process",
      description: "Automated onboarding workflow for new clients",
      status: "Draft",
      trigger: "Deal marked as won",
      actions: [
        "Create onboarding project",
        "Schedule kickoff meeting",
        "Send welcome package",
        "Assign customer success manager"
      ],
      lastRun: null,
      totalRuns: 0,
      successRate: 0,
      category: "Client Management"
    },
    {
      id: 5,
      name: "Monthly Report Generation",
      description: "Generate and send monthly performance reports to stakeholders",
      status: "Active",
      trigger: "First day of month",
      actions: [
        "Generate sales report",
        "Generate performance metrics",
        "Send to stakeholders",
        "Archive previous reports"
      ],
      lastRun: "2024-12-01T08:00:00",
      totalRuns: 12,
      successRate: 100,
      category: "Reporting"
    },
    {
      id: 6,
      name: "Lead Score Updates",
      description: "Update lead scores based on activity and engagement",
      status: "Paused",
      trigger: "Lead activity detected",
      actions: [
        "Calculate new score",
        "Update lead record",
        "Trigger qualification if high score"
      ],
      lastRun: "2024-12-10T16:00:00",
      totalRuns: 1247,
      successRate: 97.8,
      category: "Lead Management"
    }
  ];

  const automationTemplates = [
    {
      id: 1,
      name: "Lead Qualification",
      description: "Automatically qualify leads based on predefined criteria",
      category: "Lead Management",
      complexity: "Simple"
    },
    {
      id: 2,
      name: "Deal Follow-up",
      description: "Create follow-up tasks when deals haven't been updated",
      category: "Deal Management",
      complexity: "Medium"
    },
    {
      id: 3,
      name: "Customer Lifecycle",
      description: "Track and automate customer journey stages",
      category: "Client Management",
      complexity: "Advanced"
    },
    {
      id: 4,
      name: "Email Campaign Trigger",
      description: "Trigger email campaigns based on customer behavior",
      category: "Marketing",
      complexity: "Medium"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-500";
      case "Paused": return "bg-yellow-500";
      case "Draft": return "bg-gray-500";
      case "Error": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Lead Management": return "bg-blue-100 text-blue-800";
      case "Deal Management": return "bg-green-100 text-green-800";
      case "Task Management": return "bg-orange-100 text-orange-800";
      case "Client Management": return "bg-purple-100 text-purple-800";
      case "Reporting": return "bg-pink-100 text-pink-800";
      case "Marketing": return "bg-indigo-100 text-indigo-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Simple": return "bg-green-100 text-green-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredWorkflows = workflows.filter(workflow =>
    workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workflow.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workflow.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeWorkflows = filteredWorkflows.filter(w => w.status === "Active");
  const draftWorkflows = filteredWorkflows.filter(w => w.status === "Draft");

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const WorkflowCard = ({ workflow }: { workflow: any }) => (
    <div className="p-6 rounded-lg border border-border hover:bg-accent/50 transition-colors">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{workflow.name}</h3>
              <Badge className={`${getStatusColor(workflow.status)} text-white`}>
                {workflow.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{workflow.description}</p>
            <Badge variant="outline" className={getCategoryColor(workflow.category)}>
              {workflow.category}
            </Badge>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Edit Workflow
              </DropdownMenuItem>
              <DropdownMenuItem>
                <GitBranch className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              {workflow.status === "Active" ? (
                <DropdownMenuItem>
                  <Pause className="mr-2 h-4 w-4" />
                  Pause
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem>
                  <Play className="mr-2 h-4 w-4" />
                  Activate
                </DropdownMenuItem>
              )}
              <DropdownMenuItem className="text-red-600">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Zap className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Trigger:</span>
            <span className="text-muted-foreground">{workflow.trigger}</span>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium">Actions:</p>
            <div className="flex flex-wrap gap-1">
              {workflow.actions.slice(0, 3).map((action, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {action}
                </Badge>
              ))}
              {workflow.actions.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{workflow.actions.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground pt-3 border-t">
          <div className="flex items-center gap-4">
            <span>Last run: {formatDate(workflow.lastRun)}</span>
            <span>Runs: {workflow.totalRuns}</span>
          </div>
          <div className="flex items-center gap-1">
            {workflow.successRate >= 95 ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            )}
            <span>{workflow.successRate}% success</span>
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
          <h1 className="text-3xl font-bold">Workflows & Automations</h1>
          <p className="text-muted-foreground mt-1">
            Automate repetitive tasks and streamline your business processes.
          </p>
        </div>
        <Button className="gap-2">
          <Plus size={16} />
          Create Workflow
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search workflows by name, description, or category..."
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
              <p className="text-2xl font-bold">{workflows.length}</p>
              <p className="text-sm text-muted-foreground">Total Workflows</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{activeWorkflows.length}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{workflows.reduce((sum, w) => sum + w.totalRuns, 0)}</p>
              <p className="text-sm text-muted-foreground">Total Executions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{((workflows.reduce((sum, w) => sum + (w.successRate * w.totalRuns), 0) / workflows.reduce((sum, w) => sum + w.totalRuns, 0)) || 0).toFixed(1)}%</p>
              <p className="text-sm text-muted-foreground">Avg Success Rate</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workflow Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Workflows</TabsTrigger>
          <TabsTrigger value="active">Active ({activeWorkflows.length})</TabsTrigger>
          <TabsTrigger value="draft">Draft ({draftWorkflows.length})</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4">
            {filteredWorkflows.map((workflow) => (
              <WorkflowCard key={workflow.id} workflow={workflow} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4">
            {activeWorkflows.map((workflow) => (
              <WorkflowCard key={workflow.id} workflow={workflow} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="draft" className="space-y-4">
          {draftWorkflows.length > 0 ? (
            <div className="grid gap-4">
              {draftWorkflows.map((workflow) => (
                <WorkflowCard key={workflow.id} workflow={workflow} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <GitBranch className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium text-lg mb-2">No draft workflows</h3>
              <p className="text-muted-foreground mb-4">Create a new workflow to get started</p>
              <Button>Create Workflow</Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Automation Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {automationTemplates.map((template) => (
                  <div key={template.id} className="p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{template.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getCategoryColor(template.category)}>
                          {template.category}
                        </Badge>
                        <Badge variant="secondary" className={getComplexityColor(template.complexity)}>
                          {template.complexity}
                        </Badge>
                      </div>
                      
                      <Button variant="outline" size="sm" className="w-full">
                        Use Template
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default withPageTitle(Workflows, 'workflows');
