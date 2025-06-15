
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { LayoutDashboard, List } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DealsViewToggleProps {
  viewMode: 'kanban' | 'list';
  onViewModeChange: (mode: 'kanban' | 'list') => void;
}

export function DealsViewToggle({ viewMode, onViewModeChange }: DealsViewToggleProps) {
  const { t } = useTranslation();
  return (
    <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && onViewModeChange(value as 'kanban' | 'list')}>
      <ToggleGroupItem value="kanban" aria-label={t('deals.view.pipeline')} className="gap-2">
        <LayoutDashboard size={16} />
        {t('deals.view.pipeline')}
      </ToggleGroupItem>
      <ToggleGroupItem value="list" aria-label={t('deals.view.list')} className="gap-2">
        <List size={16} />
        {t('deals.view.list')}
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
