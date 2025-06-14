
import { Deal } from '@/types/deal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign, User, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DealCardProps {
  deal: Deal;
  onClick: (deal: Deal) => void;
  onEdit: (deal: Deal) => void;
  onDelete: (dealId: string) => void;
}

export function DealCard({ deal, onClick, onEdit, onDelete }: DealCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick(deal);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(deal);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(deal.id);
  };

  return (
    <div 
      className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h4 className="font-medium text-sm leading-tight">{deal.name}</h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEdit}>Edit Deal</DropdownMenuItem>
              <DropdownMenuItem>Add Note</DropdownMenuItem>
              <DropdownMenuItem>Schedule Follow-up</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{deal.client}</p>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-lg">
              {deal.value.toLocaleString()} {deal.currency}
            </span>
            <Badge variant="secondary" className={getPriorityColor(deal.priority)}>
              {deal.priority}
            </Badge>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Probability</span>
            <span>{deal.probability}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all" 
              style={{ width: `${deal.probability}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{new Date(deal.expectedCloseDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span className="truncate">{deal.owner}</span>
          </div>
        </div>

        {deal.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {deal.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
