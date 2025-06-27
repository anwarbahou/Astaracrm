import { supabase } from '@/integrations/supabase/client';
import { notificationService } from '@/services/notificationService';

type Client = any;

export interface ClientProfile {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  country?: string | null;
  industry?: string | null;
  website?: string | null;
  avatar_url?: string | null;
  notes?: string | null;
  tags?: string[] | null;
  stage?: string | null;
  status?: string | null;
  owner_id?: string | null;
  contacts_count?: number | null;
  total_deal_value?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
  owner?: any;
  users?: any;
  company_name?: string;
  description?: string;
}

export interface ClientInput {
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  country?: string | null;
  industry?: string | null;
  website?: string | null;
  avatar_url?: string | null;
  notes?: string | null;
  tags?: string[] | null;
  stage?: string | null;
  status?: string | null;
  owner_id?: string | null;
  contacts_count?: number | null;
  total_deal_value?: number | null;
}

export interface UserContext {
  userId: string;
  userRole: 'admin' | 'manager' | 'user' | null;
}

export interface Contact {
  id: string;
  client_id: string;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  is_primary?: boolean;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Deal {
  id: string;
  client_id: string;
  title: string;
  description?: string;
  value: number;
  stage: string;
  priority?: string;
  probability?: number;
  close_date?: string;
  assigned_to?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Activity {
  id: string;
  client_id: string;
  type: string;
  title: string;
  description?: string;
  user_id: string;
  user?: {
    first_name?: string;
    last_name?: string;
  };
  created_at?: string;
}

export interface Document {
  id: string;
  client_id: string;
  name: string;
  file_path: string;
  file_size?: number;
  mime_type?: string;
  uploaded_by: string;
  created_at?: string;
}

export class ClientService {
  // Get client profile with owner information
  static async getClientProfile(clientId: string): Promise<ClientProfile | null> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select(`
          *,
          users (
            id,
            first_name,
            last_name,
            email,
            avatar_url
          )
        `)
        .eq('id', clientId)
        .single();

      if (error) {
        console.error('Error fetching client profile:', error);
        return null;
      }

      if (!data) {
        console.warn('No client data returned for ID:', clientId);
        return null;
      }

      // Transform the data to match expected structure
      const transformedData = {
        ...data,
        owner: data.users || null
      };

      return transformedData;
    } catch (error) {
      console.error('Error in getClientProfile:', error);
      return null;
    }
  }

  // Update client profile
  static async updateClient(clientId: string, updates: Partial<ClientProfile>): Promise<boolean> {
    try {
      // Only include fields that exist in the database table
      const {
        id,
        owner,
        users,
        company_name,
        description,
        created_at,
        updated_at,
        ...validUpdates
      } = updates;

      const { error } = await supabase
        .from('clients')
        .update({
          ...validUpdates,
          updated_at: new Date().toISOString()
        })
        .eq('id', clientId);

      if (error) {
        console.error('Error updating client:', error);
        return false;
      }

      console.log('✅ Client updated successfully:', clientId);

      // Push notification
      const { data: user } = await supabase.auth.getUser();
      if (user?.user?.id) {
        await notificationService.notifyClientUpdated(
          updates.name || '',
          clientId,
          { userId: user.user.id, userRole: 'user' }
        );
      }
      return true;
    } catch (error) {
      console.error('Error in updateClient:', error);
      return false;
    }
  }

