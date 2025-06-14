import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { X, Calendar as CalendarIcon, Upload } from "lucide-react";
import type { Note } from "@/types/note";

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Partial<Note>) => void;
  note?: Note;
}

export function NoteModal({ isOpen, onClose, onSave, note }: NoteModalProps) {
  const { t } = useTranslation();
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [type, setType] = useState(note?.type || "general");
  const [visibility, setVisibility] = useState(note?.visibility || "private");
  const [tags, setTags] = useState<string[]>(note?.tags || []);
  const [currentTag, setCurrentTag] = useState("");
  const [isPinned, setIsPinned] = useState(note?.isPinned || false);
  const [hasReminder, setHasReminder] = useState(note?.hasReminder || false);
  const [reminderDate, setReminderDate] = useState<Date | undefined>(
    note?.reminderDate ? new Date(note.reminderDate) : undefined
  );

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTypeChange = (value: string) => {
    setType(value as Note["type"]);
  };

  const handleVisibilityChange = (value: string) => {
    setVisibility(value as Note["visibility"]);
  };

  const handleSave = () => {
    const noteData: Partial<Note> = {
      title,
      content,
      type: type as Note["type"],
      visibility: visibility as Note["visibility"],
      tags,
      isPinned,
      hasReminder,
      reminderDate: reminderDate?.toISOString(),
    };

    onSave(noteData);
    handleClose();
  };

  const handleClose = () => {
    setTitle("");
    setContent("");
    setType("general");
    setVisibility("private");
    setTags([]);
    setCurrentTag("");
    setIsPinned(false);
    setHasReminder(false);
    setReminderDate(undefined);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{note ? t('notes.modal.editTitle') : t('notes.modal.createTitle')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
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

          {/* Type and Visibility */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('notes.modal.typeLabel')}</Label>
              <Select value={type} onValueChange={handleTypeChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">{t('notes.noteType.general')}</SelectItem>
                  <SelectItem value="meeting">{t('notes.noteType.meeting')}</SelectItem>
                  <SelectItem value="task">{t('notes.noteType.task')}</SelectItem>
                  <SelectItem value="idea">{t('notes.noteType.idea')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t('notes.modal.visibilityLabel')}</Label>
              <Select value={visibility} onValueChange={handleVisibilityChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">{t('notes.visibility.private')}</SelectItem>
                  <SelectItem value="team">{t('notes.visibility.team')}</SelectItem>
                  <SelectItem value="public">{t('notes.visibility.public')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleRemoveTag(tag)}
                  />
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

          {/* Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="pinned">{t('notes.modal.pinNote')}</Label>
              <Switch
                id="pinned"
                checked={isPinned}
                onCheckedChange={setIsPinned}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="reminder">{t('notes.modal.setReminder')}</Label>
              <Switch
                id="reminder"
                checked={hasReminder}
                onCheckedChange={setHasReminder}
              />
            </div>

            {hasReminder && (
              <div className="space-y-2">
                <Label>{t('notes.modal.reminderDate')}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {reminderDate ? reminderDate.toLocaleDateString() : t('notes.modal.selectDate')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={reminderDate}
                      onSelect={setReminderDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>

          {/* Attachments */}
          <div className="space-y-2">
            <Label>{t('notes.modal.attachmentsLabel')}</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {t('notes.modal.attachmentsPlaceholder')}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button variant="outline" onClick={handleClose}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSave} disabled={!title.trim()}>
            {note ? t('notes.modal.updateButton') : t('notes.modal.createButton')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
