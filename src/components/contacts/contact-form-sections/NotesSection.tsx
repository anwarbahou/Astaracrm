
import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SectionProps } from ".";

export function NotesSection({ formData, setFormData }: SectionProps) {
  const { t } = useTranslation();

  return (
    <div>
      <Label htmlFor="notes">{t('addContactModal.notesLabel')}</Label>
      <Textarea
        id="notes"
        value={formData.notes}
        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        placeholder={t('addContactModal.notesPlaceholder')}
        rows={4}
      />
    </div>
  );
}
