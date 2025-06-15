import { DealFilters, DealStage } from '@/types/deal';
import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Filter, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import FilterSection from '../clients/FilterSection';

interface DealsFilterDropdownProps {
  filters: DealFilters;
  onFiltersChange: (filters: DealFilters) => void;
  onClearFilters: () => void;
}

interface DealsFilterPopoverContentProps {
    filters: DealFilters;
    onFiltersChange: (filters: DealFilters) => void;
    onClose: () => void;
    onClearFilters: () => void;
}

const DealsFilterPopoverContent = ({ filters, onFiltersChange, onClose, onClearFilters }: DealsFilterPopoverContentProps) => {
    const { t } = useTranslation();
    const [localFilters, setLocalFilters] = useState<DealFilters>(filters);
    const [showAllStages, setShowAllStages] = useState(false);
    const [showAllOwners, setShowAllOwners] = useState(false);

    useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);

    const stages: DealStage[] = ['Prospect', 'Lead', 'Qualified', 'Negotiation', 'Won/Lost'];
    const owners = ['Sarah Chen', 'Mike Johnson', 'Emma Davis', 'Alex Rivera', 'David Kim', 'Lisa Wang', 'James Liu'];

    const handleApplyFilters = () => {
        onFiltersChange(localFilters);
        onClose();
    };

    const handleClearFilters = () => {
        onClearFilters();
    };

    const handleStageChange = (stage: DealStage, checked: boolean) => {
        const newStages = checked 
          ? [...localFilters.stages, stage]
          : localFilters.stages.filter(s => s !== stage);
        setLocalFilters({ ...localFilters, stages: newStages });
    };
    
    const handleOwnerChange = (owner: string, checked: boolean) => {
        const newOwners = checked 
          ? [...localFilters.owners, owner]
          : localFilters.owners.filter(o => o !== owner);
        setLocalFilters({ ...localFilters, owners: newOwners });
    };

    const displayedStages = showAllStages ? stages : stages.slice(0, 3);
    const displayedOwners = showAllOwners ? owners : owners.slice(0, 3);

    return (
        <Card className="w-[380px] bg-gray-800 border-gray-700 text-gray-300 shadow-lg">
             <CardHeader className="border-b border-gray-700 p-4">
                <CardTitle className="flex items-center justify-between text-lg text-gray-100">
                    <span className="flex items-center gap-2">
                        <Filter size={20} />
                        {t('deals.filtersDropdown.title')}
                    </span>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearFilters}
                        className="h-7 px-2 text-xs text-gray-400 hover:text-gray-100 hover:bg-gray-700"
                    >
                        <X className="h-3 w-3 mr-1" />
                        {t('deals.filtersPanel.clearAll')}
                    </Button>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-6 max-h-[calc(100vh-250px)] overflow-y-auto">
                <FilterSection title={t('deals.filtersDropdown.stagesLabel')}>
                    {displayedStages.map((stage) => (
                        <div key={stage} className="flex items-center space-x-2">
                        <Checkbox
                            id={`stage-${stage}`}
                            checked={localFilters.stages.includes(stage)}
                            onCheckedChange={(checked) => handleStageChange(stage, checked as boolean)}
                            className="border-gray-500 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                        />
                        <Label htmlFor={`stage-${stage}`} className="text-sm text-gray-300 cursor-pointer">
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
                        {showAllStages ? t('deals.filtersDropdown.showLess') : t('deals.filtersDropdown.showMore')}
                        </Button>
                    )}
                </FilterSection>

                <FilterSection title={t('deals.filtersDropdown.ownersLabel')}>
                    {displayedOwners.map((owner) => (
                        <div key={owner} className="flex items-center space-x-2">
                            <Checkbox
                                id={`owner-${owner}`}
                                checked={localFilters.owners.includes(owner)}
                                onCheckedChange={(checked) => handleOwnerChange(owner, checked as boolean)}
                                className="border-gray-500 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                            />
                            <Label htmlFor={`owner-${owner}`} className="text-sm text-gray-300 cursor-pointer">{owner}</Label>
                        </div>
                    ))}
                    {owners.length > 3 && (
                        <Button
                        variant="link"
                        className="p-0 h-auto text-xs text-blue-400 hover:text-blue-300"
                        onClick={(e) => { e.preventDefault(); setShowAllOwners(!showAllOwners); }}
                        >
                        {showAllOwners ? t('deals.filtersDropdown.showLess') : t('deals.filtersDropdown.showMore')}
                        </Button>
                    )}
                </FilterSection>

                <FilterSection title={t('deals.filtersDropdown.valueLabel')}>
                    <div className="grid grid-cols-2 gap-2">
                        <Input
                        type="number"
                        placeholder={t('deals.filtersDropdown.minPlaceholder')}
                        value={localFilters.valueRange[0] || ''}
                        onChange={(e) => setLocalFilters({
                            ...localFilters,
                            valueRange: [parseInt(e.target.value) || 0, localFilters.valueRange[1]]
                        })}
                        className="bg-gray-700 border-gray-600 text-gray-100"
                        />
                        <Input
                        type="number"
                        placeholder={t('deals.filtersDropdown.maxPlaceholder')}
                        value={localFilters.valueRange[1] === 1000000 ? '' : localFilters.valueRange[1]}
                        onChange={(e) => setLocalFilters({
                            ...localFilters,
                            valueRange: [localFilters.valueRange[0], parseInt(e.target.value) || 1000000]
                        })}
                        className="bg-gray-700 border-gray-600 text-gray-100"
                        />
                    </div>
                </FilterSection>

                <FilterSection title={t('deals.filtersDropdown.dateLabel')}>
                    <div className="grid grid-cols-2 gap-2">
                        <Input
                        type="date"
                        value={localFilters.dateRange.start}
                        onChange={(e) => setLocalFilters({
                            ...localFilters,
                            dateRange: { ...localFilters.dateRange, start: e.target.value }
                        })}
                        className="bg-gray-700 border-gray-600 text-gray-100"
                        />
                        <Input
                        type="date"
                        value={localFilters.dateRange.end}
                        onChange={(e) => setLocalFilters({
                            ...localFilters,
                            dateRange: { ...localFilters.dateRange, end: e.target.value }
                        })}
                        className="bg-gray-700 border-gray-600 text-gray-100"
                        />
                    </div>
                </FilterSection>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 p-4 border-t border-gray-700">
                <Button variant="outline" onClick={onClose} className="bg-transparent border-gray-600 hover:bg-gray-700 text-gray-300">
                    {t('common.cancel')}
                </Button>
                <Button onClick={handleApplyFilters} className="bg-blue-600 hover:bg-blue-700 text-white">
                    {t('deals.filtersPanel.apply')}
                </Button>
            </CardFooter>
        </Card>
    );
};

export function DealsFilterDropdown({ filters, onFiltersChange, onClearFilters }: DealsFilterDropdownProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  
  const hasActiveFilters = filters.stages.length > 0 || filters.owners.length > 0 || 
    filters.valueRange[0] > 0 || filters.valueRange[1] < 1000000 ||
    filters.dateRange.start || filters.dateRange.end;
  
  const activeFilterCount =
    (filters.stages?.length || 0) +
    (filters.owners?.length || 0) +
    (filters.valueRange[0] > 0 ? 1 : 0) +
    (filters.valueRange[1] < 1000000 ? 1 : 0) +
    (filters.dateRange.start ? 1 : 0) +
    (filters.dateRange.end ? 1 : 0);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700">
          <Filter className="h-4 w-4" />
          {t('deals.filters')}
          {activeFilterCount > 0 && (
            <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-auto p-0 border-none bg-transparent" 
        align="end"
      >
        <DealsFilterPopoverContent filters={filters} onFiltersChange={onFiltersChange} onClose={() => setIsOpen(false)} onClearFilters={onClearFilters} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
