
import { useState } from "react";
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
  Calendar, 
  Paperclip, 
  Edit, 
  Trash2, 
  Download,
  Eye,
  EyeOff,
  Users,
  FileText,
  Lightbulb,
  CheckSquare,
  MessageSquare
} from "lucide-react";
import { NoteModal } from "./NoteModal";
import type { Note } from "@/types/note";

interface NoteDetailDrawerProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
}

export function NoteDetailDrawer({ note, isOpen, onClose }: NoteDetailDrawerProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!note) return null;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "meeting":
        return <MessageSquare className="h-4 w-4" />;
      case "task":
        return <CheckSquare className="h-4 w-4" />;
      case "idea":
        return <Lightbulb className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "meeting":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "task":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "idea":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case "private":
        return <EyeOff className="h-4 w-4" />;
      case "team":
        return <Users className="h-4 w-4" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  const getVisibilityText = (visibility: string) => {
    switch (visibility) {
      case "private":
        return "Private";
      case "team":
        return "Team";
      default:
        return "Public";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleEdit = (noteData: Partial<Note>) => {
    // Mock update - in real app, this would call API
    console.log("Updating note:", noteData);
    setIsEditModalOpen(false);
  };

  const handleDelete = () => {
    // Mock delete - in real app, this would call API
    console.log("Deleting note:", note.id);
    onClose();
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Metadata */}
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <Badge className={`gap-1 ${getTypeColor(note.type)}`}>
                  {getTypeIcon(note.type)}
                  {note.type}
                </Badge>
                <Badge variant="outline" className="gap-1">
                  {getVisibilityIcon(note.visibility)}
                  {getVisibilityText(note.visibility)}
                </Badge>
              </div>

              {note.linkedTo && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Linked to:</span>
                  <Badge variant="outline">
                    {note.linkedTo.name}
                  </Badge>
                </div>
              )}

              {note.tags.length > 0 && (
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Tags:</span>
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
              <h3 className="font-medium">Content</h3>
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {note.content}
                </div>
              </div>
            </div>

            {/* Reminder */}
            {note.hasReminder && note.reminderDate && (
              <div className="space-y-3">
                <h3 className="font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Reminder
                </h3>
                <p className="text-sm text-muted-foreground">
                  {formatDate(note.reminderDate)}
                </p>
              </div>
            )}

            {/* Attachments */}
            {note.attachments.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium flex items-center gap-2">
                  <Paperclip className="h-4 w-4" />
                  Attachments ({note.attachments.length})
                </h3>
                <div className="space-y-2">
                  {note.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">
                          {attachment.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(attachment.size)}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{note.createdBy.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{note.createdBy.name}</p>
                  <p className="text-xs text-muted-foreground">Author</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Created</p>
                  <p>{formatDate(note.createdAt)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Modified</p>
                  <p>{formatDate(note.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <NoteModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEdit}
        note={note}
      />
    </>
  );
}
