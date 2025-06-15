
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Filter, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export interface ClientFilters {
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

const FilterSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="space-y-2">
    <Label className="text-sm font-medium text-muted-foreground">{title}</Label>
    {children}
  </div>
);

interface FiltersPopoverContentProps {
    filters: ClientFilters;
    onFiltersChange: (f: ClientFilters) => void;
    onClose: () => void;
}

export const FiltersPopoverContent = ({ filters, onFiltersChange, onClose }: FiltersPopoverContentProps) => {
  const { t } = useTranslation();
  const [localFilters, setLocalFilters] = useState<ClientFilters>(filters);
  const [showMore, setShowMore] = useState({
    owner: false,
    stage: false,
    industry: false,
    country: false,
  });

  const toggleShowMore = (section: keyof typeof showMore) => {
    setShowMore(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const owners = useMemo(() => ["John Smith", "Sarah Johnson", "Mike Wilson", "Emily Davis"], []);
  const stages = useMemo(() => ["Lead", "Prospect", "Active", "Inactive"], []);
  const industries = useMemo(() => ["Technology", "Healthcare", "Finance", "Manufacturing", "Retail", "Consulting"], []);
  const countries = useMemo(() => ["Morocco", "France", "Spain", "USA", "UAE"], []);
  const statuses = useMemo(() => ["Active", "Archived"], []);
  const availableTags = useMemo(() => ["VIP", "High Value", "Enterprise", "SMB", "Urgent", "International"], []);

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

  return (
    <Card className="w-[380px] bg-card border-border text-card-foreground shadow-lg">
      <CardHeader className="border-b border-border p-4">
        <CardTitle className="flex items-center justify-between text-lg text-foreground">
          <span className="flex items-center gap-2">
            <Filter size={20} />
            {t('clients.filtersPanel.title')}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground hover:bg-accent"
          >
            <X className="h-3 w-3 mr-1" />
            {t('clients.filtersPanel.clearAll')}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-6 max-h-[calc(100vh-250px)] overflow-y-auto">
        <div className="grid grid-cols-1 gap-6">
          <FilterSection title={t('clients.filtersPanel.owner')}>
            <RadioGroup value={localFilters.owner} onValueChange={(value) => setLocalFilters({ ...localFilters, owner: value })}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="" id="owner-all" />
                <Label htmlFor="owner-all" className="cursor-pointer">{t('clients.filtersPanel.allOwners')}</Label>
              </div>
              {(showMore.owner ? owners : owners.slice(0, 3)).map(owner => (
                <div key={owner} className="flex items-center space-x-2">
                  <RadioGroupItem value={owner} id={`owner-${owner}`} />
                  <Label htmlFor={`owner-${owner}`} className="cursor-pointer">{owner}</Label>
                </div>
              ))}
            </RadioGroup>
            {owners.length > 3 && (
              <Button variant="link" size="sm" onClick={() => toggleShowMore('owner')} className="p-0 h-auto text-blue-400 hover:text-blue-500 mt-2 justify-start">
                {showMore.owner ? t('clients.filtersPanel.showLess') : t('clients.filtersPanel.showMore')}
              </Button>
            )}
          </FilterSection>

          <FilterSection title={t('clients.filtersPanel.stage')}>
            <RadioGroup value={localFilters.stage} onValueChange={(value) => setLocalFilters({ ...localFilters, stage: value })}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="" id="stage-all" />
                <Label htmlFor="stage-all" className="cursor-pointer">{t('clients.filtersPanel.allStages')}</Label>
              </div>
              {(showMore.stage ? stages : stages.slice(0, 3)).map(stage => (
                <div key={stage} className="flex items-center space-x-2">
                  <RadioGroupItem value={stage} id={`stage-${stage}`} />
                  <Label htmlFor={`stage-${stage}`} className="cursor-pointer">{stage}</Label>
                </div>
              ))}
            </RadioGroup>
            {stages.length > 3 && (
              <Button variant="link" size="sm" onClick={() => toggleShowMore('stage')} className="p-0 h-auto text-blue-400 hover:text-blue-500 mt-2 justify-start">
                {showMore.stage ? t('clients.filtersPanel.showLess') : t('clients.filtersPanel.showMore')}
              </Button>
            )}
          </FilterSection>
          
          <FilterSection title={t('clients.filtersPanel.industry')}>
            <RadioGroup value={localFilters.industry} onValueChange={(value) => setLocalFilters({ ...localFilters, industry: value })}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="" id="industry-all" />
                <Label htmlFor="industry-all" className="cursor-pointer">{t('clients.filtersPanel.allIndustries')}</Label>
              </div>
              {(showMore.industry ? industries : industries.slice(0, 3)).map(industry => (
                <div key={industry} className="flex items-center space-x-2">
                  <RadioGroupItem value={industry} id={`industry-${industry}`} />
                  <Label htmlFor={`industry-${industry}`} className="cursor-pointer">{industry}</Label>
                </div>
              ))}
            </RadioGroup>
             {industries.length > 3 && (
              <Button variant="link" size="sm" onClick={() => toggleShowMore('industry')} className="p-0 h-auto text-blue-400 hover:text-blue-500 mt-2 justify-start">
                {showMore.industry ? t('clients.filtersPanel.showLess') : t('clients.filtersPanel.showMore')}
              </Button>
            )}
          </FilterSection>

          <FilterSection title={t('clients.filtersPanel.location')}>
            <RadioGroup value={localFilters.country} onValueChange={(value) => setLocalFilters({ ...localFilters, country: value })}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="" id="country-all" />
                <Label htmlFor="country-all" className="cursor-pointer">{t('clients.filtersPanel.allLocations')}</Label>
              </div>
              {(showMore.country ? countries : countries.slice(0, 3)).map(country => (
                <div key={country} className="flex items-center space-x-2">
                  <RadioGroupItem value={country} id={`country-${country}`} />
                  <Label htmlFor={`country-${country}`} className="cursor-pointer">{country}</Label>
                </div>
              ))}
            </RadioGroup>
            {countries.length > 3 && (
              <Button variant="link" size="sm" onClick={() => toggleShowMore('country')} className="p-0 h-auto text-blue-400 hover:text-blue-500 mt-2 justify-start">
                {showMore.country ? t('clients.filtersPanel.showLess') : t('clients.filtersPanel.showMore')}
              </Button>
            )}
          </FilterSection>

          <FilterSection title={t('clients.filtersPanel.status')}>
            <RadioGroup value={localFilters.status} onValueChange={(value) => setLocalFilters({ ...localFilters, status: value })}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="" id="status-all" />
                <Label htmlFor="status-all" className="cursor-pointer">{t('clients.filtersPanel.allStatuses')}</Label>
              </div>
              {statuses.map(status => (
                <div key={status} className="flex items-center space-x-2">
                  <RadioGroupItem value={status} id={`status-${status}`} />
                  <Label htmlFor={`status-${status}`} className="cursor-pointer">{status}</Label>
                </div>
              ))}
            </RadioGroup>
          </FilterSection>

          <FilterSection title={t('clients.filtersPanel.tags')}>
            <div className="space-y-2">
              <Select onValueChange={(value) => addTag(value)}>
                <SelectTrigger className="bg-input border-input">
                  <SelectValue placeholder={t('clients.filtersPanel.addTag')} />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border text-popover-foreground">
                  {availableTags.map(tag => (
                    <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                  ))}
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
          </FilterSection>

          <FilterSection title={t('clients.filtersPanel.dateCreated')}>
             <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-muted-foreground">{t('clients.filtersPanel.from')}</Label>
                <Input
                  type="date"
                  value={localFilters.dateCreatedFrom}
                  onChange={(e) => setLocalFilters({ ...localFilters, dateCreatedFrom: e.target.value })}
                  className="bg-input border-input"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">{t('clients.filtersPanel.to')}</Label>
                <Input
                  type="date"
                  value={localFilters.dateCreatedTo}
                  onChange={(e) => setLocalFilters({ ...localFilters, dateCreatedTo: e.target.value })}
                  className="bg-input border-input"
                />
              </div>
            </div>
          </FilterSection>

          <FilterSection title={t('clients.filtersPanel.lastInteraction')}>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-muted-foreground">{t('clients.filtersPanel.from')}</Label>
                <Input
                  type="date"
                  value={localFilters.lastInteractionFrom}
                  onChange={(e) => setLocalFilters({ ...localFilters, lastInteractionFrom: e.target.value })}
                  className="bg-input border-input"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">{t('clients.filtersPanel.to')}</Label>
                <Input
                  type="date"
                  value={localFilters.lastInteractionTo}
                  onChange={(e) => setLocalFilters({ ...localFilters, lastInteractionTo: e.target.value })}
                  className="bg-input border-input"
                />
              </div>
            </div>
          </FilterSection>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 p-4 border-t border-border">
        <Button variant="outline" onClick={onClose}>
          {t('common.cancel')}
        </Button>
        <Button onClick={handleApplyFilters} className="bg-blue-600 hover:bg-blue-700">
          {t('clients.filtersPanel.apply')}
        </Button>
      </CardFooter>
    </Card>
  )
}
