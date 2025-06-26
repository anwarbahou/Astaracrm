import { supabase } from '@/integrations/supabase/client';
import { Note } from '@/types/note';

// Database types
// Using 'any' placeholders due to missing generated types
type NoteRow = any;
type NoteInsert = any;
type NoteUpdate = any;

export interface NoteInput {
  title: string;
  content: string;
  tags?: string[];
  is_pinned?: boolean;
  related_entity_type?: 'client' | 'contact' | 'deal' | null;
  related_entity_id?: string | null;
  owner_id: string;
}

export interface NoteServiceOptions {
  userId: string;
  userRole: 'admin' | 'manager' | 'user' | null;
}

// Convert database note to UI note format
const dbNoteToNote = (dbNote: NoteRow & { owner?: any }): Note => {
  return {
    id: dbNote.id,
    title: dbNote.title,
    content: dbNote.content || '',
    tags: dbNote.tags || [],
    isPinned: dbNote.is_pinned || false,
    relatedEntityType: dbNote.related_entity_type || null,
    relatedEntityId: dbNote.related_entity_id || null,
    createdAt: dbNote.created_at || '',
    updatedAt: dbNote.updated_at || '',
    ownerId: dbNote.owner_id || '',
    owner: dbNote.owner ? `${dbNote.owner.first_name} ${dbNote.owner.last_name}` : 'Unknown',
  };
};

// Convert UI note input to database format for insert
const noteInputToDbInsert = (input: NoteInput): NoteInsert => {
  return {
    title: input.title,
    content: input.content,
    tags: input.tags || [],
    is_pinned: input.is_pinned || false,
    related_entity_type: input.related_entity_type || null,
    related_entity_id: input.related_entity_id || null,
    owner_id: input.owner_id,
  };
};

// Convert UI note input to database format for update
const noteInputToDbUpdate = (input: Partial<NoteInput>): NoteUpdate => {
  return {
    title: input.title,
    content: input.content,
    tags: input.tags,
    is_pinned: input.is_pinned,
    related_entity_type: input.related_entity_type,
    related_entity_id: input.related_entity_id,
    owner_id: input.owner_id,
  };
};

export const noteService = {
  async getNotes(options: NoteServiceOptions): Promise<Note[]> {
    const { userId, userRole } = options;
    try {
      let query = supabase.from('notes').select(`
        *,
        owner:users!notes_owner_id_fkey(first_name, last_name)
      `);

      if (userRole !== 'admin') {
        query = query.eq('owner_id', userId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notes from Supabase:', error);
        throw error;
      }
      return data.map(dbNoteToNote);
    } catch (error) {
      console.error('Error in getNotes:', error);
      return [];
    }
  },

  async createNote(noteInput: NoteInput): Promise<Note | null> {
    try {
      const dbInsert = noteInputToDbInsert(noteInput);
      const { data, error } = await supabase
        .from('notes')
        .insert(dbInsert)
        .select(`
          *,
          owner:users!notes_owner_id_fkey(first_name, last_name)
        `)
        .single();

      if (error) {
        console.error('Error creating note in Supabase:', error);
        throw error;
      }
      return dbNoteToNote(data);
    } catch (error) {
      console.error('Error in createNote:', error);
      throw error;
    }
  },

  async updateNote(noteId: string, noteInput: Partial<NoteInput>, options: NoteServiceOptions): Promise<Note | null> {
    const { userId, userRole } = options;
    try {
      // Check ownership/permissions before updating
      const { data: existingNote, error: fetchError } = await supabase
        .from('notes')
        .select('owner_id')
        .eq('id', noteId)
        .single();

      if (fetchError || !existingNote) {
        console.error('Note not found or error fetching existing note:', fetchError);
        throw new Error('Note not found or access denied');
      }

      if (userRole !== 'admin' && existingNote.owner_id !== userId) {
        throw new Error('Access denied: You can only update your own notes');
      }

      const dbUpdate = noteInputToDbUpdate(noteInput);
      const { data, error } = await supabase
        .from('notes')
        .update(dbUpdate)
        .eq('id', noteId)
        .select(`
          *,
          owner:users!notes_owner_id_fkey(first_name, last_name)
        `)
        .single();

      if (error) {
        console.error('Error updating note in Supabase:', error);
        throw error;
      }
      return dbNoteToNote(data);
    } catch (error) {
      console.error('Error in updateNote:', error);
      throw error;
    }
  },

  async deleteNote(noteId: string, options: NoteServiceOptions): Promise<boolean> {
    const { userId, userRole } = options;
    try {
      // Check ownership/permissions before deleting
      const { data: existingNote, error: fetchError } = await supabase
        .from('notes')
        .select('owner_id')
        .eq('id', noteId)
        .single();

      if (fetchError || !existingNote) {
        console.error('Note not found or error fetching existing note:', fetchError);
        return false;
      }

      if (userRole !== 'admin' && existingNote.owner_id !== userId) {
        throw new Error('Access denied: You can only delete your own notes');
      }

      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId);

      if (error) {
        console.error('Error deleting note from Supabase:', error);
        throw error;
      }
      return true;
    } catch (error) {
      console.error('Error in deleteNote:', error);
      throw error;
    }
  },
}; 