  // Delete a client by ID
  static async deleteClient(clientId: string): Promise<boolean> {
    try {
      // Fetch client name before deletion
      const { data: clientData, error: fetchError } = await supabase
        .from('clients')
        .select('name')
        .eq('id', clientId)
        .single();
      if (fetchError) {
        console.error('Error fetching client before deletion:', fetchError);
        return false;
      }

      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);

      if (error) {
        console.error('Error deleting client:', error);
        return false;
      }

      const { data: user } = await supabase.auth.getUser();
      const userRole = user?.user?.user_metadata?.role || 'user';
      if (user?.user?.id && clientData?.name) {
        await notificationService.notifyClientDeleted(
          clientData.name,
          clientId,
          { userId: user.user.id, userRole }
        );
      }

      return true;
    } catch (error) {
      console.error('Error in deleteClient:', error);
      return false;
    }
  }

  // Get client contacts (mock data for now until table is created)
  static async getClientContacts(clientId: string): Promise<Contact[]> {
    // Mock data - replace with real Supabase query once contacts table is created
    return [
      {
        id: '1',
        client_id: clientId,
        name: 'John Smith',
        role: 'CEO',
        email: 'john@company.com',
        phone: '+212 661 234567',
        is_primary: true,
      },
      {
        id: '2',
        client_id: clientId,
        name: 'Sarah Johnson',
        role: 'CTO',
        email: 'sarah@company.com',
        phone: '+212 661 234568',
        is_primary: false,
      },
      {
        id: '3',
        client_id: clientId,
        name: 'Mike Wilson',
        role: 'Procurement',
        email: 'mike@company.com',
        phone: '+212 661 234569',
        is_primary: false,
      },
    ];
  }

  // Get client deals (mock data for now)
  static async getClientDeals(clientId: string): Promise<Deal[]> {
    return [
      {
        id: '1',
        client_id: clientId,
        title: 'Q4 Software License',
        value: 45000,
        stage: 'negotiation',
        probability: 75,
        close_date: '2024-12-31',
      },
      {
        id: '2',
        client_id: clientId,
        title: 'Consulting Services',
        value: 25000,
        stage: 'proposal',
        probability: 60,
        close_date: '2025-01-15',
      },
      {
        id: '3',
        client_id: clientId,
        title: 'Support Package',
        value: 15000,
        stage: 'won',
        probability: 100,
        close_date: '2024-11-15',
      },
    ];
  }

  // Get client activities (mock data for now)
  static async getClientActivities(clientId: string): Promise<Activity[]> {
    return [
      {
        id: '1',
        client_id: clientId,
        type: 'email_sent',
        title: 'Sent proposal for new project',
        description: 'Detailed project proposal with timeline and pricing',
        user_id: '1',
        user: { first_name: 'You', last_name: '' },
        created_at: '2024-01-15T14:30:00Z',
      },
      {
        id: '2',
        client_id: clientId,
        type: 'meeting_scheduled',
        title: 'Discovery call with John Smith',
        description: 'Initial discovery call to understand requirements',
        user_id: '2',
        user: { first_name: 'Sarah', last_name: 'Davis' },
        created_at: '2024-01-14T10:00:00Z',
      },
      {
        id: '3',
        client_id: clientId,
        type: 'note_added',
        title: 'Meeting notes',
        description: 'Key takeaways from client meeting',
        user_id: '1',
        user: { first_name: 'You', last_name: '' },
        created_at: '2024-01-10T09:00:00Z',
      },
    ];
  }

  // Get client documents (mock data for now)
  static async getClientDocuments(clientId: string): Promise<Document[]> {
    return [
      {
        id: '1',
        client_id: clientId,
        name: 'Project Proposal v1.2.pdf',
        file_path: '/documents/proposal_v1.2.pdf',
        file_size: 1024 * 500, // 500 KB
        mime_type: 'application/pdf',
        uploaded_by: 'John Doe',
        created_at: '2024-01-15T16:00:00Z',
      },
      {
        id: '2',
        client_id: clientId,
        name: 'Contract_ClientA.docx',
        file_path: '/documents/contract_clientA.docx',
        file_size: 1024 * 120, // 120 KB
        mime_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        uploaded_by: 'Jane Smith',
        created_at: '2024-01-10T11:00:00Z',
      },
    ];
  }

  // Calculate total deal value for a client
  static async calculateClientDealValue(clientId: string): Promise<number> {
    const deals = await ClientService.getClientDeals(clientId); // Using mock data
    return deals.reduce((sum, deal) => sum + deal.value, 0);
  }

  // Get count of deals for a client
  static async getClientDealCount(clientId: string): Promise<number> {
    const deals = await ClientService.getClientDeals(clientId); // Using mock data
    return deals.length;
  }

  static async importClients(
    clientsToImport: ClientInput[],
    options: UserContext
  ): Promise<void> {
    const { userId, userRole } = options;
    try {
      const dbInserts = clientsToImport.map(client => ({
        name: client.name,
        email: client.email || null,
        phone: client.phone || null,
        address: client.address || null,
        country: client.country || null,
        industry: client.industry || null,
        website: client.website || null,
        avatar_url: client.avatar_url || null,
        notes: client.notes || null,
        tags: client.tags || [],
        stage: client.stage || 'lead',
        status: client.status || 'active',
        owner_id: client.owner_id || userId,
        contacts_count: client.contacts_count || 0, 
        total_deal_value: client.total_deal_value || 0,
      }));

      const { error } = await supabase
        .from('clients')
        .insert(dbInserts);

      if (error) {
        console.error('Error importing clients to Supabase:', error);
        throw error;
      }
      console.log(`🔗 Supabase: Successfully imported ${clientsToImport.length} clients.`);

      // Robust notification: fetch all imported clients by email in one query
      const emails = clientsToImport.map(c => c.email).filter(Boolean);
      if (emails.length > 0) {
        const { data: insertedClients, error: fetchError } = await supabase
          .from('clients')
          .select('id, email, name')
          .in('email', emails);
        if (!fetchError && insertedClients) {
          // Map email to id
          const emailToId: Record<string, string> = {};
          insertedClients.forEach(c => {
            if (c.email && c.id) emailToId[c.email] = c.id;
          });
          // Notify for each imported client
          for (const client of clientsToImport) {
            if (client.email && emailToId[client.email]) {
              await notificationService.notifyClientAdded(
                client.name,
                emailToId[client.email],
                { userId, userRole }
              );
            }
          }
        }
      }
    } catch (error) {
      console.error('Error importing clients:', error);
      throw error;
    }
  }

  // Add this method for creating a client with duplicate check and owner info
  static async createClient(clientInput: ClientInput, options: UserContext): Promise<{ success: boolean, message?: string, owner?: string }> {
    const { userId } = options;
    try {
      // Check if a client with the same email exists
      if (clientInput.email) {
        const { data: existing, error: findError } = await supabase
          .from('clients')
          .select('id, name, email, owner_id')
          .eq('email', clientInput.email)
          .single();
        if (!findError && existing) {
          // Optionally fetch owner info
          let ownerName = 'Unknown';
          if (existing.owner_id) {
            const { data: ownerUser } = await supabase
              .from('users')
              .select('first_name, last_name, email')
              .eq('id', existing.owner_id)
              .single();
            if (ownerUser) {
              ownerName = `${ownerUser.first_name || ''} ${ownerUser.last_name || ownerUser.email || ''}`.trim();
            }
          }
          return { success: false, message: 'Client already exists', owner: ownerName };
        }
      }
      // Insert new client
      const { data, error } = await supabase
        .from('clients')
        .insert({ ...clientInput, owner_id: clientInput.owner_id || userId })
        .select()
        .single();
      if (error) {
        return { success: false, message: error.message };
      }
      return { success: true };
    } catch (error) {
      return { success: false, message: (error as any).message };
    }
  }
} 