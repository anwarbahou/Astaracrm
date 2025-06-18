import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useUsers } from '@/hooks/useUsers';
import { useAuth } from '@/contexts/AuthContext';
import { ClientFormData } from '../AddClientForm';

interface BusinessInfoSectionProps {
  formData: ClientFormData;
  setFormData: React.Dispatch<React.SetStateAction<ClientFormData>>;
}

export const BusinessInfoSection = ({ formData, setFormData }: BusinessInfoSectionProps) => {
    const { t } = useTranslation();
    const { users, loading } = useUsers();
    const { user, isAdmin, isManager } = useAuth();

    // Set current user as default owner when users are loaded
    useEffect(() => {
      if (users.length > 0 && user?.id && !formData.owner) {
        setFormData(prev => ({ ...prev, owner: user.id }));
      }
    }, [users, user?.id, formData.owner, setFormData]);

    const getUserDisplayName = (user: any) => {
      const firstName = user.first_name || '';
      const lastName = user.last_name || '';
      return `${firstName} ${lastName}`.trim() || user.email;
    };

    const getRoleBadgeColor = (role: string) => {
      switch (role) {
        case 'admin':
          return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
        case 'manager':
          return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
        default:
          return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      }
    };

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
                      <SelectItem value="lead">{t('clientStages.lead')}</SelectItem>
                      <SelectItem value="prospect">{t('clientStages.prospect')}</SelectItem>
                      <SelectItem value="active">{t('clientStages.active')}</SelectItem>
                      <SelectItem value="inactive">{t('clientStages.inactive')}</SelectItem>
                  </SelectContent>
              </Select>
          </div>
          <div className="md:col-span-2">
              <Label htmlFor="owner">{t('addClientModal.ownerLabel')}</Label>
              <Select
                  value={formData.owner}
                  onValueChange={(value) => setFormData({ ...formData, owner: value })}
                  disabled={loading}
              >
                  <SelectTrigger>
                      <SelectValue 
                        placeholder={loading ? "Loading users..." : t('addClientModal.ownerPlaceholder')} 
                      />
                  </SelectTrigger>
                  <SelectContent className="bg-background border">
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          <div className="flex items-center gap-2 w-full">
                            <span>{getUserDisplayName(user)}</span>
                            {user.role && (
                              <Badge className={`text-xs px-2 py-0.5 ${getRoleBadgeColor(user.role)}`}>
                                {user.role.toUpperCase()}
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
              </Select>
              {!isAdmin && !isManager && (
                <p className="text-xs text-muted-foreground mt-1">
                  Regular users can only assign clients to themselves. Admins and managers can assign to any user.
                </p>
              )}
          </div>
      </div>
    );
};
