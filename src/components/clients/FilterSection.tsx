
import { Label } from '@/components/ui/label';
import React from 'react';

const FilterSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="space-y-2">
    <Label className="text-sm font-medium text-muted-foreground">{title}</Label>
    {children}
  </div>
);

export default FilterSection;
