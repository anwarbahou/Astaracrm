import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Search, 
  Filter,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  X,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/contexts/AuthContext';

export interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  company: string;
  tags: string[];
  country: string;
  status: "Active" | "Inactive";
  visibility: "Public" | "Private";
  createdDate: string;
  lastContacted: string;
  notes?: string;
  owner?: string;
  owner_id?: string;
}

export interface ContactFilters {
  company: string;
  role: string;
  country: string;
  status: string;
  tags: string[];
  dateCreatedFrom: string;
  dateCreatedTo: string;
  lastContactedFrom: string;
  lastContactedTo: string;
}

interface ContactsTableProps {
  contacts: Contact[];
  onContactClick: (contact: Contact) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: ContactFilters;
  onFiltersChange: (filters: ContactFilters) => void;
}

const FilterSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="space-y-2">
    <Label className="text-sm font-medium text-muted-foreground">{title}</Label>
    {children}
  </div>
);

const FiltersPopoverContent = ({ filters, onFiltersChange, onClose }: { filters: ContactFilters; onFiltersChange: (f: ContactFilters) => void; onClose: () => void }) => {
  const { t } = useTranslation();
  const [localFilters, setLocalFilters] = useState<ContactFilters>(filters);
  const [showMore, setShowMore] = useState({
    company: false,
    role: false,
    country: false,
  });

  const toggleShowMore = (section: keyof typeof showMore) => {
    setShowMore(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const companies = useMemo(() => ["Acme Corporation", "Tech Solutions Ltd", "Global Industries", "StartupXYZ", "Enterprise Corp", "Consulting Pro", "HealthCare Plus", "Retail Masters", "FinTech Solutions"], []);
  const roles = useMemo(() => ["CEO", "CTO", "Procurement Manager", "Founder", "VP Sales", "Senior Consultant", "IT Director", "Operations Manager", "Product Manager"], []);
  const countries = useMemo(() => ["Morocco", "France", "Spain", "USA", "UAE", "UK", "Germany", "Switzerland"], []);
  const statuses = useMemo(() => ["Active", "Inactive"], []);
  const availableTags = useMemo(() => ["Decision Maker", "VIP", "Technical", "Procurement", "Founder", "Startup", "Sales", "Consulting", "Healthcare", "Retail", "Operations", "Finance", "Product"], []);

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleClearFilters = () => {
    const emptyFilters: ContactFilters = {
      company: '',
      role: '',
      country: '',
      status: '',
      tags: [],
      dateCreatedFrom: '',
      dateCreatedTo: '',
      lastContactedFrom: '',
      lastContactedTo: '',
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
    <Card className="w-[380px] bg-card border-border text-card-foreground shadow-lg">
      <CardHeader className="border-b border-border p-4">
        <CardTitle className="flex items-center justify-between text-lg text-foreground">
          <span className="flex items-center gap-2">
            <Filter size={20} />
            {t('contacts.filtersPanel.title')}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground hover:bg-accent"
          >
            <X className="h-3 w-3 mr-1" />
            {t('contacts.filtersPanel.clearAll')}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-6 max-h-[calc(100vh-250px)] overflow-y-auto">
        <div className="grid grid-cols-1 gap-6">
          <FilterSection title={t('contacts.filtersPanel.company')}>
            <RadioGroup value={localFilters.company} onValueChange={(value) => setLocalFilters({ ...localFilters, company: value })}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="" id="company-all" />
                <Label htmlFor="company-all" className="cursor-pointer">{t('contacts.filtersPanel.allCompanies')}</Label>
              </div>
              {(showMore.company ? companies : companies.slice(0, 3)).map(company => (
                <div key={company} className="flex items-center space-x-2">
                  <RadioGroupItem value={company} id={`company-${company}`} />
                  <Label htmlFor={`company-${company}`} className="cursor-pointer">{company}</Label>
                </div>
              ))}
            </RadioGroup>
            {companies.length > 3 && (
              <Button variant="link" size="sm" onClick={() => toggleShowMore('company')} className="p-0 h-auto text-blue-400 hover:text-blue-500 mt-2 justify-start">
                {showMore.company ? t('common.showLess') : t('common.showMore')}
              </Button>
            )}
          </FilterSection>

          <FilterSection title={t('contacts.filtersPanel.role')}>
            <RadioGroup value={localFilters.role} onValueChange={(value) => setLocalFilters({ ...localFilters, role: value })}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="" id="role-all" />
                <Label htmlFor="role-all" className="cursor-pointer">{t('contacts.filtersPanel.allRoles')}</Label>
              </div>
              {(showMore.role ? roles : roles.slice(0, 3)).map(role => (
                <div key={role} className="flex items-center space-x-2">
                  <RadioGroupItem value={role} id={`role-${role}`} />
                  <Label htmlFor={`role-${role}`} className="cursor-pointer">{role}</Label>
                </div>
              ))}
            </RadioGroup>
            {roles.length > 3 && (
              <Button variant="link" size="sm" onClick={() => toggleShowMore('role')} className="p-0 h-auto text-blue-400 hover:text-blue-500 mt-2 justify-start">
                {showMore.role ? t('common.showLess') : t('common.showMore')}
              </Button>
            )}
          </FilterSection>

          <FilterSection title={t('contacts.filtersPanel.country')}>
            <RadioGroup value={localFilters.country} onValueChange={(value) => setLocalFilters({ ...localFilters, country: value })}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="" id="country-all" />
                <Label htmlFor="country-all" className="cursor-pointer">{t('contacts.filtersPanel.allCountries')}</Label>
              </div>
              {(showMore.country ? countries : countries.slice(0, 3)).map(country => (
                <div key={country} className="flex items-center space-x-2">
                  <RadioGroupItem value={country} id={`country-${country}`} />
                  <Label htmlFor={`country-${country}`} className="cursor-pointer">{country}</Label>
                </div>
              ))}
            </RadioGroup>
            {countries.length > 3 && (
              <Button variant="link" size="sm" onClick={() => toggleShowMore('country')} className="p-0 h-auto text-blue-400 hover:text-blue-500 mt-2 justify-start">
                {showMore.country ? t('common.showLess') : t('common.showMore')}
              </Button>
            )}
          </FilterSection>

          <FilterSection title={t('contacts.filtersPanel.status')}>
            <RadioGroup value={localFilters.status} onValueChange={(value) => setLocalFilters({ ...localFilters, status: value })}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="" id="status-all" />
                <Label htmlFor="status-all" className="cursor-pointer">{t('contacts.filtersPanel.allStatuses')}</Label>
              </div>
              {statuses.map(status => (
                <div key={status} className="flex items-center space-x-2">
                  <RadioGroupItem value={status} id={`status-${status}`} />
                  <Label htmlFor={`status-${status}`} className="cursor-pointer">{status}</Label>
                </div>
              ))}
            </RadioGroup>
          </FilterSection>

          <FilterSection title={t('contacts.filtersPanel.tags')}>
            <div className="space-y-2">
              <Select onValueChange={(value) => addTag(value)}>
                <SelectTrigger className="bg-input border-input">
                  <SelectValue placeholder={t('clients.filtersPanel.addTag')} />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border text-popover-foreground">
                  {availableTags.map(tag => (
                    <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {localFilters.tags.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {localFilters.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
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

          <FilterSection title={t('contacts.filtersPanel.createdDate')}>
             <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-muted-foreground">{t('contacts.filtersPanel.from')}</Label>
                <Input
                  type="date"
                  value={localFilters.dateCreatedFrom}
                  onChange={(e) => setLocalFilters({ ...localFilters, dateCreatedFrom: e.target.value })}
                  className="bg-input border-input"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">{t('contacts.filtersPanel.to')}</Label>
                <Input
                  type="date"
                  value={localFilters.dateCreatedTo}
                  onChange={(e) => setLocalFilters({ ...localFilters, dateCreatedTo: e.target.value })}
                  className="bg-input border-input"
                />
              </div>
            </div>
          </FilterSection>

          <FilterSection title={t('contacts.filtersPanel.lastContacted')}>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-muted-foreground">{t('contacts.filtersPanel.from')}</Label>
                <Input
                  type="date"
                  value={localFilters.lastContactedFrom}
                  onChange={(e) => setLocalFilters({ ...localFilters, lastContactedFrom: e.target.value })}
                  className="bg-input border-input"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">{t('contacts.filtersPanel.to')}</Label>
                <Input
                  type="date"
                  value={localFilters.lastContactedTo}
                  onChange={(e) => setLocalFilters({ ...localFilters, lastContactedTo: e.target.value })}
                  className="bg-input border-input"
                />
              </div>
            </div>
          </FilterSection>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 p-4 border-t border-border">
        <Button variant="outline" onClick={onClose}>
          {t('common.cancel')}
        </Button>
        <Button onClick={handleApplyFilters} className="bg-blue-600 hover:bg-blue-700">
          {t('clients.filtersPanel.apply')}
        </Button>
      </CardFooter>
    </Card>
  )
}


export function ContactsTable({ 
  contacts, 
  onContactClick, 
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
}: ContactsTableProps) {
  const { t } = useTranslation();
  const { isAdmin } = useAuth();
  const [sortField, setSortField] = useState<keyof Contact>('firstName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-500";
      case "Inactive": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getTagColor = (tag: string) => {
    switch (tag) {
      case "Decision Maker": return "bg-purple-100 text-purple-800";
      case "VIP": return "bg-yellow-100 text-yellow-800";
      case "Technical": return "bg-blue-100 text-blue-800";
      case "Founder": return "bg-green-100 text-green-800";
      case "Startup": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      const searchMatch =
        searchQuery === '' ||
        `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.role.toLowerCase().includes(searchQuery.toLowerCase());

      const companyMatch = !filters.company || contact.company === filters.company;
      const roleMatch = !filters.role || contact.role === filters.role;
      const countryMatch = !filters.country || contact.country === filters.country;
      const statusMatch = !filters.status || contact.status === filters.status;
      const tagsMatch = filters.tags.length === 0 || filters.tags.every(tag => contact.tags.includes(tag));
      const createdFromMatch = !filters.dateCreatedFrom || new Date(contact.createdDate) >= new Date(filters.dateCreatedFrom);
      const createdToMatch = !filters.dateCreatedTo || new Date(contact.createdDate) <= new Date(filters.dateCreatedTo);
      
      // Note: Filtering by 'last contacted' date is not implemented due to mock data format.
      const lastContactedFromMatch = true; 
      const lastContactedToMatch = true;

      return searchMatch && companyMatch && roleMatch && countryMatch && statusMatch && tagsMatch && createdFromMatch && createdToMatch && lastContactedFromMatch && lastContactedToMatch;
    });
  }, [contacts, searchQuery, filters]);

  // Sort contacts
  const sortedContacts = [...filteredContacts].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    return 0;
  });

  // Paginate contacts
  const totalPages = Math.ceil(sortedContacts.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedContacts = sortedContacts.slice(startIndex, startIndex + rowsPerPage);

  const handleSort = (field: keyof Contact) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t('contacts.table.title', { count: filteredContacts.length })}</CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={t('contacts.table.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
            <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter size={16} />
                  {t('contacts.table.filtersButton')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <FiltersPopoverContent filters={filters} onFiltersChange={onFiltersChange} onClose={() => setFiltersOpen(false)} />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('contacts.table.header.contact')}</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('role')}
                >
                  <div className="flex items-center gap-1">
                    {t('contacts.table.header.role')}
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                {isAdmin && (
                  <TableHead>{t('contacts.table.header.owner')}</TableHead>
                )}
                <TableHead>{t('contacts.table.header.contactInfo')}</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('company')}
                >
                  <div className="flex items-center gap-1">
                    {t('contacts.table.header.company')}
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>{t('contacts.table.header.tags')}</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('country')}
                >
                  <div className="flex items-center gap-1">
                    {t('contacts.table.header.location')}
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('createdDate')}
                >
                  <div className="flex items-center gap-1">
                    {t('contacts.table.header.created')}
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>{t('contacts.table.header.status')}</TableHead>
                <TableHead>{t('contacts.table.header.visibility')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedContacts.map((contact) => (
                <TableRow 
                  key={contact.id} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onContactClick(contact)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {contact.firstName[0]}{contact.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{contact.firstName} {contact.lastName}</p>
                        <p className="text-sm text-muted-foreground">{t('contacts.table.lastContacted', { value: contact.lastContacted })}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{contact.role}</p>
                  </TableCell>
                  {isAdmin && (
                    <TableCell>
                      <p className="text-sm text-muted-foreground">{contact.owner || 'Non assigné'}</p>
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm">{contact.email}</p>
                      <p className="text-sm text-muted-foreground">{contact.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{contact.company}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {contact.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="secondary" className={`${getTagColor(tag)} text-xs`}>
                          {tag}
                        </Badge>
                      ))}
                      {contact.tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{contact.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{contact.country}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{contact.createdDate}</p>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(contact.status)} text-white text-xs`}>
                      {contact.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {contact.visibility === 'Private' ? (
                      <span className="inline-flex items-center gap-1 text-xs"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c1.654 0 3-.895 3-2s-1.346-2-3-2-3 .895-3 2 .346 2 3 2z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 13c-4.971 0-9 2.239-9 5v2h18v-2c0-2.761-4.029-5-9-5z"/></svg>{t('visibility.private','Private')}</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 7.292"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 12a7.5 7.5 0 017.5 7.5H4.5A7.5 7.5 0 0112 12z"/></svg>{t('visibility.public','Public')}</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{t('contacts.table.pagination.rowsPerPage')}</span>
            <Select value={rowsPerPage.toString()} onValueChange={(value) => {
              setRowsPerPage(parseInt(value));
              setCurrentPage(1);
            }}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background border">
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {t('contacts.table.pagination.of', { start: startIndex + 1, end: Math.min(startIndex + rowsPerPage, filteredContacts.length), total: filteredContacts.length })}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
