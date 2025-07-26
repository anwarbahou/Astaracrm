import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Edit, Save, X } from 'lucide-react';
import { noteService } from '@/services/noteService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { Note } from '@/types/note';
import { Badge } from '@/components/ui/badge';

interface NoteEditorProps {
  note: Note;
  onNoteUpdated: () => void;
}

export function NoteEditor({ note, onNoteUpdated }: NoteEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(note.priority || 'medium');
  
  const { userProfile } = useAuth();
  const { toast } = useToast();

  const handleSave = async () => {
    if (!title.trim() || !content.trim() || !userProfile) {
      toast({
        title: "Validation Error",
        description: "Please fill in both title and content for the note.",
        variant: "destructive",
      });
      return;
    }

    try {
      const noteData = {
        title: title.trim(),
        content: content.trim(),
        priority,
        status: note.status
      };

      await noteService.updateNote(note.id, noteData, { 
        userId: userProfile.id, 
        userRole: userProfile.role as any 
      });
      
      setIsEditing(false);
      onNoteUpdated();
      
      toast({
        title: "Note Updated",
        description: "Note updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update note.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setTitle(note.title);
    setContent(note.content);
    setPriority(note.priority || 'medium');
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="p-3 bg-muted rounded-lg border">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-sm">{note.title}</h4>
          <div className="flex items-center gap-2">
            <Badge 
              variant={note.priority === 'high' ? 'destructive' : note.priority === 'medium' ? 'default' : 'secondary'}
              className="text-xs"
            >
              {note.priority}
            </Badge>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-6 w-6 p-0"
            >
              <Edit className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground whitespace-pre-line">
          {note.content}
        </p>
        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
          <span>{new Date(note.createdAt).toLocaleDateString()}</span>
          {note.isPinned && <Badge variant="outline" className="text-xs">Pinned</Badge>}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
      <div className="space-y-2">
        <Label htmlFor="edit-note-title" className="text-sm font-medium">Note Title</Label>
        <Input
          id="edit-note-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter note title..."
          className="h-9"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="edit-note-content" className="text-sm font-medium">Note Content</Label>
        <Textarea
          id="edit-note-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter note content..."
          className="min-h-[100px] resize-none"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="edit-note-priority" className="text-sm font-medium">Priority</Label>
        <Select value={priority} onValueChange={(value) => setPriority(value as 'low' | 'medium' | 'high')}>
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex gap-2">
        <Button
          type="button"
          size="sm"
          onClick={handleSave}
          className="flex-1"
        >
          <Save className="h-4 w-4 mr-1" />
          Save Changes
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCancel}
          className="flex-1"
        >
          <X className="h-4 w-4 mr-1" />
          Cancel
        </Button>
      </div>
    </div>
  );
} 