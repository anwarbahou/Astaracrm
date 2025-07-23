import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Deal, DealStage } from '@/types/deal';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { notificationService } from '@/services/notificationService';
import { useTranslation } from 'react-i18next';

// Transform database deal to frontend Deal type
const transformDealFromDB = (dbDeal: any): Deal => ({
  id: dbDeal.id,
  name: dbDeal.name,
  client: dbDeal.client_name || 'Unknown Client',
  clientId: dbDeal.client_id || null,
  clientPhone: dbDeal.client_phone || null,
  clientEmail: dbDeal.client_email || null,
  value: Number(dbDeal.value),
  currency: dbDeal.currency || 'MAD',
  stage: mapDBStageToFrontend(dbDeal.stage, dbDeal.tags),
  probability: dbDeal.probability || 0,
  expectedCloseDate: dbDeal.expected_close_date || '',
  source: dbDeal.source || '',
  owner: dbDeal.users ? `${dbDeal.users.first_name || ''} ${dbDeal.users.last_name || ''}`.trim() || dbDeal.users.email : 'Unknown Owner',
  ownerId: dbDeal.owner_id,
  ownerAvatar: dbDeal.users?.avatar_url,
  website: dbDeal.website || '', // New
  rating: dbDeal.rating ?? null, // New
  assigneeId: dbDeal.assignee_id || null, // New
  assigneeName: dbDeal.assignee_user ? `${dbDeal.assignee_user.first_name || ''} ${dbDeal.assignee_user.last_name || ''}`.trim() || dbDeal.assignee_user.email : '', // New, if joined
  assigneeAvatar: dbDeal.assignee_user?.avatar_url || '', // New, if joined
  tags: (dbDeal.tags || []).filter((tag: string) => tag !== '__lead_stage__'),
  priority: capitalizeFirst(dbDeal.priority) as 'Low' | 'Medium' | 'High',
  created_at: dbDeal.created_at?.split('T')[0] || '',
  updated_at: dbDeal.updated_at?.split('T')[0] || '',
  notes: dbDeal.notes || '',
  description: dbDeal.description || '',
  activities: []
});

// Transform frontend Deal to database format
const transformDealToDB = (deal: Partial<Deal>) => {
  const tags = deal.tags || [];
  
  // Add special tag for Lead stage
  if (deal.stage === 'Lead') {
    tags.push('__lead_stage__');
  } else {
    // Remove the tag if it exists but stage is not Lead
    const index = tags.indexOf('__lead_stage__');
    if (index > -1) {
      tags.splice(index, 1);
    }
  }
  
  return {
    name: deal.name,
    client_id: deal.clientId || null,
    client_name: deal.client || null,
    value: deal.value,
    currency: deal.currency || 'MAD',
    stage: mapFrontendStageToDB(deal.stage),
    probability: deal.probability,
    expected_close_date: deal.expectedCloseDate,
    source: deal.source,
    owner_id: deal.ownerId || null,
    tags: tags,
    priority: deal.priority?.toLowerCase() as 'low' | 'medium' | 'high',
    notes: deal.notes,
    description: deal.notes, // Use notes as description for now
    website: deal.website || null, // New
    rating: deal.rating ?? null, // New
    assignee_id: deal.assigneeId || null, // New
  };
};

// Map database stage enum to frontend
const mapDBStageToFrontend = (dbStage: string, dealTags?: string[]): DealStage => {
  const stageMap: Record<string, DealStage> = {
    'prospect': 'Prospect',
    'qualified': 'Qualified', 
    'proposal': 'Proposal',
    'negotiation': 'Negotiation',
    'won': 'Won/Lost',
    'lost': 'Won/Lost'
  };
  
  // Special handling for prospect stage - check if it should be Lead
  if (dbStage === 'prospect' && dealTags?.includes('__lead_stage__')) {
    return 'Lead';
  }
  
  return stageMap[dbStage] || 'Prospect';
};

