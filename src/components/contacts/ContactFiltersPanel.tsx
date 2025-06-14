
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

  return (
    <Collapsible open={isOpen}>
      <CollapsibleContent>
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                Filters {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeFiltersCount}
                  </Badge>
                )}
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  <FilterX className="h-4 w-4 mr-2" />
                  Clear All
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
                <Label htmlFor="company">Company</Label>
                <Select
                  value={filters.company}
                  onValueChange={(value) => handleFilterChange('company', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All companies" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border">
                    <SelectItem value="">All companies</SelectItem>
                    <SelectItem value="Acme Corporation">Acme Corporation</SelectItem>
                    <SelectItem value="Tech Solutions Ltd">Tech Solutions Ltd</SelectItem>
                    <SelectItem value="Global Industries">Global Industries</SelectItem>
                    <SelectItem value="StartupXYZ">StartupXYZ</SelectItem>
                    <SelectItem value="Enterprise Corp">Enterprise Corp</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Role Filter */}
              <div className="space-y-2">
                <Label htmlFor="role">Role/Title</Label>
                <Select
                  value={filters.role}
                  onValueChange={(value) => handleFilterChange('role', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All roles" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border">
                    <SelectItem value="">All roles</SelectItem>
                    <SelectItem value="CEO">CEO</SelectItem>
                    <SelectItem value="CTO">CTO</SelectItem>
                    <SelectItem value="VP Sales">VP Sales</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Developer">Developer</SelectItem>
                    <SelectItem value="Designer">Designer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Country Filter */}
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select
                  value={filters.country}
                  onValueChange={(value) => handleFilterChange('country', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All countries" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border">
                    <SelectItem value="">All countries</SelectItem>
                    <SelectItem value="Morocco">Morocco</SelectItem>
                    <SelectItem value="France">France</SelectItem>
                    <SelectItem value="Spain">Spain</SelectItem>
                    <SelectItem value="USA">United States</SelectItem>
                    <SelectItem value="UK">United Kingdom</SelectItem>
                    <SelectItem value="Germany">Germany</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => handleFilterChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border">
                    <SelectItem value="">All statuses</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Created From */}
              <div className="space-y-2">
                <Label htmlFor="dateCreatedFrom">Created From</Label>
                <Input
                  id="dateCreatedFrom"
                  type="date"
                  value={filters.dateCreatedFrom}
                  onChange={(e) => handleFilterChange('dateCreatedFrom', e.target.value)}
                />
              </div>

              {/* Date Created To */}
              <div className="space-y-2">
                <Label htmlFor="dateCreatedTo">Created To</Label>
                <Input
                  id="dateCreatedTo"
                  type="date"
                  value={filters.dateCreatedTo}
                  onChange={(e) => handleFilterChange('dateCreatedTo', e.target.value)}
                />
              </div>

              {/* Last Contacted From */}
              <div className="space-y-2">
                <Label htmlFor="lastContactedFrom">Last Contacted From</Label>
                <Input
                  id="lastContactedFrom"
                  type="date"
                  value={filters.lastContactedFrom}
                  onChange={(e) => handleFilterChange('lastContactedFrom', e.target.value)}
                />
              </div>

              {/* Last Contacted To */}
              <div className="space-y-2">
                <Label htmlFor="lastContactedTo">Last Contacted To</Label>
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
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2">
                {['Decision Maker', 'VIP', 'Technical', 'Founder', 'Startup', 'Procurement', 'Sales'].map((tag) => (
                  <Badge
                    key={tag}
                    variant={filters.tags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => filters.tags.includes(tag) ? removeTag(tag) : addTag(tag)}
                  >
                    {tag}
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
