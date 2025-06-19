import { Deal, PipelineStage } from '@/types/deal';
import { DealCard } from './DealCard';
import { Button } from '@/components/ui/button';
import { Plus, MoreVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  onBulkAction?: (action: string, deals: Deal[]) => void;
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
  isDragging,
  onBulkAction
}: PipelineColumnProps) {
  const { t } = useTranslation();
  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    onDragOver();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('text/plain');
    if (dealId) {
      onDrop();
    }
  };

  const getStageColor = (stageName: string) => {
    switch (stageName) {
      case 'Prospect': return 'bg-purple-500';
      case 'Lead': return 'bg-blue-500';
      case 'Qualified': return 'bg-yellow-500';
      case 'Proposal': return 'bg-orange-500';
      case 'Negotiation': return 'bg-red-500';
      case 'Won/Lost': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const handleBulkAction = (action: string, dealsToUpdate: Deal[] = deals) => {
    if (onBulkAction && dealsToUpdate.length > 0) {
      onBulkAction(action, dealsToUpdate);
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
            <h3 className="font-semibold text-foreground text-base">{t(`deals.stages.${stage.name.toLowerCase().replace('/', '-')}`)}</h3>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-muted text-muted-foreground">
              {deals.length}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleBulkAction('delete', deals)}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    Delete All
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction('move_prospect', deals)}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    Move to Prospect
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction('move_lead', deals)}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    Move to Lead
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction('move_qualified', deals)}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    Move to Qualified
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction('move_proposal', deals)}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                    Move to Proposal
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction('move_negotiation', deals)}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                    Move to Negotiation
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction('move_won_lost', deals)}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    Move to Won/Lost
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
          {t('deals.pipeline.dropDeal')}
        </div>
      )}

      {/* Enhanced Deals List */}
      <CardContent className="flex-1 pt-0 overflow-hidden">
        <div className="space-y-3 h-[calc(100vh-400px)] overflow-y-auto pr-2">
          <AnimatePresence mode="sync">
            {deals.map((deal, index) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 1, x: 0, height: "auto" }}
                exit={{
                  opacity: 0,
                  x: -50,
                  height: 0,
                  marginTop: 0,
                  marginBottom: 0,
                  transition: {
                    opacity: { duration: 0.2, delay: index * 0.1 },
                    x: { duration: 0.2, delay: index * 0.1 },
                    height: { duration: 0.2, delay: index * 0.1 },
                    marginTop: { duration: 0.2, delay: index * 0.1 },
                    marginBottom: { duration: 0.2, delay: index * 0.1 }
                  }
                }}
              >
                <DealCard
                  deal={deal}
                  onClick={onDealClick}
                  onDragStart={onDragStart}
                  onDragEnd={onDragEnd}
                  onEdit={onDealClick}
                  onDelete={(deal) => handleBulkAction('delete', [deal])}
                  onMove={(deal, newStage) => handleBulkAction(`move_${newStage.toLowerCase()}`, [deal])}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          
          {deals.length === 0 && (
            <div 
              className={cn(
                "text-center py-12 text-muted-foreground min-h-[200px] flex flex-col items-center justify-center transition-all duration-200",
                isDropTarget && isDragging && "border-2 border-dashed border-primary bg-primary/10 text-primary"
              )}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="text-4xl mb-2">📋</div>
              <p className="text-sm">{t('deals.pipeline.noDeals')}</p>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onAddDeal}
                className="mt-2 text-xs hover:bg-muted/50"
              >
                {t('deals.pipeline.addFirstDeal')}
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
            {t('deals.pipeline.addDeal')}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
