
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Plus
} from "lucide-react";
import { Deal, DealFilters, DealStage } from '@/types/deal';
import { mockDeals, pipelineStages } from '@/data/mockDeals';
import { PipelineBoard } from '@/components/deals/PipelineBoard';
import { DealModal } from '@/components/deals/DealModal';
import { AddDealModal } from '@/components/deals/AddDealModal';
import { DealsFilterDropdown } from '@/components/deals/DealsFilterDropdown';
import { DealsViewToggle } from '@/components/deals/DealsViewToggle';
import { DealsListTable } from '@/components/deals/DealsListTable';
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function Deals() {
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
    // Search filter
    const matchesSearch = 
      deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.owner.toLowerCase().includes(searchQuery.toLowerCase());

    // Stage filter
    const matchesStage = filters.stages.length === 0 || filters.stages.includes(deal.stage);
    
    // Owner filter
    const matchesOwner = filters.owners.length === 0 || filters.owners.includes(deal.owner);
    
    // Value range filter
    const matchesValue = deal.value >= filters.valueRange[0] && deal.value <= filters.valueRange[1];
    
    // Date range filter
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
      title: "Deal moved",
      description: `Deal moved to ${newStage} stage`,
    });
  };

  const handleDealSave = (updatedDeal: Deal) => {
    setDeals(prev => prev.map(deal => 
      deal.id === updatedDeal.id ? updatedDeal : deal
    ));
    
    toast({
      title: "Deal updated",
      description: "Deal has been successfully updated",
    });
  };

  const handleDealDelete = (dealId: string) => {
    setDeals(prev => prev.filter(deal => deal.id !== dealId));
    
    toast({
      title: "Deal deleted",
      description: "Deal has been successfully deleted",
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
      title: "Deal created",
      description: `New deal added to ${addDealStage} stage`,
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
    <div className="min-h-screen bg-gray-900 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Sales Pipeline</h1>
          <p className="text-gray-400 mt-1">
            Manage your deals through the sales process
          </p>
        </div>
        <div className="flex gap-3">
          <DealsViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          <Button onClick={() => handleOpenAddDeal('Prospect')} className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Plus size={16} />
            New Deal
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search deals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400"
          />
        </div>
        <DealsFilterDropdown
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
        />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{filteredDeals.length}</p>
            <p className="text-sm text-gray-400">Active Deals</p>
          </div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">{totalValue.toLocaleString()} MAD</p>
            <p className="text-sm text-gray-400">Pipeline Value</p>
          </div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-400">{wonDeals.length}</p>
            <p className="text-sm text-gray-400">Deals Won</p>
          </div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-400">
              {filteredDeals.length > 0 ? Math.round(totalValue / filteredDeals.length).toLocaleString() : 0} MAD
            </p>
            <p className="text-sm text-gray-400">Avg Deal Size</p>
          </div>
        </div>
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
        <Card className="bg-gray-800 border-gray-700">
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
