
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { ClientFormData } from '../AddClientForm';

export const ProfileSection = ({ formData }: { formData: ClientFormData }) => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-20 w-20">
        <AvatarImage src={formData.avatar} />
        <AvatarFallback className="text-xl">
          {formData.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
        </AvatarFallback>
      </Avatar>
      <div className="space-y-2">
        <Label>{t('addClientModal.profilePicture')}</Label>
        <Button type="button" variant="outline" size="sm" className="gap-2">
          <Upload size={16} />
          {t('addClientModal.uploadPhoto')}
        </Button>
        <p className="text-xs text-muted-foreground">{t('addClientModal.uploadHint')}</p>
      </div>
    </div>
  );
};
