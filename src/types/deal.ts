export interface Deal {
  id: string;
  name: string;
  client: string;
  clientId?: string;
  clientPhone?: string | null;
  clientEmail?: string | null;
  value: number;
  currency: string;
  stage: DealStage;
  probability: number;
  expectedCloseDate: string;
  source: string;
  owner: string;
  ownerId?: string;
  ownerAvatar?: string;
  website?: string; // New: website for the deal
  rating?: number; // New: rating for the deal (0-5)
  assigneeId?: string; // New: assignee user id
  assigneeName?: string; // New: assignee display name (optional, for UI)
  assigneeAvatar?: string; // New: assignee avatar (optional, for UI)
  tags: string[];
  priority: 'Low' | 'Medium' | 'High';
  created_at: string;
  updated_at: string;
  notes?: string;
  description?: string;
  activities?: DealActivity[];
  files?: DealFile[];
}

export type DealStage = 'Prospect' | 'Lead' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Won/Lost';

export interface PipelineStage {
  id: string;
  name: DealStage;
  color: string;
  icon: string;
  order: number;
}

export interface DealActivity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'task';
  title: string;
  description: string;
  date: string;
  user: string;
}

export interface DealFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  uploadedBy: string;
  url: string;
}

export interface DealFilters {
  stages: DealStage[];
  owners: string[];
  valueRange: [number, number];
  dateRange: {
    start: string;
    end: string;
  };
  sources: string[];
  tags: string[];
  search: string;
}
