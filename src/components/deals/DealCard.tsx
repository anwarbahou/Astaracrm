import { Deal } from '@/types/deal';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface DealCardProps {
  deal: Deal;
  onClick: (deal: Deal) => void;
  onDragStart: (deal: Deal) => void;
  onDragEnd: () => void;
  onEdit?: (deal: Deal) => void;
  onDelete?: (deal: Deal) => void;
  onMove?: (deal: Deal, stage: string) => void;
}

export function DealCard({ 
  deal, 
  onClick, 
  onDragStart, 
  onDragEnd,
  onEdit,
  onDelete,
  onMove 
}: DealCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', deal.id);
    e.dataTransfer.effectAllowed = 'move';
    onDragStart(deal);
  };

  const handleClick = (e: React.MouseEvent) => {
    // Prevent click when clicking dropdown
    if ((e.target as HTMLElement).closest('.deal-menu-trigger')) {
      return;
    }
    onClick(deal);
  };

  return (
    <div 
      className="bg-gray-700 border border-gray-600 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:bg-gray-600 hover:shadow-lg hover:scale-[1.02] group relative"
      onClick={handleClick}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="absolute top-2 right-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-gray-600 deal-menu-trigger"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => onEdit?.(deal)}>
              Edit Deal
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete?.(deal)} className="text-red-500">
              Delete Deal
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              onMove?.(deal, 'Prospect');
            }}>
              Move to Prospect
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              onMove?.(deal, 'Lead');
            }}>
              Move to Lead
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              onMove?.(deal, 'Qualified');
            }}>
              Move to Qualified
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              onMove?.(deal, 'Proposal');
            }}>
              Move to Proposal
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              onMove?.(deal, 'Negotiation');
            }}>
              Move to Negotiation
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              onMove?.(deal, 'Won/Lost');
            }}>
              Move to Won/Lost
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-3">
        {/* Deal Name */}
        <h4 className="font-semibold text-white text-sm leading-tight group-hover:text-blue-300 transition-colors">
          {deal.name}
        </h4>
        
        {/* Client */}
        <p className="text-gray-300 text-sm">{deal.client}</p>
        
        {/* Value and Priority */}
        <div className="flex items-center justify-between">
          <span className="font-bold text-green-400 text-lg">
            {deal.value.toLocaleString()} {deal.currency}
          </span>
          <Badge className={cn("text-xs", getPriorityColor(deal.priority))}>
            {deal.priority}
          </Badge>
        </div>
        
        {/* Probability Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Probability</span>
            <span className="text-gray-300">{deal.probability}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${deal.probability}%` }}
            />
          </div>
        </div>
        
        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{new Date(deal.expectedCloseDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span className="truncate max-w-[80px]">{deal.owner}</span>
          </div>
        </div>

        {/* Tags */}
        {deal.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {deal.tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs bg-gray-800 text-gray-300 border-gray-600">
                {tag}
              </Badge>
            ))}
            {deal.tags.length > 2 && (
              <Badge variant="outline" className="text-xs bg-gray-800 text-gray-300 border-gray-600">
                +{deal.tags.length - 2}
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
