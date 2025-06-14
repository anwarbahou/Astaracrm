
import { NoteCard } from "./NoteCard";
import type { Note } from "@/types/note";

interface NotesGridProps {
  notes: Note[];
  onNoteClick: (note: Note) => void;
}

export function NotesGrid({ notes, onNoteClick }: NotesGridProps) {
  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-lg font-medium text-foreground mb-2">No notes found</h3>
        <p className="text-muted-foreground text-center max-w-md">
          Start capturing your ideas, meeting notes, and important information by creating your first note.
        </p>
      </div>
    );
  }

  const pinnedNotes = notes.filter(note => note.isPinned);
  const regularNotes = notes.filter(note => !note.isPinned);

  return (
    <div className="space-y-8">
      {pinnedNotes.length > 0 && (
        <div>
          <h2 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
            📌 Pinned Notes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {pinnedNotes.map((note) => (
              <NoteCard 
                key={note.id} 
                note={note} 
                onClick={() => onNoteClick(note)} 
              />
            ))}
          </div>
        </div>
      )}
      
      {regularNotes.length > 0 && (
        <div>
          {pinnedNotes.length > 0 && (
            <h2 className="text-lg font-medium text-foreground mb-4">All Notes</h2>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {regularNotes.map((note) => (
              <NoteCard 
                key={note.id} 
                note={note} 
                onClick={() => onNoteClick(note)} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
