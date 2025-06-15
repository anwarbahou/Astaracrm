
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from "lucide-react";
import { SectionProps } from ".";

export function ProfileSection({ formData }: Pick<SectionProps, 'formData'>) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-20 w-20">
        <AvatarImage src={formData.avatar} />
        <AvatarFallback className="text-xl">
          {formData.firstName?.[0]}
          {formData.lastName?.[0]}
        </AvatarFallback>
      </Avatar>
      <div className="space-y-2">
        <Label>{t('addContactModal.profilePicture')}</Label>
        <Button type="button" variant="outline" size="sm" className="gap-2">
          <Upload size={16} />
          {t('addContactModal.uploadPhoto')}
        </Button>
        <p className="text-xs text-muted-foreground">{t('addContactModal.uploadHint')}</p>
      </div>
    </div>
  );
}
