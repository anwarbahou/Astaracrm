
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, FilterX } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useTranslation } from "react-i18next";

interface ContactFilters {
  company: string;
  role: string;
  country: string;
  status: string;
  tags: string[];
  dateCreatedFrom: string;
  dateCreatedTo: string;
  lastContactedFrom: string;
  lastContactedTo: string;
}

interface ContactFiltersPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: ContactFilters;
  onFiltersChange: (filters: ContactFilters) => void;
}

export function ContactFiltersPanel({ 
  isOpen, 
  onClose, 
  filters, 
  onFiltersChange 
}: ContactFiltersPanelProps) {
  const { t } = useTranslation();

  const handleFilterChange = (key: keyof ContactFilters, value: string | string[]) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      company: '',
      role: '',
      country: '',
      status: '',
      tags: [],
      dateCreatedFrom: '',
      dateCreatedTo: '',
      lastContactedFrom: '',
      lastContactedTo: '',
    });
  };

  const addTag = (tag: string) => {
    if (tag && !filters.tags.includes(tag)) {
      handleFilterChange('tags', [...filters.tags, tag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    handleFilterChange('tags', filters.tags.filter(tag => tag !== tagToRemove));
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    Array.isArray(value) ? value.length > 0 : value !== ''
  ).length;

  const companies = ["Acme Corporation", "Tech Solutions Ltd", "Global Industries", "StartupXYZ", "Enterprise Corp"];
  const companyKeys = ["acme", "tech", "global", "startup", "enterprise"];
  
  const roles = ["CEO", "CTO", "VP Sales", "Manager", "Developer", "Designer"];
  const roleKeys = ["ceo", "cto", "vpSales", "manager", "developer", "designer"];

  const countries = ["Morocco", "France", "Spain", "USA", "UK", "Germany"];
  const countryKeys = ["morocco", "france", "spain", "usa", "uk", "germany"];

  const statuses = ["Active", "Inactive"];
  const statusKeys = ["active", "inactive"];

  const tags = ['Decision Maker', 'VIP', 'Technical', 'Founder', 'Startup', 'Procurement', 'Sales'];
  const tagKeys = ['decisionMaker', 'vip', 'technical', 'founder', 'startup', 'procurement', 'sales'];

  return (
    <Collapsible open={isOpen}>
      <CollapsibleContent>
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {t('contacts.filtersPanel.title')} {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeFiltersCount}
                  </Badge>
                )}
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  <FilterX className="h-4 w-4 mr-2" />
                  {t('contacts.filtersPanel.clearAll')}
                </Button>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Company Filter */}
              <div className="space-y-2">
                <Label htmlFor="company">{t('contacts.filtersPanel.company')}</Label>
                <Select
                  value={filters.company}
                  onValueChange={(value) => handleFilterChange('company', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('contacts.filtersPanel.allCompanies')} />
                  </SelectTrigger>
                  <SelectContent className="bg-background border">
                    {companies.map((company, index) => (
                      <SelectItem key={company} value={company}>{t(`contacts.companies.${companyKeys[index]}`)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Role Filter */}
              <div className="space-y-2">
                <Label htmlFor="role">{t('contacts.filtersPanel.role')}</Label>
                <Select
                  value={filters.role}
                  onValueChange={(value) => handleFilterChange('role', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('contacts.filtersPanel.allRoles')} />
                  </SelectTrigger>
                  <SelectContent className="bg-background border">
                    {roles.map((role, index) => (
                      <SelectItem key={role} value={role}>{t(`contacts.roles.${roleKeys[index]}`)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Country Filter */}
              <div className="space-y-2">
                <Label htmlFor="country">{t('contacts.filtersPanel.country')}</Label>
                <Select
                  value={filters.country}
                  onValueChange={(value) => handleFilterChange('country', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('contacts.filtersPanel.allCountries')} />
                  </SelectTrigger>
                  <SelectContent className="bg-background border">
                    {countries.map((country, index) => (
                      <SelectItem key={country} value={country}>{t(`countries.${countryKeys[index]}`)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <Label htmlFor="status">{t('contacts.filtersPanel.status')}</Label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => handleFilterChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('contacts.filtersPanel.allStatuses')} />
                  </SelectTrigger>
                  <SelectContent className="bg-background border">
                    {statuses.map((status, index) => (
                      <SelectItem key={status} value={status}>{t(`contacts.statuses.${statusKeys[index]}`)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date Created From */}
              <div className="space-y-2">
                <Label htmlFor="dateCreatedFrom">{t('contacts.filtersPanel.createdFrom')}</Label>
                <Input
                  id="dateCreatedFrom"
                  type="date"
                  value={filters.dateCreatedFrom}
                  onChange={(e) => handleFilterChange('dateCreatedFrom', e.target.value)}
                />
              </div>

              {/* Date Created To */}
              <div className="space-y-2">
                <Label htmlFor="dateCreatedTo">{t('contacts.filtersPanel.createdTo')}</Label>
                <Input
                  id="dateCreatedTo"
                  type="date"
                  value={filters.dateCreatedTo}
                  onChange={(e) => handleFilterChange('dateCreatedTo', e.target.value)}
                />
              </div>

              {/* Last Contacted From */}
              <div className="space-y-2">
                <Label htmlFor="lastContactedFrom">{t('contacts.filtersPanel.lastContactedFrom')}</Label>

                <Input
                  id="lastContactedFrom"
                  type="date"
                  value={filters.lastContactedFrom}
                  onChange={(e) => handleFilterChange('lastContactedFrom', e.target.value)}
                />
              </div>

              {/* Last Contacted To */}
              <div className="space-y-2">
                <Label htmlFor="lastContactedTo">{t('contacts.filtersPanel.lastContactedTo')}</Label>
                <Input
                  id="lastContactedTo"
                  type="date"
                  value={filters.lastContactedTo}
                  onChange={(e) => handleFilterChange('lastContactedTo', e.target.value)}
                />
              </div>
            </div>

            {/* Tags Section */}
            <div className="mt-6 space-y-2">
              <Label>{t('contacts.filtersPanel.tags')}</Label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge
                    key={tag}
                    variant={filters.tags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => filters.tags.includes(tag) ? removeTag(tag) : addTag(tag)}
                  >
                    {t(`contacts.tags.${tagKeys[index]}`)}
                    {filters.tags.includes(tag) && <X className="h-3 w-3 ml-1" />}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
}
