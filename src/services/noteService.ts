import { supabase } from '@/integrations/supabase/client';
import { Note, NoteInput } from '@/types/note';

// Database types
type NoteRow = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  is_pinned: boolean;
  related_entity_type: 'client' | 'contact' | 'deal' | null;
  related_entity_id: string | null;
  owner_id: string;
  created_at: string;
  updated_at: string;
  priority: 'low' | 'medium' | 'high' | null;
  status: 'active' | 'archived' | 'completed' | null;
};

export interface NoteServiceOptions {
  userId: string;
  userRole: 'user' | 'admin' | 'manager' | 'team_leader';
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
    priority: dbNote.priority || 'medium',
    status: dbNote.status || 'active',
  };
};

// Convert UI note input to database format for insert
const noteInputToDbInsert = (input: NoteInput): Omit<NoteRow, 'id' | 'created_at' | 'updated_at'> => {
  return {
    title: input.title,
    content: input.content,
    tags: input.tags || [],
    is_pinned: input.is_pinned || false,
    related_entity_type: input.related_entity_type || null,
    related_entity_id: input.related_entity_id || null,
    owner_id: input.owner_id,
    priority: input.priority || 'medium',
    status: input.status || 'active'
  };
};

// Convert UI note input to database format for update
const noteInputToDbUpdate = (input: Partial<NoteInput>): Partial<Omit<NoteRow, 'id' | 'created_at' | 'updated_at'>> => {
  const update: any = {};
  
  if (input.title !== undefined) update.title = input.title;
  if (input.content !== undefined) update.content = input.content;
  if (input.tags !== undefined) update.tags = input.tags;
  if (input.is_pinned !== undefined) update.is_pinned = input.is_pinned;
  if (input.related_entity_type !== undefined) update.related_entity_type = input.related_entity_type;
  if (input.related_entity_id !== undefined) update.related_entity_id = input.related_entity_id;
  if (input.owner_id !== undefined) update.owner_id = input.owner_id;
  if (input.priority !== undefined) update.priority = input.priority || 'medium';
  if (input.status !== undefined) update.status = input.status || 'active';
  
  return update;
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
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteNote:', error);
      return false;
    }
  },
}; 