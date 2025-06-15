
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

  // Moroccan and regional focus
  const industryOptions = [
    "Tech & IA", "Fintech", "E-commerce", "Tourisme", "Immobilier", 
    "Éducation", "Santé", "Automobile", "Agroalimentaire", "Énergie", 
    "Télécoms", "Transport & Logistique"
  ];

  const countryOptions = [
    "Maroc", "Émirats Arabes Unis", "Arabie Saoudite", "Égypte", "Jordanie",
    "Liban", "Tunisie", "Algérie", "France", "Espagne", "Allemagne", "Royaume-Uni"
  ];

  const companySizeOptions = [
    "1-10 employés", "11-50 employés", "51-200 employés", 
    "201-500 employés", "501-1000 employés", "1000+ employés"
  ];

  const jobTitleOptions = [
    "PDG/CEO", "Directeur Général", "CTO", "CMO", "Directeur Marketing", 
    "Directeur Commercial", "Responsable Digital", "Chef de Projet", 
    "Directeur Financier", "Directeur RH", "Fondateur"
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate AI lead generation with regional data
    setTimeout(() => {
      const mockLeads = [
        {
          id: 1,
          name: "Karim El-Fassi",
          company: "Marrakech Digital Solutions",
          position: "Directeur Général",
          email: "k.elfassi@marrakechdigital.ma",
          phone: "+212 6 11 22 33 44",
          location: "Marrakech, Maroc",
          score: 94,
          industry: searchParams.industry || "Tech & IA",
          companySize: "100-200 employés",
          country: "Maroc",
          enrichment: {
            linkedin: "linkedin.com/in/karimelfassi",
            fundingStage: "Série A",
            recentNews: "Levée de fonds 15M MAD",
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
          industry: searchParams.industry || "Tech & IA",
          companySize: "200+ employés",
          country: "Émirats Arabes Unis",
          enrichment: {
            linkedin: "linkedin.com/in/aminaalzahra",
            fundingStage: "Série B",
            recentNews: "Expansion vers l'Afrique du Nord",
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
          industry: searchParams.industry || "Fintech",
          companySize: "50-100 employés",
          country: "Maroc",
          enrichment: {
            linkedin: "linkedin.com/in/hassanbenkirane",
            fundingStage: "Seed",
            recentNews: "Partenariat avec Bank of Africa",
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20 hover:bg-purple-500/20">
          <Brain size={16} />
          Assistant Recherche
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground text-xl flex items-center gap-2">
            <Search className="text-purple-500" size={20} />
            Assistant Recherche IA - MENA & Europe
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Search Parameters */}
          <div className="lg:col-span-1 space-y-6">
            <div className="p-4 bg-muted/50 rounded-lg border">
              <h3 className="text-foreground font-medium mb-4 flex items-center gap-2">
                <Target size={16} />
                Paramètres de Recherche
              </h3>

              <div className="space-y-4">
                <div>
                  <Label className="text-foreground">Secteur d'Activité</Label>
                  <Select value={searchParams.industry} onValueChange={(value) => setSearchParams(prev => ({ ...prev, industry: value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Sélectionner un secteur..." />
                    </SelectTrigger>
                    <SelectContent>
                      {industryOptions.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-foreground">Pays/Région</Label>
                  <Select value={searchParams.country} onValueChange={(value) => setSearchParams(prev => ({ ...prev, country: value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Sélectionner un pays..." />
                    </SelectTrigger>
                    <SelectContent>
                      {countryOptions.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-foreground">Poste/Fonction</Label>
                  <Select value={searchParams.jobTitle} onValueChange={(value) => setSearchParams(prev => ({ ...prev, jobTitle: value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Sélectionner un poste..." />
                    </SelectTrigger>
                    <SelectContent>
                      {jobTitleOptions.map((title) => (
                        <SelectItem key={title} value={title}>
                          {title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-foreground">Taille Entreprise</Label>
                  <Select value={searchParams.companySize} onValueChange={(value) => setSearchParams(prev => ({ ...prev, companySize: value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Sélectionner une taille..." />
                    </SelectTrigger>
                    <SelectContent>
                      {companySizeOptions.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-foreground">Mots-clés Additionnels</Label>
                  <Textarea
                    placeholder="Critères supplémentaires, technologies, etc..."
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
                    Enrichissement Avancé
                  </Label>
                </div>
                <p className="text-muted-foreground text-xs">
                  Inclure profils sociaux, données de financement, et stack technologique
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
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Générer des Leads
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2 space-y-6">
            {isGenerating ? (
              <div className="p-8 bg-muted/50 rounded-lg border text-center">
                <RefreshCw size={32} className="mx-auto text-purple-500 animate-spin mb-4" />
                <h3 className="text-foreground font-medium mb-2">Recherche IA en Cours</h3>
                <p className="text-muted-foreground">Analyse des bases de données et enrichissement des profils...</p>
                <div className="mt-4 space-y-2">
                  <div className="text-sm text-muted-foreground">• Recherche profils LinkedIn MENA</div>
                  <div className="text-sm text-muted-foreground">• Analyse données entreprises</div>
                  <div className="text-sm text-muted-foreground">• Enrichissement informations contact</div>
                </div>
              </div>
            ) : generatedLeads.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-foreground font-medium flex items-center gap-2">
                    <Users size={16} />
                    Leads Générés ({generatedLeads.length})
                  </h3>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="gap-2">
                      <Filter size={14} />
                      Affiner
                    </Button>
                    <Button size="sm" onClick={handleExport} className="gap-2">
                      <Download size={14} />
                      Exporter vers CRM
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
                              <p className="text-muted-foreground text-sm">{lead.position} chez {lead.company}</p>
                            </div>
                            <Badge className={`${
                              lead.score >= 90 ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                              lead.score >= 80 ? 'bg-green-500/10 text-green-600 border-green-500/20' :
                              'bg-amber-500/10 text-amber-600 border-amber-500/20'
                            } border`}>
                              Score: {lead.score}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
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
                                <span className="text-purple-600 text-sm font-medium">Données Enrichissement</span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                <div>
                                  <span className="text-muted-foreground">Financement:</span>
                                  <span className="text-foreground ml-2">{lead.enrichment.fundingStage}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Actualités:</span>
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
                <h3 className="text-foreground font-medium mb-2">Prêt à Générer des Leads</h3>
                <p className="text-muted-foreground">Configurez vos paramètres de recherche et cliquez sur "Générer des Leads" pour démarrer la recherche IA.</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
