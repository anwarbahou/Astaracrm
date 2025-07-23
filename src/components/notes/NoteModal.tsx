import { useState, useEffect } from "react";
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
import { X, User, Briefcase, Handshake } from "lucide-react";
import type { Note } from "@/types/note";
import { noteService } from '@/services/noteService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useClientsForSelection } from '@/hooks/useClients';
import { contactsService } from '@/services/contactsService';
import { useDeals } from '@/hooks/useDeals';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Partial<Note>) => void;
  note?: Note;
  initialRelatedEntityType?: "deal" | "client" | "contact";
  initialRelatedEntityId?: string;
  initialRelatedEntityName?: string;
}

export function NoteModal({ isOpen, onClose, onSave, note, initialRelatedEntityType, initialRelatedEntityId, initialRelatedEntityName }: NoteModalProps) {
  const { t } = useTranslation();
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const { clients, isLoading: clientsLoading } = useClientsForSelection();
  const { deals, isLoading: dealsLoading } = useDeals();
  const [contacts, setContacts] = useState<any[]>([]);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [tags, setTags] = useState<string[]>(note?.tags || []);
  const [currentTag, setCurrentTag] = useState("");
  const [isPinned, setIsPinned] = useState(note?.isPinned || false);
  const [relatedEntityType, setRelatedEntityType] = useState<Note["relatedEntityType"]>(
    note?.relatedEntityType || initialRelatedEntityType || null
  );
  const [relatedEntityId, setRelatedEntityId] = useState<string | null>(
    note?.relatedEntityId || initialRelatedEntityId || null
  );
  const [relatedEntityName, setRelatedEntityName] = useState<string | null>(
    initialRelatedEntityName || null
  );
  const [priority, setPriority] = useState<Note["priority"]>(note?.priority || "medium");
  const [status, setStatus] = useState<Note["status"]>(note?.status || 'active');

  useEffect(() => {
    if (userProfile) {
      setContactsLoading(true);
      function isAllowedRole(role: any): role is 'user' | 'admin' | 'manager' | 'team_leader' {
        return role === 'user' || role === 'admin' || role === 'manager' || role === 'team_leader';
      }
      let allowedRole: 'user' | 'admin' | 'manager' | 'team_leader' = 'user';
      if (typeof userProfile.role === 'string' && isAllowedRole(userProfile.role)) {
        allowedRole = userProfile.role;
      }
      contactsService.getContacts({ 
        userId: userProfile.id, 
        userRole: allowedRole
      })
        .then(data => setContacts(data.map(c => ({ id: c.id, name: c.firstName + ' ' + c.lastName }))))
        .finally(() => setContactsLoading(false));
    }
  }, [userProfile]);

  const predefinedTags = ["meeting", "idea", "task", "general"];

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleRelatedEntityChange = (entityType: "client" | "contact" | "deal", id: string, name: string) => {
    setRelatedEntityType(entityType);
      setRelatedEntityId(id);
    setRelatedEntityName(name);
    setDropdownOpen(null);
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

    if (!title.trim()) {
      toast({
        title: "Validation Error",
        description: "Title is required.",
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
      priority,
      status
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
    setRelatedEntityType(initialRelatedEntityType || null);
    setRelatedEntityId(initialRelatedEntityId || null);
    setRelatedEntityName(initialRelatedEntityName || null);
    setPriority("medium");
    setStatus('active');
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

          {/* Related Entity */}
          <div className="space-y-2">
            <Label>{t('tasks.addTaskModal.form.relatedEntity')}</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={!relatedEntityType ? "default" : "outline"}
                onClick={() => {
                  setRelatedEntityType(null);
                  setRelatedEntityId(null);
                  setRelatedEntityName(null);
                }}
              >
                {t('tasks.addTaskModal.form.none')}
              </Button>

              <Popover open={dropdownOpen === 'client'} onOpenChange={(open) => setDropdownOpen(open ? 'client' : null)}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant={relatedEntityType === "client" ? "default" : "outline"}
                  >
                    <Briefcase className="mr-2 h-4 w-4" />
                    {t('tasks.addTaskModal.form.client')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <Input
                      placeholder={t('tasks.addTaskModal.form.searchEntities')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="max-h-48 overflow-auto">
                      {clientsLoading ? (
                        <div className="text-center py-2">{t('tasks.addTaskModal.form.loading')}</div>
                      ) : clients.length === 0 ? (
                        <div className="text-center py-2">{t('tasks.addTaskModal.form.noEntitiesFound')}</div>
                      ) : (
                        clients
                          .filter(client => client.name.toLowerCase().includes(searchQuery.toLowerCase()))
                          .map((client) => (
                            <Button
                              key={client.id}
                              variant="ghost"
                              className="w-full justify-start"
                              onClick={() => handleRelatedEntityChange("client", client.id, client.name)}
                            >
                              {client.name}
                            </Button>
                          ))
                      )}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Popover open={dropdownOpen === 'contact'} onOpenChange={(open) => setDropdownOpen(open ? 'contact' : null)}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant={relatedEntityType === "contact" ? "default" : "outline"}
                  >
                    <User className="mr-2 h-4 w-4" />
                    {t('tasks.addTaskModal.form.contact')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <Input
                      placeholder={t('tasks.addTaskModal.form.searchEntities')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="max-h-48 overflow-auto">
                      {contactsLoading ? (
                        <div className="text-center py-2">{t('tasks.addTaskModal.form.loading')}</div>
                      ) : contacts.length === 0 ? (
                        <div className="text-center py-2">{t('tasks.addTaskModal.form.noEntitiesFound')}</div>
                      ) : (
                        contacts
                          .filter(contact => contact.name.toLowerCase().includes(searchQuery.toLowerCase()))
                          .map((contact) => (
                            <Button
                              key={contact.id}
                              variant="ghost"
                              className="w-full justify-start"
                              onClick={() => handleRelatedEntityChange("contact", contact.id, contact.name)}
                            >
                              {contact.name}
                            </Button>
                          ))
                      )}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Popover open={dropdownOpen === 'deal'} onOpenChange={(open) => setDropdownOpen(open ? 'deal' : null)}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant={relatedEntityType === "deal" ? "default" : "outline"}
                  >
                    <Handshake className="mr-2 h-4 w-4" />
                    {t('tasks.addTaskModal.form.deal')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <Input
                      placeholder={t('tasks.addTaskModal.form.searchEntities')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="max-h-48 overflow-auto">
                      {dealsLoading ? (
                        <div className="text-center py-2">{t('tasks.addTaskModal.form.loading')}</div>
                      ) : deals.length === 0 ? (
                        <div className="text-center py-2">{t('tasks.addTaskModal.form.noEntitiesFound')}</div>
                      ) : (
                        deals
                          .filter(deal => deal.name.toLowerCase().includes(searchQuery.toLowerCase()))
                          .map((deal) => (
                            <Button
                              key={deal.id}
                              variant="ghost"
                              className="w-full justify-start"
                              onClick={() => handleRelatedEntityChange("deal", deal.id, deal.name)}
                            >
                              {deal.name}
                            </Button>
                          ))
                      )}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            {relatedEntityName && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{t('notes.modal.selectedEntity')}:</span>
                <Badge variant="secondary" className="flex items-center gap-1">
                  {relatedEntityType === 'client' && <Briefcase className="h-3 w-3" />}
                  {relatedEntityType === 'contact' && <User className="h-3 w-3" />}
                  {relatedEntityType === 'deal' && <Handshake className="h-3 w-3" />}
                  {relatedEntityName}
                </Badge>
              </div>
            )}
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

          {/* Priority */}
          <div className="space-y-2">
            <Label>{t('notes.modal.priorityLabel', 'Priority')}</Label>
            <Select value={priority} onValueChange={(value) => setPriority(value as Note["priority"])}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>{t('notes.modal.statusLabel', 'Status')}</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as Note["status"])}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Is Pinned */}
          <div className="flex items-center space-x-2">
            <Switch
              id="is-pinned"
              checked={isPinned}
              onCheckedChange={setIsPinned}
            />
            <Label htmlFor="is-pinned">{t('notes.modal.pinnedLabel', 'Pin this note')}</Label>
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
