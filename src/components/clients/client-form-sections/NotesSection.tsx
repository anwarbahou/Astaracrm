
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface NotesSectionProps {
    notes: string;
    onNotesChange: (notes: string) => void;
}

export const NotesSection = ({ notes, onNotesChange }: NotesSectionProps) => {
    const { t } = useTranslation();
    return (
      <div>
          <Label htmlFor="notes">{t('addClientModal.notesLabel')}</Label>
          <Textarea
              id="notes"
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder={t('addClientModal.notesPlaceholder')}
              rows={4}
          />
      </div>
    );
};
