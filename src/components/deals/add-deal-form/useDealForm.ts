import { useState } from 'react';
import { Deal, DealStage } from '@/types/deal';

interface DealFormData {
  name: string;
  client: string;
  clientId: string;
  value: number;
  stage: DealStage;
  probability: number;
  expectedCloseDate: string;
  source: string;
  owner: string;
  ownerId: string;
  priority: 'Low' | 'Medium' | 'High';
  tags: string[];
  notes: string;
}

const initialFormData: DealFormData = {
  name: '',
  client: '',
  clientId: '',
  value: 0,
  stage: 'Prospect',
  probability: 25,
  expectedCloseDate: '',
  source: '',
  owner: '',
  ownerId: '',
  priority: 'Medium',
  tags: [],
  notes: ''
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

  const convertToDeal = (): Omit<Deal, 'id' | 'createdAt' | 'updatedAt'> => {
    return {
      name: formData.name,
      client: formData.client,
      clientId: formData.clientId,
      value: formData.value,
      currency: 'MAD',
      stage: formData.stage,
      probability: formData.probability,
      expectedCloseDate: formData.expectedCloseDate,
      source: formData.source,
      owner: formData.owner,
      ownerId: formData.ownerId,
      tags: formData.tags,
      priority: formData.priority,
      notes: formData.notes,
      activities: []
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
