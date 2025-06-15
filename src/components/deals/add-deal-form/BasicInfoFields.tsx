
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";

interface BasicInfoFieldsProps {
  formData: {
    name: string;
    client: string;
    value: number;
    notes: string;
  };
  onUpdateField: (field: string, value: any) => void;
}

export function BasicInfoFields({ formData, onUpdateField }: BasicInfoFieldsProps) {
  const { t } = useTranslation();

  return (
    <>
      <div className="col-span-2">
        <Label htmlFor="dealName">{t('addDealModal.dealNameLabel')}</Label>
        <Input
          id="dealName"
          value={formData.name}
          onChange={(e) => onUpdateField('name', e.target.value)}
          placeholder={t('addDealModal.dealNamePlaceholder')}
          required
        />
      </div>

      <div>
        <Label htmlFor="client">{t('addDealModal.clientLabel')}</Label>
        <Input
          id="client"
          value={formData.client}
          onChange={(e) => onUpdateField('client', e.target.value)}
          placeholder={t('addDealModal.clientPlaceholder')}
          required
        />
      </div>

      <div>
        <Label htmlFor="value">{t('addDealModal.valueLabel')}</Label>
        <Input
          id="value"
          type="number"
          value={formData.value}
          onChange={(e) => onUpdateField('value', parseInt(e.target.value) || 0)}
          placeholder="0"
          required
        />
      </div>

      <div className="col-span-2">
        <Label htmlFor="notes">{t('addDealModal.notesLabel')}</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => onUpdateField('notes', e.target.value)}
          placeholder={t('addDealModal.notesPlaceholder')}
          rows={3}
        />
      </div>
    </>
  );
}
