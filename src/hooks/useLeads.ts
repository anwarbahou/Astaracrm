
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadsService, LeadFilters, GeneratedLead, SavedFilter } from '@/services/leadsService';
import { toast } from 'sonner';

export interface UseLeadsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  industry?: string;
  country?: string;
}

export const useLeads = (params: UseLeadsParams = {}) => {
  const queryClient = useQueryClient();

  const {
    data: leadsData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['leads', params],
    queryFn: () => leadsService.getLeads(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const generateLeadsMutation = useMutation({
    mutationFn: (filters: LeadFilters) => leadsService.generateLeads(filters),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success(`Generated ${data.count} new leads successfully!`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to generate leads: ${error.message}`);
    },
  });

  const updateLeadStatusMutation = useMutation({
    mutationFn: ({ leadId, status }: { leadId: string; status: string }) =>
      leadsService.updateLeadStatus(leadId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead status updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update lead status: ${error.message}`);
    },
  });

  const deleteLeadsMutation = useMutation({
    mutationFn: (leadIds: string[]) => leadsService.deleteLeads(leadIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Leads deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete leads: ${error.message}`);
    },
  });

  const createCampaignMutation = useMutation({
    mutationFn: (campaignData: {
      name: string;
      leadIds: string[];
      messageTemplate: string;
      duration?: string;
      budget?: number;
      status?: string;
    }) => leadsService.createCampaign(campaignData),
    onSuccess: (data) => {
      toast.success(`Campaign created with ${data.leadCount} leads!`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create campaign: ${error.message}`);
    },
  });

  return {
    // Data
    leads: leadsData?.leads || [],
    pagination: leadsData?.pagination,
    isLoading,
    error,

    // Actions
    generateLeads: generateLeadsMutation.mutate,
    updateLeadStatus: updateLeadStatusMutation.mutate,
    deleteLeads: deleteLeadsMutation.mutate,
    createCampaign: createCampaignMutation.mutate,
    refetch,

    // Loading states
    isGenerating: generateLeadsMutation.isPending,
    isUpdating: updateLeadStatusMutation.isPending,
    isDeleting: deleteLeadsMutation.isPending,
    isCreatingCampaign: createCampaignMutation.isPending,
  };
};

export const useSavedFilters = () => {
  const queryClient = useQueryClient();

  const {
    data: savedFilters = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['savedFilters'],
    queryFn: () => leadsService.getSavedFilters(),
  });

  const saveFiltersMutation = useMutation({
    mutationFn: ({ name, filters }: { name: string; filters: LeadFilters }) =>
      leadsService.saveFilters(name, filters),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedFilters'] });
      toast.success('Filters saved successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to save filters: ${error.message}`);
    },
  });

  return {
    savedFilters,
    isLoading,
    error,
    saveFilters: saveFiltersMutation.mutate,
    isSaving: saveFiltersMutation.isPending,
  };
};

export const useLead = (leadId: string) => {
  const {
    data: lead,
    isLoading,
    error
  } = useQuery({
    queryKey: ['lead', leadId],
    queryFn: () => leadsService.getLead(leadId),
    enabled: !!leadId,
  });

  return {
    lead,
    isLoading,
    error,
  };
};

export const useLeadExport = () => {
  const [isExporting, setIsExporting] = useState(false);

  const exportLeads = async (leadIds: string[], format: 'csv' | 'json' = 'csv') => {
    setIsExporting(true);
    try {
      const data = await leadsService.exportLeads(leadIds, format);
      
      // Create download
      const blob = new Blob([data], { 
        type: format === 'csv' ? 'text/csv' : 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads-export-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success(`Leads exported successfully as ${format.toUpperCase()}!`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export leads');
    } finally {
      setIsExporting(false);
    }
  };

  return {
    exportLeads,
    isExporting,
  };
};
