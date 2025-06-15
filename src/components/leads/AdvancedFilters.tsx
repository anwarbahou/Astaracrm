
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Filter, X } from "lucide-react";

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
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (filterType: keyof FilterState, value: any) => {
    const newFilters = { ...activeFilters, [filterType]: value };
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
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
    onFiltersChange(emptyFilters);
  };

  const activeFilterCount = Object.values(activeFilters).reduce((count, filter) => {
    if (Array.isArray(filter)) return count + filter.length;
    if (typeof filter === 'object' && filter !== null) {
      return count + Object.values(filter).filter(v => v !== "" && v !== 0).length;
    }
    return count;
  }, 0);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2 relative">
          <Filter size={16} />
          {t("aiLeads.buttons.filtresAvances")}
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1 bg-blue-500/20 text-blue-400">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-4 bg-background border border-border" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">{t("aiLeads.buttons.filtresAvances")}</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X size={14} className="mr-1" />
              {t("common.clear")}
            </Button>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Status</label>
            <div className="flex flex-wrap gap-2">
              {["Hot", "Warm", "Cold"].map((status) => (
                <Badge
                  key={status}
                  variant={activeFilters.status.includes(status) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => {
                    const newStatus = activeFilters.status.includes(status)
                      ? activeFilters.status.filter(s => s !== status)
                      : [...activeFilters.status, status];
                    handleFilterChange("status", newStatus);
                  }}
                >
                  {status}
                </Badge>
              ))}
            </div>
          </div>

          {/* Source Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Source</label>
            <div className="flex flex-wrap gap-2">
              {["AI LinkedIn Maroc", "AI Gulf Networks", "AI MENA Tracker", "AI Europa Networks", "AI Startup Maroc"].map((source) => (
                <Badge
                  key={source}
                  variant={activeFilters.source.includes(source) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => {
                    const newSource = activeFilters.source.includes(source)
                      ? activeFilters.source.filter(s => s !== source)
                      : [...activeFilters.source, source];
                    handleFilterChange("source", newSource);
                  }}
                >
                  {source}
                </Badge>
              ))}
            </div>
          </div>

          {/* Score Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Score Range</label>
            <div className="px-3">
              <input
                type="range"
                min="0"
                max="100"
                value={activeFilters.scoreRange[1]}
                onChange={(e) => {
                  handleFilterChange("scoreRange", [activeFilters.scoreRange[0], parseInt(e.target.value)]);
                }}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{activeFilters.scoreRange[0]}</span>
                <span>{activeFilters.scoreRange[1]}</span>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
