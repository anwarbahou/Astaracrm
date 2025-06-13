
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  Plus, 
  Filter,
  MoreHorizontal,
  DollarSign,
  Calendar,
  User
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Deals() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");

  // Mock deals data
  const deals = [
    {
      id: 1,
      name: "Q4 Software License",
      client: "Acme Corporation",
      value: 45000,
      stage: "Negotiation",
      probability: 75,
      closeDate: "2024-12-31",
      owner: "John Doe",
      lastActivity: "2 days ago",
      priority: "High"
    },
    {
      id: 2,
      name: "Consulting Services",
      client: "Tech Solutions Ltd",
      value: 32000,
      stage: "Proposal",
      probability: 60,
      closeDate: "2025-01-15",
      owner: "Sarah Smith",
      lastActivity: "1 week ago",
      priority: "Medium"
    },
    {
      id: 3,
      name: "Enterprise Package",
      client: "Global Industries",
      value: 78000,
      stage: "Qualified",
      probability: 40,
      closeDate: "2025-02-28",
      owner: "Mike Johnson",
      lastActivity: "3 days ago",
      priority: "High"
    },
    {
      id: 4,
      name: "Startup Package",
      client: "StartupXYZ",
      value: 12000,
      stage: "Closed Won",
      probability: 100,
      closeDate: "2024-11-15",
      owner: "Emily Davis",
      lastActivity: "1 day ago",
      priority: "Low"
    },
    {
      id: 5,
      name: "Custom Development",
      client: "Enterprise Corp",
      value: 95000,
      stage: "Discovery",
      probability: 25,
      closeDate: "2025-03-30",
      owner: "David Wilson",
      lastActivity: "1 week ago",
      priority: "Medium"
    },
    {
      id: 6,
      name: "Support Contract",
      client: "Tech Solutions Ltd",
      value: 18000,
      stage: "Proposal",
      probability: 70,
      closeDate: "2025-01-10",
      owner: "Sarah Smith",
      lastActivity: "4 days ago",
      priority: "Low"
    }
  ];

  const stages = [
    { name: "Discovery", color: "bg-gray-100 border-gray-300" },
    { name: "Qualified", color: "bg-blue-100 border-blue-300" },
    { name: "Proposal", color: "bg-yellow-100 border-yellow-300" },
    { name: "Negotiation", color: "bg-orange-100 border-orange-300" },
    { name: "Closed Won", color: "bg-green-100 border-green-300" },
    { name: "Closed Lost", color: "bg-red-100 border-red-300" }
  ];

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Discovery": return "bg-gray-500";
      case "Qualified": return "bg-blue-500";
      case "Proposal": return "bg-yellow-500";
      case "Negotiation": return "bg-orange-500";
      case "Closed Won": return "bg-green-500";
      case "Closed Lost": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredDeals = deals.filter(deal =>
    deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deal.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deal.owner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const wonDeals = deals.filter(deal => deal.stage === "Closed Won");
  const avgDealSize = totalValue / deals.length;

  const DealCard = ({ deal }: { deal: any }) => (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h4 className="font-medium text-sm">{deal.name}</h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit Deal</DropdownMenuItem>
              <DropdownMenuItem>Add Note</DropdownMenuItem>
              <DropdownMenuItem>Schedule Follow-up</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{deal.client}</p>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-lg">${deal.value.toLocaleString()}</span>
            <Badge variant="secondary" className={getPriorityColor(deal.priority)}>
              {deal.priority}
            </Badge>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Probability</span>
            <span>{deal.probability}%</span>
          </div>
          <Progress value={deal.probability} className="h-2" />
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{new Date(deal.closeDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>{deal.owner}</span>
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
          <h1 className="text-3xl font-bold">Deal Management</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage your sales opportunities through the pipeline.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setViewMode(viewMode === "kanban" ? "list" : "kanban")}>
            {viewMode === "kanban" ? "List View" : "Kanban View"}
          </Button>
          <Button className="gap-2">
            <Plus size={16} />
            Add Deal
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search deals by name, client, or owner..."
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
              <p className="text-2xl font-bold">{deals.length}</p>
              <p className="text-sm text-muted-foreground">Total Deals</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Pipeline Value</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{wonDeals.length}</p>
              <p className="text-sm text-muted-foreground">Deals Won</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold">${Math.round(avgDealSize).toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Avg Deal Size</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Kanban Board or List View */}
      {viewMode === "kanban" ? (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {stages.map((stage) => {
            const stageDeals = filteredDeals.filter(deal => deal.stage === stage.name);
            const stageValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);
            
            return (
              <Card key={stage.name} className={`${stage.color}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{stage.name}</CardTitle>
                    <Badge variant="secondary">{stageDeals.length}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    ${stageValue.toLocaleString()}
                  </p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {stageDeals.map((deal) => (
                      <DealCard key={deal.id} deal={deal} />
                    ))}
                    {stageDeals.length === 0 && (
                      <div className="text-center py-6 text-muted-foreground text-sm">
                        No deals in this stage
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Deals ({filteredDeals.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredDeals.map((deal) => (
                <div key={deal.id} className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4">
                    <div>
                      <h4 className="font-medium">{deal.name}</h4>
                      <p className="text-sm text-muted-foreground">{deal.client}</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="font-medium">${deal.value.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Value</p>
                    </div>
                    
                    <div className="text-center">
                      <Badge className={`${getStageColor(deal.stage)} text-white`}>
                        {deal.stage}
                      </Badge>
                    </div>
                    
                    <div className="text-center">
                      <p className="font-medium">{deal.probability}%</p>
                      <Progress value={deal.probability} className="w-full h-2 mt-1" />
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm">{new Date(deal.closeDate).toLocaleDateString()}</p>
                      <p className="text-xs text-muted-foreground">Close Date</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-center">
                        <p className="text-sm">{deal.owner}</p>
                        <Badge variant="secondary" className={getPriorityColor(deal.priority)}>
                          {deal.priority}
                        </Badge>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit Deal</DropdownMenuItem>
                          <DropdownMenuItem>Add Note</DropdownMenuItem>
                          <DropdownMenuItem>Schedule Follow-up</DropdownMenuItem>
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
      )}
    </div>
  );
}
