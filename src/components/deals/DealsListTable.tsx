
import { Deal } from '@/types/deal';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowUpDown, Calendar, DollarSign } from 'lucide-react';
import { useState } from 'react';

interface DealsListTableProps {
  deals: Deal[];
  onDealClick: (deal: Deal) => void;
}

type SortField = 'name' | 'value' | 'expectedCloseDate' | 'stage' | 'client';
type SortDirection = 'asc' | 'desc';

export function DealsListTable({ deals, onDealClick }: DealsListTableProps) {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedDeals = [...deals].sort((a, b) => {
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];

    if (sortField === 'value') {
      aValue = Number(aValue);
      bValue = Number(bValue);
    } else if (sortField === 'expectedCloseDate') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    } else {
      aValue = String(aValue).toLowerCase();
      bValue = String(bValue).toLowerCase();
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Discovery': return 'bg-gray-100 text-gray-800';
      case 'Qualified': return 'bg-blue-100 text-blue-800';
      case 'Proposal': return 'bg-yellow-100 text-yellow-800';
      case 'Negotiation': return 'bg-orange-100 text-orange-800';
      case 'Closed Won': return 'bg-green-100 text-green-800';
      case 'Closed Lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      onClick={() => handleSort(field)}
      className="h-auto p-0 font-medium hover:bg-transparent"
    >
      {children}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );

  if (deals.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-4">
          <DollarSign className="mx-auto h-12 w-12 mb-4 opacity-50" />
          <h3 className="text-lg font-medium">No deals found</h3>
          <p className="text-sm">Get started by creating your first deal.</p>
        </div>
        <Button>Add New Deal</Button>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <SortButton field="name">Deal Name</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="client">Client</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="value">Value</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="stage">Stage</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="expectedCloseDate">Close Date</SortButton>
            </TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Tags</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedDeals.map((deal) => (
            <TableRow
              key={deal.id}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => onDealClick(deal)}
            >
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <span className="font-semibold">{deal.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {deal.probability}% probability
                  </span>
                </div>
              </TableCell>
              <TableCell>{deal.client}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">
                    {deal.value.toLocaleString()} {deal.currency}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className={getStageColor(deal.stage)}>
                  {deal.stage}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {new Date(deal.expectedCloseDate).toLocaleDateString()}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {deal.owner.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{deal.owner}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{deal.source}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={getPriorityColor(deal.priority)}>
                  {deal.priority}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {deal.tags.slice(0, 2).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {deal.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{deal.tags.length - 2}
                    </Badge>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
