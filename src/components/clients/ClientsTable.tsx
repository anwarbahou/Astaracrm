import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import {
  ChevronUp,
  ChevronDown,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  industry: string;
  stage: string;
  tags: string[];
  owner: string;
  country: string;
  contactsCount: number;
  totalDealValue: number;
  createdDate: string;
  lastInteraction: string;
  status: 'Active' | 'Archived';
  avatar?: string;
  notes?: string;
}

interface ClientFilters {
  owner: string;
  stage: string;
  industry: string;
  country: string;
  status: string;
  tags: string[];
  dateCreatedFrom: string;
  dateCreatedTo: string;
  lastInteractionFrom: string;
  lastInteractionTo: string;
}

interface ClientsTableProps {
  clients: Client[];
  onClientClick: (client: Client) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: ClientFilters;
  onFiltersChange: (filters: ClientFilters) => void;
}

type SortField = keyof Client;
type SortDirection = 'asc' | 'desc';

const FilterSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="space-y-2">
    <Label className="text-sm font-medium text-gray-200">{title}</Label>
    {children}
  </div>
);

const FiltersPopoverContent = ({ filters, onFiltersChange, onClose }: { filters: ClientFilters; onFiltersChange: (f: ClientFilters) => void; onClose: () => void }) => {
  const { t } = useTranslation();
  const [localFilters, setLocalFilters] = useState<ClientFilters>(filters);

  const owners = useMemo(() => ["John Smith", "Sarah Johnson", "Mike Wilson", "Emily Davis"], []);
  const stages = useMemo(() => ["Lead", "Prospect", "Active", "Inactive"], []);
  const industries = useMemo(() => ["Technology", "Healthcare", "Finance", "Manufacturing", "Retail", "Consulting"], []);
  const countries = useMemo(() => ["Morocco", "France", "Spain", "USA", "UAE"], []);
  const statuses = useMemo(() => ["Active", "Archived"], []);
  const availableTags = useMemo(() => ["VIP", "High Value", "Enterprise", "SMB", "Urgent", "International"], []);

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleClearFilters = () => {
    const emptyFilters: ClientFilters = {
      owner: '',
      stage: '',
      industry: '',
      country: '',
      status: '',
      tags: [],
      dateCreatedFrom: '',
      dateCreatedTo: '',
      lastInteractionFrom: '',
      lastInteractionTo: '',
    };
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const removeTag = (tagToRemove: string) => {
    setLocalFilters({
      ...localFilters,
      tags: localFilters.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const addTag = (newTag: string) => {
    if (newTag && !localFilters.tags.includes(newTag)) {
      setLocalFilters({
        ...localFilters,
        tags: [...localFilters.tags, newTag]
      });
    }
  };

  return (
    <Card className="w-[380px] bg-gray-800 border-gray-700 text-gray-200 shadow-lg">
      <CardHeader className="border-b border-gray-700 p-4">
        <CardTitle className="flex items-center justify-between text-lg text-gray-100">
          <span className="flex items-center gap-2">
            <Filter size={20} />
            {t('clients.filtersPanel.title')}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="h-7 px-2 text-xs text-gray-400 hover:text-gray-100 hover:bg-gray-700"
          >
            <X className="h-3 w-3 mr-1" />
            {t('clients.filtersPanel.clearAll')}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-6 max-h-[calc(100vh-250px)] overflow-y-auto">
        <div className="grid grid-cols-1 gap-6">
          <FilterSection title={t('clients.filtersPanel.owner')}>
            <RadioGroup value={localFilters.owner} onValueChange={(value) => setLocalFilters({ ...localFilters, owner: value })}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="" id="owner-all" />
                <Label htmlFor="owner-all" className="cursor-pointer">{t('clients.filtersPanel.allOwners')}</Label>
              </div>
              {owners.map(owner => (
                <div key={owner} className="flex items-center space-x-2">
                  <RadioGroupItem value={owner} id={`owner-${owner}`} />
                  <Label htmlFor={`owner-${owner}`} className="cursor-pointer">{owner}</Label>
                </div>
              ))}
            </RadioGroup>
          </FilterSection>

          <FilterSection title={t('clients.filtersPanel.stage')}>
            <RadioGroup value={localFilters.stage} onValueChange={(value) => setLocalFilters({ ...localFilters, stage: value })}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="" id="stage-all" />
                <Label htmlFor="stage-all" className="cursor-pointer">{t('clients.filtersPanel.allStages')}</Label>
              </div>
              {stages.map(stage => (
                <div key={stage} className="flex items-center space-x-2">
                  <RadioGroupItem value={stage} id={`stage-${stage}`} />
                  <Label htmlFor={`stage-${stage}`} className="cursor-pointer">{stage}</Label>
                </div>
              ))}
            </RadioGroup>
          </FilterSection>
          
          <FilterSection title={t('clients.filtersPanel.industry')}>
            <RadioGroup value={localFilters.industry} onValueChange={(value) => setLocalFilters({ ...localFilters, industry: value })}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="" id="industry-all" />
                <Label htmlFor="industry-all" className="cursor-pointer">{t('clients.filtersPanel.allIndustries')}</Label>
              </div>
              {industries.map(industry => (
                <div key={industry} className="flex items-center space-x-2">
                  <RadioGroupItem value={industry} id={`industry-${industry}`} />
                  <Label htmlFor={`industry-${industry}`} className="cursor-pointer">{industry}</Label>
                </div>
              ))}
            </RadioGroup>
          </FilterSection>

          <FilterSection title={t('clients.filtersPanel.location')}>
            <RadioGroup value={localFilters.country} onValueChange={(value) => setLocalFilters({ ...localFilters, country: value })}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="" id="country-all" />
                <Label htmlFor="country-all" className="cursor-pointer">{t('clients.filtersPanel.allLocations')}</Label>
              </div>
              {countries.map(country => (
                <div key={country} className="flex items-center space-x-2">
                  <RadioGroupItem value={country} id={`country-${country}`} />
                  <Label htmlFor={`country-${country}`} className="cursor-pointer">{country}</Label>
                </div>
              ))}
            </RadioGroup>
          </FilterSection>

          <FilterSection title={t('clients.filtersPanel.status')}>
            <RadioGroup value={localFilters.status} onValueChange={(value) => setLocalFilters({ ...localFilters, status: value })}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="" id="status-all" />
                <Label htmlFor="status-all" className="cursor-pointer">{t('clients.filtersPanel.allStatuses')}</Label>
              </div>
              {statuses.map(status => (
                <div key={status} className="flex items-center space-x-2">
                  <RadioGroupItem value={status} id={`status-${status}`} />
                  <Label htmlFor={`status-${status}`} className="cursor-pointer">{status}</Label>
                </div>
              ))}
            </RadioGroup>
          </FilterSection>

          <FilterSection title={t('clients.filtersPanel.tags')}>
            <div className="space-y-2">
              <Select onValueChange={(value) => addTag(value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder={t('clients.filtersPanel.addTag')} />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                  {availableTags.map(tag => (
                    <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {localFilters.tags.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {localFilters.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="gap-1 bg-gray-600 text-gray-100">
                      {tag}
                      <X 
                        size={12} 
                        className="cursor-pointer hover:text-destructive"
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </FilterSection>

          <FilterSection title={t('clients.filtersPanel.dateCreated')}>
             <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-muted-foreground">{t('clients.filtersPanel.from')}</Label>
                <Input
                  type="date"
                  value={localFilters.dateCreatedFrom}
                  onChange={(e) => setLocalFilters({ ...localFilters, dateCreatedFrom: e.target.value })}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">{t('clients.filtersPanel.to')}</Label>
                <Input
                  type="date"
                  value={localFilters.dateCreatedTo}
                  onChange={(e) => setLocalFilters({ ...localFilters, dateCreatedTo: e.target.value })}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
            </div>
          </FilterSection>

          <FilterSection title={t('clients.filtersPanel.lastInteraction')}>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-muted-foreground">{t('clients.filtersPanel.from')}</Label>
                <Input
                  type="date"
                  value={localFilters.lastInteractionFrom}
                  onChange={(e) => setLocalFilters({ ...localFilters, lastInteractionFrom: e.target.value })}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">{t('clients.filtersPanel.to')}</Label>
                <Input
                  type="date"
                  value={localFilters.lastInteractionTo}
                  onChange={(e) => setLocalFilters({ ...localFilters, lastInteractionTo: e.target.value })}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
            </div>
          </FilterSection>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 p-4 border-t border-gray-700">
        <Button variant="outline" onClick={onClose} className="border-gray-600 hover:bg-gray-700">
          {t('common.cancel')}
        </Button>
        <Button onClick={handleApplyFilters} className="bg-blue-600 hover:bg-blue-700">
          {t('clients.filtersPanel.apply')}
        </Button>
      </CardFooter>
    </Card>
  )
}

export function ClientsTable({ 
  clients, 
  onClientClick, 
  searchQuery, 
  onSearchChange,
  filters,
  onFiltersChange,
}: ClientsTableProps) {
  const { t, i18n } = useTranslation();
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Lead': return 'bg-yellow-500';
      case 'Active': return 'bg-green-500';
      case 'Inactive': return 'bg-red-500';
      case 'Prospect': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const formatLastInteraction = (dateString: string) => {
    const date = new Date(dateString);
    const rtf = new Intl.RelativeTimeFormat(i18n.language, { numeric: 'auto' });
    const now = new Date();
    
    const diffInSecondsPast = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSecondsPast < 60) return rtf.format(-diffInSecondsPast, 'second');
    if (diffInSecondsPast < 3600) return rtf.format(-Math.floor(diffInSecondsPast / 60), 'minute');
    if (diffInSecondsPast < 86400) return rtf.format(-Math.floor(diffInSecondsPast / 3600), 'hour');
    const diffInDaysPast = Math.floor(diffInSecondsPast / 86400);
    if (diffInDaysPast < 7) return rtf.format(-diffInDaysPast, 'day');
    if (diffInDaysPast < 30) return rtf.format(-Math.floor(diffInDaysPast / 7), 'week');
    if (diffInDaysPast < 365) return rtf.format(-Math.floor(diffInDaysPast / 30), 'month');
    return rtf.format(-Math.floor(diffInDaysPast / 365), 'year');
  };

  const filteredAndSortedClients = useMemo(() => {
    let filtered = clients.filter(client => {
      const searchMatch =
        searchQuery === '' ||
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.owner.toLowerCase().includes(searchQuery.toLowerCase());

      const ownerMatch = !filters.owner || client.owner === filters.owner;
      const stageMatch = !filters.stage || client.stage === filters.stage;
      const industryMatch = !filters.industry || client.industry === filters.industry;
      const countryMatch = !filters.country || client.country === filters.country;
      const statusMatch = !filters.status || client.status === filters.status;
      const tagsMatch = filters.tags.length === 0 || filters.tags.every(tag => client.tags.includes(tag));
      const createdFromMatch = !filters.dateCreatedFrom || new Date(client.createdDate) >= new Date(filters.dateCreatedFrom);
      const createdToMatch = !filters.dateCreatedTo || new Date(client.createdDate) <= new Date(filters.dateCreatedTo);
      const lastInteractionFromMatch = !filters.lastInteractionFrom || new Date(client.lastInteraction) >= new Date(filters.lastInteractionFrom);
      const lastInteractionToMatch = !filters.lastInteractionTo || new Date(client.lastInteraction) <= new Date(filters.lastInteractionTo);

      return searchMatch && ownerMatch && stageMatch && industryMatch && countryMatch && statusMatch && tagsMatch && createdFromMatch && createdToMatch && lastInteractionFromMatch && lastInteractionToMatch;
    });

    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });

    return filtered;
  }, [clients, searchQuery, sortField, sortDirection, filters]);

  const paginatedClients = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredAndSortedClients.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredAndSortedClients, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedClients.length / rowsPerPage);

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead 
      className="cursor-pointer hover:bg-muted/50 select-none"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortField === field && (
          sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
        )}
      </div>
    </TableHead>
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
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

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead className="w-16"></TableHead>
                  <SortableHeader field="name">{t('clients.table.clientName')}</SortableHeader>
                  <SortableHeader field="industry">{t('clients.table.industry')}</SortableHeader>
                  <TableHead>{t('clients.table.tags')}</TableHead>
                  <SortableHeader field="stage">{t('clients.table.stage')}</SortableHeader>
                  <SortableHeader field="owner">{t('clients.table.owner')}</SortableHeader>
                  <SortableHeader field="country">{t('clients.table.location')}</SortableHeader>
                  <SortableHeader field="contactsCount">{t('clients.table.contacts')}</SortableHeader>
                  <SortableHeader field="totalDealValue">{t('clients.table.dealValue')}</SortableHeader>
                  <SortableHeader field="createdDate">{t('clients.table.created')}</SortableHeader>
                  <SortableHeader field="lastInteraction">{t('clients.table.lastInteraction')}</SortableHeader>
                  <SortableHeader field="status">{t('clients.table.status')}</SortableHeader>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedClients.map((client) => (
                  <TableRow 
                    key={client.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => onClientClick(client)}
                  >
                    <TableCell>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={client.avatar} />
                        <AvatarFallback className="text-xs">
                          {client.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.industry}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {client.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {client.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{client.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStageColor(client.stage)} text-white text-xs`}>
                        {client.stage}
                      </Badge>
                    </TableCell>
                    <TableCell>{client.owner}</TableCell>
                    <TableCell>{client.country}</TableCell>
                    <TableCell className="text-center">{client.contactsCount}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(client.totalDealValue)}</TableCell>
                    <TableCell>{new Date(client.createdDate).toLocaleDateString()}</TableCell>
                    <TableCell>{formatLastInteraction(client.lastInteraction)}</TableCell>
                    <TableCell>
                      <Badge variant={client.status === 'Active' ? 'default' : 'secondary'}>
                        {client.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{t('clients.table.rowsPerPage')}</span>
              <Select value={rowsPerPage.toString()} onValueChange={(value) => setRowsPerPage(Number(value))}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {t('clients.table.of', { 
                  start: ((currentPage - 1) * rowsPerPage) + 1, 
                  end: Math.min(currentPage * rowsPerPage, filteredAndSortedClients.length), 
                  total: filteredAndSortedClients.length 
                })}
              </span>
              <div className="flex gap-1">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={16} />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
