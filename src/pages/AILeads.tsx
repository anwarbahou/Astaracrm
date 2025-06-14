
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Bot, 
  Users, 
  TrendingUp, 
  Star, 
  Plus,
  Brain,
  Zap,
  Target,
  BarChart3,
  Sparkles,
  Search,
  Download,
  Filter
} from "lucide-react";

// Import new components
import { LeadsTable } from "@/components/leads/LeadsTable";
import { LeadProfileModal } from "@/components/leads/LeadProfileModal";
import { AdvancedFilters } from "@/components/leads/AdvancedFilters";
import { NewCampaignModal } from "@/components/leads/NewCampaignModal";
import { ResearchAssistant } from "@/components/leads/ResearchAssistant";

interface Lead {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  position: string;
  score: number;
  status: "Hot" | "Warm" | "Cold";
  source: string;
  lastActivity: string;
  dealSize: string;
  location: string;
  companySize: string;
  industry: string;
  engagement: number;
  avatar: string;
  tags: string[];
  assignedTo?: string;
  dateAdded: string;
  aiInsights?: string;
}

interface FilterState {
  status: string[];
  source: string[];
  industry: string[];
  scoreRange: [number, number];
  companySize: string[];
  location: string[];
  assignedTo: string[];
  dateRange: { start: string; end: string };
}