// Map frontend stage to database enum
const mapFrontendStageToDB = (frontendStage?: DealStage | string): 'prospect' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost' => {
  if (!frontendStage) return 'prospect';
  
  // Convert to lowercase for mapping
  const stage = frontendStage.toLowerCase();
  
  // Handle both the formatted frontend values and direct database values
  const stageMap: Record<string, 'prospect' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost'> = {
    // Capitalized frontend values - both Prospect and Lead map to 'prospect' in DB
    'prospect': 'prospect',
    'lead': 'prospect', // Lead maps to prospect in database
    'qualified': 'qualified',
    'proposal': 'proposal', 
    'negotiation': 'negotiation',
    'won/lost': 'won',
    // Direct database values (lowercase)
    'won': 'won',
    'lost': 'lost'
  };
  
  return stageMap[stage] || 'prospect';
};

const capitalizeFirst = (str: string): string => 
  str.charAt(0).toUpperCase() + str.slice(1);

export function useDeals() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user, userProfile } = useAuth();
  const { t } = useTranslation();
  const [selectedDeals, setSelectedDeals] = useState<string[]>([]);
  const [isUsingMockData] = useState(false);

  // Fetch all deals with owner information
  const {
    data: deals = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['deals'],
    queryFn: async () => {
      console.log('🔍 Fetching deals with owner information...');
      console.log('👤 Current user:', user?.id);
      console.log('🔑 User profile:', userProfile);
      
      // Use proper SQL join instead of Supabase's foreign key syntax
      const { data, error } = await supabase
        .from('deals')
        .select(`
          *,
          users!deals_owner_id_fkey (
            id,
            first_name,
            last_name,
            email,
            avatar_url
          ),
          assignee_user:users!deals_assignee_id_fkey (
            id,
            first_name,
            last_name,
            email,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching deals:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        throw error;
      }

      console.log('✅ Raw deals data:', data);
      const transformed = data?.map((deal) => transformDealFromDB(deal)) || [];
      console.log('🔄 Transformed deals:', transformed);
      return transformed;
    },
    retry: 1, // Reduce retries to see errors faster
    retryDelay: 1000,
  });

  // Create deal mutation with optional silent mode
  const createDealMutation = useMutation({
    mutationFn: async ({ dealData, silent = false }: { 
      dealData: Omit<Deal, 'id' | 'created_at' | 'updated_at'>, 
      silent?: boolean 
    }) => {
      console.log('=== DEAL CREATION DEBUG ===');
      console.log('Input dealData:', dealData);
      
      // Create a simple, explicit object to avoid any transformation issues
      const simpleDealData = {
        name: dealData.name || 'Untitled Deal',
        client_name: dealData.client || 'Unknown Client',
        client_id: dealData.clientId || null,
        client_phone: dealData.clientPhone || (dealData as any)?.client_phone || null, // Support both camelCase and snake_case
        value: Number(dealData.value) || 0,
        currency: dealData.currency || 'MAD',
        stage: 'prospect' as 'prospect',
        probability: Number(dealData.probability) || 25,
        expected_close_date: dealData.expectedCloseDate || new Date().toISOString().split('T')[0],
        source: dealData.source || '',
        owner_id: dealData.ownerId,
        tags: dealData.tags || [],
        priority: 'medium' as 'medium',
        notes: dealData.notes || '',
        description: dealData.notes || '',
        website: dealData.website || null, // New
        rating: dealData.rating ?? null, // New
        assignee_id: dealData.assigneeId || null, // New
      };
      
      console.log('Simplified deal data:', simpleDealData);
      console.log('User ID being used:', dealData.ownerId);
      
      const { data, error } = await supabase
        .from('deals')
        .insert(simpleDealData as any)
        .select('*')
        .single();

      if (error) {
        console.error('=== DATABASE ERROR ===');
        console.error('Error details:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        throw error;
      }
      
      console.log('=== SUCCESS ===');
      console.log('Deal created successfully:', data);
      return { deal: transformDealFromDB(data), silent };
    },
    onSuccess: async ({ deal, silent }) => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      
      // Create notifications for the new deal only if not silent
      if (!silent && user?.id && userProfile?.role) {
        await notificationService.notifyDealAdded(
          deal.name,
          deal.id,
          deal.value,
          {
            userId: user.id,
            userRole: userProfile.role as 'admin' | 'manager' | 'user'
          },
          {
            title: t('deals.notifications.created.title'),
            description: t('deals.notifications.created.description', { 
              name: deal.name, 
              value: deal.value.toLocaleString() 
            })
          }
        );
      }
      
      if (!silent) {
        toast({
          title: t('deals.toasts.created.title'),
          description: t('deals.toasts.created.description'),
        });
      }
    },
    onError: (error, { silent }) => {
      console.error('Error creating deal:', error);
      if (!silent) {
        toast({
          title: 'Error',
          description: 'Failed to create deal. Please try again.',
          variant: 'destructive',
        });
      }
    },
  });

  // Update deal mutation
  const updateDealMutation = useMutation({
    mutationFn: async ({ id, ...dealData }: Partial<Deal> & { id: string }) => {
      const { data, error } = await supabase
        .from('deals')
        .update(transformDealToDB(dealData))
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;
      return transformDealFromDB(data);
    },
    onSuccess: async (updatedDeal) => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      
      // Create notification if user context exists
      if (user?.id && userProfile?.role) {
        await notificationService.notifyDealUpdated(
          updatedDeal.name,
          updatedDeal.id,
          {
            userId: user.id,
            userRole: userProfile.role as 'admin' | 'manager' | 'user'
          },
          {
            title: t('deals.notifications.updated.title'),
            description: t('deals.notifications.updated.description', { 
              name: updatedDeal.name 
            })
          }
        );
      }

      toast({
        title: t('deals.toasts.updated.title'),
        description: t('deals.toasts.updated.description')
      });
    },
    onError: (error) => {
      console.error('Error updating deal:', error);
      toast({
        title: 'Error',
        description: 'Failed to update deal. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Delete deal mutation
  const deleteDealMutation = useMutation({
    mutationFn: async ({ dealId, silent = false }: { dealId: string, silent?: boolean }) => {
      // Get deal details before deletion for notification
      const { data: dealData, error: fetchError } = await supabase
        .from('deals')
        .select('*')
        .eq('id', dealId)
        .single();

      if (fetchError) throw fetchError;

      // Delete the deal
      const { error } = await supabase
        .from('deals')
        .delete()
        .eq('id', dealId);

      if (error) throw error;
      return { dealId, silent, dealName: dealData.name };
    },
    onSuccess: async ({ dealId, silent, dealName }) => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      
      // Send notification if not silent and user context exists
      if (!silent && user?.id && userProfile?.role) {
        await notificationService.notifyDealDeleted(
          dealName,
          dealId,
          {
            userId: user.id,
            userRole: userProfile.role as 'admin' | 'manager' | 'user'
          },
          {
            title: t('deals.notifications.deleted.title'),
            description: t('deals.notifications.deleted.description', { name: dealName })
          }
        );
      }

      if (!silent) {
        toast({
          title: t('deals.toasts.deleted.title'),
          description: t('deals.toasts.deleted.description'),
        });
      }
    },
    onError: (error, { silent }) => {
      console.error('Error deleting deal:', error);
      if (!silent) {
        toast({
          title: 'Error',
          description: 'Failed to delete deal. Please try again.',
          variant: 'destructive',
        });
      }
    },
  });

  // Helper functions for backwards compatibility
  const createDeal = (dealData: Omit<Deal, 'id' | 'created_at' | 'updated_at'>) => {
    createDealMutation.mutate({ dealData, silent: false });
  };

  const createDealAsync = (dealData: Omit<Deal, 'id' | 'created_at' | 'updated_at'>, silent = false) => {
    return createDealMutation.mutateAsync({ dealData, silent });
  };

  const createDealsSilent = async (dealsData: Omit<Deal, 'id' | 'created_at' | 'updated_at'>[]) => {
    const results = [];
    for (const dealData of dealsData) {
      const result = await createDealMutation.mutateAsync({ dealData, silent: true });
      results.push(result.deal);
    }
    return results;
  };

  const createDealsWithBulkNotification = async (dealsData: Omit<Deal, 'id' | 'created_at' | 'updated_at'>[]) => {
    console.log('🔄 Starting bulk deal creation for', dealsData.length, 'deals');
    const results = [];
    let totalValue = 0;
    
    // Create all deals silently
    for (const dealData of dealsData) {
      console.log('📝 Creating deal silently:', dealData.name);
      const result = await createDealMutation.mutateAsync({ dealData, silent: true });
      results.push(result.deal);
      totalValue += result.deal.value;
    }
    
    console.log('✅ All deals created. Total:', results.length, 'deals, Value:', totalValue);
    
    // Create a single bulk notification
    if (user?.id && userProfile?.role && results.length > 0) {
      console.log('🔔 Creating bulk notification for', results.length, 'deals');
      await notificationService.notifyBulkDealsAdded(
        results.length,
        totalValue,
        {
          userId: user.id,
          userRole: userProfile.role as 'admin' | 'manager' | 'user'
        },
        {
          title: t('deals.notifications.BulkAdded.title'),
          description: t('deals.notifications.BulkAdded.description', { 
            count: results.length, 
            value: totalValue.toLocaleString() 
          })
        }
      );
      console.log('✅ Bulk notification created successfully');
    }
    
    return results;
  };

  const deleteDeal = (dealId: string) => {
    deleteDealMutation.mutate({ dealId, silent: false });
  };

  const deleteDealAsync = (dealId: string, silent = false) => {
    return deleteDealMutation.mutateAsync({ dealId, silent });
  };

  const deleteDealsSilent = async (dealIds: string[]) => {
    const results = [];
    for (const dealId of dealIds) {
      const result = await deleteDealMutation.mutateAsync({ dealId, silent: true });
      results.push(result.dealId);
    }
    return results;
  };

  const handleBulkDelete = async (dealsToDelete: Deal[]) => {
    if (isUsingMockData) {
      const newDeals = dealsToDelete.map(deal => ({
        ...deal,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));
    } else {
      try {
        // Delete deals silently first
        await deleteDealsSilent(dealsToDelete.map(d => d.id));

        // Send a single bulk notification
        if (user?.id && userProfile?.role) {
          await notificationService.notifyBulkDealsDeleted(
            dealsToDelete.length,
            dealsToDelete.reduce((sum, deal) => sum + deal.value, 0),
            {
              userId: user.id,
              userRole: userProfile.role as 'admin' | 'manager' | 'user'
            },
            {
              title: t('deals.notifications.BulkDeleted.title'),
              description: t('deals.notifications.BulkDeleted.description', { 
                count: dealsToDelete.length 
              })
            }
          );
        }

        toast({
          title: t('deals.toasts.bulkDeleted.title'),
          description: t('deals.toasts.bulkDeleted.description', { count: dealsToDelete.length }),
        });
      } catch (error) {
        // ... existing error handling ...
      }
    }
    setSelectedDeals([]);
  };

  // Test database connection and query
  const testConnection = async () => {
    try {
      console.log('🔗 Testing database connection...');
      const { data, error } = await supabase
        .from('deals')
        .select('count')
        .limit(1);
      
      console.log('🔗 Database connection test:', { data, error });
      return !error;
    } catch (err) {
      console.error('❌ Database connection failed:', err);
      return false;
    }
  };

  // Call test on mount
  useEffect(() => {
    testConnection();
  }, []);

  return {
    deals,
    isLoading,
    error,
    createDeal,
    createDealAsync,
    createDealsSilent,
    createDealsWithBulkNotification,
    updateDeal: updateDealMutation.mutate,
    updateDealAsync: updateDealMutation.mutateAsync,
    deleteDeal,
    deleteDealAsync,
    deleteDealsSilent,
    isCreating: createDealMutation.isPending,
    isUpdating: updateDealMutation.isPending,
    isDeleting: deleteDealMutation.isPending,
  };
} 