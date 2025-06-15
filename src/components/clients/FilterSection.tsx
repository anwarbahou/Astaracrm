
import { Label } from '@/components/ui/label';
import React from 'react';

const FilterSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="flex justify-between items-start gap-4">
    <div className="space-y-2 flex-grow">
      {children}
    </div>
    <Label className="text-xs text-muted-foreground pt-1 shrink-0 w-20 text-right font-medium">{title}</Label>
  </div>
);

export default FilterSection;
