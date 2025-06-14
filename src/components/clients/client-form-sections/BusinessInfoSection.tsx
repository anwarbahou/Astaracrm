
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClientFormData } from '../AddClientForm';

interface BusinessInfoSectionProps {
  formData: ClientFormData;
  setFormData: React.Dispatch<React.SetStateAction<ClientFormData>>;
}

export const BusinessInfoSection = ({ formData, setFormData }: BusinessInfoSectionProps) => {
    const { t } = useTranslation();
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
              <Label htmlFor="industry">{t('addClientModal.industryLabel')}</Label>
              <Select
                  value={formData.industry}
                  onValueChange={(value) => setFormData({ ...formData, industry: value })}
              >
                  <SelectTrigger>
                      <SelectValue placeholder={t('addClientModal.industryPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent className="bg-background border">
                      <SelectItem value="Technology">{t('industries.technology')}</SelectItem>
                      <SelectItem value="Healthcare">{t('industries.healthcare')}</SelectItem>
                      <SelectItem value="Finance">{t('industries.finance')}</SelectItem>
                      <SelectItem value="Retail">{t('industries.retail')}</SelectItem>
                      <SelectItem value="Manufacturing">{t('industries.manufacturing')}</SelectItem>
                      <SelectItem value="Consulting">{t('industries.consulting')}</SelectItem>
                      <SelectItem value="Education">{t('industries.education')}</SelectItem>
                      <SelectItem value="Real Estate">{t('industries.real_estate')}</SelectItem>
                      <SelectItem value="Other">{t('industries.other')}</SelectItem>
                  </SelectContent>
              </Select>
          </div>
          <div>
              <Label htmlFor="stage">{t('addClientModal.stageLabel')}</Label>
              <Select
                  value={formData.stage}
                  onValueChange={(value) => setFormData({ ...formData, stage: value })}
              >
                  <SelectTrigger>
                      <SelectValue placeholder={t('addClientModal.stagePlaceholder')} />
                  </SelectTrigger>
                  <SelectContent className="bg-background border">
                      <SelectItem value="Lead">{t('clientStages.lead')}</SelectItem>
                      <SelectItem value="Prospect">{t('clientStages.prospect')}</SelectItem>
                      <SelectItem value="Active">{t('clientStages.active')}</SelectItem>
                      <SelectItem value="Inactive">{t('clientStages.inactive')}</SelectItem>
                  </SelectContent>
              </Select>
          </div>
          <div className="md:col-span-2">
              <Label htmlFor="owner">{t('addClientModal.ownerLabel')}</Label>
              <Select
                  value={formData.owner}
                  onValueChange={(value) => setFormData({ ...formData, owner: value })}
              >
                  <SelectTrigger>
                      <SelectValue placeholder={t('addClientModal.ownerPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent className="bg-background border">
                      <SelectItem value="John Smith">John Smith</SelectItem>
                      <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                      <SelectItem value="Mike Wilson">Mike Wilson</SelectItem>
                      <SelectItem value="Emily Davis">Emily Davis</SelectItem>
                      <SelectItem value="David Brown">David Brown</SelectItem>
                  </SelectContent>
              </Select>
          </div>
      </div>
    );
};
