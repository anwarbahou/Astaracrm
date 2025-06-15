
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronUp, ChevronDown } from 'lucide-react';
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

  return (
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
          {clients.map((client) => (
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
  );
}
