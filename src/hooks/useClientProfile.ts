import { useQuery, useQueries, useQueryClient } from '@tanstack/react-query';
import { 
  ClientService, 
  ClientProfile, 
  Contact, 
  Deal, 
  Activity, 
  Document 
} from '@/services/clientService';

export interface UseClientProfileData {
  client: ClientProfile | null;
  contacts: Contact[];
  deals: Deal[];
  activities: Activity[];
  documents: Document[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  updateClient: (updates: Partial<ClientProfile>) => Promise<boolean>;
}

export function useClientProfile(clientId: string | null): UseClientProfileData {
  const queryClient = useQueryClient();

  // Queries for each resource
  const clientQuery = useQuery({
    queryKey: ['clientProfile', clientId],
    queryFn: () => clientId ? ClientService.getClientProfile(clientId) : Promise.resolve(null),
    enabled: !!clientId,
    staleTime: 1000 * 60 * 5,
  });
  const contactsQuery = useQuery({
    queryKey: ['clientContacts', clientId],
    queryFn: () => clientId ? ClientService.getClientContacts(clientId) : Promise.resolve([]),
    enabled: !!clientId,
    staleTime: 1000 * 60 * 5,
  });
  const dealsQuery = useQuery({
    queryKey: ['clientDeals', clientId],
    queryFn: () => clientId ? ClientService.getClientDeals(clientId) : Promise.resolve([]),
    enabled: !!clientId,
    staleTime: 1000 * 60 * 5,
  });
  const activitiesQuery = useQuery({
    queryKey: ['clientActivities', clientId],
    queryFn: () => clientId ? ClientService.getClientActivities(clientId) : Promise.resolve([]),
    enabled: !!clientId,
    staleTime: 1000 * 60 * 5,
  });
  const documentsQuery = useQuery({
    queryKey: ['clientDocuments', clientId],
    queryFn: () => clientId ? ClientService.getClientDocuments(clientId) : Promise.resolve([]),
    enabled: !!clientId,
    staleTime: 1000 * 60 * 5,
  });

  const loading = [clientQuery, contactsQuery, dealsQuery, activitiesQuery, documentsQuery].some(q => q.isLoading);
  const error = [clientQuery, contactsQuery, dealsQuery, activitiesQuery, documentsQuery].find(q => q.error)?.error?.message || null;

  const refreshData = async () => {
    if (clientId) {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['clientProfile', clientId] }),
        queryClient.invalidateQueries({ queryKey: ['clientContacts', clientId] }),
        queryClient.invalidateQueries({ queryKey: ['clientDeals', clientId] }),
        queryClient.invalidateQueries({ queryKey: ['clientActivities', clientId] }),
        queryClient.invalidateQueries({ queryKey: ['clientDocuments', clientId] }),
      ]);
    }
  };

  const updateClient = async (updates: Partial<ClientProfile>): Promise<boolean> => {
    if (!clientId) return false;
    const success = await ClientService.updateClient(clientId, updates);
    if (success) {
      // Optimistically update cache
      queryClient.setQueryData(['clientProfile', clientId], (old: ClientProfile | null) => old ? { ...old, ...updates } : old);
    }
    return success;
  };

  return {
    client: clientQuery.data ?? null,
    contacts: contactsQuery.data ?? [],
    deals: dealsQuery.data ?? [],
    activities: activitiesQuery.data ?? [],
    documents: documentsQuery.data ?? [],
    loading,
    error,
    refreshData,
    updateClient,
  };
} 