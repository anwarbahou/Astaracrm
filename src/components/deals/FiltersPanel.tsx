import { DealFilters, DealStage } from '@/types/deal';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Filter } from 'lucide-react';

interface FiltersPanelProps {
  filters: DealFilters;
  onFiltersChange: (filters: DealFilters) => void;
  onClearFilters: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FiltersPanel({ 
  filters, 
  onFiltersChange, 
  onClearFilters, 
  open, 
  onOpenChange 
}: FiltersPanelProps) {
  const [localFilters, setLocalFilters] = useState<DealFilters>(filters);

  const stages: DealStage[] = ['Prospect', 'Lead', 'Qualified', 'Negotiation', 'Won/Lost'];
  const owners = ['John Doe', 'Sarah Smith', 'Mike Johnson', 'Emily Davis', 'David Wilson'];
  const sources = ['Website', 'Referral', 'Cold Outreach', 'LinkedIn', 'Existing Client'];

  const updateLocalFilters = (field: keyof DealFilters, value: any) => {
    setLocalFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleStageChange = (stage: DealStage, checked: boolean) => {
    const newStages = checked 
      ? [...localFilters.stages, stage]
      : localFilters.stages.filter(s => s !== stage);
    updateLocalFilters('stages', newStages);
  };

  const handleOwnerChange = (owner: string, checked: boolean) => {
    const newOwners = checked 
      ? [...localFilters.owners, owner]
      : localFilters.owners.filter(o => o !== owner);
    updateLocalFilters('owners', newOwners);
  };

  const handleSourceChange = (source: string, checked: boolean) => {
    const newSources = checked 
      ? [...localFilters.sources, source]
      : localFilters.sources.filter(s => s !== source);
    updateLocalFilters('sources', newSources);
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
  };

  const clearFilters = () => {
    const emptyFilters: DealFilters = {
      stages: [],
      owners: [],
      valueRange: [0, 1000000],
      dateRange: { start: '', end: '' },
      sources: [],
      tags: [],
      search: ''
    };
    setLocalFilters(emptyFilters);
    onClearFilters();
  };

  if (!open) return null;

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Stages Filter */}
          <div>
            <Label className="text-sm font-medium">Stages</Label>
            <div className="space-y-2 mt-2">
              {stages.map((stage) => (
                <div key={stage} className="flex items-center space-x-2">
                  <Checkbox
                    id={`stage-${stage}`}
                    checked={localFilters.stages.includes(stage)}
                    onCheckedChange={(checked) => handleStageChange(stage, !!checked)}
                  />
                  <Label htmlFor={`stage-${stage}`} className="text-sm">
                    {stage}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Owners Filter */}
          <div>
            <Label className="text-sm font-medium">Owners</Label>
            <div className="space-y-2 mt-2">
              {owners.map((owner) => (
                <div key={owner} className="flex items-center space-x-2">
                  <Checkbox
                    id={`owner-${owner}`}
                    checked={localFilters.owners.includes(owner)}
                    onCheckedChange={(checked) => handleOwnerChange(owner, !!checked)}
                  />
                  <Label htmlFor={`owner-${owner}`} className="text-sm">
                    {owner}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Sources Filter */}
          <div>
            <Label className="text-sm font-medium">Sources</Label>
            <div className="space-y-2 mt-2">
              {sources.map((source) => (
                <div key={source} className="flex items-center space-x-2">
                  <Checkbox
                    id={`source-${source}`}
                    checked={localFilters.sources.includes(source)}
                    onCheckedChange={(checked) => handleSourceChange(source, !!checked)}
                  />
                  <Label htmlFor={`source-${source}`} className="text-sm">
                    {source}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Value Range & Date Range */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Value Range (MAD)</Label>
              <div className="flex items-center space-x-2 mt-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={localFilters.valueRange[0]}
                  onChange={(e) => updateLocalFilters('valueRange', [parseInt(e.target.value) || 0, localFilters.valueRange[1]])}
                  className="w-20"
                />
                <span>-</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={localFilters.valueRange[1]}
                  onChange={(e) => updateLocalFilters('valueRange', [localFilters.valueRange[0], parseInt(e.target.value) || 1000000])}
                  className="w-20"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Expected Close Date</Label>
              <div className="space-y-2 mt-2">
                <Input
                  type="date"
                  value={localFilters.dateRange.start}
                  onChange={(e) => updateLocalFilters('dateRange', { ...localFilters.dateRange, start: e.target.value })}
                />
                <Input
                  type="date"
                  value={localFilters.dateRange.end}
                  onChange={(e) => updateLocalFilters('dateRange', { ...localFilters.dateRange, end: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={clearFilters}>
            Clear All
          </Button>
          <Button onClick={applyFilters}>
            Apply Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
