
import { Deal, DealStage } from '@/types/deal';
import { DealCard } from './DealCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { dealStages } from '@/data/mockDeals';

interface DealsBoardProps {
  deals: Deal[];
  onDealClick: (deal: Deal) => void;
  onDealEdit: (deal: Deal) => void;
  onDealDelete: (dealId: string) => void;
}

export function DealsBoard({ deals, onDealClick, onDealEdit, onDealDelete }: DealsBoardProps) {
  const getStageDeals = (stage: DealStage) => {
    return deals.filter(deal => deal.stage === stage);
  };

  const getStageValue = (stageDeals: Deal[]) => {
    return stageDeals.reduce((sum, deal) => sum + deal.value, 0);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
      {dealStages.map((stage) => {
        const stageDeals = getStageDeals(stage.name as DealStage);
        const stageValue = getStageValue(stageDeals);
        
        return (
          <Card key={stage.name} className={`${stage.color} min-h-[600px]`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{stage.name}</CardTitle>
                <Badge variant="secondary">{stageDeals.length}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {stageValue.toLocaleString()} MAD
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {stageDeals.map((deal) => (
                  <DealCard 
                    key={deal.id} 
                    deal={deal}
                    onClick={onDealClick}
                    onEdit={onDealEdit}
                    onDelete={onDealDelete}
                  />
                ))}
                {stageDeals.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No deals in this stage
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
