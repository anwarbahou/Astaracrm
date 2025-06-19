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
  onDealSelect?: (deal: Deal, event: React.MouseEvent) => void;
  selectedDeals?: string[];
}

export function PipelineBoard({ 
  deals, 
  stages, 
  onDealMove, 
  onDealClick, 
  onAddDeal,
  onBulkDelete,
  onDealSelect,
  selectedDeals = []
}: PipelineBoardProps) {
  const [draggedDeal, setDraggedDeal] = useState<Deal | null>(null);
  const [draggedDeals, setDraggedDeals] = useState<Deal[]>([]);
  const [dragOverStage, setDragOverStage] = useState<DealStage | null>(null);
  const [deletingDeals, setDeletingDeals] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const getStageDeals = (stage: DealStage) => {
    return deals.filter(deal => !deletingDeals.includes(deal.id) && deal.stage === stage);
  };

  const handleDragStart = (deal: Deal) => {
    setDraggedDeal(deal);
    
    // If the dragged deal is selected and there are multiple selected deals, drag all selected
    if (selectedDeals.includes(deal.id) && selectedDeals.length > 1) {
      const selectedDealObjects = deals.filter(d => selectedDeals.includes(d.id));
      setDraggedDeals(selectedDealObjects);
    } else {
      // Only drag the single deal
      setDraggedDeals([deal]);
    }
  };

  const handleDragEnd = () => {
    setDraggedDeal(null);
    setDraggedDeals([]);
    setDragOverStage(null);
  };

  const handleDragOver = (stage: DealStage) => {
    setDragOverStage(stage);
  };

  const handleDrop = (stage: DealStage) => {
    if (draggedDeals.length > 0) {
      // Move all dragged deals to the new stage
      draggedDeals.forEach(deal => {
        if (deal.stage !== stage) {
          onDealMove(deal.id, stage);
        }
      });
      
      // Show appropriate toast message
      if (draggedDeals.length > 1) {
        toast({
          title: "Deals Moved",
          description: `${draggedDeals.length} deals moved to ${stage} stage.`,
        });
      }
    }
    
    setDraggedDeal(null);
    setDraggedDeals([]);
    setDragOverStage(null);
  };

  const handleBulkAction = async (action: string, dealsToUpdate: Deal[]) => {
    switch (action) {
      case 'delete':
        if (onBulkDelete && !isDeleting) {
          setIsDeleting(true);
          
          // Mark all deals as deleting to start animation
          setDeletingDeals(prev => [...prev, ...dealsToUpdate.map(d => d.id)]);
          
          // Wait for animation to complete
          await new Promise(resolve => setTimeout(resolve, 300));
          
          try {
            // Actually delete the deals (this will show the toast)
            await onBulkDelete(dealsToUpdate);
            
            // Keep the deleting state until the data has been refetched
            // This prevents the cards from reappearing during the refetch
            setTimeout(() => {
              setDeletingDeals([]);
              setIsDeleting(false);
            }, 100);
            
          } catch (error) {
            // If deletion fails, restore the deals
            setDeletingDeals([]);
            setIsDeleting(false);
            throw error;
          }
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
            onDealSelect={onDealSelect}
            selectedDeals={selectedDeals}
            draggedDealsCount={draggedDeals.length}
          />
        );
      })}
    </div>
  );
}
