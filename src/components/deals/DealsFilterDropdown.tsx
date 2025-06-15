
import { DealFilters } from '@/types/deal';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import DealsFilterPopoverContent from './DealsFilterPopoverContent';

interface DealsFilterDropdownProps {
  filters: DealFilters;
  onFiltersChange: (filters: DealFilters) => void;
  onClearFilters: () => void;
}

export function DealsFilterDropdown({ filters, onFiltersChange, onClearFilters }: DealsFilterDropdownProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  
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
