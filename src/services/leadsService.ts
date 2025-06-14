
import { supabase } from "@/integrations/supabase/client";

export interface LeadFilters {
  industry: string;
  country: string;
  jobTitle: string;
  companySize?: string;
  experience?: string;
  language?: string;
  count?: number;
}

export interface GeneratedLead {
  id: string;
  fullName: string;
  jobTitle: string;
  company: string;
  country: string;
  industry: string;
  email: string;
  phone?: string;
  linkedin?: string;
  experience: string;
  companySize: string;
  language: string;
  leadScore: number;
  source: string;
  dateAdded: string;
  status: string;
  tags: string[];
  userId: string;
}

export interface LeadsPaginationResponse {
  leads: GeneratedLead[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface Campaign {
  id: string;
  name: string;
  message_template: string;
  duration?: string;
  budget?: number;
  status: string;
  user_id: string;
  created_at: string;
}

export interface SavedFilter {
  id: string;
  name: string;
  filters: LeadFilters;
  user_id: string;
  created_at: string;
}

class LeadsService {
  private async getAuthHeaders() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error('No authentication token found');
    }
    return {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    };
  }

  async generateLeads(filters: LeadFilters): Promise<{ leads: GeneratedLead[]; count: number; filters: LeadFilters }> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-leads`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({ filters }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate leads');
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating leads:', error);
      throw error;
    }
  }

  async getLeads(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    industry?: string;
    country?: string;
  } = {}): Promise<LeadsPaginationResponse> {
    try {
      const headers = await this.getAuthHeaders();
      const searchParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          searchParams.append(key, value.toString());
        }
      });

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/leads-api/leads?${searchParams.toString()}`,
        {
          method: 'GET',
          headers,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch leads');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching leads:', error);
      throw error;
    }
  }

  async getLead(leadId: string): Promise<GeneratedLead> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/leads-api/lead/${leadId}`,
        {
          method: 'GET',
          headers,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch lead');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching lead:', error);
      throw error;
    }
  }

  async createCampaign(campaignData: {
    name: string;
    leadIds: string[];
    messageTemplate: string;
    duration?: string;
    budget?: number;
    status?: string;
  }): Promise<{ campaign: Campaign; leadCount: number }> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/leads-api/campaigns`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify(campaignData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create campaign');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  }

  async saveFilters(name: string, filters: LeadFilters): Promise<SavedFilter> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/leads-api/filters/saved`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({ name, filters }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save filters');
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving filters:', error);
      throw error;
    }
  }

  async getSavedFilters(): Promise<SavedFilter[]> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/leads-api/filters/saved`,
        {
          method: 'GET',
          headers,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch saved filters');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching saved filters:', error);
      throw error;
    }
  }

  async updateLeadStatus(leadId: string, status: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('generated_leads')
        .update({ status })
        .eq('id', leadId);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error updating lead status:', error);
      throw error;
    }
  }

  async deleteLeads(leadIds: string[]): Promise<void> {
    try {
      const { error } = await supabase
        .from('generated_leads')
        .delete()
        .in('id', leadIds);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error deleting leads:', error);
      throw error;
    }
  }

  async exportLeads(leadIds: string[], format: 'csv' | 'json' = 'csv'): Promise<string> {
    try {
      const { data: leads, error } = await supabase
        .from('generated_leads')
        .select('*')
        .in('id', leadIds);

      if (error) {
        throw error;
      }

      if (format === 'json') {
        return JSON.stringify(leads, null, 2);
      }

      // CSV export
      if (!leads || leads.length === 0) {
        return '';
      }

      const headers = Object.keys(leads[0]).join(',');
      const rows = leads.map(lead => 
        Object.values(lead).map(value => 
          typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
        ).join(',')
      );

      return [headers, ...rows].join('\n');
    } catch (error) {
      console.error('Error exporting leads:', error);
      throw error;
    }
  }
}

export const leadsService = new LeadsService();
