import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
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

// Import components
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
  country: string;
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
  const { t } = useTranslation();
  
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

  // Enhanced lead stats with regional focus
  const leadStats = [
    { 
      label: t("aiLeads.stats.aiGeneratedLeads"), 
      value: "1,247", 
      change: "+18%",
      icon: Bot, 
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      trend: "up"
    },
    { 
      label: t("aiLeads.stats.menaQualified"), 
      value: "423", 
      change: "+25%",
      icon: Brain, 
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      trend: "up"
    },
    { 
      label: t("aiLeads.stats.conversionRate"), 
      value: "38.7%", 
      change: "+6.3%",
      icon: TrendingUp, 
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      trend: "up"
    },
    { 
      label: t("aiLeads.stats.activeCampaigns"), 
      value: "8", 
      change: "+2",
      icon: Target, 
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      trend: "up"
    },
  ];

  // Moroccan and regional lead data
  const mockLeads: Lead[] = [
    {
      id: 1,
      name: "Aicha Bennani",
      company: "Atlas Digital",
      email: "a.bennani@atlasdigital.ma",
      phone: "+212 6 12 34 56 78",
      position: "Directrice Générale",
      score: 92,
      status: "Hot",
      source: "AI LinkedIn Maroc",
      lastActivity: "Il y a 1 heure",
      aiInsights: "Fort intérêt pour les solutions digitales. A visité la page tarifs 4x. Parfait pour le plan Enterprise.",
      dealSize: "285,000 MAD",
      location: "Casablanca, Maroc",
      country: "Morocco",
      companySize: "50-100 employés",
      industry: "Tech",
      engagement: 94,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400",
      tags: ["Enterprise", "Lead Chaud", "Décideur"],
      assignedTo: "Youssef Alami",
      dateAdded: "2024-01-15"
    },
    {
      id: 2,
      name: "Omar Al-Rashid",
      company: "Emirates FinTech",
      email: "omar@emiratesfintech.ae",
      phone: "+971 50 123 4567",
      position: "Chief Technology Officer",
      score: 89,
      status: "Hot",
      source: "AI Gulf Networks",
      lastActivity: "2 hours ago",
      aiInsights: "Active in fintech innovation. Downloaded 3 whitepapers. High-value prospect for Professional plan.",
      dealSize: "$125,000",
      location: "Dubai, UAE",
      country: "UAE",
      companySize: "200+ employees",
      industry: "Fintech",
      engagement: 91,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      tags: ["Fintech", "Innovation", "Gulf"],
      assignedTo: "Sara Khalil",
      dateAdded: "2024-01-14"
    },
    {
      id: 3,
      name: "Fatima El-Khoury",
      company: "Beirut Analytics",
      email: "f.elkhoury@beirutanalytics.lb",
      phone: "+961 3 456 789",
      position: "Head of Data Science",
      score: 85,
      status: "Warm",
      source: "AI MENA Tracker",
      lastActivity: "5 heures",
      aiInsights: "Spécialiste en analytics. Budget approuvé Q1. Prospect de haute valeur pour le plan Professional.",
      dealSize: "$67,500",
      location: "Beyrouth, Liban",
      country: "Lebanon",
      companySize: "100-200 employés",
      industry: "Analytics",
      engagement: 82,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
      tags: ["Analytics", "Budget Approuvé", "MENA"],
      assignedTo: "Hassan Medini",
      dateAdded: "2024-01-13"
    },
    {
      id: 4,
      name: "Ahmed Benali",
      company: "Maroc Cyber Security",
      email: "a.benali@maroccyber.ma",
      phone: "+212 6 87 65 43 21",
      position: "Directeur Sécurité",
      score: 88,
      status: "Hot",
      source: "AI LinkedIn Maroc",
      lastActivity: "45 minutes",
      aiInsights: "Recherche active de solutions de sécurité. Fort engagement avec notre contenu.",
      dealSize: "320,000 MAD",
      location: "Rabat, Maroc",
      country: "Morocco",
      companySize: "150+ employés",
      industry: "Cybersécurité",
      engagement: 89,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
      tags: ["Sécurité", "Haute Intention", "Maroc"],
      assignedTo: "Laila Benjelloun",
      dateAdded: "2024-01-12"
    },
    {
      id: 5,
      name: "Sofia Martínez",
      company: "Madrid Digital Hub",
      email: "sofia@madriddigital.es",
      phone: "+34 91 123 4567",
      position: "Chief Digital Officer",
      score: 79,
      status: "Warm",
      source: "AI Europa Networks",
      lastActivity: "2 horas",
      aiInsights: "Enfoque en transformación digital. Evaluando múltiples proveedores.",
      dealSize: "€95,000",
      location: "Madrid, España",
      country: "Spain",
      companySize: "300+ empleados",
      industry: "Digital",
      engagement: 76,
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
      tags: ["Transformación Digital", "Europa", "Gran Empresa"],
      dateAdded: "2024-01-11"
    },
    {
      id: 6,
      name: "Mehdi Tazi",
      company: "Fes Tech Innovation",
      email: "m.tazi@festech.ma",
      phone: "+212 6 55 44 33 22",
      position: "Fondateur & CEO",
      score: 91,
      status: "Hot",
      source: "AI Startup Maroc",
      lastActivity: "30 minutes",
      aiInsights: "Startup prometteuse avec financement récent. Intérêt fort pour l'automatisation.",
      dealSize: "180,000 MAD",
      location: "Fès, Maroc",
      country: "Morocco",
      companySize: "25-50 employés",
      industry: "Startup",
      engagement: 93,
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400",
      tags: ["Startup", "Innovation", "Financement"],
      assignedTo: "Nadia Chraibi",
      dateAdded: "2024-01-10"
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
    <div className="min-h-screen bg-background p-4 md:p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
            <Bot className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {t("aiLeads.title")}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t("aiLeads.subtitle")}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <ResearchAssistant />
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => setAiInsightsVisible(!aiInsightsVisible)}
          >
            <Brain size={16} />
            {t("aiLeads.buttons.aiInsights")}
          </Button>
          <NewCampaignModal />
        </div>
      </div>

      {/* AI Insights Panel */}
      {aiInsightsVisible && (
        <Card className="border-purple-500/20 bg-gradient-to-r from-purple-500/5 to-blue-500/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="text-purple-400" size={20} />
              <h3 className="text-lg font-semibold text-foreground">Insights & Recommandations IA</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">🎯 4 leads chauds prêts pour contact immédiat</p>
                <p className="text-sm text-muted-foreground">🚀 Meilleure source: LinkedIn Maroc AI</p>
                <p className="text-sm text-muted-foreground">💡 Recommandé: Suivre les prospects Enterprise sous 2h</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">📈 Pipeline revenus +45% vs mois dernier</p>
                <p className="text-sm text-muted-foreground">🎉 8 campagnes actives générant des leads qualifiés</p>
                <p className="text-sm text-muted-foreground">⚡ Automatisation IA: 19h économisées cette semaine</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">🔥 Leads haute intention +28% cette semaine</p>
                <p className="text-sm text-muted-foreground">💼 Taille moyenne deal: 195,000 MAD</p>
                <p className="text-sm text-muted-foreground">📊 Taux conversion amélioré à 38.7%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-4">
        {leadStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-foreground group-hover:scale-105 transition-transform">
                      {stat.value}
                    </p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp size={12} className="text-emerald-500" />
                      <span className="text-xs text-emerald-500">{stat.change}</span>
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
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 flex-wrap mb-4">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("aiLeads.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline" className="gap-2">
              <BarChart3 size={16} />
              {t("aiLeads.buttons.analytics")}
            </Button>
            {selectedLeads.length > 0 && (
              <Button onClick={handleBulkExport} variant="outline" className="gap-2">
                <Download size={16} />
                {t("aiLeads.buttons.export")} ({selectedLeads.length})
              </Button>
            )}
          </div>

          <AdvancedFilters 
            onFiltersChange={handleFiltersChange}
            activeFilters={filters}
          />
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground flex items-center gap-2">
              <Users size={20} />
              {t("aiLeads.pipelineTitle", { count: filteredLeads.length })}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-red-500/10 text-red-400 border-red-500/20">
                {t("aiLeads.statusCounts.hot", { count: filteredLeads.filter(l => l.status === 'Hot').length })}
              </Badge>
              <Badge variant="secondary" className="bg-amber-500/10 text-amber-400 border-amber-500/20">
                {t("aiLeads.statusCounts.warm", { count: filteredLeads.filter(l => l.status === 'Warm').length })}
              </Badge>
              <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                {t("aiLeads.statusCounts.cold", { count: filteredLeads.filter(l => l.status === 'Cold').length })}
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
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-lg border border-blue-500/10">
            <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
              <Brain size={16} />
              <strong>Recommandation IA:</strong> Concentrez-vous sur Aicha Bennani et Mehdi Tazi dans les 2 prochaines heures pour un taux de conversion optimal.
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
