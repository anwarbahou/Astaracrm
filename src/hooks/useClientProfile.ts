import { useState, useEffect } from 'react';
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
  const [client, setClient] = useState<ClientProfile | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadClientData = async (id: string) => {
    console.log('🚀 useClientProfile.loadClientData called with id:', id);
    setLoading(true);
    setError(null);
    
    try {
      // Load all client-related data in parallel
      const [
        clientData,
        contactsData,
        dealsData,
        activitiesData,
        documentsData
      ] = await Promise.all([
        ClientService.getClientProfile(id),
        ClientService.getClientContacts(id),
        ClientService.getClientDeals(id),
        ClientService.getClientActivities(id),
        ClientService.getClientDocuments(id)
      ]);

      console.log('📦 useClientProfile - clientData:', clientData);
      console.log('👥 useClientProfile - contactsData:', contactsData);
      console.log('💼 useClientProfile - dealsData:', dealsData);

      setClient(clientData);
      setContacts(contactsData);
      setDeals(dealsData);
      setActivities(activitiesData);
      setDocuments(documentsData);

      console.log('✅ useClientProfile - all data set successfully');
    } catch (err) {
      console.error('❌ useClientProfile - Error loading client data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load client data');
    } finally {
      console.log('🏁 useClientProfile - loadClientData finished, setting loading to false');
      setLoading(false);
    }
  };

  const refreshData = async () => {
    if (clientId) {
      await loadClientData(clientId);
    }
  };

  const updateClient = async (updates: Partial<ClientProfile>): Promise<boolean> => {
    if (!clientId) return false;
    
    const success = await ClientService.updateClient(clientId, updates);
    if (success && client) {
      // Update local state optimistically
      setClient({ ...client, ...updates });
    }
    return success;
  };

  useEffect(() => {
    console.log('🔄 useClientProfile useEffect triggered with clientId:', clientId);
    
    if (clientId) {
      console.log('🔍 Loading client data for ID:', clientId);
      loadClientData(clientId);
    } else {
      console.log('🚫 No clientId provided, resetting state');
      // Reset state when clientId is null
      setClient(null);
      setContacts([]);
      setDeals([]);
      setActivities([]);
      setDocuments([]);
      setError(null);
      setLoading(false);
    }
  }, [clientId]);

  // Add logging whenever state changes
  useEffect(() => {
    console.log('📊 Client state changed:', { 
      client: client ? { id: client.id, name: client.name } : null, 
      loading, 
      error 
    });
  }, [client, loading, error]);

  return {
    client,
    contacts,
    deals,
    activities,
    documents,
    loading,
    error,
    refreshData,
    updateClient,
  };
} 