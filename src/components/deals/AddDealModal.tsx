
import { Deal } from '@/types/deal';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { BasicInfoFields, DealDetailsFields, useDealForm } from './add-deal-form';

interface AddDealModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export function AddDealModal({ open, onOpenChange, onSubmit }: AddDealModalProps) {
  const { t } = useTranslation();
  const { formData, updateField, resetForm, validateForm, convertToDeal } = useDealForm();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('Please fill in all required fields');
      return;
    }

    const newDeal = convertToDeal();
    onSubmit(newDeal);
    onOpenChange(false);
    resetForm();
  };

  const handleClose = () => {
    onOpenChange(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('addDealModal.title')}</DialogTitle>
          <DialogDescription>
            {t('addDealModal.description')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <BasicInfoFields formData={formData} onUpdateField={updateField} />
            <DealDetailsFields formData={formData} onUpdateField={updateField} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              {t('common.cancel')}
            </Button>
            <Button type="submit">{t('addDealModal.submitButton')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
