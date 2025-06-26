import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Pin,
  Edit,
  Trash2,
} from "lucide-react";
import { NoteModal } from "./NoteModal";
import type { Note } from "@/types/note";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface NoteDetailDrawerProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  onDelete: (noteId: string) => void;
  relatedEntityOptions?: Array<{ id: string; name: string; type: 'client' | 'contact' | 'deal' }>;
}

export function NoteDetailDrawer({
  note,
  isOpen,
  onClose,
  onSave,
  onDelete,
  relatedEntityOptions
}: NoteDetailDrawerProps) {
  const { t, i18n } = useTranslation();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!note) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(i18n.language, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const handleEditSave = () => {
    onSave();
    setIsEditModalOpen(false);
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {note.isPinned && (
                  <Pin className="h-5 w-5 text-orange-500 fill-current flex-shrink-0" />
                )}
                <SheetTitle className="text-left line-clamp-2">
                  {note.title}
                </SheetTitle>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this
                        note and remove its data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDelete(note.id)}>
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            {/* Metadata */}
            <div className="space-y-3">
              {note.relatedEntityId && note.relatedEntityType && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Related to:</span>
                  <Badge variant="outline">
                    {relatedEntityOptions?.find(opt => opt.id === note.relatedEntityId)?.name || note.relatedEntityType}
                  </Badge>
                </div>
              )}

              {note.tags.length > 0 && (
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">{t('notes.detail.tags')}</span>
                  <div className="flex flex-wrap gap-2">
                    {note.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </SheetHeader>

          <div className="space-y-6 py-6">
            {/* Content */}
            <div className="space-y-3">
              <h3 className="font-medium">{t('notes.detail.content')}</h3>
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {note.content}
                </div>
              </div>
            </div>

            {/* Created & Updated Info */}
            <div className="space-y-3">
              <h3 className="font-medium">{t('notes.detail.info')}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Avatar className="h-6 w-6">
                  <AvatarFallback>{note.owner?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <span>{note.owner || 'Unknown'}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                <span>{t('notes.detail.createdAt')}: </span>
                <span>{formatDate(note.createdAt)}</span>
              </div>
              {note.updatedAt && note.updatedAt !== note.createdAt && (
                <div className="text-sm text-muted-foreground">
                  <span>{t('notes.detail.updatedAt')}: </span>
                  <span>{formatDate(note.updatedAt)}</span>
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <NoteModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEditSave}
        note={note}
        relatedEntityOptions={relatedEntityOptions}
      />
    </>
  );
}
