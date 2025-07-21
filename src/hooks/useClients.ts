import { useState } from 'react';
import { Client } from "@/types/client";
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/types/supabase';
import { useQuery, useQueryClient } from '@tanstack/react-query';

type SupabaseClient = Database['public']['Tables']['clients']['Row'];

const convertSupabaseClient = (client: SupabaseClient & { owner: any }): Client => ({
    id: client.id,
    name: client.name || '',
    email: client.email || '',
    industry: client.industry || '',
    stage: (client.stage === 'lead' || client.stage === 'prospect' || client.stage === 'active' || client.stage === 'inactive') ? client.stage : 'lead',
    tags: client.tags || [],
    country: client.country || '',
    contactsCount: client.contacts_count || 0,
    totalDealValue: Number(client.total_deal_value) || 0,
    status: client.status === 'active' ? 'Active' : 'Archived',
    owner: client.owner ? `${client.owner.first_name} ${client.owner.last_name}` : '',
    createdDate: client.created_at || new Date().toISOString(),
    lastInteraction: client.updated_at || new Date().toISOString(),
    notes: client.notes || '',
    phone: client.phone || '',
    // Removed website and address as they are not in Client type
    // avatarUrl: client.avatar_url || '',
});

export const useClients = () => {
    const queryClient = useQueryClient();
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

    const { data: clients = [], isLoading, error, refetch } = useQuery({
        queryKey: ['clients'],
        queryFn: async () => {
            const { data, error: supabaseError } = await supabase
                .from('clients')
                .select(`
                    *,
                    owner:users!clients_owner_id_fkey (
                        id,
                        first_name,
                        last_name,
                        email
                    )
                `)
                .order('created_at', { ascending: false });

            if (supabaseError) {
                console.error('Error fetching clients:', supabaseError);
                throw supabaseError;
            }

            return data?.map((client) => convertSupabaseClient({
                ...client,
                owner: client.owner
            })) || [];
        },
        staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
        retry: 3, // Retry failed requests 3 times
        refetchOnWindowFocus: true, // Refetch when window regains focus
        refetchOnReconnect: true, // Refetch when internet reconnects
    });

    const handleClientClick = (client: Client) => {
        setSelectedClient(client);
        setProfileModalOpen(true);
    };

    const handleSaveClient = async (updatedClient: Client) => {
        try {
            // Optimistically update the UI
            queryClient.setQueryData(['clients'], (oldData: Client[] = []) => {
                return oldData.map(client => 
                    client.id === updatedClient.id ? updatedClient : client
                );
            });

            // Perform the actual update
            const { error: updateError } = await supabase
                .from('clients')
                .update({
                    name: updatedClient.name,
                    email: updatedClient.email,
                    industry: updatedClient.industry,
                    stage: updatedClient.stage as 'lead' | 'prospect' | 'active' | 'inactive',
                    tags: updatedClient.tags,
                    country: updatedClient.country,
                    status: updatedClient.status === 'Active' ? 'active' : 'inactive',
                    notes: updatedClient.notes,
                    phone: updatedClient.phone,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', updatedClient.id);

            if (updateError) {
                throw updateError;
            }

            // Refetch to ensure consistency
            await refetch();
            return true;
        } catch (err) {
            // Revert optimistic update on error
            await refetch();
            console.error('Error saving client:', err);
            return false;
        }
    };

    return {
        clients,
        loading: isLoading,
        error: error ? (error as Error).message : null,
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
        refreshClients: refetch,
    };
};

export interface ClientOption {
  id: string;
  name: string;
  email?: string;
  owner_id?: string;
}

export function useClientsForSelection() {
  const { data: clients = [], isLoading, error } = useQuery({
    queryKey: ['clients-selection'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('id, name, email, owner_id')
        .eq('status', 'active')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching clients:', error);
        throw error;
      }

      return data?.map((client): ClientOption => ({
        id: client.id,
        name: client.name,
        email: client.email || undefined,
        owner_id: client.owner_id
      })) || [];
    },
  });

  return {
    clients,
    isLoading,
    error
  };
}
