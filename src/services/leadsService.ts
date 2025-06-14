
// Mock implementation to avoid TypeScript errors until database is properly set up
export interface LeadFilters {
  industries?: string[];
  countries?: string[];
  jobTitles?: string[];
  companySizes?: string[];
  experience?: string[];
  languages?: string[];
  tags?: string[];
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
  experience?: string;
  companySize?: string;
  language?: string;
  leadScore: number;
  source: string;
  dateAdded: string;
  status: string;
  tags: string[];
}

export interface SavedFilter {
  id: string;
  name: string;
  filters: LeadFilters;
  createdAt: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface LeadsResponse {
  leads: GeneratedLead[];
  pagination: PaginationInfo;
}

// Mock data for development
const mockLeads: GeneratedLead[] = [
  {
    id: '1',
    fullName: 'Ahmed Ben Khalil',
    jobTitle: 'Marketing Director',
    company: 'TechCorp Morocco',
    country: 'Morocco',
    industry: 'Technology',
    email: 'ahmed.khalil@techcorp.ma',
    phone: '+212 6 12 34 56 78',
    linkedin: 'https://linkedin.com/in/ahmed-khalil',
    experience: '5-10 years',
    companySize: '100-500',
    language: 'fr',
    leadScore: 85,
    source: 'ai_generated',
    dateAdded: new Date().toISOString(),
    status: 'new',
    tags: ['hot-lead', 'morocco']
  }
];

const mockSavedFilters: SavedFilter[] = [
  {
    id: '1',
    name: 'Morocco Tech Directors',
    filters: {
      countries: ['Morocco'],
      industries: ['Technology'],
      jobTitles: ['Director', 'Manager']
    },
    createdAt: new Date().toISOString()
  }
];

export const leadsService = {
  async getLeads(params: any = {}): Promise<LeadsResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      leads: mockLeads,
      pagination: {
        page: params.page || 1,
        limit: params.limit || 10,
        total: mockLeads.length,
        totalPages: 1
      }
    };
  },

  async getLead(leadId: string): Promise<GeneratedLead | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockLeads.find(lead => lead.id === leadId) || null;
  },

  async generateLeads(filters: LeadFilters): Promise<{ count: number; leads: GeneratedLead[] }> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      count: mockLeads.length,
      leads: mockLeads
    };
  },

  async updateLeadStatus(leadId: string, status: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const lead = mockLeads.find(l => l.id === leadId);
    if (lead) {
      lead.status = status;
    }
  },

  async deleteLeads(leadIds: string[]): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`Mock: Deleted leads ${leadIds.join(', ')}`);
  },

  async createCampaign(campaignData: any): Promise<{ id: string; leadCount: number }> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      id: 'campaign-' + Date.now(),
      leadCount: campaignData.leadIds.length
    };
  },

  async getSavedFilters(): Promise<SavedFilter[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockSavedFilters;
  },

  async saveFilters(name: string, filters: LeadFilters): Promise<SavedFilter> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newFilter: SavedFilter = {
      id: 'filter-' + Date.now(),
      name,
      filters,
      createdAt: new Date().toISOString()
    };
    mockSavedFilters.push(newFilter);
    return newFilter;
  },

  async exportLeads(leadIds: string[], format: 'csv' | 'json' = 'csv'): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const leadsToExport = mockLeads.filter(lead => leadIds.includes(lead.id));
    
    if (format === 'json') {
      return JSON.stringify(leadsToExport, null, 2);
    } else {
      // CSV format
      const headers = 'Name,Job Title,Company,Country,Industry,Email,Phone,LinkedIn,Status\n';
      const rows = leadsToExport.map(lead => 
        `"${lead.fullName}","${lead.jobTitle}","${lead.company}","${lead.country}","${lead.industry}","${lead.email}","${lead.phone || ''}","${lead.linkedin || ''}","${lead.status}"`
      ).join('\n');
      return headers + rows;
    }
  }
};
