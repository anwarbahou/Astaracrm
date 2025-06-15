
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { DealStage } from "@/types/deal";

interface DealDetailsFieldsProps {
  formData: {
    stage: DealStage;
    probability: number;
    expectedCloseDate: string;
    source: string;
    owner: string;
    priority: 'Low' | 'Medium' | 'High';
  };
  onUpdateField: (field: string, value: any) => void;
}

export function DealDetailsFields({ formData, onUpdateField }: DealDetailsFieldsProps) {
  const { t } = useTranslation();

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
        <Label htmlFor="closeDate">{t('addDealModal.expectedCloseDateLabel')}</Label>
        <Input
          id="closeDate"
          type="date"
          value={formData.expectedCloseDate}
          onChange={(e) => onUpdateField('expectedCloseDate', e.target.value)}
          required
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
        <Label htmlFor="owner">{t('addDealModal.ownerLabel')}</Label>
        <Select value={formData.owner} onValueChange={(value) => onUpdateField('owner', value)}>
          <SelectTrigger>
            <SelectValue placeholder={t('addDealModal.ownerPlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="John Doe">John Doe</SelectItem>
            <SelectItem value="Sarah Smith">Sarah Smith</SelectItem>
            <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
            <SelectItem value="Emily Davis">Emily Davis</SelectItem>
            <SelectItem value="David Wilson">David Wilson</SelectItem>
          </SelectContent>
        </Select>
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
    </>
  );
}
