import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { 
  Search, 
  Plus,
  Filter,
  Upload
} from "lucide-react";
import { Deal, DealFilters, DealStage } from '@/types/deal';
import { mockDeals, pipelineStages } from '@/data/mockDeals';
import { PipelineBoard } from '@/components/deals/PipelineBoard';
import { DealModal } from '@/components/deals/DealModal';
import { AddDealModal } from '@/components/deals/AddDealModal';
import { ImportDealsModal } from '@/components/deals/ImportDealsModal';
import { DealsFilterDropdown } from '@/components/deals/DealsFilterDropdown';
import { DealsViewToggle } from '@/components/deals/DealsViewToggle';
import { DealsListTable } from '@/components/deals/DealsListTable';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useDeals } from "@/hooks/useDeals";

export default function Deals() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [dealModalOpen, setDealModalOpen] = useState(false);
  const [addDealModalOpen, setAddDealModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
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
  
  // Try to use backend data, fallback to mock data if deals table doesn't exist
  const { 
    deals: backendDeals, 
    isLoading: isLoadingDeals, 
    error: dealsError,
    createDeal, 
    createDealAsync,
    updateDeal, 
    deleteDeal
  } = useDeals();
  
  // Use backend deals if available, otherwise fallback to mock data
  const [localMockDeals, setLocalMockDeals] = useState<Deal[]>(mockDeals);
  const deals = dealsError ? localMockDeals : (backendDeals || []);
  const isUsingMockData = !!dealsError;

  const queryClient = useQueryClient();

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
    if (isUsingMockData) {
      setLocalMockDeals(prev => prev.map(deal => 
        deal.id === dealId 
          ? { 
              ...deal, 
              stage: newStage,
              updatedAt: new Date().toISOString().split('T')[0]
            }
          : deal
      ));
    } else {
      // Find the deal and update it
      const dealToUpdate = deals.find(deal => deal.id === dealId);
      if (dealToUpdate) {
        updateDeal({ ...dealToUpdate, stage: newStage });
      }
    }
    
    toast({
      title: t('deals.toasts.moved.title'),
      description: t('deals.toasts.moved.description', { stage: t(`deals.stages.${newStage.toLowerCase().replace('/', '-')}`) }),
    });
  };

  const handleDealSave = (updatedDeal: Deal) => {
    if (isUsingMockData) {
      setLocalMockDeals(prev => prev.map(deal => 
        deal.id === updatedDeal.id ? updatedDeal : deal
      ));
      
      toast({
        title: t('deals.toasts.updated.title'),
        description: t('deals.toasts.updated.description'),
      });
    } else {
      updateDeal(updatedDeal);
    }
  };

  const handleDealDelete = (dealId: string) => {
    if (isUsingMockData) {
      setLocalMockDeals(prev => prev.filter(deal => deal.id !== dealId));
      
      toast({
        title: t('deals.toasts.deleted.title'),
        description: t('deals.toasts.deleted.description'),
      });
    } else {
      deleteDeal(dealId);
    }
  };

  const handleAddDeal = (newDealData: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (isUsingMockData) {
      const newDeal: Deal = {
        ...newDealData,
        stage: addDealStage,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setLocalMockDeals(prev => [...prev, newDeal]);
      
      toast({
        title: t('deals.toasts.created.title'),
        description: t('deals.toasts.created.description', { stage: t(`deals.stages.${addDealStage.toLowerCase().replace('/', '-')}`) }),
      });
    } else {
      createDeal({ ...newDealData, stage: addDealStage });
    }
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

  const handleImportDeals = async (dealsToImport: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>[]) => {
    if (isUsingMockData) {
      const newDeals = dealsToImport.map(deal => ({
        ...deal,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      }));
      setLocalMockDeals(prev => [...prev, ...newDeals]);
      
      toast({
        title: t('deals.toasts.imported.title'),
        description: t('deals.toasts.imported.description', { count: dealsToImport.length }),
      });
    } else {
      // Import deals one by one to handle potential errors
      try {
        for (const deal of dealsToImport) {
          await createDealAsync(deal);
        }
        
        toast({
          title: 'Success',
          description: `${dealsToImport.length} deals imported successfully`,
        });
      } catch (error) {
        console.error('Error importing deals:', error);
        toast({
          title: 'Error',
          description: 'Failed to import some deals. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleBulkDelete = async (dealsToDelete: Deal[]) => {
    try {
      // Delete each deal
      await Promise.all(dealsToDelete.map(deal => deleteDeal(deal.id)));
      
      // Refresh the deals list
      await queryClient.invalidateQueries({ queryKey: ['deals'] });
      
      toast({
        title: "Success",
        description: `${dealsToDelete.length} deals have been deleted.`,
      });
    } catch (error) {
      console.error('Error deleting deals:', error);
      toast({
        title: "Error",
        description: "Failed to delete deals. Please try again.",
        variant: "destructive",
      });
    }
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
          <Button variant="outline" onClick={() => setImportModalOpen(true)} className="gap-2">
            <Upload size={16} />
            {t('deals.import.button', 'Import')}
          </Button>
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
          onBulkDelete={handleBulkDelete}
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

      <ImportDealsModal
        open={importModalOpen}
        onOpenChange={setImportModalOpen}
        onImport={handleImportDeals}
      />
    </div>
  );
}
