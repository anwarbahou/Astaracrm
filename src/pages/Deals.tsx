import { useState, useEffect } from "react";
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
  AlertCircle,
  Trash2,
  ArrowRight,
  Calendar,
  User,
  DollarSign,
  Tag,
  Phone,
  Mail
} from "lucide-react";
import { FaWhatsapp } from 'react-icons/fa';
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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useDeals } from "@/hooks/useDeals";
import { useUsers } from "@/hooks/useUsers";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { withPageTitle } from '@/components/withPageTitle';
import { useLocation } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from '@/components/ui/sheet';
import { QuickNoteCreator } from '@/components/notes/QuickNoteCreator';
import { NoteEditor } from '@/components/notes/NoteEditor';
import { noteService } from '@/services/noteService';
import { useAuth } from '@/contexts/AuthContext';
import type { Note } from '@/types/note';

function Deals() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [dealModalOpen, setDealModalOpen] = useState(false);
  const [addDealModalOpen, setAddDealModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [addDealStage, setAddDealStage] = useState<DealStage>('Prospect');
  const [selectedDeals, setSelectedDeals] = useState<string[]>([]);
  const [filters, setFilters] = useState<DealFilters>({
    stages: [],
    owners: [],
    valueRange: [0, 1000000],
    dateRange: { start: '', end: '' },
    sources: [],
    tags: [],
    search: ''
  });
  const [users, setUsers] = useState<any[]>([]);
  const [previewDeal, setPreviewDeal] = useState<Deal | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewNotes, setPreviewNotes] = useState<Note[]>([]);
  
  const { toast } = useToast();
  const location = useLocation();
  const { userProfile } = useAuth();
  
  // Try to use backend data, fallback to mock data if deals table doesn't exist
  const { 
    deals: backendDeals, 
    isLoading: isLoadingDeals, 
    error: dealsError,
    createDeal, 
    updateDeal, 
    deleteDeal,
    deleteDealsSilent,
    createDealsWithBulkNotification,
  } = useDeals();
  
  // Use backend deals if available, otherwise fallback to mock data
  const [localMockDeals, setLocalMockDeals] = useState<Deal[]>(mockDeals);
  const deals = dealsError ? localMockDeals : (backendDeals || []);
  const isUsingMockData = !!dealsError;

  const queryClient = useQueryClient();

  // Data will be automatically refetched by React Query on mount and window focus

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

  const handleModalClose = (open: boolean) => {
    if (!open) {
      setSelectedDeal(null);
    }
    setDealModalOpen(open);
  };

  const handleDealClick = (deal: Deal) => {
    if (selectedDeals.length > 0) {
      handleDealSelect(deal);
    } else {
      setSelectedDeal(deal);
      setDealModalOpen(true);
    }
  };

  const handlePreviewDeal = (deal: Deal) => {
    setPreviewDeal(deal);
    setPreviewModalOpen(true);
    // Fetch notes for this deal
    if (userProfile) {
      fetchPreviewNotes(deal.id);
    }
  };

  const fetchPreviewNotes = async (dealId: string) => {
    if (!userProfile) return;
    
    try {
      const allNotes = await noteService.getNotes({ 
        userId: userProfile.id, 
        userRole: userProfile.role as any 
      });
      const dealNotes = allNotes.filter(n => 
        n.relatedEntityType === 'deal' && n.relatedEntityId === dealId
      );
      setPreviewNotes(dealNotes);
    } catch (error) {
      console.error('Error fetching preview notes:', error);
      setPreviewNotes([]);
    }
  };

  const handlePreviewNoteCreated = async () => {
    if (previewDeal && userProfile) {
      await fetchPreviewNotes(previewDeal.id);
    }
  };

  const handleDealSelect = (deal: Deal) => {
    setSelectedDeals(prev => 
      prev.includes(deal.id)
        ? prev.filter(id => id !== deal.id)
        : [...prev, deal.id]
    );
  };

  const handleClearSelected = () => {
    setSelectedDeals([]);
  };

  const handleBulkDelete = async () => {
    const dealsToDelete = deals.filter(deal => selectedDeals.includes(deal.id));
    
    if (isUsingMockData) {
      setLocalMockDeals(prev => prev.filter(deal => !selectedDeals.includes(deal.id)));
    } else {
      await deleteDealsSilent(selectedDeals);
    }
    
    toast({
      title: t('deals.toasts.bulkDeleted.title'),
      description: t('deals.toasts.bulkDeleted.description', { count: dealsToDelete.length }),
    });
    
    setSelectedDeals([]);
  };

  const handleBulkMove = async (stage: DealStage) => {
    const dealsToMove = deals.filter(deal => selectedDeals.includes(deal.id));
    
    for (const deal of dealsToMove) {
      await handleDealMove(deal.id, stage);
    }
    
    toast({
      title: t('deals.toasts.bulkMoved.title'),
      description: t('deals.toasts.bulkMoved.description', { count: dealsToMove.length, stage: t(`deals.stages.${stage.toLowerCase().replace('/', '-')}`) }),
    });
    
    setSelectedDeals([]);
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
    setDealModalOpen(false);
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
        description: t('deals.toasts.imported.description', { count: dealsToImport.length }),
      });
    } else {
      try {
        // Use the bulk creation function with a single notification
        await createDealsWithBulkNotification(dealsToImport);
        
        toast({
          title: t('deals.toasts.imported.title'),
          description: t('deals.toasts.imported.description', { count: dealsToImport.length }),
        });
      } catch (error) {
        console.error('Error importing deals:', error);
        toast({
          title: 'Error',
          description: 'Failed to import deals. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleDeleteAllDeals = async () => {
    if (isUsingMockData) {
      setLocalMockDeals([]);
    } else {
      // Delete all deals in the backend
      await deleteDealsSilent(deals.map(deal => deal.id));
    }
    toast({
      title: t('deals.toasts.bulkDeleted.title'),
      description: t('deals.toasts.bulkDeleted.description', { count: deals.length }),
    });
    setSelectedDeals([]);
  };

  // Add this handler
  const handleDealEdit = (deal: Deal) => {
    setSelectedDeal(deal);
    setDealModalOpen(true);
  };

  // Add handler for individual deal deletion
  const handleDealDeleteFromCard = (deal: Deal) => {
    handleDealDelete(deal.id);
  };

  // Fetch users for avatar display
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, email, first_name, last_name, avatar_url');
        
        if (!error && data) {
          setUsers(data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    
    fetchUsers();
  }, []);

  // Get unique owners and tags from deals
  const availableOwners = Array.from(new Set(deals.map(d => d.owner)));
  const allTags = Array.from(new Set(deals.flatMap(deal => deal.tags || [])));

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 md:p-6">
      {/* Error Alert */}
      {dealsError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load deals from the database. Using mock data instead.
          </AlertDescription>
        </Alert>
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <h1 className="text-xl sm:text-2xl font-bold">{t('deals.title')}</h1>
          <Badge variant="secondary" className="text-xs sm:text-sm w-fit">
            {filteredDeals.length} {t('deals.total')}
          </Badge>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <Button onClick={() => setImportModalOpen(true)} variant="outline" className="gap-2 w-full sm:w-auto text-sm">
            <Upload className="h-4 w-4" />
            {t('deals.actions.import')}
          </Button>
          <Button onClick={() => handleOpenAddDeal('Prospect')} className="gap-2 w-full sm:w-auto text-sm">
            <Plus className="h-4 w-4" />
            {t('deals.actions.add')}
          </Button>
        </div>
      </div>

      {/* Selection Actions */}
      {selectedDeals.length > 0 && (
        <div className="flex items-center gap-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <span className="text-sm text-blue-400">
            {selectedDeals.length} deals selected
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearSelected}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Clear Selection
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkMove('Prospect')}
              className="gap-2"
            >
              <ArrowRight className="h-4 w-4" />
              Move to Prospect
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkMove('Lead')}
              className="gap-2"
            >
              <ArrowRight className="h-4 w-4" />
              Move to Lead
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      {/* Filters Section */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder={t('deals.filters.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>

        {/* Owner Avatar Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filter by:</span>
          <div className="flex items-center gap-1">
            {users.slice(0, 5).map((user) => {
              const ownerName = user.first_name && user.last_name 
                ? `${user.first_name} ${user.last_name}` 
                : user.first_name || user.email?.split('@')[0] || 'User';
              return (
                <Avatar
                  key={user.id}
                  className="h-6 w-6 cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
                  onClick={() => {
                    const newOwners = filters.owners.includes(ownerName)
                      ? filters.owners.filter(o => o !== ownerName)
                      : [...filters.owners, ownerName];
                    handleFiltersChange({ ...filters, owners: newOwners });
                  }}
                >
                  <AvatarImage src={user?.avatar_url} alt={ownerName} />
                  <AvatarFallback>
                    {user?.first_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              );
            })}
            {users.length > 5 && (
              <Badge variant="secondary" className="text-xs">
                +{users.length - 5}
              </Badge>
            )}
          </div>
        </div>

        <DealsFilterDropdown
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
          availableOwners={availableOwners}
          allTags={allTags}
        />

        {(filters.stages.length > 0 || 
          filters.owners.length > 0 || 
          filters.valueRange[0] > 0 || 
          filters.valueRange[1] < 1000000 ||
          filters.dateRange.start ||
          filters.dateRange.end) && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleClearFilters}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            {t('deals.filters.clear')}
          </Button>
        )}

        <DealsViewToggle 
          viewMode={viewMode} 
          onViewModeChange={setViewMode} 
        />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              {t('deals.stats.totalValue')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-xl md:text-2xl font-bold">{totalValue.toLocaleString()} MAD</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              {t('deals.stats.wonDeals')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-xl md:text-2xl font-bold">{wonDeals.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              {t('deals.stats.avgDealSize')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-xl md:text-2xl font-bold">
              {filteredDeals.length > 0 
                ? Math.round(totalValue / filteredDeals.length).toLocaleString()
                : 0} MAD
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deals Board/List */}
      {viewMode === "kanban" ? (
        <PipelineBoard
          deals={filteredDeals}
          stages={pipelineStages}
          onDealClick={handlePreviewDeal} // Open preview on card click
          onDealMove={handleDealMove}
          onAddDeal={handleOpenAddDeal}
          onDealSelect={handleDealSelect}
          selectedDeals={selectedDeals}
          onBulkDelete={handleDeleteAllDeals}
          onEdit={handleDealEdit} // Pass the edit handler
          onDelete={handleDealDeleteFromCard} // Pass the delete handler
        />
      ) : (
        <DealsListTable
          deals={filteredDeals}
          onDealClick={handlePreviewDeal} // Open preview on table row click
          onDealSelect={handleDealSelect}
          selectedDeals={selectedDeals}
        />
      )}

      {/* Modals */}
      <DealModal
        deal={selectedDeal}
        open={dealModalOpen}
        onOpenChange={handleModalClose}
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

      {/* Deal Preview Side Modal */}
      <Sheet open={previewModalOpen} onOpenChange={setPreviewModalOpen}>
        <SheetContent side="right" className="h-full w-full max-w-full sm:max-w-[90vw] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[800px] border-l shadow-2xl bg-background/95 backdrop-blur-sm p-0 flex flex-col">
          <SheetHeader className="px-4 sm:px-6 py-4 border-b">
            <SheetTitle className="text-lg sm:text-2xl font-bold truncate flex items-center gap-2">
              {previewDeal?.name}
              <Badge variant="secondary" className="ml-2 text-xs">{previewDeal?.stage}</Badge>
              <Badge variant="outline" className="ml-2 text-xs">{previewDeal?.priority}</Badge>
            </SheetTitle>
            <SheetDescription className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-muted-foreground text-xs">Created {previewDeal?.created_at && new Date(previewDeal.created_at).toLocaleDateString()}</span>
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <div className="font-semibold text-sm text-muted-foreground">Client</div>
                <div className="flex items-center gap-2 text-lg font-medium">
                  <User className="h-4 w-4 text-muted-foreground" />
                  {previewDeal?.client}
                </div>
                {previewDeal?.clientPhone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    {previewDeal.clientPhone}
                    <a
                      href={`https://wa.me/${previewDeal.clientPhone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Chat on WhatsApp"
                      className="ml-1 text-green-500 hover:text-green-600"
                    >
                      <FaWhatsapp className="inline h-5 w-5 align-middle" />
                    </a>
                  </div>
                )}
                {previewDeal?.clientEmail && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {previewDeal.clientEmail}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="font-semibold text-sm text-muted-foreground">Owner</div>
                <div className="flex items-center gap-2 text-lg font-medium">
                  <User className="h-4 w-4 text-muted-foreground" />
                  {previewDeal?.owner}
                </div>
              </div>
              <div className="space-y-2">
                <div className="font-semibold text-sm text-muted-foreground">Value</div>
                <div className="flex items-center gap-2 text-lg font-bold text-green-600">
                  <span className="font-bold text-green-600 text-lg">د.م.</span>
                  {previewDeal?.value?.toLocaleString()} MAD
                </div>
              </div>
              <div className="space-y-2">
                <div className="font-semibold text-sm text-muted-foreground">Probability</div>
                <div className="flex items-center gap-2 text-lg font-medium">
                  {previewDeal?.probability}%
                </div>
              </div>
              <div className="space-y-2">
                <div className="font-semibold text-sm text-muted-foreground">Expected Close Date</div>
                <div className="flex items-center gap-2 text-lg font-medium">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {previewDeal?.expectedCloseDate}
                </div>
              </div>
              <div className="space-y-2">
                <div className="font-semibold text-sm text-muted-foreground">Tags</div>
                <div className="flex flex-wrap gap-2">
                  {previewDeal?.tags?.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <div className="font-semibold text-sm text-muted-foreground">Website</div>
                <div className="flex items-center gap-2 text-lg font-medium">
                  {previewDeal?.website ? (
                    <a href={previewDeal.website} target="_blank" rel="noopener noreferrer" className="underline text-blue-400">{previewDeal.website}</a>
                  ) : (
                    <span>-</span>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <div className="font-semibold text-sm text-muted-foreground">Rating</div>
                <div className="flex items-center gap-2 text-lg font-medium">
                  <span>⭐</span>
                  <span>{typeof previewDeal?.rating === 'number' ? previewDeal.rating : '-'}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="font-semibold text-sm text-muted-foreground">Assignee</div>
                <div className="flex items-center gap-2 text-lg font-medium">
                  {previewDeal?.assigneeName ? previewDeal.assigneeName : <span>-</span>}
                </div>
              </div>
            </div>
            <div className="space-y-4 mt-6">
              <div>
                <div className="font-semibold text-sm text-muted-foreground mb-1">Description</div>
                <div className="bg-muted rounded-md p-3 text-sm whitespace-pre-line">
                  {previewDeal?.description || <span className="text-muted-foreground">No description provided.</span>}
                </div>
              </div>
              <div>
                <div className="font-semibold text-sm text-muted-foreground mb-1">Notes</div>
                
                {/* Quick Note Creator */}
                {previewDeal && (
                  <QuickNoteCreator
                    dealId={previewDeal.id}
                    dealName={previewDeal.name}
                    onNoteCreated={handlePreviewNoteCreated}
                    isEditing={true} // Always allow editing in preview
                  />
                )}
                
                {/* Display attached notes */}
                {previewNotes.length > 0 && (
                  <div className="space-y-3 mt-4">
                    <div className="font-semibold text-sm text-muted-foreground">Attached Notes</div>
                    <div className="space-y-2">
                      {previewNotes.map((note) => (
                        <NoteEditor
                          key={note.id}
                          note={note}
                          onNoteUpdated={handlePreviewNoteCreated}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default withPageTitle(Deals, 'deals');
