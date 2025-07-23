import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import { useTranslation } from "react-i18next";
import { DealStage } from "@/types/deal";
import { useUsersForSelection } from "@/hooks/useUsers";

interface DealDetailsFieldsProps {
  formData: {
    stage: DealStage;
    probability: number;
    expectedCloseDate: string;
    source: string;
    owner: string;
    ownerId: string;
    priority: 'Low' | 'Medium' | 'High';
    website?: string;
    rating?: number;
    assigneeId?: string;
  };
  onUpdateField: (field: string, value: any) => void;
}

export function DealDetailsFields({ formData, onUpdateField }: DealDetailsFieldsProps) {
  const { t } = useTranslation();
  const { users, isLoading: isLoadingUsers, currentUser, userRole } = useUsersForSelection();

  const handleOwnerSelect = (ownerId: string) => {
    const selectedUser = users.find(u => u.id === ownerId);
    if (selectedUser) {
      onUpdateField('ownerId', ownerId);
      onUpdateField('owner', selectedUser.name);
    }
  };

  // Auto-select current user if they're not admin/manager and form is empty
  React.useEffect(() => {
    if (
      !formData.ownerId && 
      currentUser && 
      userRole !== 'admin' && 
      userRole !== 'manager' && 
      users.length > 0
    ) {
      const currentUserOption = users.find(u => u.id === currentUser.id);
      if (currentUserOption) {
        handleOwnerSelect(currentUserOption.id);
      }
    }
  }, [users, currentUser, userRole, formData.ownerId]);

  return (
    <>
      <div>
        <Label htmlFor="stage">{t('addDealModal.stageLabel')}</Label>
        <Select value={formData.stage} onValueChange={(value) => onUpdateField('stage', value)}>
          <SelectTrigger>
            <SelectValue placeholder={t('addDealModal.stagePlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Prospect">{t('deals.stages.prospect')}</SelectItem>
            <SelectItem value="Lead">{t('deals.stages.lead')}</SelectItem>
            <SelectItem value="Qualified">{t('deals.stages.qualified')}</SelectItem>
            <SelectItem value="Negotiation">{t('deals.stages.negotiation')}</SelectItem>
            <SelectItem value="Won/Lost">{t('deals.stages.won-lost')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="probability">{t('addDealModal.probabilityLabel')}</Label>
        <Input
          id="probability"
          type="number"
          min="0"
          max="100"
          value={formData.probability}
          onChange={(e) => onUpdateField('probability', parseInt(e.target.value) || 0)}
        />
      </div>

      <div>
        <Label htmlFor="closeDate">
          {t('addDealModal.expectedCloseDateLabel')} <span className="text-red-500">*</span>
        </Label>
        <Input
          id="closeDate"
          type="date"
          value={formData.expectedCloseDate}
          onChange={(e) => onUpdateField('expectedCloseDate', e.target.value)}
          required
          className={!formData.expectedCloseDate ? "border-red-300 focus:border-red-500" : ""}
        />
      </div>

      <div>
        <Label htmlFor="source">{t('addDealModal.sourceLabel')}</Label>
        <Input
          id="source"
          value={formData.source}
          onChange={(e) => onUpdateField('source', e.target.value)}
          placeholder={t('addDealModal.sourcePlaceholder')}
        />
      </div>

      <div>
        <Label htmlFor="owner">
          {t('addDealModal.ownerLabel')} <span className="text-red-500">*</span>
        </Label>
        <Select
          value={formData.ownerId}
          onValueChange={handleOwnerSelect}
          required
        >
          <SelectTrigger className={!formData.ownerId ? "border-red-300 focus:border-red-500" : ""}>
            <SelectValue placeholder={isLoadingUsers ? "Loading users..." : t('addDealModal.ownerPlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                <div className="flex flex-col">
                  <span className="font-medium">{user.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {user.email} • {user.role}
                  </span>
                </div>
              </SelectItem>
            ))}
            {users.length === 0 && !isLoadingUsers && (
              <SelectItem value="no-users" disabled>
                No users available
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        {userRole !== 'admin' && userRole !== 'manager' && (
          <p className="text-xs text-muted-foreground mt-1">
            You can only assign deals to yourself
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="priority">{t('addDealModal.priorityLabel')}</Label>
        <Select value={formData.priority} onValueChange={(value) => onUpdateField('priority', value)}>
          <SelectTrigger>
            <SelectValue placeholder={t('addDealModal.priorityPlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Low">{t('dashboard.priority.low')}</SelectItem>
            <SelectItem value="Medium">{t('dashboard.priority.medium')}</SelectItem>
            <SelectItem value="High">{t('dashboard.priority.high')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Add website field */}
      <div>
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          type="text"
          value={formData.website || ''}
          onChange={e => onUpdateField('website', e.target.value)}
          placeholder="https://example.com"
        />
      </div>
      {/* Add rating field */}
      <div>
        <Label htmlFor="rating">Rating (0-5)</Label>
        <Input
          id="rating"
          type="number"
          min={0}
          max={5}
          value={formData.rating ?? ''}
          onChange={e => onUpdateField('rating', Number(e.target.value))}
          placeholder="0-5"
        />
      </div>
      {/* Add assignee field */}
      <div>
        <Label htmlFor="assignee">Assignee</Label>
        <Select
          value={formData.assigneeId || ''}
          onValueChange={val => onUpdateField('assigneeId', val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select assignee" />
          </SelectTrigger>
          <SelectContent>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                <div className="flex flex-col">
                  <span className="font-medium">{user.name}</span>
                  <span className="text-sm text-muted-foreground">{user.email} • {user.role}</span>
                </div>
              </SelectItem>
            ))}
            {users.length === 0 && !isLoadingUsers && (
              <SelectItem value="no-users" disabled>
                No users available
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
