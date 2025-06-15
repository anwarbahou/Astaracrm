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
import { Card, CardContent } from "@/components/ui/card";
import {
  ChevronUp,
  ChevronDown,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

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

interface ClientsTableProps {
  clients: Client[];
  onClientClick: (client: Client) => void;
  onFiltersToggle: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

type SortField = keyof Client;
type SortDirection = 'asc' | 'desc';

export function ClientsTable({ 
  clients, 
  onClientClick, 
  onFiltersToggle, 
  searchQuery, 
  onSearchChange 
}: ClientsTableProps) {
  const { t, i18n } = useTranslation();
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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
    let filtered = clients.filter(client =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.owner.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
  }, [clients, searchQuery, sortField, sortDirection]);

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
            <Button variant="outline" onClick={onFiltersToggle} className="gap-2">
              <Filter size={16} />
              {t('clients.table.filters')}
            </Button>
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
