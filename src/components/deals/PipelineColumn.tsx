
import { Deal, PipelineStage } from '@/types/deal';
import { DealCard } from './DealCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PipelineColumnProps {
  stage: PipelineStage;
  deals: Deal[];
  onDealClick: (deal: Deal) => void;
  onAddDeal: () => void;
  onDragStart: (deal: Deal) => void;
  onDragEnd: () => void;
  onDragOver: () => void;
  onDrop: () => void;
  isDropTarget: boolean;
  isDragging: boolean;
}

export function PipelineColumn({
  stage,
  deals,
  onDealClick,
  onAddDeal,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  isDropTarget,
  isDragging
}: PipelineColumnProps) {
  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    onDragOver();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop();
  };

  return (
    <div 
      className={cn(
        "bg-gray-800 rounded-xl p-4 min-w-[320px] max-w-[320px] flex flex-col border-2 transition-all duration-200",
        isDropTarget && isDragging 
          ? "border-blue-400 bg-gray-700 shadow-lg" 
          : "border-gray-700"
      )}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn("w-3 h-3 rounded-full", stage.color.replace('bg-', 'bg-').replace('-100', '-400'))} />
          <h3 className="font-bold text-white text-lg">{stage.name}</h3>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-400 hover:text-white">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <Badge variant="secondary" className="bg-gray-700 text-gray-300">
          {deals.length}
        </Badge>
      </div>

      {/* Stage Stats */}
      <div className="mb-4 text-sm text-gray-400">
        {totalValue.toLocaleString()} MAD
      </div>

      {/* Drop Zone Indicator */}
      {isDropTarget && isDragging && (
        <div className="border-2 border-dashed border-blue-400 bg-blue-900/20 rounded-lg p-4 mb-4 text-center text-blue-300">
          Drop deal here
        </div>
      )}

      {/* Deals List */}
      <div className="flex-1 space-y-3 overflow-y-auto">
        {deals.map((deal) => (
          <DealCard
            key={deal.id}
            deal={deal}
            onClick={onDealClick}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        ))}
        
        {deals.length === 0 && !isDropTarget && (
          <div className="text-center py-8 text-gray-500 text-sm">
            No deals in this stage
          </div>
        )}
      </div>

      {/* Add Deal Button */}
      <Button 
        variant="outline" 
        onClick={onAddDeal}
        className="mt-4 w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Deal
      </Button>
    </div>
  );
}
