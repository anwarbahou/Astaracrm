import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Deal, DealStage } from '@/types/deal';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { notificationService } from '@/services/notificationService';

// Transform database deal to frontend Deal type
const transformDealFromDB = (dbDeal: any): Deal => ({
  id: dbDeal.id,
  name: dbDeal.name,
  client: dbDeal.client_name || 'Unknown Client', // Use client_name from deals table
  clientId: dbDeal.client_id,
  value: Number(dbDeal.value),
  currency: dbDeal.currency || 'MAD',
  stage: mapDBStageToFrontend(dbDeal.stage, dbDeal.tags),
  probability: dbDeal.probability || 0,
  expectedCloseDate: dbDeal.expected_close_date || '',
  source: dbDeal.source || '',
  owner: 'Unknown Owner', // TODO: Add owner join later when foreign key is set up
  ownerId: dbDeal.owner_id,
  tags: (dbDeal.tags || []).filter((tag: string) => tag !== '__lead_stage__'),
  priority: capitalizeFirst(dbDeal.priority) as 'Low' | 'Medium' | 'High',
  createdAt: dbDeal.created_at?.split('T')[0] || '',
  updatedAt: dbDeal.updated_at?.split('T')[0] || '',
  notes: dbDeal.notes || '',
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
    description: deal.notes // Use notes as description for now
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
  const { toast } = useToast();
  const { user, userProfile } = useAuth();
  const queryClient = useQueryClient();

  // Fetch all deals with joins
  const {
    data: deals = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['deals'],
    queryFn: async () => {
      console.log('Fetching deals without joins...');
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching deals:', error);
        throw error;
      }

      console.log('Deals fetched successfully:', data);
      return data?.map((deal) => transformDealFromDB(deal)) || [];
    },
  });

  // Create deal mutation with optional silent mode
  const createDealMutation = useMutation({
    mutationFn: async ({ dealData, silent = false }: { 
      dealData: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>, 
      silent?: boolean 
    }) => {
      console.log('=== DEAL CREATION DEBUG ===');
      console.log('Input dealData:', dealData);
      
      // Create a simple, explicit object to avoid any transformation issues
      const simpleDealData = {
        name: dealData.name || 'Untitled Deal',
        client_name: dealData.client || 'Unknown Client',
        client_id: dealData.clientId || null,
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
        description: dealData.notes || ''
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
      
      // Create notifications for the new deal
      if (user?.id && userProfile?.role) {
        await notificationService.notifyDealAdded(
          deal.name,
          deal.id,
          deal.value,
          {
            userId: user.id,
            userRole: userProfile.role
          }
        );
      }
      
      if (!silent) {
        toast({
          title: 'Deal created',
          description: `${deal.name} has been created successfully.`,
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
    onSuccess: (updatedDeal) => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      toast({
        title: 'Deal updated',
        description: `${updatedDeal.name} has been updated successfully.`,
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
      const { error } = await supabase
        .from('deals')
        .delete()
        .eq('id', dealId);

      if (error) throw error;
      return { dealId, silent };
    },
    onSuccess: ({ dealId, silent }) => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      if (!silent) {
        toast({
          title: 'Deal deleted',
          description: 'Deal has been deleted successfully.',
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
  const createDeal = (dealData: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => {
    createDealMutation.mutate({ dealData, silent: false });
  };

  const createDealAsync = (dealData: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>, silent = false) => {
    return createDealMutation.mutateAsync({ dealData, silent });
  };

  const createDealsSilent = async (dealsData: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>[]) => {
    const results = [];
    for (const dealData of dealsData) {
      const result = await createDealMutation.mutateAsync({ dealData, silent: true });
      results.push(result.deal);
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

  return {
    deals,
    isLoading,
    error,
    createDeal,
    createDealAsync,
    createDealsSilent,
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