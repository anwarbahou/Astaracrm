
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

  const quickFilters = [
    { label: "Hot Leads", value: "hot", color: "bg-red-500/20 text-red-400 border-red-500/30" },
    { label: "High Score", value: "high-score", color: "bg-green-500/20 text-green-400 border-green-500/30" },
    { label: "Unassigned", value: "unassigned", color: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
    { label: "Enterprise", value: "enterprise", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  ];

  const savedFilters = [
    "High-Value Prospects",
    "Recent Leads",
    "Qualified Leads",
    "Enterprise Targets"
  ];

  const statusOptions = ["Hot", "Warm", "Cold", "New", "Qualified", "Lost"];
  const sourceOptions = ["AI LinkedIn Scraper", "AI Content Engagement", "AI Event Tracker", "Manual Import", "Website Form"];
  const industryOptions = ["SaaS", "Analytics", "Fintech", "Healthcare", "E-commerce", "Manufacturing"];
  const companySizeOptions = ["1-10", "11-50", "51-100", "101-500", "500+"];
  const assignedToOptions = ["John Smith", "Sarah Johnson", "Mike Chen", "Unassigned"];

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
          <Filter size={16} className="text-gray-400" />
          <span className="text-sm text-gray-400">Quick Filters:</span>
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
            <Button variant="outline" className="gap-2 bg-white/5 border-white/20 text-white hover:bg-white/10">
              <SlidersHorizontal size={16} />
              Advanced Filters
              {activeFilterCount > 0 && (
                <Badge className="bg-blue-500 text-white text-xs">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          
          <SheetContent className="w-[500px] sm:max-w-[500px] bg-slate-900 border-white/10 overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="text-white">Advanced Filters</SheetTitle>
            </SheetHeader>

            <div className="space-y-6 mt-6">
              {/* Saved Filters */}
              <div className="space-y-3">
                <Label className="text-white">Saved Filters</Label>
                <div className="grid grid-cols-2 gap-2">
                  {savedFilters.map((filter) => (
                    <Button 
                      key={filter}
                      variant="outline" 
                      size="sm"
                      className="justify-start bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                      {filter}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator className="bg-white/10" />

              {/* Lead Status */}
              <div className="space-y-3">
                <Label className="text-white">Lead Status</Label>
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
                      className={`text-xs ${
                        filters.status.includes(status) 
                          ? 'bg-blue-500 hover:bg-blue-600' 
                          : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                      }`}
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>

              {/* AI Score Range */}
              <div className="space-y-3">
                <Label className="text-white">AI Score Range</Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.scoreRange[0]}
                    onChange={(e) => updateFilter('scoreRange', [parseInt(e.target.value) || 0, filters.scoreRange[1]])}
                    className="bg-white/5 border-white/20 text-white"
                  />
                  <span className="text-gray-400">to</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.scoreRange[1]}
                    onChange={(e) => updateFilter('scoreRange', [filters.scoreRange[0], parseInt(e.target.value) || 100])}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
              </div>

              {/* Source */}
              <div className="space-y-3">
                <Label className="text-white">Lead Source</Label>
                <Select>
                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                    <SelectValue placeholder="Select sources..." />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/20">
                    {sourceOptions.map((source) => (
                      <SelectItem key={source} value={source} className="text-white hover:bg-white/10">
                        {source}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-2 flex-wrap">
                  {filters.source.map((source) => (
                    <Badge key={source} className="bg-blue-500/20 text-blue-300 border-blue-500/30 gap-1">
                      {source}
                      <X 
                        size={12} 
                        className="cursor-pointer hover:text-blue-100"
                        onClick={() => removeFromArrayFilter('source', source)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Industry */}
              <div className="space-y-3">
                <Label className="text-white">Industry</Label>
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
                      className={`text-xs justify-start ${
                        filters.industry.includes(industry) 
                          ? 'bg-blue-500 hover:bg-blue-600' 
                          : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                      }`}
                    >
                      {industry}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Company Size */}
              <div className="space-y-3">
                <Label className="text-white">Company Size</Label>
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
                      className={`text-xs ${
                        filters.companySize.includes(size) 
                          ? 'bg-blue-500 hover:bg-blue-600' 
                          : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                      }`}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Assigned To */}
              <div className="space-y-3">
                <Label className="text-white">Assigned To</Label>
                <Select>
                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                    <SelectValue placeholder="Select assignee..." />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/20">
                    {assignedToOptions.map((assignee) => (
                      <SelectItem key={assignee} value={assignee} className="text-white hover:bg-white/10">
                        {assignee}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range */}
              <div className="space-y-3">
                <Label className="text-white">Date Added</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="date"
                    value={filters.dateRange.start}
                    onChange={(e) => updateFilter('dateRange', { ...filters.dateRange, start: e.target.value })}
                    className="bg-white/5 border-white/20 text-white"
                  />
                  <Input
                    type="date"
                    value={filters.dateRange.end}
                    onChange={(e) => updateFilter('dateRange', { ...filters.dateRange, end: e.target.value })}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button onClick={applyFilters} className="flex-1 bg-blue-500 hover:bg-blue-600">
                  Apply Filters
                </Button>
                <Button variant="outline" onClick={clearFilters} className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                  Clear All
                </Button>
                <Button variant="outline" size="icon" className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                  <BookmarkPlus size={16} />
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Bulk Actions */}
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 bg-white/5 border-white/20 text-white hover:bg-white/10">
            <Plus size={16} />
            Bulk Actions
          </Button>
        </div>
      </div>
    </div>
  );
}
