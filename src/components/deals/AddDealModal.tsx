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
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { BasicInfoFields, DealDetailsFields, useDealForm } from './add-deal-form';
import { useState } from 'react';

interface AddDealModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export function AddDealModal({ open, onOpenChange, onSubmit }: AddDealModalProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { formData, updateField, resetForm, validateForm, convertToDeal } = useDealForm();
  const [showValidationError, setShowValidationError] = useState(false);

  const getValidationErrors = () => {
    const errors = [];
    if (!formData.name.trim()) errors.push('Deal name');
    if (!formData.clientId) errors.push('Client assignment');
    if (!formData.expectedCloseDate) errors.push('Expected close date');
    if (formData.value <= 0) errors.push('Deal value (must be greater than 0)');
    if (!formData.ownerId) errors.push('Deal owner');
    return errors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      const errors = getValidationErrors();
      setShowValidationError(true);
      toast({
        title: "Required Fields Missing",
        description: `Please fill in: ${errors.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    const newDeal = convertToDeal();
    onSubmit(newDeal);
    onOpenChange(false);
    resetForm();
    setShowValidationError(false);
  };

  const handleClose = () => {
    onOpenChange(false);
    resetForm();
    setShowValidationError(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('addDealModal.title')}</DialogTitle>
          <DialogDescription>
            {t('addDealModal.description')}
            <br />
            <span className="text-sm text-muted-foreground mt-2 block">
              Fields marked with <span className="text-red-500">*</span> are required
            </span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <BasicInfoFields formData={formData} onUpdateField={updateField} />
            <DealDetailsFields formData={formData} onUpdateField={updateField} />
          </div>

          {showValidationError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please fill in all required fields: {getValidationErrors().join(', ')}
              </AlertDescription>
            </Alert>
          )}

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
