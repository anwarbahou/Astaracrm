import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Plus, 
  Filter
} from "lucide-react";
import { Deal, DealFilters } from '@/types/deal';
import { mockDeals } from '@/data/mockDeals';
import { DealsBoard } from '@/components/deals/DealsBoard';
import { DealModal } from '@/components/deals/DealModal';
import { AddDealModal } from '@/components/deals/AddDealModal';
import { FiltersPanel } from '@/components/deals/FiltersPanel';
import { DealsViewToggle } from '@/components/deals/DealsViewToggle';
import { DealsListTable } from '@/components/deals/DealsListTable';

export default function Deals() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [deals, setDeals] = useState<Deal[]>(mockDeals);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [dealModalOpen, setDealModalOpen] = useState(false);
  const [addDealModalOpen, setAddDealModalOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<DealFilters>({
    stages: [],
    owners: [],
    valueRange: [0, 1000000],
    dateRange: { start: '', end: '' },
    sources: [],
    tags: [],
    search: ''
  });

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
    
    // Source filter
    const matchesSource = filters.sources.length === 0 || filters.sources.includes(deal.source);

    return matchesSearch && matchesStage && matchesOwner && matchesValue && matchesDate && matchesSource;
  });

  const totalValue = filteredDeals.reduce((sum, deal) => sum + deal.value, 0);
  const wonDeals = filteredDeals.filter(deal => deal.stage === "Closed Won");
  const avgDealSize = filteredDeals.length > 0 ? totalValue / filteredDeals.length : 0;

  const handleDealClick = (deal: Deal) => {
    setSelectedDeal(deal);
    setDealModalOpen(true);
  };

  const handleDealEdit = (deal: Deal) => {
    setSelectedDeal(deal);
    setDealModalOpen(true);
  };

  const handleDealSave = (updatedDeal: Deal) => {
    setDeals(prev => prev.map(deal => 
      deal.id === updatedDeal.id ? updatedDeal : deal
    ));
  };

  const handleDealDelete = (dealId: string) => {
    setDeals(prev => prev.filter(deal => deal.id !== dealId));
  };

  const handleAddDeal = (newDealData: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newDeal: Deal = {
      ...newDealData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setDeals(prev => [...prev, newDeal]);
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
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Deal Management</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage your sales opportunities through the pipeline.
          </p>
        </div>
        <div className="flex gap-2">
          <DealsViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          <Button onClick={() => setAddDealModalOpen(true)} className="gap-2">
            <Plus size={16} />
            Add Deal
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search deals by name, client, or owner..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="gap-2"
            >
              <Filter size={16} />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters Panel */}
      <FiltersPanel
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{filteredDeals.length}</p>
              <p className="text-sm text-muted-foreground">Total Deals</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{totalValue.toLocaleString()} MAD</p>
              <p className="text-sm text-muted-foreground">Pipeline Value</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{wonDeals.length}</p>
              <p className="text-sm text-muted-foreground">Deals Won</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{Math.round(avgDealSize).toLocaleString()} MAD</p>
              <p className="text-sm text-muted-foreground">Avg Deal Size</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deals Content - Toggle between views */}
      {viewMode === "kanban" ? (
        <DealsBoard
          deals={filteredDeals}
          onDealClick={handleDealClick}
          onDealEdit={handleDealEdit}
          onDealDelete={handleDealDelete}
        />
      ) : (
        <Card>
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
