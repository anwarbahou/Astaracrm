import { Deal, DealStage, PipelineStage } from '@/types/deal';
import { PipelineColumn } from './PipelineColumn';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface PipelineBoardProps {
  deals: Deal[];
  stages: PipelineStage[];
  onDealMove: (dealId: string, newStage: DealStage) => void;
  onDealClick: (deal: Deal) => void;
  onAddDeal: (stage: DealStage) => void;
  onBulkDelete?: (deals: Deal[]) => void;
}

export function PipelineBoard({ 
  deals, 
  stages, 
  onDealMove, 
  onDealClick, 
  onAddDeal,
  onBulkDelete 
}: PipelineBoardProps) {
  const [draggedDeal, setDraggedDeal] = useState<Deal | null>(null);
  const [dragOverStage, setDragOverStage] = useState<DealStage | null>(null);
  const [deletingDeals, setDeletingDeals] = useState<string[]>([]);
  const { toast } = useToast();

  const getStageDeals = (stage: DealStage) => {
    return deals.filter(deal => !deletingDeals.includes(deal.id) && deal.stage === stage);
  };

  const handleDragStart = (deal: Deal) => {
    setDraggedDeal(deal);
  };

  const handleDragEnd = () => {
    setDraggedDeal(null);
    setDragOverStage(null);
  };

  const handleDragOver = (stage: DealStage) => {
    setDragOverStage(stage);
  };

  const handleDrop = (stage: DealStage) => {
    if (draggedDeal && draggedDeal.stage !== stage) {
      onDealMove(draggedDeal.id, stage);
    }
    setDraggedDeal(null);
    setDragOverStage(null);
  };

  const handleBulkAction = async (action: string, dealsToUpdate: Deal[]) => {
    switch (action) {
      case 'delete':
        if (onBulkDelete) {
          // Mark all deals as deleting
          setDeletingDeals(prev => [...prev, ...dealsToUpdate.map(d => d.id)]);
          
          // Wait for animation
          await new Promise(resolve => setTimeout(resolve, (dealsToUpdate.length + 1) * 100));
          
          // Actually delete the deals
          onBulkDelete(dealsToUpdate);
          
          // Clear deleting state
          setDeletingDeals([]);
          
          toast({
            title: "Deals Deleted",
            description: `${dealsToUpdate.length} deals have been deleted.`,
          });
        }
        break;
      case 'move_prospect':
        dealsToUpdate.forEach(deal => onDealMove(deal.id, 'Prospect'));
        toast({
          title: "Deals Moved",
          description: `${dealsToUpdate.length} deals moved to Prospect stage.`,
        });
        break;
      case 'move_lead':
        dealsToUpdate.forEach(deal => onDealMove(deal.id, 'Lead'));
        toast({
          title: "Deals Moved",
          description: `${dealsToUpdate.length} deals moved to Lead stage.`,
        });
        break;
      case 'move_qualified':
        dealsToUpdate.forEach(deal => onDealMove(deal.id, 'Qualified'));
        toast({
          title: "Deals Moved",
          description: `${dealsToUpdate.length} deals moved to Qualified stage.`,
        });
        break;
      case 'move_proposal':
        dealsToUpdate.forEach(deal => onDealMove(deal.id, 'Proposal'));
        toast({
          title: "Deals Moved",
          description: `${dealsToUpdate.length} deals moved to Proposal stage.`,
        });
        break;
      case 'move_negotiation':
        dealsToUpdate.forEach(deal => onDealMove(deal.id, 'Negotiation'));
        toast({
          title: "Deals Moved",
          description: `${dealsToUpdate.length} deals moved to Negotiation stage.`,
        });
        break;
      case 'move_won_lost':
        dealsToUpdate.forEach(deal => onDealMove(deal.id, 'Won/Lost'));
        toast({
          title: "Deals Moved",
          description: `${dealsToUpdate.length} deals moved to Won/Lost stage.`,
        });
        break;
    }
  };

  return (
    <div className="flex gap-6 overflow-x-auto pb-6 min-h-[calc(100vh-350px)] animate-fade-in">
      {stages.map((stage) => {
        const stageDeals = getStageDeals(stage.name);
        const isDropTarget = dragOverStage === stage.name;
        
        return (
          <PipelineColumn
            key={stage.id}
            stage={stage}
            deals={stageDeals}
            onDealClick={onDealClick}
            onAddDeal={() => onAddDeal(stage.name)}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={() => handleDragOver(stage.name)}
            onDrop={() => handleDrop(stage.name)}
            isDropTarget={isDropTarget}
            isDragging={!!draggedDeal}
            onBulkAction={handleBulkAction}
          />
        );
      })}
    </div>
  );
}
