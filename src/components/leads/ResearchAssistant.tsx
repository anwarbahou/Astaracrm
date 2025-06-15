
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  RefreshCw,
  MapPin,
  Briefcase,
  Phone,
  Mail
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
          position: t("researchAssistant.mockData.positions.directeurGeneral"),
          email: "k.elfassi@marrakechdigital.ma",
          phone: "+212 6 11 22 33 44",
          location: "Marrakech, Maroc",
          score: 94,
          industry: searchParams.industry || t("researchAssistant.industries.techIA"),
          companySize: t("researchAssistant.companySizes.100200"),
          country: "Maroc",
          enrichment: {
            linkedin: "linkedin.com/in/karimelfassi",
            fundingStage: t("researchAssistant.fundingStages.serieA"),
            recentNews: t("researchAssistant.recentNews.funding15M"),
            technologies: ["React", "Node.js", "MongoDB"]
          }
        },
        {
          id: 2,
          name: "Amina Al-Zahra",
          company: "Dubai Innovation Labs",
          position: "Chief Innovation Officer",
          email: "amina@dubaiinnovation.ae",
          phone: "+971 50 987 6543",
          location: "Dubai, EAU",
          score: 91,
          industry: searchParams.industry || t("researchAssistant.industries.techIA"),
          companySize: t("researchAssistant.companySizes.200plus"),
          country: "Émirats Arabes Unis",
          enrichment: {
            linkedin: "linkedin.com/in/aminaalzahra",
            fundingStage: t("researchAssistant.fundingStages.serieB"),
            recentNews: t("researchAssistant.recentNews.expansionAfrique"),
            technologies: ["AI/ML", "Blockchain", "IoT"]
          }
        },
        {
          id: 3,
          name: "Hassan Benkirane",
          company: "Casablanca Fintech",
          position: "CEO & Fondateur",
          email: "h.benkirane@casablancafintech.ma",
          phone: "+212 6 77 88 99 00",
          location: "Casablanca, Maroc",
          score: 88,
          industry: searchParams.industry || t("researchAssistant.industries.fintech"),
          companySize: t("researchAssistant.companySizes.50100"),
          country: "Maroc",
          enrichment: {
            linkedin: "linkedin.com/in/hassanbenkirane",
            fundingStage: t("researchAssistant.fundingStages.seed"),
            recentNews: t("researchAssistant.recentNews.partnershipBOA"),
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
          {t("researchAssistant.title")}
        </Button>
      </SheetTrigger>
      
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader className="pb-6">
          <SheetTitle className="text-foreground text-xl flex items-center gap-2">
            <Search className="text-purple-500" size={20} />
            {t("researchAssistant.header.title")}
          </SheetTitle>
          <p className="text-muted-foreground text-sm">
            {t("researchAssistant.header.description")}
          </p>
        </SheetHeader>

        <div className="space-y-6">
          {/* Search Parameters */}
          <div className="p-4 bg-muted/50 rounded-lg border">
            <h3 className="text-foreground font-medium mb-4 flex items-center gap-2">
              <Target size={16} />
              {t("researchAssistant.searchParams.title")}
            </h3>

            <div className="space-y-4">
              <div>
                <Label className="text-foreground">{t("researchAssistant.searchParams.industry")}</Label>
                <Select value={searchParams.industry} onValueChange={(value) => setSearchParams(prev => ({ ...prev, industry: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={t("researchAssistant.searchParams.industryPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tech-ia">{t("researchAssistant.industries.techIA")}</SelectItem>
                    <SelectItem value="fintech">{t("researchAssistant.industries.fintech")}</SelectItem>
                    <SelectItem value="ecommerce">{t("researchAssistant.industries.ecommerce")}</SelectItem>
                    <SelectItem value="tourisme">{t("researchAssistant.industries.tourisme")}</SelectItem>
                    <SelectItem value="immobilier">{t("researchAssistant.industries.immobilier")}</SelectItem>
                    <SelectItem value="education">{t("researchAssistant.industries.education")}</SelectItem>
                    <SelectItem value="sante">{t("researchAssistant.industries.sante")}</SelectItem>
                    <SelectItem value="automobile">{t("researchAssistant.industries.automobile")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-foreground">{t("researchAssistant.searchParams.country")}</Label>
                <Select value={searchParams.country} onValueChange={(value) => setSearchParams(prev => ({ ...prev, country: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={t("researchAssistant.searchParams.countryPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maroc">{t("researchAssistant.countries.maroc")}</SelectItem>
                    <SelectItem value="eae">{t("researchAssistant.countries.eae")}</SelectItem>
                    <SelectItem value="arabie-saoudite">{t("researchAssistant.countries.arabieSaoudite")}</SelectItem>
                    <SelectItem value="egypte">{t("researchAssistant.countries.egypte")}</SelectItem>
                    <SelectItem value="jordanie">{t("researchAssistant.countries.jordanie")}</SelectItem>
                    <SelectItem value="liban">{t("researchAssistant.countries.liban")}</SelectItem>
                    <SelectItem value="tunisie">{t("researchAssistant.countries.tunisie")}</SelectItem>
                    <SelectItem value="algerie">{t("researchAssistant.countries.algerie")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-foreground">{t("researchAssistant.searchParams.jobTitle")}</Label>
                <Select value={searchParams.jobTitle} onValueChange={(value) => setSearchParams(prev => ({ ...prev, jobTitle: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={t("researchAssistant.searchParams.jobTitlePlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdg-ceo">{t("researchAssistant.jobTitles.pdgCeo")}</SelectItem>
                    <SelectItem value="directeur-general">{t("researchAssistant.jobTitles.directeurGeneral")}</SelectItem>
                    <SelectItem value="cto">{t("researchAssistant.jobTitles.cto")}</SelectItem>
                    <SelectItem value="cmo">{t("researchAssistant.jobTitles.cmo")}</SelectItem>
                    <SelectItem value="directeur-marketing">{t("researchAssistant.jobTitles.directeurMarketing")}</SelectItem>
                    <SelectItem value="directeur-commercial">{t("researchAssistant.jobTitles.directeurCommercial")}</SelectItem>
                    <SelectItem value="fondateur">{t("researchAssistant.jobTitles.fondateur")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-foreground">{t("researchAssistant.searchParams.companySize")}</Label>
                <Select value={searchParams.companySize} onValueChange={(value) => setSearchParams(prev => ({ ...prev, companySize: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={t("researchAssistant.searchParams.companySizePlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">{t("researchAssistant.companySizes.110")}</SelectItem>
                    <SelectItem value="11-50">{t("researchAssistant.companySizes.1150")}</SelectItem>
                    <SelectItem value="51-200">{t("researchAssistant.companySizes.51200")}</SelectItem>
                    <SelectItem value="201-500">{t("researchAssistant.companySizes.201500")}</SelectItem>
                    <SelectItem value="501-1000">{t("researchAssistant.companySizes.5011000")}</SelectItem>
                    <SelectItem value="1000+">{t("researchAssistant.companySizes.1000plus")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-foreground">{t("researchAssistant.searchParams.keywords")}</Label>
                <Textarea
                  placeholder={t("researchAssistant.searchParams.keywordsPlaceholder")}
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
                  {t("researchAssistant.searchParams.deepEnrichment")}
                </Label>
              </div>
              <p className="text-muted-foreground text-xs">
                {t("researchAssistant.searchParams.deepEnrichmentDescription")}
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
                  {t("researchAssistant.buttons.generating")}
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  {t("researchAssistant.buttons.generateLeads")}
                </>
              )}
            </Button>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {isGenerating ? (
              <div className="p-8 bg-muted/50 rounded-lg border text-center">
                <RefreshCw size={32} className="mx-auto text-purple-500 animate-spin mb-4" />
                <h3 className="text-foreground font-medium mb-2">{t("researchAssistant.generation.title")}</h3>
                <p className="text-muted-foreground">{t("researchAssistant.generation.description")}</p>
                <div className="mt-4 space-y-2">
                  <div className="text-sm text-muted-foreground">• {t("researchAssistant.generation.step1")}</div>
                  <div className="text-sm text-muted-foreground">• {t("researchAssistant.generation.step2")}</div>
                  <div className="text-sm text-muted-foreground">• {t("researchAssistant.generation.step3")}</div>
                </div>
              </div>
            ) : generatedLeads.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-foreground font-medium flex items-center gap-2">
                    <Users size={16} />
                    {t("researchAssistant.results.title", { count: generatedLeads.length })}
                  </h3>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="gap-2">
                      <Filter size={14} />
                      {t("researchAssistant.buttons.refine")}
                    </Button>
                    <Button size="sm" onClick={handleExport} className="gap-2">
                      <Download size={14} />
                      {t("researchAssistant.buttons.exportToCRM")}
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
                              <p className="text-muted-foreground text-sm">{lead.position} {t("common.at")} {lead.company}</p>
                            </div>
                            <Badge className={`${
                              lead.score >= 90 ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                              lead.score >= 80 ? 'bg-green-500/10 text-green-600 border-green-500/20' :
                              'bg-amber-500/10 text-amber-600 border-amber-500/20'
                            } border`}>
                              {t("researchAssistant.results.score")}: {lead.score}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 gap-2 text-sm mb-3">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin size={12} />
                              {lead.location}
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Building size={12} />
                              {lead.companySize}
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Mail size={12} />
                              {lead.email}
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Phone size={12} />
                              {lead.phone}
                            </div>
                          </div>

                          {searchParams.deepEnrichment && lead.enrichment && (
                            <div className="pt-3 border-t">
                              <div className="flex items-center gap-2 mb-2">
                                <Zap size={14} className="text-purple-500" />
                                <span className="text-purple-600 text-sm font-medium">{t("researchAssistant.results.enrichmentData")}</span>
                              </div>
                              <div className="grid grid-cols-1 gap-2 text-xs">
                                <div>
                                  <span className="text-muted-foreground">{t("researchAssistant.results.funding")}:</span>
                                  <span className="text-foreground ml-2">{lead.enrichment.fundingStage}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">{t("researchAssistant.results.news")}:</span>
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
                <h3 className="text-foreground font-medium mb-2">{t("researchAssistant.empty.title")}</h3>
                <p className="text-muted-foreground">{t("researchAssistant.empty.description")}</p>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
