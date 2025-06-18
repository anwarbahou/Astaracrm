import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Client = Database['public']['Tables']['clients']['Row'];
type User = Database['public']['Tables']['users']['Row'];

export interface ClientProfile extends Client {
  owner?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string;
    avatar_url: string | null;
  };
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
          owner:owner_id (
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

      return data;
    } catch (error) {
      console.error('Error in getClientProfile:', error);
      return null;
    }
  }

  // Update client profile
  static async updateClient(clientId: string, updates: Partial<ClientProfile>): Promise<boolean> {
    try {
      // Extract only the database fields, excluding nested objects like 'owner'
      const {
        owner, // Remove owner object
        ...dbUpdates
      } = updates;

      const { error } = await supabase
        .from('clients')
        .update({
          ...dbUpdates,
          updated_at: new Date().toISOString()
        })
        .eq('id', clientId);

      if (error) {
        console.error('Error updating client:', error);
        return false;
      }

      console.log('✅ Client updated successfully:', clientId);
      return true;
    } catch (error) {
      console.error('Error in updateClient:', error);
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
        type: 'note_created',
        title: 'Product demonstration completed',
        description: 'Demonstrated key features and answered questions',
        user_id: '1',
        user: { first_name: 'You', last_name: '' },
        created_at: '2024-01-12T15:00:00Z',
      },
    ];
  }

  // Get client documents (mock data for now)
  static async getClientDocuments(clientId: string): Promise<Document[]> {
    return [];
  }

  // Calculate total deal value for a client
  static async calculateClientDealValue(clientId: string): Promise<number> {
    const deals = await this.getClientDeals(clientId);
    return deals
      .filter(deal => deal.stage === 'won')
      .reduce((total, deal) => total + deal.value, 0);
  }

  // Get deal count for a client
  static async getClientDealCount(clientId: string): Promise<number> {
    const deals = await this.getClientDeals(clientId);
    return deals.filter(deal => deal.stage !== 'won' && deal.stage !== 'lost').length;
  }
} 