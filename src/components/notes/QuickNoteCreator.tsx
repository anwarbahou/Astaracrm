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
import { Plus, Check, X } from 'lucide-react';
import { noteService } from '@/services/noteService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { Note } from '@/types/note';

interface QuickNoteCreatorProps {
  dealId: string;
  dealName: string;
  onNoteCreated: () => void;
  isEditing: boolean;
}

export function QuickNoteCreator({ dealId, dealName, onNoteCreated, isEditing }: QuickNoteCreatorProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  
  const { userProfile } = useAuth();
  const { toast } = useToast();

  const handleCreateNote = async () => {
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
        tags: [],
        is_pinned: false,
        related_entity_type: 'deal' as const,
        related_entity_id: dealId,
        owner_id: userProfile.id,
        priority,
        status: 'active' as const
      };

      await noteService.createNote(noteData);
      
      // Reset form
      setTitle('');
      setContent('');
      setPriority('medium');
      setIsCreating(false);
      
      // Notify parent component
      onNoteCreated();
      
      toast({
        title: "Note Created",
        description: "Note created successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create note.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setTitle('');
    setContent('');
    setPriority('medium');
    setIsCreating(false);
  };

  if (!isEditing) {
    return null;
  }

  return (
    <div className="space-y-4">
      {!isCreating ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsCreating(true)}
          className="h-8 px-3"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Note
        </Button>
      ) : (
        <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
          <div className="space-y-2">
            <Label htmlFor="note-title" className="text-sm font-medium">Note Title</Label>
            <Input
              id="note-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title..."
              className="h-9"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="note-content" className="text-sm font-medium">Note Content</Label>
            <Textarea
              id="note-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter note content..."
              className="min-h-[100px] resize-none"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="note-priority" className="text-sm font-medium">Priority</Label>
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
              onClick={handleCreateNote}
              className="flex-1"
            >
              <Check className="h-4 w-4 mr-1" />
              Create Note
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
      )}
    </div>
  );
} 