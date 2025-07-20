
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClientFormData } from '../AddClientForm';

interface BasicInfoSectionProps {
  formData: ClientFormData;
  setFormData: React.Dispatch<React.SetStateAction<ClientFormData>>;
}

export const BasicInfoSection = ({ formData, setFormData }: BasicInfoSectionProps) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">{t('addClientModal.nameLabel')}</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder={t('addClientModal.namePlaceholder')}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">{t('addClientModal.emailLabel')}</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder={t('addClientModal.emailPlaceholder')}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">{t('addClientModal.phoneLabel')}</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder={t('addClientModal.phonePlaceholder')}
          />
        </div>
        <div>
          <Label htmlFor="country">{t('addClientModal.countryLabel')}</Label>
          <Select
            value={formData.country}
            onValueChange={(value) => setFormData({ ...formData, country: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('addClientModal.countryPlaceholder')} />
            </SelectTrigger>
            <SelectContent className="bg-background border">
              <SelectItem value="Morocco">{t('countries.morocco')}</SelectItem>
              <SelectItem value="France">{t('countries.france')}</SelectItem>
              <SelectItem value="Spain">{t('countries.spain')}</SelectItem>
              <SelectItem value="USA">{t('countries.usa')}</SelectItem>
              <SelectItem value="UAE">{t('countries.uae')}</SelectItem>
              <SelectItem value="UK">{t('countries.uk')}</SelectItem>
              <SelectItem value="Germany">{t('countries.germany')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="address">{t('addClientModal.addressLabel')}</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder={t('addClientModal.addressPlaceholder')}
          rows={3}
        />
      </div>
    </div>
  );
};
