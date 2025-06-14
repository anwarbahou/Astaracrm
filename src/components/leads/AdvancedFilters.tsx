
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { 
  SlidersHorizontal, 
  X,
  Plus,
  Search,
  Filter,
  BookmarkPlus
} from "lucide-react";

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

interface AdvancedFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  activeFilters: FilterState;
}

export function AdvancedFilters({ onFiltersChange, activeFilters }: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(activeFilters);

  // Moroccan and regional quick filters
  const quickFilters = [
    { label: "Leads Chauds", value: "hot", color: "bg-red-500/10 text-red-600 border-red-500/20" },
    { label: "Score Élevé", value: "high-score", color: "bg-green-500/10 text-green-600 border-green-500/20" },
    { label: "Non Assignés", value: "unassigned", color: "bg-gray-500/10 text-gray-600 border-gray-500/20" },
    { label: "MENA", value: "mena", color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  ];

  const savedFilters = [
    "Prospects Maroc",
    "Leads Récents MENA",
    "Enterprise Qualifiés",
    "Tech & Innovation"
  ];

  const statusOptions = ["Hot", "Warm", "Cold", "Nouveau", "Qualifié", "Perdu"];
  const sourceOptions = ["AI LinkedIn Maroc", "AI MENA Networks", "AI Europa Networks", "Import Manuel", "Formulaire Web"];
  const industryOptions = ["Tech & IA", "Fintech", "E-commerce", "Tourisme", "Immobilier", "Éducation"];
  const companySizeOptions = ["1-10", "11-50", "51-100", "101-500", "500+"];
  const assignedToOptions = ["Youssef Alami", "Sara Khalil", "Hassan Medini", "Laila Benjelloun", "Non Assigné"];

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const addToArrayFilter = (key: keyof FilterState, value: string) => {
    const currentArray = filters[key] as string[];
    if (!currentArray.includes(value)) {
      updateFilter(key, [...currentArray, value]);
    }
  };

  const removeFromArrayFilter = (key: keyof FilterState, value: string) => {
    const currentArray = filters[key] as string[];
    updateFilter(key, currentArray.filter(item => item !== value));
  };

  const applyFilters = () => {
    onFiltersChange(filters);
    setIsOpen(false);
  };

  const clearFilters = () => {
    const emptyFilters: FilterState = {
      status: [],
      source: [],
      industry: [],
      scoreRange: [0, 100],
      companySize: [],
      location: [],
      assignedTo: [],
      dateRange: { start: "", end: "" }
    };
    setFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const activeFilterCount = Object.values(filters).reduce((count, filter) => {
    if (Array.isArray(filter)) return count + filter.length;
    if (typeof filter === 'object' && filter.start && filter.end) return count + 1;
    return count;
  }, 0);

  return (
    <div className="space-y-4">
      {/* Quick Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filtres Rapides:</span>
        </div>
        {quickFilters.map((filter) => (
          <Badge 
            key={filter.value}
            className={`cursor-pointer hover:opacity-80 ${filter.color} border`}
          >
            {filter.label}
          </Badge>
        ))}
      </div>

      {/* Advanced Filters Toggle */}
      <div className="flex items-center justify-between">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal size={16} />
              Filtres Avancés
              {activeFilterCount > 0 && (
                <Badge className="bg-blue-500 text-white text-xs">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          
          <SheetContent className="w-[500px] sm:max-w-[500px] overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="text-foreground">Filtres Avancés</SheetTitle>
            </SheetHeader>

            <div className="space-y-6 mt-6">
              {/* Saved Filters */}
              <div className="space-y-3">
                <Label className="text-foreground">Filtres Sauvegardés</Label>
                <div className="grid grid-cols-2 gap-2">
                  {savedFilters.map((filter) => (
                    <Button 
                      key={filter}
                      variant="outline" 
                      size="sm"
                      className="justify-start"
                    >
                      {filter}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Lead Status */}
              <div className="space-y-3">
                <Label className="text-foreground">Statut Lead</Label>
                <div className="grid grid-cols-3 gap-2">
                  {statusOptions.map((status) => (
                    <Button
                      key={status}
                      variant={filters.status.includes(status) ? "default" : "outline"}
                      size="sm"
                      onClick={() => 
                        filters.status.includes(status) 
                          ? removeFromArrayFilter('status', status)
                          : addToArrayFilter('status', status)
                      }
                      className="text-xs"
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>

              {/* AI Score Range */}
              <div className="space-y-3">
                <Label className="text-foreground">Plage Score IA</Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.scoreRange[0]}
                    onChange={(e) => updateFilter('scoreRange', [parseInt(e.target.value) || 0, filters.scoreRange[1]])}
                  />
                  <span className="text-muted-foreground">à</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.scoreRange[1]}
                    onChange={(e) => updateFilter('scoreRange', [filters.scoreRange[0], parseInt(e.target.value) || 100])}
                  />
                </div>
              </div>

              {/* Source */}
              <div className="space-y-3">
                <Label className="text-foreground">Source Lead</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner sources..." />
                  </SelectTrigger>
                  <SelectContent>
                    {sourceOptions.map((source) => (
                      <SelectItem key={source} value={source}>
                        {source}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-2 flex-wrap">
                  {filters.source.map((source) => (
                    <Badge key={source} className="bg-blue-500/10 text-blue-600 border-blue-500/20 gap-1">
                      {source}
                      <X 
                        size={12} 
                        className="cursor-pointer hover:text-blue-400"
                        onClick={() => removeFromArrayFilter('source', source)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Industry */}
              <div className="space-y-3">
                <Label className="text-foreground">Secteur</Label>
                <div className="grid grid-cols-2 gap-2">
                  {industryOptions.map((industry) => (
                    <Button
                      key={industry}
                      variant={filters.industry.includes(industry) ? "default" : "outline"}
                      size="sm"
                      onClick={() => 
                        filters.industry.includes(industry) 
                          ? removeFromArrayFilter('industry', industry)
                          : addToArrayFilter('industry', industry)
                      }
                      className="text-xs justify-start"
                    >
                      {industry}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Company Size */}
              <div className="space-y-3">
                <Label className="text-foreground">Taille Entreprise</Label>
                <div className="grid grid-cols-3 gap-2">
                  {companySizeOptions.map((size) => (
                    <Button
                      key={size}
                      variant={filters.companySize.includes(size) ? "default" : "outline"}
                      size="sm"
                      onClick={() => 
                        filters.companySize.includes(size) 
                          ? removeFromArrayFilter('companySize', size)
                          : addToArrayFilter('companySize', size)
                      }
                      className="text-xs"
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Assigned To */}
              <div className="space-y-3">
                <Label className="text-foreground">Assigné À</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner assigné..." />
                  </SelectTrigger>
                  <SelectContent>
                    {assignedToOptions.map((assignee) => (
                      <SelectItem key={assignee} value={assignee}>
                        {assignee}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range */}
              <div className="space-y-3">
                <Label className="text-foreground">Date Ajout</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="date"
                    value={filters.dateRange.start}
                    onChange={(e) => updateFilter('dateRange', { ...filters.dateRange, start: e.target.value })}
                  />
                  <Input
                    type="date"
                    value={filters.dateRange.end}
                    onChange={(e) => updateFilter('dateRange', { ...filters.dateRange, end: e.target.value })}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button onClick={applyFilters} className="flex-1">
                  Appliquer Filtres
                </Button>
                <Button variant="outline" onClick={clearFilters}>
                  Effacer Tout
                </Button>
                <Button variant="outline" size="icon">
                  <BookmarkPlus size={16} />
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Bulk Actions */}
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Plus size={16} />
            Actions Groupées
          </Button>
        </div>
      </div>
    </div>
  );
}
