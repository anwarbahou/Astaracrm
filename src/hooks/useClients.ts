import { useState, useEffect } from 'react';
import { Client } from "@/types/client";
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type SupabaseClient = Database['public']['Tables']['clients']['Row'];

// Function to convert Supabase client to our Client type
const convertSupabaseClient = (supabaseClient: any): Client => ({
  id: supabaseClient.id,
  name: supabaseClient.name,
  email: supabaseClient.email || '',
  phone: supabaseClient.phone || '',
  industry: supabaseClient.industry || '',
  stage: supabaseClient.stage || 'lead',
  tags: supabaseClient.tags || [],
  owner: supabaseClient.owner ? 
    `${supabaseClient.owner.first_name || ''} ${supabaseClient.owner.last_name || ''}`.trim() || supabaseClient.owner.email 
    : 'Unassigned',
  country: supabaseClient.country || '',
  contactsCount: supabaseClient.contacts_count || 0,
  totalDealValue: supabaseClient.total_deal_value || 0,
  createdDate: supabaseClient.created_at ? new Date(supabaseClient.created_at).toISOString().split('T')[0] : '',
  lastInteraction: supabaseClient.updated_at ? new Date(supabaseClient.updated_at).toISOString().split('T')[0] : '',
  status: supabaseClient.status === 'active' ? 'Active' : 'Archived',
  notes: supabaseClient.notes || '',
});

export const useClients = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [addClientOpen, setAddClientOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [profileModalOpen, setProfileModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        owner: '',
        stage: '',
        industry: '',
        country: '',
        status: '',
        tags: [] as string[],
        dateCreatedFrom: '',
        dateCreatedTo: '',
        lastInteractionFrom: '',
        lastInteractionTo: '',
    });

    const fetchClients = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const { data, error: supabaseError } = await supabase
                .from('clients')
                .select(`
                    *,
                    owner:owner_id (
                        id,
                        first_name,
                        last_name,
                        email
                    )
                `)
                .order('created_at', { ascending: false });

            if (supabaseError) {
                console.error('Error fetching clients:', supabaseError);
                setError(supabaseError.message);
                return;
            }

            const convertedClients = data?.map(convertSupabaseClient) || [];
            setClients(convertedClients);
            
        } catch (err) {
            console.error('Unexpected error fetching clients:', err);
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const handleClientClick = (client: Client) => {
        setSelectedClient(client);
        setProfileModalOpen(true);
    };

    const handleSaveClient = (updatedClient: Client) => {
        // In a real app, this would update the client in the database
        console.log('Saving client:', updatedClient);
    };

    const refreshClients = () => {
        fetchClients();
    };

    return {
        clients,
        loading,
        error,
        searchQuery,
        setSearchQuery,
        addClientOpen,
        setAddClientOpen,
        selectedClient,
        profileModalOpen,
        setProfileModalOpen,
        filters,
        setFilters,
        handleClientClick,
        handleSaveClient,
        refreshClients,
    };
}
