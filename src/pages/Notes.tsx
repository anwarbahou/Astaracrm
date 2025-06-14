
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter } from "lucide-react";
import { NotesGrid } from "@/components/notes/NotesGrid";
import { NoteModal } from "@/components/notes/NoteModal";
import { NoteDetailDrawer } from "@/components/notes/NoteDetailDrawer";
import { NoteFilters } from "@/components/notes/NoteFilters";
import { mockNotes } from "@/data/mockNotes";
import type { Note, NoteFilters as NoteFiltersType } from "@/types/note";

export default function Notes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<NoteFiltersType>({
    tags: [],
    type: "all",
    visibility: "all",
    sortBy: "modified"
  });

  const filteredNotes = mockNotes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTags = filters.tags.length === 0 || 
                       filters.tags.some(tag => note.tags.includes(tag));
    
    const matchesType = filters.type === "all" || note.type === filters.type;
    
    const matchesVisibility = filters.visibility === "all" || note.visibility === filters.visibility;
    
    return matchesSearch && matchesTags && matchesType && matchesVisibility;
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
    setIsDetailDrawerOpen(true);
  };

  const handleCreateNote = (noteData: Partial<Note>) => {
    // Mock creation - in real app, this would call API
    console.log("Creating note:", noteData);
    setIsCreateModalOpen(false);
  };

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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              {/* Filters */}
              <NoteFilters filters={filters} onFiltersChange={setFilters} />
              
              {/* Create Note Button */}
              <Button 
                onClick={() => setIsCreateModalOpen(true)}
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
        />
      </div>

      {/* Modals */}
      <NoteModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateNote}
      />

      <NoteDetailDrawer
        note={selectedNote}
        isOpen={isDetailDrawerOpen}
        onClose={() => setIsDetailDrawerOpen(false)}
      />
    </div>
  );
}
