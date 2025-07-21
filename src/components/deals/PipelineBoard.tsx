import { Deal, DealStage, PipelineStage } from '@/types/deal';
import { PipelineColumn } from './PipelineColumn';
import { useState, useCallback, useMemo, memo } from 'react';
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

const MemoizedPipelineColumn = memo(PipelineColumn);

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

  // Memoize stage deals calculation
  const stageDealsMap = useMemo(() => {
    const map = new Map<DealStage, Deal[]>();
    stages.forEach(stage => {
      map.set(
        stage.name,
        deals.filter(deal => !deletingDeals.includes(deal.id) && deal.stage === stage.name)
      );
    });
    return map;
  }, [deals, deletingDeals, stages]);

  const handleDragStart = useCallback((deal: Deal) => {
    setDraggedDeal(deal);
    
    if (selectedDeals.includes(deal.id) && selectedDeals.length > 1) {
      const selectedDealObjects = deals.filter(d => selectedDeals.includes(d.id));
      setDraggedDeals(selectedDealObjects);
    } else {
      setDraggedDeals([deal]);
    }
  }, [deals, selectedDeals]);

  const handleDragEnd = useCallback(() => {
    setDraggedDeal(null);
    setDraggedDeals([]);
    setDragOverStage(null);
  }, []);

  const handleDragOver = useCallback((stage: DealStage) => {
    setDragOverStage(stage);
  }, []);

  const handleDrop = useCallback((stage: DealStage) => {
    if (draggedDeals.length > 0) {
      draggedDeals.forEach(deal => {
        if (deal.stage !== stage) {
          onDealMove(deal.id, stage);
        }
      });
      
      if (draggedDeals.length > 1) {
        toast({
          title: "Deals Moved",
          description: `${draggedDeals.length} deals moved to ${stage} stage.`,
        });
      }
    }
    
    handleDragEnd();
  }, [draggedDeals, onDealMove, toast, handleDragEnd]);

  const handleBulkAction = useCallback(async (action: string, dealsToUpdate: Deal[]) => {
    switch (action) {
      case 'delete':
        if (onBulkDelete && !isDeleting) {
          setIsDeleting(true);
          setDeletingDeals(prev => [...prev, ...dealsToUpdate.map(d => d.id)]);
          
          await new Promise(resolve => setTimeout(resolve, 300));
          
          try {
            await onBulkDelete(dealsToUpdate);
            setTimeout(() => {
              setDeletingDeals([]);
              setIsDeleting(false);
            }, 100);
          } catch (error) {
            setDeletingDeals([]);
            setIsDeleting(false);
            throw error;
          }
        }
        break;
      default:
        const newStage = action.replace('move_', '').toUpperCase() as DealStage;
        dealsToUpdate.forEach(deal => onDealMove(deal.id, newStage));
        toast({
          title: "Deals Moved",
          description: `${dealsToUpdate.length} deals moved to ${newStage} stage.`,
        });
    }
  }, [onBulkDelete, isDeleting, onDealMove, toast]);

  // Memoize column props to prevent unnecessary re-renders
  const getColumnProps = useCallback((stage: PipelineStage) => ({
    stage,
    deals: stageDealsMap.get(stage.name) || [],
    onDealClick,
    onAddDeal: () => onAddDeal(stage.name),
    onDragStart: handleDragStart,
    onDragEnd: handleDragEnd,
    onDragOver: () => handleDragOver(stage.name),
    onDrop: () => handleDrop(stage.name),
    isDropTarget: dragOverStage === stage.name,
    isDragging: !!draggedDeal,
    onBulkAction: handleBulkAction,
    onDealSelect,
    selectedDeals,
    draggedDealsCount: draggedDeals.length
  }), [
    stageDealsMap,
    onDealClick,
    onAddDeal,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
    dragOverStage,
    draggedDeal,
    handleBulkAction,
    onDealSelect,
    selectedDeals,
    draggedDeals.length
  ]);

  return (
    <div className="flex gap-6 overflow-x-auto pb-6 min-h-[calc(100vh-350px)] animate-fade-in custom-scrollbar">
      {stages.map((stage) => (
        <MemoizedPipelineColumn
            key={stage.id}
          {...getColumnProps(stage)}
          />
      ))}
    </div>
  );
}
