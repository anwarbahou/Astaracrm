
import { Deal, DealStage, PipelineStage } from '@/types/deal';
import { PipelineColumn } from './PipelineColumn';
import { useState } from 'react';

interface PipelineBoardProps {
  deals: Deal[];
  stages: PipelineStage[];
  onDealMove: (dealId: string, newStage: DealStage) => void;
  onDealClick: (deal: Deal) => void;
  onAddDeal: (stage: DealStage) => void;
}

export function PipelineBoard({ deals, stages, onDealMove, onDealClick, onAddDeal }: PipelineBoardProps) {
  const [draggedDeal, setDraggedDeal] = useState<Deal | null>(null);
  const [dragOverStage, setDragOverStage] = useState<DealStage | null>(null);

  const getStageDeals = (stage: DealStage) => {
    return deals.filter(deal => deal.stage === stage);
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
          />
        );
      })}
    </div>
  );
}