export default function AILeads() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [aiInsightsVisible, setAiInsightsVisible] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    source: [],
    industry: [],
    scoreRange: [0, 100],
    companySize: [],
    location: [],
    assignedTo: [],
    dateRange: { start: "", end: "" }
  });

  // Advanced lead stats with AI insights
  const leadStats = [
    { 
      label: "AI-Generated Leads", 
      value: "2,847", 
      change: "+23%",
      icon: Bot, 
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      trend: "up"
    },
    { 
      label: "Qualified by AI", 
      value: "891", 
      change: "+31%",
      icon: Brain, 
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      trend: "up"
    },
    { 
      label: "Conversion Rate", 
      value: "43.2%", 
      change: "+8.1%",
      icon: TrendingUp, 
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      trend: "up"
    },
    { 
      label: "Active Campaigns", 
      value: "12", 
      change: "+3",
      icon: Target, 
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      trend: "up"
    },
  ];

  // Enhanced mock leads with AI insights
  const mockLeads: Lead[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      company: "TechFlow Solutions",
      email: "sarah@techflow.io",
      phone: "+1 (555) 234-5678",
      position: "VP of Engineering",
      score: 94,
      status: "Hot",
      source: "AI LinkedIn Scraper",
      lastActivity: "2 hours ago",
      aiInsights: "High intent signals detected. Viewed pricing 3x. Perfect fit for Enterprise plan.",
      dealSize: "$45,000",
      location: "San Francisco, CA",
      companySize: "150-200 employees",
      industry: "SaaS",
      engagement: 92,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400",
      tags: ["Enterprise", "Hot Lead", "Decision Maker"],
      assignedTo: "John Smith",
      dateAdded: "2024-01-15"
    },
    {
      id: 2,
      name: "Michael Chen",
      company: "DataCorp Analytics",
      email: "m.chen@datacorp.com",
      phone: "+1 (555) 345-6789",
      position: "CTO",
      score: 87,
      status: "Warm",
      source: "AI Content Engagement",
      lastActivity: "6 hours ago",
      aiInsights: "Downloaded 2 whitepapers. Strong technical interest. Schedule demo ASAP.",
      dealSize: "$78,500",
      location: "Austin, TX",
      companySize: "50-100 employees",
      industry: "Analytics",
      engagement: 78,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      tags: ["Technical", "High Score", "Budget Confirmed"],
      assignedTo: "Sarah Martinez",
      dateAdded: "2024-01-14"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      company: "InnovateLabs",
      email: "emily@innovatelabs.co",
      phone: "+1 (555) 456-7890",
      position: "Head of Product",
      score: 73,
      status: "Warm",
      source: "AI Event Tracker",
      lastActivity: "1 day ago",
      aiInsights: "Attended 3 webinars. Budget approved Q1. High-value prospect for Professional plan.",
      dealSize: "$32,000",
      location: "New York, NY",
      companySize: "200+ employees",
      industry: "Product",
      engagement: 85,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
      tags: ["Product", "Budget Approved", "Q1 Timeline"],
      assignedTo: "Mike Johnson",
      dateAdded: "2024-01-13"
    },
    {
      id: 4,
      name: "David Park",
      company: "CloudSecure Inc",
      email: "david@cloudsecure.com",
      phone: "+1 (555) 567-8901",
      position: "Security Director",
      score: 89,
      status: "Hot",
      source: "AI LinkedIn Scraper",
      lastActivity: "30 minutes ago",
      aiInsights: "Actively researching security solutions. High engagement with our content.",
      dealSize: "$95,000",
      location: "Seattle, WA",
      companySize: "300+ employees",
      industry: "Security",
      engagement: 94,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
      tags: ["Security", "High Intent", "Enterprise"],
      assignedTo: "Lisa Chen",
      dateAdded: "2024-01-12"
    },
    {
      id: 5,
      name: "Amanda Foster",
      company: "RetailMax Solutions",
      email: "amanda@retailmax.com",
      phone: "+1 (555) 678-9012",
      position: "Chief Digital Officer",
      score: 76,
      status: "Warm",
      source: "AI Content Engagement",
      lastActivity: "3 hours ago",
      aiInsights: "Digital transformation focus. Evaluating multiple vendors.",
      dealSize: "$52,000",
      location: "Chicago, IL",
      companySize: "500+ employees",
      industry: "Retail",
      engagement: 71,
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
      tags: ["Digital Transform", "Multi-vendor", "Large Enterprise"],
      dateAdded: "2024-01-11"
    }
  ];

  const filteredLeads = mockLeads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filters.status.length === 0 || filters.status.includes(lead.status);
    const matchesScore = lead.score >= filters.scoreRange[0] && lead.score <= filters.scoreRange[1];
    
    return matchesSearch && matchesStatus && matchesScore;
  });

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
    setIsProfileModalOpen(true);
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleBulkExport = () => {
    console.log("Exporting selected leads:", selectedLeads);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Glassmorphism Header */}
      <div className="mb-8">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Bot className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  AI Lead Intelligence
                </h1>
                <p className="text-gray-400 mt-1">
                  Enterprise-grade lead generation powered by advanced AI
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <ResearchAssistant />
              <Button 
                variant="outline" 
                className="gap-2 bg-white/5 border-white/20 text-white hover:bg-white/10"
                onClick={() => setAiInsightsVisible(!aiInsightsVisible)}
              >
                <Brain size={16} />
                AI Insights
              </Button>
              <NewCampaignModal />
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights Panel */}
      {aiInsightsVisible && (
        <div className="mb-6 backdrop-blur-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="text-purple-400" size={20} />
            <h3 className="text-lg font-semibold text-white">AI Insights & Recommendations</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="text-gray-300 text-sm">🎯 3 hot leads ready for immediate contact</p>
              <p className="text-gray-300 text-sm">🚀 Best performing source: LinkedIn AI Scraper</p>
              <p className="text-gray-300 text-sm">💡 Recommended: Follow up with Enterprise prospects within 2 hours</p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-300 text-sm">📈 Revenue pipeline up 67% vs last month</p>
              <p className="text-gray-300 text-sm">🎉 12 active campaigns generating quality leads</p>
              <p className="text-gray-300 text-sm">⚡ AI automation saved 23 hours this week</p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-300 text-sm">🔥 High-intent leads increased 34% this week</p>
              <p className="text-gray-300 text-sm">💼 Average deal size: $58,500</p>
              <p className="text-gray-300 text-sm">📊 Conversion rate improved to 43.2%</p>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Stats Grid */}
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        {leadStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="backdrop-blur-xl bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-white group-hover:scale-105 transition-transform">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-400">{stat.label}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp size={12} className="text-green-400" />
                      <span className="text-xs text-green-400">{stat.change}</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <IconComponent className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search & Filters */}
      <Card className="mb-6 backdrop-blur-xl bg-white/5 border-white/10">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 flex-wrap mb-4">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search leads by name, company, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
            </div>
            <Button variant="outline" className="gap-2 bg-white/5 border-white/20 text-white hover:bg-white/10">
              <BarChart3 size={16} />
              Analytics
            </Button>
            {selectedLeads.length > 0 && (
              <Button onClick={handleBulkExport} variant="outline" className="gap-2 bg-green-500/20 border-green-500/30 text-green-400 hover:bg-green-500/30">
                <Download size={16} />
                Export ({selectedLeads.length})
              </Button>
            )}
          </div>

          <AdvancedFilters 
            onFiltersChange={handleFiltersChange}
            activeFilters={filters}
          />
        </CardContent>
      </Card>

      {/* Enhanced Leads Table */}
      <Card className="backdrop-blur-xl bg-white/5 border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Users size={20} />
              Lead Pipeline ({filteredLeads.length})
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                {filteredLeads.filter(l => l.status === 'Hot').length} Hot
              </Badge>
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">
                {filteredLeads.filter(l => l.status === 'Warm').length} Warm
              </Badge>
              <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">
                {filteredLeads.filter(l => l.status === 'Cold').length} Cold
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <LeadsTable
            leads={filteredLeads}
            onLeadClick={handleLeadClick}
            selectedLeads={selectedLeads}
            onSelectionChange={setSelectedLeads}
          />

          {/* AI Insights Footer */}
          <div className="mt-6 p-4 backdrop-blur-sm bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
            <div className="flex items-center gap-2 text-sm text-blue-300">
              <Brain size={16} />
              <strong>AI Recommendation:</strong> Focus on hot leads in the next 2 hours for optimal conversion rates. Sarah Johnson and David Park show highest purchase intent.
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lead Profile Modal */}
      <LeadProfileModal
        lead={selectedLead}
        isOpen={isProfileModalOpen}
        onClose={() => {
          setIsProfileModalOpen(false);
          setSelectedLead(null);
        }}
      />
    </div>
  );
}
