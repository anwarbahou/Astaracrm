
import { Deal, DealStage } from '@/types/deal';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AddDealModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export function AddDealModal({ open, onOpenChange, onSubmit }: AddDealModalProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    value: 0,
    stage: 'Prospect' as DealStage,
    probability: 25,
    expectedCloseDate: '',
    source: '',
    owner: 'John Doe',
    priority: 'Medium' as 'Low' | 'Medium' | 'High',
    tags: [] as string[],
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.client || !formData.expectedCloseDate) {
      alert('Please fill in all required fields');
      return;
    }

    const newDeal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'> = {
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

    onSubmit(newDeal);
    onOpenChange(false);
    resetForm();
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
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
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('deals.addDealModal.title')}</DialogTitle>
          <DialogDescription>
            {t('deals.addDealModal.description')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="dealName">{t('deals.addDealModal.dealNameLabel')}</Label>
              <Input
                id="dealName"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder={t('deals.addDealModal.dealNamePlaceholder')}
                required
              />
            </div>

            <div>
              <Label htmlFor="client">{t('deals.addDealModal.clientLabel')}</Label>
              <Input
                id="client"
                value={formData.client}
                onChange={(e) => updateField('client', e.target.value)}
                placeholder={t('deals.addDealModal.clientPlaceholder')}
                required
              />
            </div>

            <div>
              <Label htmlFor="value">{t('deals.addDealModal.valueLabel')}</Label>
              <Input
                id="value"
                type="number"
                value={formData.value}
                onChange={(e) => updateField('value', parseInt(e.target.value) || 0)}
                placeholder="0"
                required
              />
            </div>

            <div>
              <Label htmlFor="stage">{t('deals.addDealModal.stageLabel')}</Label>
              <Select value={formData.stage} onValueChange={(value) => updateField('stage', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('deals.addDealModal.stagePlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Prospect">{t('deals.stages.prospect')}</SelectItem>
                  <SelectItem value="Lead">{t('deals.stages.lead')}</SelectItem>
                  <SelectItem value="Qualified">{t('deals.stages.qualified')}</SelectItem>
                  <SelectItem value="Negotiation">{t('deals.stages.negotiation')}</SelectItem>
                  <SelectItem value="Won/Lost">{t('deals.stages.won-lost')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="probability">{t('deals.addDealModal.probabilityLabel')}</Label>
              <Input
                id="probability"
                type="number"
                min="0"
                max="100"
                value={formData.probability}
                onChange={(e) => updateField('probability', parseInt(e.target.value) || 0)}
              />
            </div>

            <div>
              <Label htmlFor="closeDate">{t('deals.addDealModal.closeDateLabel')}</Label>
              <Input
                id="closeDate"
                type="date"
                value={formData.expectedCloseDate}
                onChange={(e) => updateField('expectedCloseDate', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="source">{t('deals.addDealModal.sourceLabel')}</Label>
              <Input
                id="source"
                value={formData.source}
                onChange={(e) => updateField('source', e.target.value)}
                placeholder={t('deals.addDealModal.sourcePlaceholder')}
              />
            </div>

            <div>
              <Label htmlFor="owner">{t('deals.addDealModal.ownerLabel')}</Label>
              <Select value={formData.owner} onValueChange={(value) => updateField('owner', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('deals.addDealModal.ownerPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="John Doe">John Doe</SelectItem>
                  <SelectItem value="Sarah Smith">Sarah Smith</SelectItem>
                  <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                  <SelectItem value="Emily Davis">Emily Davis</SelectItem>
                  <SelectItem value="David Wilson">David Wilson</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">{t('deals.addDealModal.priorityLabel')}</Label>
              <Select value={formData.priority} onValueChange={(value) => updateField('priority', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('deals.addDealModal.priorityPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">{t('dashboard.priority.low')}</SelectItem>
                  <SelectItem value="Medium">{t('dashboard.priority.medium')}</SelectItem>
                  <SelectItem value="High">{t('dashboard.priority.high')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2">
              <Label htmlFor="notes">{t('deals.addDealModal.notesLabel')}</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                placeholder={t('deals.addDealModal.notesPlaceholder')}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit">{t('deals.addDealModal.createButton')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
