
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Filter, ChevronUp } from 'lucide-react';

interface ClientFilters {
  owner: string;
  stage: string;
  industry: string;
  country: string;
  status: string;
  tags: string[];
  dateCreatedFrom: string;
  dateCreatedTo: string;
  lastInteractionFrom: string;
  lastInteractionTo: string;
}

interface ClientFiltersPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: ClientFilters;
  onFiltersChange: (filters: ClientFilters) => void;
}

export function ClientFiltersPanel({ isOpen, onClose, filters, onFiltersChange }: ClientFiltersPanelProps) {
  const { t } = useTranslation();
  const [localFilters, setLocalFilters] = useState<ClientFilters>(filters);

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleClearFilters = () => {
    const emptyFilters: ClientFilters = {
      owner: '',
      stage: '',
      industry: '',
      country: '',
      status: '',
      tags: [],
      dateCreatedFrom: '',
      dateCreatedTo: '',
      lastInteractionFrom: '',
      lastInteractionTo: '',
    };
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const removeTag = (tagToRemove: string) => {
    setLocalFilters({
      ...localFilters,
      tags: localFilters.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const addTag = (newTag: string) => {
    if (newTag && !localFilters.tags.includes(newTag)) {
      setLocalFilters({
        ...localFilters,
        tags: [...localFilters.tags, newTag]
      });
    }
  };

  if (!isOpen) return null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Filter size={20} />
            {t('clients.filtersPanel.title')}
          </span>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ChevronUp size={16} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Owner Filter */}
          <div>
            <Label>{t('clients.filtersPanel.owner')}</Label>
            <Select
              value={localFilters.owner}
              onValueChange={(value) => setLocalFilters({ ...localFilters, owner: value === 'all' ? '' : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('clients.filtersPanel.ownerPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('clients.filtersPanel.allOwners')}</SelectItem>
                <SelectItem value="John Smith">John Smith</SelectItem>
                <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                <SelectItem value="Mike Wilson">Mike Wilson</SelectItem>
                <SelectItem value="Emily Davis">Emily Davis</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stage Filter */}
          <div>
            <Label>{t('clients.filtersPanel.stage')}</Label>
            <Select
              value={localFilters.stage}
              onValueChange={(value) => setLocalFilters({ ...localFilters, stage: value === 'all' ? '' : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('clients.filtersPanel.stagePlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('clients.filtersPanel.allStages')}</SelectItem>
                <SelectItem value="Lead">Lead</SelectItem>
                <SelectItem value="Prospect">Prospect</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Industry Filter */}
          <div>
            <Label>{t('clients.filtersPanel.industry')}</Label>
            <Select
              value={localFilters.industry}
              onValueChange={(value) => setLocalFilters({ ...localFilters, industry: value === 'all' ? '' : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('clients.filtersPanel.industryPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('clients.filtersPanel.allIndustries')}</SelectItem>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                <SelectItem value="Retail">Retail</SelectItem>
                <SelectItem value="Consulting">Consulting</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Country Filter */}
          <div>
            <Label>{t('clients.filtersPanel.location')}</Label>
            <Select
              value={localFilters.country}
              onValueChange={(value) => setLocalFilters({ ...localFilters, country: value === 'all' ? '' : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('clients.filtersPanel.locationPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('clients.filtersPanel.allLocations')}</SelectItem>
                <SelectItem value="Morocco">Morocco</SelectItem>
                <SelectItem value="France">France</SelectItem>
                <SelectItem value="Spain">Spain</SelectItem>
                <SelectItem value="USA">USA</SelectItem>
                <SelectItem value="UAE">UAE</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div>
            <Label>{t('clients.filtersPanel.status')}</Label>
            <Select
              value={localFilters.status}
              onValueChange={(value) => setLocalFilters({ ...localFilters, status: value === 'all' ? '' : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('clients.filtersPanel.statusPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('clients.filtersPanel.allStatuses')}</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tags Filter */}
          <div>
            <Label>{t('clients.filtersPanel.tags')}</Label>
            <div className="space-y-2">
              <Select onValueChange={(value) => addTag(value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('clients.filtersPanel.addTag')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VIP">VIP</SelectItem>
                  <SelectItem value="High Value">High Value</SelectItem>
                  <SelectItem value="Enterprise">Enterprise</SelectItem>
                  <SelectItem value="SMB">SMB</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                  <SelectItem value="International">International</SelectItem>
                </SelectContent>
              </Select>
              {localFilters.tags.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {localFilters.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {tag}
                      <X 
                        size={12} 
                        className="cursor-pointer hover:text-destructive"
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Date Filters */}
        <div className="space-y-4">
          <h4 className="font-medium">{t('clients.filtersPanel.dateRanges')}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>{t('clients.filtersPanel.dateCreated')}</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-muted-foreground">{t('clients.filtersPanel.from')}</Label>
                  <Input
                    type="date"
                    value={localFilters.dateCreatedFrom}
                    onChange={(e) => setLocalFilters({ ...localFilters, dateCreatedFrom: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">{t('clients.filtersPanel.to')}</Label>
                  <Input
                    type="date"
                    value={localFilters.dateCreatedTo}
                    onChange={(e) => setLocalFilters({ ...localFilters, dateCreatedTo: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t('clients.filtersPanel.lastInteraction')}</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-muted-foreground">{t('clients.filtersPanel.from')}</Label>
                  <Input
                    type="date"
                    value={localFilters.lastInteractionFrom}
                    onChange={(e) => setLocalFilters({ ...localFilters, lastInteractionFrom: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">{t('clients.filtersPanel.to')}</Label>
                  <Input
                    type="date"
                    value={localFilters.lastInteractionTo}
                    onChange={(e) => setLocalFilters({ ...localFilters, lastInteractionTo: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleClearFilters}>
            {t('clients.filtersPanel.clearAll')}
          </Button>
          <Button onClick={handleApplyFilters}>
            {t('clients.filtersPanel.apply')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
