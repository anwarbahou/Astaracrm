
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { SectionProps } from ".";

export function TagsSection({ formData, setFormData }: SectionProps) {
  const { t } = useTranslation();
  const [newTag, setNewTag] = useState("");

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({ ...formData, tags: [...formData.tags, newTag] });
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div>
      <Label>{t('addContactModal.tagsLabel')}</Label>
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('addContactModal.tagsPlaceholder')}
            className="flex-1"
          />
          <Button type="button" onClick={addTag} size="sm">
            {t('addContactModal.addTagButton')}
          </Button>
        </div>
        {formData.tags.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {formData.tags.map((tag, index) => (
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
}
