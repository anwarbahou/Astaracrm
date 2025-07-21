import { useState } from 'react';
import { Deal, DealStage } from '@/types/deal';

interface DealFormData {
  name: string;
  client: string;
  clientId: string;
  clientPhone?: string;
  clientEmail?: string;
  value: number;
  currency: string;
  stage: DealStage;
  probability: number;
  expectedCloseDate: string;
  source: string;
  owner: string;
  ownerId: string;
  priority: 'Low' | 'Medium' | 'High';
  tags: string[];
  notes: string;
  description?: string;
}

const initialFormData: DealFormData = {
  name: '',
  client: '',
  clientId: '',
  clientPhone: '',
  clientEmail: '',
  value: 0,
  currency: 'MAD',
  stage: 'Prospect',
  probability: 25,
  expectedCloseDate: '',
  source: '',
  owner: '',
  ownerId: '',
  priority: 'Medium',
  tags: [],
  notes: '',
  description: ''
};

export function useDealForm() {
  const [formData, setFormData] = useState<DealFormData>(initialFormData);

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const validateForm = (): boolean => {
    // Required fields: name, clientId (assign client), expectedCloseDate, value, ownerId
    return !!(
      formData.name.trim() && 
      formData.clientId && 
      formData.expectedCloseDate && 
      formData.value > 0 &&
      formData.ownerId
    );
  };

  const convertToDeal = (): Omit<Deal, 'id' | 'created_at' | 'updated_at' | 'activities'> => {
    return {
      name: formData.name,
      client: formData.client,
      clientId: formData.clientId,
      clientPhone: formData.clientPhone,
      clientEmail: formData.clientEmail,
      value: formData.value,
      currency: formData.currency,
      stage: formData.stage,
      probability: formData.probability,
      expectedCloseDate: formData.expectedCloseDate,
      source: formData.source,
      owner: formData.owner,
      ownerId: formData.ownerId,
      tags: formData.tags,
      priority: formData.priority,
      notes: formData.notes,
      description: formData.description
    };
  };

  return {
    formData,
    updateField,
    resetForm,
    validateForm,
    convertToDeal
  };
}
