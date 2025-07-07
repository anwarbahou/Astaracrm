import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pin,
  Trash2,
} from "lucide-react";
import type { Note } from "@/types/note";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
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

interface NoteCardProps {
  note: Note;
  onClick: () => void;
  onDelete: (noteId: string) => void;
}

export function NoteCard({ note, onClick, onDelete }: NoteCardProps) {
  const { i18n } = useTranslation();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = (now.getTime() - date.getTime()) / 1000;
    
    // Intl.RelativeTimeFormat is great for "X days ago" type formats
    const rtf = new Intl.RelativeTimeFormat(i18n.language, { numeric: 'auto' });

    const diffInDays = diffInSeconds / (60 * 60 * 24);
    if (diffInDays > 7) {
      return date.toLocaleDateString(i18n.language);
    }
    if (diffInDays >= 1) {
      return rtf.format(-Math.floor(diffInDays), 'day');
    }
    
    const diffInHours = diffInSeconds / (60 * 60);
    if (diffInHours >= 1) {
      return rtf.format(-Math.floor(diffInHours), 'hour');
    }

    const diffInMinutes = diffInSeconds / 60;
    if (diffInMinutes >= 1) {
      return rtf.format(-Math.floor(diffInMinutes), 'minute');
    }
    
    return rtf.format(-Math.floor(diffInSeconds), 'second');
  };

  return (
    <Card 
      className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] hover:border-primary/20"
      onClick={onClick}
    >
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {note.isPinned && (
              <Pin className="h-4 w-4 text-orange-500 fill-current flex-shrink-0" />
            )}
            <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
              {note.title}
            </h3>
          </div>
        </div>

        {/* Content Preview */}
        <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
          {note.content}
        </p>

        {/* Tags */}
        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {note.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {note.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{note.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <Avatar className="h-5 w-5">
              <AvatarFallback className="text-xs">{note.owner?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{note.owner || 'Unknown'}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {formatDate(note.updatedAt)}
          </span>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 ml-2" onClick={(e) => e.stopPropagation()}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  note and remove its data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={(e) => {
                  e.stopPropagation();
                  onDelete(note.id);
                }}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
