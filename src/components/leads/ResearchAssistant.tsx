
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
  const { t } = useTranslation();
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

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate AI lead generation with regional data
    setTimeout(() => {
      const mockLeads = [
        {
          id: 1,
          name: "Karim El-Fassi",
          company: "Marrakech Digital Solutions",
          position: t("aiLeads.researchAssistant.mockLeads.director"),
          email: "k.elfassi@marrakechdigital.ma",
          phone: "+212 6 11 22 33 44",
          location: "Marrakech, Maroc",
          score: 94,
          industry: searchParams.industry || t("aiLeads.researchAssistant.industries.techAI"),
          companySize: t("aiLeads.researchAssistant.companySizes.medium"),
          country: "Maroc",
          enrichment: {
            linkedin: "linkedin.com/in/karimelfassi",
            fundingStage: t("aiLeads.researchAssistant.fundingStages.seriesA"),
            recentNews: t("aiLeads.researchAssistant.news.funding"),
            technologies: ["React", "Node.js", "MongoDB"]
          }
        },
        {
          id: 2,
          name: "Amina Al-Zahra",
          company: "Dubai Innovation Labs",
          position: t("aiLeads.researchAssistant.mockLeads.cio"),
          email: "amina@dubaiinnovation.ae",
          phone: "+971 50 987 6543",
          location: "Dubai, EAU",
          score: 91,
          industry: searchParams.industry || t("aiLeads.researchAssistant.industries.techAI"),
          companySize: t("aiLeads.researchAssistant.companySizes.large"),
          country: "Émirats Arabes Unis",
          enrichment: {
            linkedin: "linkedin.com/in/aminaalzahra",
            fundingStage: t("aiLeads.researchAssistant.fundingStages.seriesB"),
            recentNews: t("aiLeads.researchAssistant.news.expansion"),
            technologies: ["AI/ML", "Blockchain", "IoT"]
          }
        },
        {
          id: 3,
          name: "Hassan Benkirane",
          company: "Casablanca Fintech",
          position: t("aiLeads.researchAssistant.mockLeads.ceoFounder"),
          email: "h.benkirane@casablancafintech.ma",
          phone: "+212 6 77 88 99 00",
          location: "Casablanca, Maroc",
          score: 88,
          industry: searchParams.industry || t("aiLeads.researchAssistant.industries.fintech"),
          companySize: t("aiLeads.researchAssistant.companySizes.small"),
          country: "Maroc",
          enrichment: {
            linkedin: "linkedin.com/in/hassanbenkirane",
            fundingStage: t("aiLeads.researchAssistant.fundingStages.seed"),
            recentNews: t("aiLeads.researchAssistant.news.partnership"),
            technologies: ["Python", "Django", "PostgreSQL"]
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
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20 hover:bg-purple-500/20">
          <Brain size={16} />
          {t("aiLeads.researchAssistant.title")}
        </Button>
      </SheetTrigger>
      
      <SheetContent side="right" className="w-[600px] max-w-[90vw] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-foreground text-xl flex items-center gap-2">
            <Search className="text-purple-500" size={20} />
            {t("aiLeads.researchAssistant.modalTitle")}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Search Parameters */}
          <div className="p-4 bg-muted/50 rounded-lg border">
            <h3 className="text-foreground font-medium mb-4 flex items-center gap-2">
              <Target size={16} />
              {t("aiLeads.researchAssistant.searchParameters")}
            </h3>

            <div className="space-y-4">
              <div>
                <Label className="text-foreground">{t("aiLeads.researchAssistant.industry")}</Label>
                <Select value={searchParams.industry} onValueChange={(value) => setSearchParams(prev => ({ ...prev, industry: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={t("aiLeads.researchAssistant.industryPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tech-ai">{t("aiLeads.researchAssistant.industries.techAI")}</SelectItem>
                    <SelectItem value="fintech">{t("aiLeads.researchAssistant.industries.fintech")}</SelectItem>
                    <SelectItem value="ecommerce">{t("aiLeads.researchAssistant.industries.ecommerce")}</SelectItem>
                    <SelectItem value="tourism">{t("aiLeads.researchAssistant.industries.tourism")}</SelectItem>
                    <SelectItem value="realestate">{t("aiLeads.researchAssistant.industries.realEstate")}</SelectItem>
                    <SelectItem value="education">{t("aiLeads.researchAssistant.industries.education")}</SelectItem>
                    <SelectItem value="healthcare">{t("aiLeads.researchAssistant.industries.healthcare")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-foreground">{t("aiLeads.researchAssistant.countryRegion")}</Label>
                <Select value={searchParams.country} onValueChange={(value) => setSearchParams(prev => ({ ...prev, country: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={t("aiLeads.researchAssistant.countryPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morocco">{t("aiLeads.researchAssistant.countries.morocco")}</SelectItem>
                    <SelectItem value="uae">{t("aiLeads.researchAssistant.countries.uae")}</SelectItem>
                    <SelectItem value="saudi">{t("aiLeads.researchAssistant.countries.saudi")}</SelectItem>
                    <SelectItem value="egypt">{t("aiLeads.researchAssistant.countries.egypt")}</SelectItem>
                    <SelectItem value="jordan">{t("aiLeads.researchAssistant.countries.jordan")}</SelectItem>
                    <SelectItem value="lebanon">{t("aiLeads.researchAssistant.countries.lebanon")}</SelectItem>
                    <SelectItem value="tunisia">{t("aiLeads.researchAssistant.countries.tunisia")}</SelectItem>
                    <SelectItem value="france">{t("aiLeads.researchAssistant.countries.france")}</SelectItem>
                    <SelectItem value="spain">{t("aiLeads.researchAssistant.countries.spain")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-foreground">{t("aiLeads.researchAssistant.jobTitle")}</Label>
                <Select value={searchParams.jobTitle} onValueChange={(value) => setSearchParams(prev => ({ ...prev, jobTitle: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={t("aiLeads.researchAssistant.jobTitlePlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ceo">{t("aiLeads.researchAssistant.jobTitles.ceo")}</SelectItem>
                    <SelectItem value="director">{t("aiLeads.researchAssistant.jobTitles.director")}</SelectItem>
                    <SelectItem value="cto">{t("aiLeads.researchAssistant.jobTitles.cto")}</SelectItem>
                    <SelectItem value="cmo">{t("aiLeads.researchAssistant.jobTitles.cmo")}</SelectItem>
                    <SelectItem value="marketingDirector">{t("aiLeads.researchAssistant.jobTitles.marketingDirector")}</SelectItem>
                    <SelectItem value="salesDirector">{t("aiLeads.researchAssistant.jobTitles.salesDirector")}</SelectItem>
                    <SelectItem value="founder">{t("aiLeads.researchAssistant.jobTitles.founder")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-foreground">{t("aiLeads.researchAssistant.companySize")}</Label>
                <Select value={searchParams.companySize} onValueChange={(value) => setSearchParams(prev => ({ ...prev, companySize: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={t("aiLeads.researchAssistant.companySizePlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">{t("aiLeads.researchAssistant.companySizes.micro")}</SelectItem>
                    <SelectItem value="11-50">{t("aiLeads.researchAssistant.companySizes.small")}</SelectItem>
                    <SelectItem value="51-200">{t("aiLeads.researchAssistant.companySizes.medium")}</SelectItem>
                    <SelectItem value="201-500">{t("aiLeads.researchAssistant.companySizes.large")}</SelectItem>
                    <SelectItem value="1000+">{t("aiLeads.researchAssistant.companySizes.enterprise")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-foreground">{t("aiLeads.researchAssistant.additionalKeywords")}</Label>
                <Textarea
                  placeholder={t("aiLeads.researchAssistant.keywordsPlaceholder")}
                  value={searchParams.keywords}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, keywords: e.target.value }))}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="deep-enrichment"
                  checked={searchParams.deepEnrichment}
                  onCheckedChange={(checked) => setSearchParams(prev => ({ ...prev, deepEnrichment: checked }))}
                />
                <Label htmlFor="deep-enrichment" className="text-foreground text-sm">
                  {t("aiLeads.researchAssistant.advancedEnrichment")}
                </Label>
              </div>
              <p className="text-muted-foreground text-xs">
                {t("aiLeads.researchAssistant.enrichmentDescription")}
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
                  {t("aiLeads.researchAssistant.generating")}
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  {t("aiLeads.researchAssistant.generateLeads")}
                </>
              )}
            </Button>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {isGenerating ? (
              <div className="p-8 bg-muted/50 rounded-lg border text-center">
                <RefreshCw size={32} className="mx-auto text-purple-500 animate-spin mb-4" />
                <h3 className="text-foreground font-medium mb-2">{t("aiLeads.researchAssistant.searchInProgress")}</h3>
                <p className="text-muted-foreground">{t("aiLeads.researchAssistant.searchDescription")}</p>
                <div className="mt-4 space-y-2">
                  <div className="text-sm text-muted-foreground">• {t("aiLeads.researchAssistant.searchSteps.linkedin")}</div>
                  <div className="text-sm text-muted-foreground">• {t("aiLeads.researchAssistant.searchSteps.companyData")}</div>
                  <div className="text-sm text-muted-foreground">• {t("aiLeads.researchAssistant.searchSteps.enrichment")}</div>
                </div>
              </div>
            ) : generatedLeads.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-foreground font-medium flex items-center gap-2">
                    <Users size={16} />
                    {t("aiLeads.researchAssistant.leadsGenerated", { count: generatedLeads.length })}
                  </h3>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="gap-2">
                      <Filter size={14} />
                      {t("aiLeads.researchAssistant.refine")}
                    </Button>
                    <Button size="sm" onClick={handleExport} className="gap-2">
                      <Download size={14} />
                      {t("aiLeads.researchAssistant.exportToCRM")}
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  {generatedLeads.map((lead) => (
                    <div key={lead.id} className="p-4 bg-muted/50 rounded-lg border hover:bg-muted/70 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div>
                              <h4 className="text-foreground font-medium">{lead.name}</h4>
                              <p className="text-muted-foreground text-sm">{lead.position} {t("aiLeads.researchAssistant.at")} {lead.company}</p>
                            </div>
                            <Badge className={`${
                              lead.score >= 90 ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                              lead.score >= 80 ? 'bg-green-500/10 text-green-600 border-green-500/20' :
                              'bg-amber-500/10 text-amber-600 border-amber-500/20'
                            } border`}>
                              {t("aiLeads.researchAssistant.score")}: {lead.score}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Globe size={12} />
                                {lead.location}
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Building size={12} />
                                {lead.companySize}
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-muted-foreground">{lead.email}</div>
                              <div className="text-muted-foreground">{lead.phone}</div>
                            </div>
                          </div>

                          {searchParams.deepEnrichment && lead.enrichment && (
                            <div className="mt-3 pt-3 border-t">
                              <div className="flex items-center gap-2 mb-2">
                                <Zap size={14} className="text-purple-500" />
                                <span className="text-purple-600 text-sm font-medium">{t("aiLeads.researchAssistant.enrichmentData")}</span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                <div>
                                  <span className="text-muted-foreground">{t("aiLeads.researchAssistant.funding")}:</span>
                                  <span className="text-foreground ml-2">{lead.enrichment.fundingStage}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">{t("aiLeads.researchAssistant.news")}:</span>
                                  <span className="text-foreground ml-2">{lead.enrichment.recentNews}</span>
                                </div>
                              </div>
                              <div className="flex gap-1 flex-wrap mt-2">
                                {lead.enrichment.technologies.map((tech: string) => (
                                  <Badge key={tech} variant="outline" className="text-xs">
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
              <div className="p-8 bg-muted/50 rounded-lg border text-center">
                <Brain size={32} className="mx-auto text-purple-500 mb-4" />
                <h3 className="text-foreground font-medium mb-2">{t("aiLeads.researchAssistant.readyToGenerate")}</h3>
                <p className="text-muted-foreground">{t("aiLeads.researchAssistant.configureAndGenerate")}</p>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
