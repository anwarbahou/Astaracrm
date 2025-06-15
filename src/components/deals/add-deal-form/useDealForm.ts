
import { useState } from 'react';
import { Deal, DealStage } from '@/types/deal';

interface DealFormData {
  name: string;
  client: string;
  value: number;
  stage: DealStage;
  probability: number;
  expectedCloseDate: string;
  source: string;
  owner: string;
  priority: 'Low' | 'Medium' | 'High';
  tags: string[];
  notes: string;
}

const initialFormData: DealFormData = {
  name: '',
  client: '',
  value: 0,
  stage: 'Prospect',
  probability: 25,
  expectedCloseDate: '',
  source: '',
  owner: 'John Doe',
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
    return !!(formData.name && formData.client && formData.expectedCloseDate);
  };

  const convertToDeal = (): Omit<Deal, 'id' | 'createdAt' | 'updatedAt'> => {
    return {
      name: formData.name,
      client: formData.client,
      value: formData.value,
      currency: 'MAD',
      stage: formData.stage,
      probability: formData.probability,
      expectedCloseDate: formData.expectedCloseDate,
      source: formData.source,
      owner: formData.owner,
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
