
import { DealFilters, DealStage } from '@/types/deal';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Filter, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DealsFilterDropdownProps {
  filters: DealFilters;
  onFiltersChange: (filters: DealFilters) => void;
  onClearFilters: () => void;
}

export function DealsFilterDropdown({ filters, onFiltersChange, onClearFilters }: DealsFilterDropdownProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [showAllStages, setShowAllStages] = useState(false);
  const [showAllOwners, setShowAllOwners] = useState(false);

  const stages: DealStage[] = ['Prospect', 'Lead', 'Qualified', 'Negotiation', 'Won/Lost'];
  const owners = ['Sarah Chen', 'Mike Johnson', 'Emma Davis', 'Alex Rivera', 'David Kim', 'Lisa Wang', 'James Liu'];

  const handleStageChange = (stage: DealStage, checked: boolean) => {
    const newStages = checked 
      ? [...filters.stages, stage]
      : filters.stages.filter(s => s !== stage);
    
    onFiltersChange({ ...filters, stages: newStages });
  };

  const handleOwnerChange = (owner: string, checked: boolean) => {
    const newOwners = checked 
      ? [...filters.owners, owner]
      : filters.owners.filter(o => o !== owner);
    
    onFiltersChange({ ...filters, owners: newOwners });
  };

  const hasActiveFilters = filters.stages.length > 0 || filters.owners.length > 0 || 
    filters.valueRange[0] > 0 || filters.valueRange[1] < 1000000 ||
    filters.dateRange.start || filters.dateRange.end;
  
  const activeFilterCount =
    filters.stages.length +
    filters.owners.length +
    (filters.valueRange[0] > 0 ? 1 : 0) +
    (filters.valueRange[1] < 1000000 ? 1 : 0) +
    (filters.dateRange.start ? 1 : 0) +
    (filters.dateRange.end ? 1 : 0);

  const displayedStages = showAllStages ? stages : stages.slice(0, 3);
  const displayedOwners = showAllOwners ? owners : owners.slice(0, 3);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700">
          <Filter className="h-4 w-4" />
          {t('deals.filters')}
          {hasActiveFilters && (
            <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-80 bg-gray-800 border-gray-600 text-gray-300" 
        align="end"
      >
        <DropdownMenuLabel className="flex items-center justify-between text-gray-100">
          {t('deals.filtersDropdown.title')}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="h-6 px-2 text-xs text-gray-400 hover:text-gray-100"
            >
              <X className="h-3 w-3 mr-1" />
              {t('deals.filtersDropdown.clear')}
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-600" />

        {/* Stages Filter */}
        <div className="p-3 space-y-2">
          <Label className="text-sm font-medium text-gray-200">{t('deals.filtersDropdown.stagesLabel')}</Label>
          {displayedStages.map((stage) => (
            <div key={stage} className="flex items-center space-x-2">
              <Checkbox
                id={`stage-${stage}`}
                checked={filters.stages.includes(stage)}
                onCheckedChange={(checked) => handleStageChange(stage, checked as boolean)}
                className="border-gray-500"
              />
              <Label 
                htmlFor={`stage-${stage}`} 
                className="text-sm text-gray-300 cursor-pointer"
              >
                {t(`deals.stages.${stage.toLowerCase().replace('/', '-')}`)}
              </Label>
            </div>
          ))}
          {stages.length > 3 && (
            <Button
              variant="link"
              className="p-0 h-auto text-xs text-blue-400 hover:text-blue-300"
              onClick={(e) => { e.preventDefault(); setShowAllStages(!showAllStages); }}
            >
              {showAllStages ? 'Show less' : 'Show more'}
            </Button>
          )}
        </div>

        <DropdownMenuSeparator className="bg-gray-600" />

        {/* Owners Filter */}
        <div className="p-3 space-y-2">
          <Label className="text-sm font-medium text-gray-200">{t('deals.filtersDropdown.ownersLabel')}</Label>
          <div className="space-y-2">
            {displayedOwners.map((owner) => (
              <div key={owner} className="flex items-center space-x-2">
                <Checkbox
                  id={`owner-${owner}`}
                  checked={filters.owners.includes(owner)}
                  onCheckedChange={(checked) => handleOwnerChange(owner, checked as boolean)}
                  className="border-gray-500"
                />
                <Label 
                  htmlFor={`owner-${owner}`} 
                  className="text-sm text-gray-300 cursor-pointer"
                >
                  {owner}
                </Label>
              </div>
            ))}
          </div>
          {owners.length > 3 && (
            <Button
              variant="link"
              className="p-0 h-auto text-xs text-blue-400 hover:text-blue-300"
              onClick={(e) => { e.preventDefault(); setShowAllOwners(!showAllOwners); }}
            >
              {showAllOwners ? 'Show less' : 'Show more'}
            </Button>
          )}
        </div>

        <DropdownMenuSeparator className="bg-gray-600" />

        {/* Value Range */}
        <div className="p-3 space-y-2">
          <Label className="text-sm font-medium text-gray-200">{t('deals.filtersDropdown.valueLabel')}</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder={t('deals.filtersDropdown.minPlaceholder')}
              value={filters.valueRange[0] || ''}
              onChange={(e) => onFiltersChange({
                ...filters,
                valueRange: [parseInt(e.target.value) || 0, filters.valueRange[1]]
              })}
              className="bg-gray-700 border-gray-600 text-gray-100"
            />
            <Input
              type="number"
              placeholder={t('deals.filtersDropdown.maxPlaceholder')}
              value={filters.valueRange[1] === 1000000 ? '' : filters.valueRange[1]}
              onChange={(e) => onFiltersChange({
                ...filters,
                valueRange: [filters.valueRange[0], parseInt(e.target.value) || 1000000]
              })}
              className="bg-gray-700 border-gray-600 text-gray-100"
            />
          </div>
        </div>

        <DropdownMenuSeparator className="bg-gray-600" />

        {/* Date Range */}
        <div className="p-3 space-y-2">
          <Label className="text-sm font-medium text-gray-200">{t('deals.filtersDropdown.dateLabel')}</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => onFiltersChange({
                ...filters,
                dateRange: { ...filters.dateRange, start: e.target.value }
              })}
              className="bg-gray-700 border-gray-600 text-gray-100"
            />
            <Input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => onFiltersChange({
                ...filters,
                dateRange: { ...filters.dateRange, end: e.target.value }
              })}
              className="bg-gray-700 border-gray-600 text-gray-100"
            />
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
