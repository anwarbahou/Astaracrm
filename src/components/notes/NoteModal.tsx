import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import type { Note } from "@/types/note";
import { noteService } from '@/services/noteService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Partial<Note>) => void;
  note?: Note;
  relatedEntityOptions?: Array<{ id: string; name: string; type: 'client' | 'contact' | 'deal' }>;
}

export function NoteModal({ isOpen, onClose, onSave, note, relatedEntityOptions }: NoteModalProps) {
  const { t } = useTranslation();
  const { user, userProfile } = useAuth();
  const { toast } = useToast();

  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [tags, setTags] = useState<string[]>(note?.tags || []);
  const [currentTag, setCurrentTag] = useState("");
  const [isPinned, setIsPinned] = useState(note?.isPinned || false);
  const [relatedEntityType, setRelatedEntityType] = useState<Note["relatedEntityType"]>(note?.relatedEntityType || null);
  const [relatedEntityId, setRelatedEntityId] = useState<string | null>(note?.relatedEntityId || null);

  const predefinedTags = ["meeting", "idea", "task", "general"];

  function isUUID(str: string) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
  }

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleRelatedEntityChange = (value: string) => {
    if (value === "none") {
      setRelatedEntityType(null);
      setRelatedEntityId(null);
    } else {
      const [type, id] = value.split(":");
      setRelatedEntityType(type as Note["relatedEntityType"]);
      setRelatedEntityId(id);
    }
  };

  const handleSave = async () => {
    if (!user?.id || !userProfile?.role) {
      toast({
        title: "Authentication Error",
        description: "User not authenticated. Please log in again.",
        variant: "destructive",
      });
      return;
    }

    const noteData = {
      title,
      content,
      tags,
      is_pinned: isPinned,
      related_entity_type: relatedEntityType,
      related_entity_id: relatedEntityId,
      owner_id: user.id,
    };

    try {
      if (note?.id) {
        await noteService.updateNote(note.id, noteData, { userId: user.id, userRole: userProfile.role });
        toast({
          title: "Note Updated",
          description: "Note updated successfully.",
        });
      } else {
        await noteService.createNote(noteData);
        toast({
          title: "Note Created",
          description: "Note created successfully.",
        });
      }
      onSave(noteData);
      handleClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save note.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setTitle("");
    setContent("");
    setTags([]);
    setCurrentTag("");
    setIsPinned(false);
    setRelatedEntityType(null);
    setRelatedEntityId(null);
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent side="right" className="max-w-2xl w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{note ? t('notes.modal.editTitle') : t('notes.modal.createTitle')}</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">{t('notes.modal.titleLabel')}</Label>
            <Input
              id="title"
              placeholder={t('notes.modal.titlePlaceholder')}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>{t('notes.modal.tagsLabel')}</Label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder={t('notes.modal.tagsPlaceholder')}
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                className="flex-1"
              />
              <Button type="button" variant="outline" onClick={handleAddTag}>
                {t('common.add')}
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {predefinedTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={tags.includes(tag) ? "default" : "secondary"}
                  className="cursor-pointer"
                  onClick={() => handleRemoveTag(tag)}
                >
                  {tag}
                  {tags.includes(tag) && <X className="h-3 w-3 ml-1" onClick={() => handleRemoveTag(tag)} />}
                </Badge>
              ))}
              {tags.filter(tag => !predefinedTags.includes(tag)).map((tag) => (
                <Badge key={tag} variant="default" className="gap-1 cursor-pointer" onClick={() => handleRemoveTag(tag)}>
                  {tag}
                  <X className="h-3 w-3" />
                </Badge>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">{t('notes.modal.contentLabel')}</Label>
            <Textarea
              id="content"
              placeholder={t('notes.modal.contentPlaceholder')}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px]"
            />
          </div>

          {/* Related Entity */}
          <div className="space-y-2">
            <Label>{t('notes.modal.relatedToLabel')}</Label>
            <Select
              value={relatedEntityType && relatedEntityId ? `${relatedEntityType}:${relatedEntityId}` : "none"}
              onValueChange={handleRelatedEntityChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a related entity (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {relatedEntityOptions?.map((entity) => (
                  <SelectItem key={entity.id} value={`${entity.type}:${entity.id}`}>
                    {entity.name} ({entity.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button variant="outline" onClick={handleClose}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSave}>
            {note ? t('common.saveChanges') : t('common.create')}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
