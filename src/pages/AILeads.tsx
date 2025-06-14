
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, Users, TrendingUp, Star, Filter, Plus } from "lucide-react";

export default function AILeads() {
  const [activeTab, setActiveTab] = useState("all");

  const leadStats = [
    { label: "Total AI Leads", value: "247", icon: Bot, color: "text-blue-600" },
    { label: "Qualified Leads", value: "89", icon: Star, color: "text-green-600" },
    { label: "Conversion Rate", value: "36%", icon: TrendingUp, color: "text-purple-600" },
    { label: "Active Campaigns", value: "12", icon: Users, color: "text-orange-600" },
  ];

  const mockLeads = [
    {
      id: 1,
      name: "Sarah Johnson",
      company: "Tech Solutions Inc",
      email: "sarah@techsolutions.com",
      score: 92,
      status: "Hot",
      source: "LinkedIn Campaign",
      lastActivity: "2 hours ago",
    },
    {
      id: 2,
      name: "Michael Chen",
      company: "Digital Dynamics",
      email: "michael@digitaldynamics.com",
      score: 78,
      status: "Warm",
      source: "Website Form",
      lastActivity: "1 day ago",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      company: "Global Enterprises",
      email: "emily@globalent.com",
      score: 65,
      status: "Cold",
      source: "Email Campaign",
      lastActivity: "3 days ago",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Hot": return "bg-red-100 text-red-800";
      case "Warm": return "bg-yellow-100 text-yellow-800";
      case "Cold": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Bot className="text-blue-600" size={32} />
            AI Leads
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-powered lead generation and qualification dashboard
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter size={16} />
            Filters
          </Button>
          <Button className="gap-2">
            <Plus size={16} />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {leadStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                  <IconComponent className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <CardTitle>AI Generated Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Tab Navigation */}
            <div className="flex gap-2 border-b">
              {["all", "hot", "warm", "cold"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 capitalize transition-colors ${
                    activeTab === tab
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Leads List */}
            <div className="space-y-4">
              {mockLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="font-semibold text-primary">
                        {lead.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{lead.name}</h3>
                      <p className="text-sm text-muted-foreground">{lead.company}</p>
                      <p className="text-xs text-muted-foreground">{lead.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">Score</p>
                      <p className={`text-lg font-bold ${getScoreColor(lead.score)}`}>
                        {lead.score}
                      </p>
                    </div>
                    
                    <Badge className={getStatusColor(lead.status)}>
                      {lead.status}
                    </Badge>
                    
                    <div className="text-right min-w-[120px]">
                      <p className="text-sm text-muted-foreground">{lead.source}</p>
                      <p className="text-xs text-muted-foreground">{lead.lastActivity}</p>
                    </div>
                    
                    <Button size="sm">Contact</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
