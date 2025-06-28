import { Deal } from '@/types/deal';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, MoreVertical, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
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
  onSelect?: (deal: Deal) => void;
  isSelected?: boolean;
}

export function DealCard({ 
  deal, 
  onClick, 
  onDragStart, 
  onDragEnd,
  onEdit,
  onDelete,
  onMove,
  onSelect,
  isSelected = false
}: DealCardProps) {
  const { user, isAdmin } = useAuth();
  
  // Check if the current user is the owner of the deal
  const isOwner = user?.id === deal.ownerId;
  
  // Only allow edit/delete if user is admin or the owner of the deal
  const canEditDelete = isAdmin || isOwner;
  
  // Only show menu if user is admin or owner
  const showMenu = isAdmin || isOwner;

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
    e.stopPropagation();
    onClick(deal);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      onClick={handleClick}
      className={cn(
        "border rounded-lg p-4 cursor-pointer transition-all duration-200 group relative",
        isSelected 
          ? "bg-blue-600 border-blue-500 shadow-lg scale-[1.02] ring-2 ring-blue-400/50" 
          : "bg-gray-700 border-gray-600 hover:bg-gray-600 hover:shadow-lg hover:scale-[1.02]"
      )}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-2 left-2 bg-blue-500 rounded-full p-1">
          <Check className="h-3 w-3 text-white" />
        </div>
      )}

      {/* Only show menu for owners and admins */}
      {showMenu && (
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
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onSelect?.(deal);
              }}>
                {isSelected ? "Deselect" : "Select"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {canEditDelete && (
                <>
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(deal);
                  }}>
                    Edit Deal
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete?.(deal)} className="text-red-500">
                    Delete Deal
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
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
      )}

      <div className="space-y-3">
        {/* Deal Name */}
        <h4 className={cn(
          "font-semibold text-sm leading-tight transition-colors",
          isSelected ? "text-white" : "text-white group-hover:text-blue-300"
        )}>
          {deal.name}
        </h4>
        
        {/* Client */}
        <p className={cn(
          "text-sm",
          isSelected ? "text-blue-100" : "text-gray-300"
        )}>{deal.client}</p>
        
        {/* Value and Priority */}
        <div className="flex items-center justify-between">
          <span className={cn(
            "font-bold text-lg",
            isSelected ? "text-green-200" : "text-green-400"
          )}>
            {deal.value.toLocaleString()} {deal.currency}
          </span>
          <Badge className={cn("text-xs", getPriorityColor(deal.priority))}>
            {deal.priority}
          </Badge>
        </div>
        
        {/* Probability Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className={cn(
              isSelected ? "text-blue-100" : "text-gray-400"
            )}>Probability</span>
            <span className={cn(
              isSelected ? "text-blue-100" : "text-gray-400"
            )}>{deal.probability}%</span>
          </div>
          <div className="h-1.5 bg-gray-600 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full transition-all",
                isSelected ? "bg-blue-300" : "bg-blue-500"
              )}
              style={{ width: `${deal.probability}%` }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          {/* Owner Avatar */}
          <div className="flex items-center gap-2">
            {deal.ownerAvatar ? (
              <img 
                src={deal.ownerAvatar} 
                alt={deal.owner}
                className="h-6 w-6 rounded-full"
              />
            ) : (
              <User className="h-4 w-4" />
            )}
          </div>
          
          {/* Due Date */}
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{deal.expectedCloseDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
