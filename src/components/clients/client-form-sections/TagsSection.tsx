
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface TagsSectionProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

export const TagsSection = ({ tags, onTagsChange }: TagsSectionProps) => {
  const { t } = useTranslation();
  const [newTag, setNewTag] = useState('');

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      onTagsChange([...tags, newTag]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div>
      <Label>{t('addClientModal.tagsLabel')}</Label>
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('addClientModal.tagsPlaceholder')}
            className="flex-1"
          />
          <Button type="button" onClick={addTag} size="sm">
            {t('common.add')}
          </Button>
        </div>
        {tags.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {tags.map((tag, index) => (
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
  );
};
