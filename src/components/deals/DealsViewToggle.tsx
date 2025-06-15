
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { LayoutDashboard, List } from 'lucide-react';

interface DealsViewToggleProps {
  viewMode: 'kanban' | 'list';
  onViewModeChange: (mode: 'kanban' | 'list') => void;
}

export function DealsViewToggle({ viewMode, onViewModeChange }: DealsViewToggleProps) {
  return (
    <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && onViewModeChange(value as 'kanban' | 'list')}>
      <ToggleGroupItem value="kanban" aria-label="Pipeline View" className="gap-2">
        <LayoutDashboard size={16} />
        Pipeline
      </ToggleGroupItem>
      <ToggleGroupItem value="list" aria-label="List View" className="gap-2">
        <List size={16} />
        List
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
