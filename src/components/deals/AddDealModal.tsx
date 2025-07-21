import { Deal } from '@/types/deal';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
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
  onSubmit: (deal: Omit<Deal, 'id' | 'created_at' | 'updated_at' | 'activities'>) => void;
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
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent 
        side="right" 
        className="h-full w-full sm:w-[600px] lg:w-[700px] xl:w-[800px] border-l shadow-2xl bg-background/95 backdrop-blur-sm p-0 flex flex-col"
      >
        <SheetHeader className="px-6 py-4">
          <SheetTitle>{t('addDealModal.title')}</SheetTitle>
          <SheetDescription>
            {t('addDealModal.description')}
            <br />
            <span className="text-sm text-muted-foreground mt-2 block">
              Fields marked with <span className="text-red-500">*</span> are required
            </span>
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 px-6 py-4 overflow-y-auto">
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
          </form>
        </div>

        <SheetFooter className="px-6 py-4 border-t">
          <Button type="button" variant="outline" onClick={handleClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            {t('addDealModal.submitButton')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
