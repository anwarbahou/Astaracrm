import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { 
  Search, 
  Plus,
  Filter,
  Upload,
  X,
  Trash2,
  Users,
  ArrowRight,
  AlertCircle
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Deals() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [dealModalOpen, setDealModalOpen] = useState(false);
  const [addDealModalOpen, setAddDealModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [addDealStage, setAddDealStage] = useState<DealStage>('Prospect');
  const [selectedDeals, setSelectedDeals] = useState<string[]>([]);
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null);
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
    createDealsSilent,
    createDealsWithBulkNotification,
    updateDeal, 
    deleteDeal,
    deleteDealsSilent
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
              updated_at: new Date().toISOString()
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

  const handleAddDeal = (newDealData: Omit<Deal, 'id' | 'created_at' | 'updated_at'>) => {
    if (isUsingMockData) {
      const newDeal: Deal = {
        ...newDealData,
        stage: addDealStage,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
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

  const handleImportDeals = async (dealsToImport: Omit<Deal, 'id' | 'created_at' | 'updated_at'>[]) => {
    if (isUsingMockData) {
      const newDeals = dealsToImport.map(deal => ({
        ...deal,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));
      setLocalMockDeals(prev => [...prev, ...newDeals]);
      
      toast({
        title: t('deals.toasts.imported.title'),
        description: t('deals.toasts.imported.description', { count: newDeals.length }),
      });

    } else {
      try {
        // Calculate total value for bulk notification
        const totalValue = dealsToImport.reduce((sum, deal) => sum + (deal.value || 0), 0);
        await createDealsWithBulkNotification(dealsToImport, totalValue);
        toast({
          title: t('deals.toasts.imported.title'),
          description: t('deals.toasts.imported.description', { count: dealsToImport.length }),
        });
      } catch (error) {
        console.error("Error importing deals:", error);
        toast({
          title: t('deals.toasts.importError.title'),
          description: t('deals.toasts.importError.description', { error: error instanceof Error ? error.message : 'Unknown error' }),
          variant: 'destructive'
        });
      }
    }
  };

  const handleClearSelected = () => {
    setSelectedDeals([]);
  };

  const handleBulkDelete = async (dealsToDelete: Deal[]) => {
    if (isUsingMockData) {
      setLocalMockDeals(prev => prev.filter(deal => !dealsToDelete.some(d => d.id === deal.id)));
      toast({
        title: t('deals.toasts.bulkDeleted.title'),
        description: t('deals.toasts.bulkDeleted.description', { count: dealsToDelete.length }),
      });
    } else {
      try {
        await deleteDealsSilent(dealsToDelete.map(d => d.id));
        toast({
          title: t('deals.toasts.bulkDeleted.title'),
          description: t('deals.toasts.bulkDeleted.description', { count: dealsToDelete.length }),
        });
      } catch (error) {
        console.error("Error bulk deleting deals:", error);
        toast({
          title: t('deals.toasts.bulkDeleteError.title'),
          description: t('deals.toasts.bulkDeleteError.description', { error: error instanceof Error ? error.message : 'Unknown error' }),
          variant: 'destructive'
        });
      }
    }
    setSelectedDeals([]);
  };

  const handleDealSelect = (deal: Deal, event: React.MouseEvent) => {
    if (event.shiftKey && lastSelectedIndex !== null) {
      const allDealIds = filteredDeals.map(d => d.id);
      const currentIndex = allDealIds.indexOf(deal.id);
      const start = Math.min(lastSelectedIndex, currentIndex);
      const end = Math.max(lastSelectedIndex, currentIndex);
      const dealsInRange = allDealIds.slice(start, end + 1);

      setSelectedDeals(prev => {
        const newSelection = new Set(prev);
        dealsInRange.forEach(id => {
          if (prev.includes(id)) {
            newSelection.delete(id);
          } else {
            newSelection.add(id);
          }
        });
        return Array.from(newSelection);
      });
    } else {
      setSelectedDeals(prev => 
        prev.includes(deal.id)
          ? prev.filter(id => id !== deal.id)
          : [...prev, deal.id]
      );
    }
    setLastSelectedIndex(filteredDeals.findIndex(d => d.id === deal.id));
  };

  const clearSelection = () => {
    setSelectedDeals([]);
  };

  const handleBulkAction = (action: string) => {
    const dealsToActOn = deals.filter(deal => selectedDeals.includes(deal.id));

    if (action === 'delete') {
      handleBulkDelete(dealsToActOn);
    } else if (action === 'export') {
      const json = JSON.stringify(dealsToActOn, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'selected_deals.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({
        title: t('deals.toasts.exported.title'),
        description: t('deals.toasts.exported.description', { count: dealsToActOn.length }),
      });
    }
  };

  const getSelectedDealsData = () => {
    return deals.filter(deal => selectedDeals.includes(deal.id));
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 sm:p-6 lg:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{t('deals.title')}</h1>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              onClick={() => handleOpenAddDeal('Prospect')}
              className="w-full sm:w-auto text-sm"
            >
              <Plus className="mr-2 h-4 w-4" />
              {t('deals.addDeal')}
            </Button>
            <Button
              variant="outline"
              onClick={() => setImportModalOpen(true)}
              className="w-full sm:w-auto text-sm"
            >
              <Upload className="mr-2 h-4 w-4" />
              {t('deals.importDeals', 'Import Deals')}
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('deals.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 w-full"
            />
          </div>
          
          <DealsFilterDropdown 
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
            availableOwners={Array.from(new Set(deals.map(d => d.owner)))} // Pass unique owners
            allTags={Array.from(new Set(deals.flatMap(deal => deal.tags || [])))} // Pass all unique tags
          />
          
          <DealsViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
        </div>

        {isUsingMockData && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {t('deals.mockDataWarning')}
            </AlertDescription>
          </Alert>
        )}

        {isLoadingDeals ? (
          <div className="text-center py-8">
            Loading deals...
          </div>
        ) : dealsError ? (
          <div className="text-center py-8 text-red-500">
            Error loading deals: {dealsError.message}. Displaying mock data.
          </div>
        ) : ( 
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            <Card className="text-center w-full">
              <CardHeader>
                <CardTitle className="text-lg font-medium">{t('deals.totalDeals')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{filteredDeals.length}</p>
              </CardContent>
            </Card>
            <Card className="text-center w-full">
              <CardHeader>
                <CardTitle className="text-lg font-medium">{t('deals.totalValue')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{totalValue.toLocaleString()} MAD</p>
              </CardContent>
            </Card>
            <Card className="text-center w-full">
              <CardHeader>
                <CardTitle className="text-lg font-medium">{t('deals.wonDeals')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{wonDeals.length}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedDeals.length > 0 && (
          <div className="flex items-center gap-2 p-2 bg-blue-100 rounded-md shadow-sm">
            <span className="text-sm text-blue-800">
              {t('common.selectedCount', { count: selectedDeals.length })}
            </span>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={clearSelection}
              className="text-blue-800 hover:bg-blue-200"
            >
              <X className="h-4 w-4 mr-1" /> {t('common.clearSelection')}
            </Button>

            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => handleBulkAction('delete')}
              className="ml-auto"
            >
              <Trash2 className="h-4 w-4 mr-1" /> {t('common.bulkDelete')}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleBulkAction('export')}
            >
              <Upload className="h-4 w-4 mr-1" /> {t('common.export')}
            </Button>
          </div>
        )}

        {viewMode === "kanban" ? (
          <PipelineBoard 
            deals={filteredDeals} 
            stages={pipelineStages}
            onDealClick={handleDealClick}
            onDealMove={handleDealMove}
            onAddDeal={handleOpenAddDeal}
            selectedDeals={selectedDeals}
            onDealSelect={handleDealSelect}
          />
        ) : (
          <DealsListTable 
            deals={filteredDeals} 
            onDealClick={handleDealClick}
            selectedDeals={selectedDeals}
            onDealSelect={handleDealSelect}
            onBulkDelete={handleBulkDelete} 
            onClearSelected={clearSelection} 
          />
        )}
      </div>

      <AddDealModal 
        open={addDealModalOpen} 
        onOpenChange={setAddDealModalOpen} 
        onSubmit={handleAddDeal}
        initialStage={addDealStage}
      />

      {selectedDeal && (
        <DealModal 
          open={dealModalOpen} 
          onOpenChange={setDealModalOpen}
          deal={selectedDeal}
          onSave={handleDealSave}
          onDelete={handleDealDelete}
        />
      )}

      <ImportDealsModal
        open={importModalOpen}
        onOpenChange={setImportModalOpen}
        onImport={handleImportDeals}
      />
    </div>
  );
}
