import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChevronUp, ChevronDown, Calendar, MapPin, Users, DollarSign } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Client } from '@/types/client';

type SortField = keyof Client;

interface ClientsTableContentProps {
  clients: Client[];
  onClientClick: (client: Client) => void;
  sortField: SortField;
  sortDirection: 'asc' | 'desc';
  onSort: (field: SortField) => void;
}

const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Lead': return 'bg-yellow-500';
      case 'Active': return 'bg-green-500';
      case 'Inactive': return 'bg-red-500';
      case 'Prospect': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
    }).format(amount);
};

export function ClientsTableContent({
  clients,
  onClientClick,
  sortField,
  sortDirection,
  onSort,
}: ClientsTableContentProps) {
  const { t, i18n } = useTranslation();
  
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

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead 
      className="cursor-pointer hover:bg-muted/50 select-none"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortField === field && (
          sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
        )}
      </div>
    </TableHead>
  );

  // Mobile Card View Component
  const MobileClientCard = ({ client }: { client: Client }) => (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow duration-200 mb-3"
      onClick={() => onClientClick(client)}
    >
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start justify-between mb-2 sm:mb-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-sm sm:text-base truncate">{client.name}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">{client.industry}</p>
            </div>
          </div>
          <Badge className={`${getStageColor(client.stage)} text-white text-xs flex-shrink-0`}>
            {client.stage}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm">
          <div className="flex items-center gap-1 sm:gap-2">
            <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground truncate">{client.country}</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Users className="h-3 w-3 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground">{client.contactsCount}</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <DollarSign className="h-3 w-3 text-muted-foreground flex-shrink-0" />
            <span className="font-medium truncate">{formatCurrency(client.totalDealValue)}</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Calendar className="h-3 w-3 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground truncate">{formatLastInteraction(client.lastInteraction)}</span>
          </div>
        </div>

        {client.tags.length > 0 && (
          <div className="flex gap-1 flex-wrap mt-2 sm:mt-3">
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
        )}
      </CardContent>
    </Card>
  );

  return (
    <>
      {/* Mobile View - Card Layout */}
      <div className="md:hidden">
        {clients.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t('clients.table.noClients')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {clients.map((client) => (
              <MobileClientCard key={client.id} client={client} />
            ))}
          </div>
        )}
      </div>

      {/* Desktop View - Table Layout */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
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
            {clients.map((client) => (
              <TableRow 
                key={client.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => onClientClick(client)}
              >
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
    </>
  );
}
