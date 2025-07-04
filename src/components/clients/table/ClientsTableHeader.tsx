
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { FiltersPopoverContent } from '../ClientsFiltersPopover';
import { ClientFilters } from '@/types/client';

interface ClientsTableHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: ClientFilters;
  onFiltersChange: (filters: ClientFilters) => void;
}

export function ClientsTableHeader({
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
}: ClientsTableHeaderProps) {
  const { t } = useTranslation();
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t('clients.table.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter size={16} />
                {t('clients.table.filters')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <FiltersPopoverContent filters={filters} onFiltersChange={onFiltersChange} onClose={() => setFiltersOpen(false)} />
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  );
}
