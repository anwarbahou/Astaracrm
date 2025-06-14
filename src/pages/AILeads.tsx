
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
  Filter, 
  Plus,
  MessageSquare,
  Brain,
  Zap,
  Target,
  Eye,
  Send,
  Phone,
  Mail,
  Globe,
  BarChart3,
  Sparkles,
  Search,
  SlidersHorizontal
} from "lucide-react";

export default function AILeads() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
  const [aiInsightsVisible, setAiInsightsVisible] = useState(false);

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
      label: "AI Actions", 
      value: "5,432", 
      change: "+67%",
      icon: Zap, 
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      trend: "up"
    },
  ];

  // Enhanced mock leads with AI insights
  const mockLeads = [
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
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400"
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
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
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
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400"
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Hot": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "Warm": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "Cold": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-400";
    if (score >= 80) return "text-green-400";
    if (score >= 70) return "text-amber-400";
    if (score >= 60) return "text-orange-400";
    return "text-red-400";
  };

  const filteredLeads = mockLeads.filter(lead => 
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                  Next-generation lead generation powered by advanced AI
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="gap-2 bg-white/5 border-white/20 text-white hover:bg-white/10"
                onClick={() => setAiInsightsVisible(!aiInsightsVisible)}
              >
                <Brain size={16} />
                AI Insights
              </Button>
              <Button className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <Plus size={16} />
                New Campaign
              </Button>
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
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-gray-300 text-sm">🎯 High-intent leads increased 34% this week</p>
              <p className="text-gray-300 text-sm">🚀 Best performing source: LinkedIn AI Scraper</p>
              <p className="text-gray-300 text-sm">💡 Recommended: Follow up with Enterprise prospects within 2 hours</p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-300 text-sm">📈 Revenue pipeline up 67% vs last month</p>
              <p className="text-gray-300 text-sm">🎉 3 hot leads ready for immediate contact</p>
              <p className="text-gray-300 text-sm">⚡ AI automation saved 23 hours this week</p>
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

      {/* Advanced Filters & Search */}
      <Card className="mb-6 backdrop-blur-xl bg-white/5 border-white/10">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 flex-wrap">
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
            <Button variant="outline" className="gap-2 bg-white/5 border-white/20 text-white">
              <SlidersHorizontal size={16} />
              Advanced Filters
            </Button>
            <Button variant="outline" className="gap-2 bg-white/5 border-white/20 text-white">
              <BarChart3 size={16} />
              Analytics
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Leads Table */}
      <Card className="backdrop-blur-xl bg-white/5 border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">AI-Powered Lead Pipeline</CardTitle>
            <div className="flex gap-2">
              {["all", "hot", "warm", "cold"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg capitalize transition-colors text-sm font-medium ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                      : "text-gray-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLeads.map((lead) => (
              <div
                key={lead.id}
                className="flex items-center justify-between p-6 backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="flex items-center gap-6 flex-1">
                  {/* Avatar & Basic Info */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img 
                        src={lead.avatar} 
                        alt={lead.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-white/20"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${
                        lead.status === 'Hot' ? 'bg-red-500' : 
                        lead.status === 'Warm' ? 'bg-amber-500' : 'bg-blue-500'
                      }`}></div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {lead.name}
                      </h3>
                      <p className="text-sm text-gray-400">{lead.position}</p>
                      <p className="text-sm text-gray-500">{lead.company}</p>
                    </div>
                  </div>

                  {/* AI Score & Insights */}
                  <div className="text-center min-w-[80px]">
                    <div className={`text-2xl font-bold ${getScoreColor(lead.score)}`}>
                      {lead.score}
                    </div>
                    <div className="text-xs text-gray-400">AI Score</div>
                    <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
                      <div 
                        className={`h-1 rounded-full ${lead.score >= 90 ? 'bg-emerald-400' : 
                          lead.score >= 80 ? 'bg-green-400' : 'bg-amber-400'}`}
                        style={{ width: `${lead.score}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Company Info */}
                  <div className="text-sm text-gray-300 min-w-[150px]">
                    <p className="flex items-center gap-1">
                      <Globe size={12} />
                      {lead.industry}
                    </p>
                    <p className="flex items-center gap-1 mt-1">
                      <Users size={12} />
                      {lead.companySize}
                    </p>
                  </div>

                  {/* Deal Value */}
                  <div className="text-center min-w-[100px]">
                    <div className="text-lg font-semibold text-green-400">
                      {lead.dealSize}
                    </div>
                    <div className="text-xs text-gray-400">Est. Value</div>
                  </div>
                </div>
                
                {/* Actions & Status */}
                <div className="flex items-center gap-4">
                  <Badge className={`${getStatusColor(lead.status)} border`}>
                    {lead.status}
                  </Badge>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="gap-1 bg-white/5 border-white/20 text-white hover:bg-white/10">
                      <Mail size={14} />
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1 bg-white/5 border-white/20 text-white hover:bg-white/10">
                      <Phone size={14} />
                    </Button>
                    <Button size="sm" className="gap-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                      <MessageSquare size={14} />
                      Contact
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* AI Insights Tooltip */}
          <div className="mt-6 p-4 backdrop-blur-sm bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
            <div className="flex items-center gap-2 text-sm text-blue-300">
              <Brain size={16} />
              <strong>AI Insight:</strong> These leads show high engagement patterns. Consider immediate outreach for hot leads.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
