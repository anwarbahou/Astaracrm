
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Pin, 
  Calendar, 
  Paperclip, 
  Eye, 
  EyeOff, 
  Users, 
  FileText,
  Lightbulb,
  CheckSquare,
  MessageSquare
} from "lucide-react";
import type { Note } from "@/types/note";

interface NoteCardProps {
  note: Note;
  onClick: () => void;
}

export function NoteCard({ note, onClick }: NoteCardProps) {
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
        return <EyeOff className="h-3 w-3" />;
      case "team":
        return <Users className="h-3 w-3" />;
      default:
        return <Eye className="h-3 w-3" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 24 * 7) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
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
          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
            {getVisibilityIcon(note.visibility)}
            {note.hasReminder && (
              <Calendar className="h-3 w-3 text-blue-500" />
            )}
            {note.attachments.length > 0 && (
              <Paperclip className="h-3 w-3 text-gray-500" />
            )}
          </div>
        </div>

        {/* Content Preview */}
        <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
          {note.content}
        </p>

        {/* Type and Linked Entity */}
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className={`gap-1 text-xs ${getTypeColor(note.type)}`}>
            {getTypeIcon(note.type)}
            {note.type}
          </Badge>
          {note.linkedTo && (
            <Badge variant="outline" className="text-xs">
              {note.linkedTo.name}
            </Badge>
          )}
        </div>

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
              <AvatarFallback className="text-xs">{note.createdBy.avatar}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{note.createdBy.name}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {formatDate(note.updatedAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
