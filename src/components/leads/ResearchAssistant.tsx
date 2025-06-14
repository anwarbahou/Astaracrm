
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  Brain, 
  Globe, 
  Building, 
  Users, 
  Target,
  Sparkles,
  Download,
  Zap,
  Filter,
  RefreshCw
} from "lucide-react";

export function ResearchAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchParams, setSearchParams] = useState({
    industry: "",
    country: "",
    jobTitle: "",
    companySize: "",
    keywords: "",
    deepEnrichment: true
  });

  const [generatedLeads, setGeneratedLeads] = useState<any[]>([]);

  const industryOptions = [
    "SaaS", "Fintech", "Healthcare", "E-commerce", "Manufacturing", 
    "Consulting", "Real Estate", "Education", "Media", "Non-profit"
  ];

  const countryOptions = [
    "United States", "Canada", "United Kingdom", "Germany", "France",
    "Australia", "Netherlands", "Sweden", "Singapore", "Brazil"
  ];

  const companySizeOptions = [
    "1-10 employees", "11-50 employees", "51-200 employees", 
    "201-500 employees", "501-1000 employees", "1000+ employees"
  ];

  const jobTitleOptions = [
    "CEO", "CTO", "VP of Engineering", "Head of Marketing", "Sales Director",
    "Product Manager", "Operations Manager", "Finance Director", "HR Director"
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate AI lead generation
    setTimeout(() => {
      const mockLeads = [
        {
          id: 1,
          name: "Alex Thompson",
          company: "TechFlow Solutions",
          position: "VP of Engineering",
          email: "alex@techflow.io",
          phone: "+1 (555) 123-4567",
          location: "San Francisco, CA",
          score: 92,
          industry: searchParams.industry || "SaaS",
          companySize: "150-200 employees",
          enrichment: {
            linkedin: "linkedin.com/in/alexthompson",
            fundingStage: "Series B",
            recentNews: "Raised $25M Series B round",
            technologies: ["React", "AWS", "Kubernetes"]
          }
        },
        {
          id: 2,
          name: "Maria Garcia",
          company: "InnovateLabs",
          position: "Head of Product",
          email: "maria@innovatelabs.co",
          phone: "+1 (555) 234-5678",
          location: "Austin, TX",
          score: 87,
          industry: searchParams.industry || "SaaS",
          companySize: "50-100 employees",
          enrichment: {
            linkedin: "linkedin.com/in/mariagarcia",
            fundingStage: "Seed",
            recentNews: "Launched new product line",
            technologies: ["Python", "Docker", "PostgreSQL"]
          }
        },
        {
          id: 3,
          name: "David Chen",
          company: "DataCorp Analytics",
          position: "CTO",
          email: "david@datacorp.com",
          phone: "+1 (555) 345-6789",
          location: "New York, NY",
          score: 94,
          industry: searchParams.industry || "Analytics",
          companySize: "200+ employees",
          enrichment: {
            linkedin: "linkedin.com/in/davidchen",
            fundingStage: "Series C",
            recentNews: "Acquired two competitors",
            technologies: ["TensorFlow", "Spark", "Snowflake"]
          }
        }
      ];
      
      setGeneratedLeads(mockLeads);
      setIsGenerating(false);
    }, 3000);
  };

  const handleExport = () => {
    console.log("Exporting leads to CRM:", generatedLeads);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500/30 text-purple-300 hover:bg-purple-500/30">
          <Brain size={16} />
          Research Assistant
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-slate-900 border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white text-xl flex items-center gap-2">
            <Search className="text-purple-400" size={20} />
            AI Research Assistant
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Search Parameters */}
          <div className="lg:col-span-1 space-y-6">
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                <Target size={16} />
                Search Parameters
              </h3>

              <div className="space-y-4">
                <div>
                  <Label className="text-white">Industry</Label>
                  <Select value={searchParams.industry} onValueChange={(value) => setSearchParams(prev => ({ ...prev, industry: value }))}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white mt-1">
                      <SelectValue placeholder="Select industry..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-white/20">
                      {industryOptions.map((industry) => (
                        <SelectItem key={industry} value={industry} className="text-white hover:bg-white/10">
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white">Country</Label>
                  <Select value={searchParams.country} onValueChange={(value) => setSearchParams(prev => ({ ...prev, country: value }))}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white mt-1">
                      <SelectValue placeholder="Select country..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-white/20">
                      {countryOptions.map((country) => (
                        <SelectItem key={country} value={country} className="text-white hover:bg-white/10">
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white">Job Title</Label>
                  <Select value={searchParams.jobTitle} onValueChange={(value) => setSearchParams(prev => ({ ...prev, jobTitle: value }))}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white mt-1">
                      <SelectValue placeholder="Select job title..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-white/20">
                      {jobTitleOptions.map((title) => (
                        <SelectItem key={title} value={title} className="text-white hover:bg-white/10">
                          {title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white">Company Size</Label>
                  <Select value={searchParams.companySize} onValueChange={(value) => setSearchParams(prev => ({ ...prev, companySize: value }))}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white mt-1">
                      <SelectValue placeholder="Select company size..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-white/20">
                      {companySizeOptions.map((size) => (
                        <SelectItem key={size} value={size} className="text-white hover:bg-white/10">
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white">Keywords</Label>
                  <Textarea
                    placeholder="Additional keywords or criteria..."
                    value={searchParams.keywords}
                    onChange={(e) => setSearchParams(prev => ({ ...prev, keywords: e.target.value }))}
                    className="bg-white/5 border-white/20 text-white mt-1"
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="deep-enrichment"
                    checked={searchParams.deepEnrichment}
                    onCheckedChange={(checked) => setSearchParams(prev => ({ ...prev, deepEnrichment: checked }))}
                  />
                  <Label htmlFor="deep-enrichment" className="text-white text-sm">
                    Deep Enrichment
                  </Label>
                </div>
                <p className="text-gray-400 text-xs">
                  Include social profiles, funding data, and tech stack information
                </p>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full mt-6 gap-2 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Generating Leads...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Generate Leads
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2 space-y-6">
            {isGenerating ? (
              <div className="p-8 bg-white/5 rounded-lg border border-white/10 text-center">
                <RefreshCw size={32} className="mx-auto text-purple-400 animate-spin mb-4" />
                <h3 className="text-white font-medium mb-2">AI Research in Progress</h3>
                <p className="text-gray-400">Scanning databases and enriching lead profiles...</p>
                <div className="mt-4 space-y-2">
                  <div className="text-sm text-gray-500">• Searching LinkedIn profiles</div>
                  <div className="text-sm text-gray-500">• Analyzing company data</div>
                  <div className="text-sm text-gray-500">• Enriching contact information</div>
                </div>
              </div>
            ) : generatedLeads.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-medium flex items-center gap-2">
                    <Users size={16} />
                    Generated Leads ({generatedLeads.length})
                  </h3>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="gap-2 bg-white/5 border-white/20 text-white hover:bg-white/10">
                      <Filter size={14} />
                      Refine
                    </Button>
                    <Button size="sm" onClick={handleExport} className="gap-2 bg-green-500 hover:bg-green-600">
                      <Download size={14} />
                      Export to CRM
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  {generatedLeads.map((lead) => (
                    <div key={lead.id} className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div>
                              <h4 className="text-white font-medium">{lead.name}</h4>
                              <p className="text-gray-400 text-sm">{lead.position} at {lead.company}</p>
                            </div>
                            <Badge className={`${
                              lead.score >= 90 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                              lead.score >= 80 ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                              'bg-amber-500/20 text-amber-400 border-amber-500/30'
                            } border`}>
                              Score: {lead.score}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-gray-300">
                                <Globe size={12} />
                                {lead.location}
                              </div>
                              <div className="flex items-center gap-2 text-gray-300">
                                <Building size={12} />
                                {lead.companySize}
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-gray-300">{lead.email}</div>
                              <div className="text-gray-300">{lead.phone}</div>
                            </div>
                          </div>

                          {searchParams.deepEnrichment && lead.enrichment && (
                            <div className="mt-3 pt-3 border-t border-white/10">
                              <div className="flex items-center gap-2 mb-2">
                                <Zap size={14} className="text-purple-400" />
                                <span className="text-purple-300 text-sm font-medium">Deep Enrichment Data</span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                <div>
                                  <span className="text-gray-400">Funding:</span>
                                  <span className="text-gray-300 ml-2">{lead.enrichment.fundingStage}</span>
                                </div>
                                <div>
                                  <span className="text-gray-400">Recent News:</span>
                                  <span className="text-gray-300 ml-2">{lead.enrichment.recentNews}</span>
                                </div>
                              </div>
                              <div className="flex gap-1 flex-wrap mt-2">
                                {lead.enrichment.technologies.map((tech: string) => (
                                  <Badge key={tech} variant="outline" className="text-xs border-white/20 text-gray-400">
                                    {tech}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-8 bg-white/5 rounded-lg border border-white/10 text-center">
                <Brain size={32} className="mx-auto text-purple-400 mb-4" />
                <h3 className="text-white font-medium mb-2">Ready to Generate Leads</h3>
                <p className="text-gray-400">Configure your search parameters and click "Generate Leads" to start AI-powered research.</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
