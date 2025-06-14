
import { Deal, PipelineStage } from '@/types/deal';
import { DealCard } from './DealCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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

  const getStageColor = (stageName: string) => {
    switch (stageName) {
      case 'Prospect': return 'bg-purple-500';
      case 'Lead': return 'bg-blue-500';
      case 'Qualified': return 'bg-yellow-500';
      case 'Negotiation': return 'bg-orange-500';
      case 'Won/Lost': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card 
      className={cn(
        "min-w-[320px] max-w-[320px] flex flex-col transition-all duration-200 crm-surface",
        isDropTarget && isDragging 
          ? "ring-2 ring-primary shadow-lg scale-[1.02]" 
          : "hover:shadow-md"
      )}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Enhanced Column Header */}
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("w-3 h-3 rounded-full", getStageColor(stage.name))} />
            <h3 className="font-semibold text-foreground text-base">{stage.name}</h3>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-muted text-muted-foreground">
              {deals.length}
            </Badge>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground hover:bg-muted/50"
              onClick={onAddDeal}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stage Value */}
        <div className="text-sm font-medium text-primary">
          {totalValue.toLocaleString()} MAD
        </div>
      </CardHeader>

      {/* Drop Zone Indicator */}
      {isDropTarget && isDragging && (
        <div className="mx-4 mb-4 border-2 border-dashed border-primary bg-primary/10 rounded-lg p-4 text-center text-primary animate-pulse">
          <Plus className="h-6 w-6 mx-auto mb-2" />
          Drop deal here
        </div>
      )}

      {/* Enhanced Deals List */}
      <CardContent className="flex-1 pt-0">
        <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto">
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
            <div className="text-center py-12 text-muted-foreground">
              <div className="text-4xl mb-2">📋</div>
              <p className="text-sm">No deals in this stage</p>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onAddDeal}
                className="mt-2 text-xs hover:bg-muted/50"
              >
                Add your first deal
              </Button>
            </div>
          )}
        </div>

        {/* Enhanced Add Deal Button */}
        {deals.length > 0 && (
          <Button 
            variant="outline" 
            onClick={onAddDeal}
            className="mt-4 w-full crm-button-secondary hover:bg-muted/50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Deal
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
