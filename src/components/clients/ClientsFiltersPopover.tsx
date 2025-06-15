
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
import FilterSection from './FilterSection';
import { ClientFilters } from '@/types/client';

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

  const owners = useMemo(() => [
    { value: "John Smith", label: "John Smith" },
    { value: "Sarah Johnson", label: "Sarah Johnson" },
    { value: "Mike Wilson", label: "Mike Wilson" },
    { value: "Emily Davis", label: "Emily Davis" }
  ], []);
  const stages = useMemo(() => [
    { value: "Lead", label: t('clientStages.lead') },
    { value: "Prospect", label: t('clientStages.prospect') },
    { value: "Active", label: t('clientStages.active') },
    { value: "Inactive", label: t('clientStages.inactive') }
  ], [t]);
  const industries = useMemo(() => [
    { value: "Technology", label: t('industries.technology') },
    { value: "Healthcare", label: t('industries.healthcare') },
    { value: "Finance", label: t('industries.finance') },
    { value: "Manufacturing", label: t('industries.manufacturing') },
    { value: "Retail", label: t('industries.retail') },
    { value: "Consulting", label: t('industries.consulting') }
  ], [t]);
  const countries = useMemo(() => [
    { value: "Morocco", label: t('countries.morocco') },
    { value: "France", label: t('countries.france') },
    { value: "Spain", label: t('countries.spain') },
    { value: "USA", label: t('countries.usa') },
    { value: "UAE", label: t('countries.uae') }
  ], [t]);
  const statuses = useMemo(() => [
      { value: 'Active', label: t('clients.statuses.active') },
      { value: 'Archived', label: t('clients.statuses.archived') },
  ], [t]);
  const availableTags = useMemo(() => [
    { value: "VIP", label: t('clients.tags.vip') },
    { value: "High Value", label: t('clients.tags.high_value') },
    { value: "Enterprise", label: t('clients.tags.enterprise') },
    { value: "SMB", label: t('clients.tags.smb') },
    { value: "Urgent", label: t('clients.tags.urgent') },
    { value: "International", label: t('clients.tags.international') }
  ], [t]);

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
            {t('clients.filtersPanel.advancedTitle')}
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
                <div key={owner.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={owner.value} id={`owner-${owner.value}`} />
                  <Label htmlFor={`owner-${owner.value}`} className="cursor-pointer">{owner.label}</Label>
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
                <div key={stage.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={stage.value} id={`stage-${stage.value}`} />
                  <Label htmlFor={`stage-${stage.value}`} className="cursor-pointer">{stage.label}</Label>
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
                <div key={industry.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={industry.value} id={`industry-${industry.value}`} />
                  <Label htmlFor={`industry-${industry.value}`} className="cursor-pointer">{industry.label}</Label>
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
                <div key={country.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={country.value} id={`country-${country.value}`} />
                  <Label htmlFor={`country-${country.value}`} className="cursor-pointer">{country.label}</Label>
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
                <div key={status.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={status.value} id={`status-${status.value}`} />
                  <Label htmlFor={`status-${status.value}`} className="cursor-pointer">{status.label}</Label>
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
                    <SelectItem key={tag.value} value={tag.value}>{tag.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {localFilters.tags.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {localFilters.tags.map((tag, index) => {
                    const tagObject = availableTags.find(t => t.value === tag);
                    return (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {tagObject ? tagObject.label : tag}
                        <X 
                          size={12} 
                          className="cursor-pointer hover:text-destructive"
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    )
                  })}
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
