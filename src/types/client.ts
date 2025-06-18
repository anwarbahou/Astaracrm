export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  industry: string;
  stage: string;
  tags: string[];
  owner: string;
  country: string;
  contactsCount: number;
  totalDealValue: number;
  createdDate: string;
  lastInteraction: string;
  status: 'Active' | 'Archived';
  notes?: string;
}

export interface ClientFilters {
  owner: string;
  stage: string;
  industry: string;
  country: string;
  status: string;
  tags: string[];
  dateCreatedFrom: string;
  dateCreatedTo: string;
  lastInteractionFrom: string;
  lastInteractionTo: string;
}
