import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter } from "lucide-react";
import { NotesGrid } from "@/components/notes/NotesGrid";
import { NoteModal } from "@/components/notes/NoteModal";
import { NoteDetailDrawer } from "@/components/notes/NoteDetailDrawer";
import { NoteFilters } from "@/components/notes/NoteFilters";
import { noteService } from '@/services/noteService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { Note, NoteFilters as NoteFiltersType } from "@/types/note";
import { withPageTitle } from '@/components/withPageTitle';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function Notes() {
  const { t } = useTranslation();
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const location = useLocation();
  
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [filters, setFilters] = useState<NoteFiltersType>({
    search: '',
    tags: [],
    relatedEntityType: 'all',
    isPinned: 'all',
    sortBy: 'modified',
    dateRange: null,
    priority: null,
    status: null
  });

  // Fetch notes with React Query
  const { 
    data: notes = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['notes', user?.id, userProfile?.role],
    queryFn: async () => {
      if (!user?.id || !userProfile?.role) return [];
      return noteService.getNotes({ 
        userId: user.id, 
        userRole: userProfile.role as 'user' | 'admin' | 'manager' 
      });
    },
    enabled: !!user?.id && !!userProfile?.role,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    retry: 2,
  });

  // Delete note mutation
  const deleteMutation = useMutation({
    mutationFn: async (noteId: string) => {
      if (!user?.id || !userProfile?.role) {
        throw new Error("User not authenticated");
      }
      return noteService.deleteNote(noteId, { 
        userId: user.id, 
        userRole: userProfile.role as 'user' | 'admin' | 'manager' 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast({
        title: "Note Deleted",
        description: "Note deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete note.",
        variant: "destructive",
      });
    }
  });

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         note.content.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesTags = filters.tags.length === 0 || 
                       filters.tags.some(tag => note.tags.includes(tag));
    
    const matchesDateRange = filters.dateRange === null || 
                            (note.createdAt >= filters.dateRange.start && note.createdAt <= filters.dateRange.end);
    
    const matchesPriority = filters.priority === null || note.priority === filters.priority;
    
    const matchesStatus = filters.status === null || note.status === filters.status;
    
    return matchesSearch && matchesTags && matchesDateRange && matchesPriority && matchesStatus;
  });

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    switch (filters.sortBy) {
      case "created":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "title":
        return a.title.localeCompare(b.title);
      default: // modified
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
  });

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setDetailDrawerOpen(true);
  };

  const handleNoteSave = () => {
    queryClient.invalidateQueries({ queryKey: ['notes'] });
    setNoteModalOpen(false);
    setSelectedNote(null);
  };

  const handleNoteDelete = async (noteId: string) => {
    deleteMutation.mutate(noteId);
  };

  // Mock related entity options for now. In a real app, these would be fetched.
  const relatedEntityOptions = [
    { id: "a1b2c3d4-e5f6-7890-1234-567890abcdef", name: "Client A", type: "client" as const },
    { id: "f0e9d8c7-b6a5-4321-fedc-ba9876543210", name: "Contact B", type: "contact" as const },
    { id: "1a2b3c4d-5e6f-7890-abcd-ef0123456789", name: "Deal C", type: "deal" as const },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        <p className="text-lg text-muted-foreground mt-4">Loading notes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-lg text-destructive mb-4">Failed to load notes</p>
        <Button 
          onClick={() => queryClient.invalidateQueries({ queryKey: ['notes'] })}
          variant="outline"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Notes</h1>
              <p className="text-sm text-muted-foreground">
                Capture ideas, meeting notes, and important information
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search notes..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10 w-64"
                />
              </div>
              
              {/* Filters */}
              <NoteFilters filters={filters} onFiltersChange={setFilters} />
              
              {/* Create Note Button */}
              <Button 
                onClick={() => setNoteModalOpen(true)}
                className="gap-2 bg-primary hover:bg-primary/90"
              >
                <Plus size={16} />
                New Note
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <NotesGrid 
          notes={sortedNotes} 
          onNoteClick={handleNoteClick}
          onDeleteNote={handleNoteDelete}
        />
      </div>

      {/* Modals */}
      <NoteModal
        isOpen={noteModalOpen}
        onClose={() => setNoteModalOpen(false)}
        onSave={handleNoteSave}
      />

      <NoteDetailDrawer
        note={selectedNote}
        isOpen={detailDrawerOpen}
        onClose={() => setDetailDrawerOpen(false)}
        onSave={handleNoteSave}
        onDelete={handleNoteDelete}
        relatedEntityOptions={relatedEntityOptions}
      />
    </div>
  );
}

export default withPageTitle(Notes, 'notes');
