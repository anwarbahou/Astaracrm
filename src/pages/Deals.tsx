import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Plus,
  Filter
} from "lucide-react";
import { Deal, DealFilters, DealStage } from '@/types/deal';
import { mockDeals, pipelineStages } from '@/data/mockDeals';
import { PipelineBoard } from '@/components/deals/PipelineBoard';
import { DealModal } from '@/components/deals/DealModal';
import { AddDealModal } from '@/components/deals/AddDealModal';
import { DealsFilterDropdown } from '@/components/deals/DealsFilterDropdown';
import { DealsViewToggle } from '@/components/deals/DealsViewToggle';
import { DealsListTable } from '@/components/deals/DealsListTable';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function Deals() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [deals, setDeals] = useState<Deal[]>(mockDeals);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [dealModalOpen, setDealModalOpen] = useState(false);
  const [addDealModalOpen, setAddDealModalOpen] = useState(false);
  const [addDealStage, setAddDealStage] = useState<DealStage>('Prospect');
  const [filters, setFilters] = useState<DealFilters>({
    stages: [],
    owners: [],
    valueRange: [0, 1000000],
    dateRange: { start: '', end: '' },
    sources: [],
    tags: [],
    search: ''
  });
  
  const { toast } = useToast();

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = 
      deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.owner.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStage = filters.stages.length === 0 || filters.stages.includes(deal.stage);
    const matchesOwner = filters.owners.length === 0 || filters.owners.includes(deal.owner);
    const matchesValue = deal.value >= filters.valueRange[0] && deal.value <= filters.valueRange[1];
    const matchesDate = (!filters.dateRange.start || deal.expectedCloseDate >= filters.dateRange.start) &&
                       (!filters.dateRange.end || deal.expectedCloseDate <= filters.dateRange.end);

    return matchesSearch && matchesStage && matchesOwner && matchesValue && matchesDate;
  });

  const totalValue = filteredDeals.reduce((sum, deal) => sum + deal.value, 0);
  const wonDeals = filteredDeals.filter(deal => deal.stage === "Won/Lost" && deal.probability === 100);

  const handleDealClick = (deal: Deal) => {
    setSelectedDeal(deal);
    setDealModalOpen(true);
  };

  const handleDealMove = (dealId: string, newStage: DealStage) => {
    setDeals(prev => prev.map(deal => 
      deal.id === dealId 
        ? { 
            ...deal, 
            stage: newStage,
            updatedAt: new Date().toISOString().split('T')[0]
          }
        : deal
    ));
    
    toast({
      title: t('deals.toasts.moved.title'),
      description: t('deals.toasts.moved.description', { stage: t(`deals.stages.${newStage.toLowerCase().replace('/', '-')}`) }),
    });
  };

  const handleDealSave = (updatedDeal: Deal) => {
    setDeals(prev => prev.map(deal => 
      deal.id === updatedDeal.id ? updatedDeal : deal
    ));
    
    toast({
      title: t('deals.toasts.updated.title'),
      description: t('deals.toasts.updated.description'),
    });
  };

  const handleDealDelete = (dealId: string) => {
    setDeals(prev => prev.filter(deal => deal.id !== dealId));
    
    toast({
      title: t('deals.toasts.deleted.title'),
      description: t('deals.toasts.deleted.description'),
    });
  };

  const handleAddDeal = (newDealData: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newDeal: Deal = {
      ...newDealData,
      stage: addDealStage,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setDeals(prev => [...prev, newDeal]);
    
    toast({
      title: t('deals.toasts.created.title'),
      description: t('deals.toasts.created.description', { stage: t(`deals.stages.${addDealStage.toLowerCase().replace('/', '-')}`) }),
    });
  };

  const handleOpenAddDeal = (stage: DealStage) => {
    setAddDealStage(stage);
    setAddDealModalOpen(true);
  };

  const handleFiltersChange = (newFilters: DealFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      stages: [],
      owners: [],
      valueRange: [0, 1000000],
      dateRange: { start: '', end: '' },
      sources: [],
      tags: [],
      search: ''
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('deals.title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('deals.description')}
          </p>
        </div>
        <div className="flex gap-3">
          <DealsViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          <Button onClick={() => handleOpenAddDeal('Prospect')} className="gap-2 crm-button-primary">
            <Plus size={16} />
            {t('deals.newDeal')}
          </Button>
        </div>
      </div>

      {/* Enhanced Search and Filters */}
      <Card className="crm-card">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={t('deals.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 crm-input"
              />
            </div>
            <DealsFilterDropdown
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="crm-card hover:shadow-lg transition-all duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('deals.stats.active')}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-foreground">{filteredDeals.length}</div>
            <div className="text-xs text-muted-foreground">{t('deals.stats.vsLastMonth', { change: '+12%' })}</div>
          </CardContent>
        </Card>

        <Card className="crm-card hover:shadow-lg transition-all duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('deals.stats.pipelineValue')}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-primary">{totalValue.toLocaleString()} MAD</div>
            <div className="text-xs text-muted-foreground">{t('deals.stats.vsLastMonth', { change: '+8%' })}</div>
          </CardContent>
        </Card>

        <Card className="crm-card hover:shadow-lg transition-all duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('deals.stats.won')}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-accent">{wonDeals.length}</div>
            <div className="text-xs text-muted-foreground">{t('deals.stats.vsLastMonth', { change: '+15%' })}</div>
          </CardContent>
        </Card>

        <Card className="crm-card hover:shadow-lg transition-all duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('deals.stats.avgSize')}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-foreground">
              {filteredDeals.length > 0 ? Math.round(totalValue / filteredDeals.length).toLocaleString() : 0} MAD
            </div>
            <div className="text-xs text-muted-foreground">{t('deals.stats.vsLastMonth', { change: '+5%' })}</div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Content */}
      {viewMode === "kanban" ? (
        <PipelineBoard
          deals={filteredDeals}
          stages={pipelineStages}
          onDealMove={handleDealMove}
          onDealClick={handleDealClick}
          onAddDeal={handleOpenAddDeal}
        />
      ) : (
        <Card className="crm-card">
          <CardContent className="p-6">
            <DealsListTable
              deals={filteredDeals}
              onDealClick={handleDealClick}
            />
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <DealModal
        deal={selectedDeal}
        open={dealModalOpen}
        onOpenChange={setDealModalOpen}
        onSave={handleDealSave}
        onDelete={handleDealDelete}
      />

      <AddDealModal
        open={addDealModalOpen}
        onOpenChange={setAddDealModalOpen}
        onSubmit={handleAddDeal}
      />
    </div>
  );
}
