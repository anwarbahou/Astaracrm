
import { Deal } from '@/types/deal';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AddDealForm } from './AddDealForm';

interface AddDealModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export function AddDealModal({ open, onOpenChange, onSubmit }: AddDealModalProps) {
  const { t } = useTranslation();

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleSubmit = (deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => {
    onSubmit(deal);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('deals.addDealModal.title')}</DialogTitle>
          <DialogDescription>
            {t('deals.addDealModal.description')}
          </DialogDescription>
        </DialogHeader>
        <AddDealForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </DialogContent>
    </Dialog>
  );
}
