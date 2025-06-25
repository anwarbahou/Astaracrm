import { supabase } from '../integrations/supabase/client';
import type { Database } from '../integrations/supabase/types';

// Type for a task row
export type TaskRow = any;

export const taskService = {
  async getTasks(): Promise<TaskRow[]> {
    const { data, error } = await supabase
      .from('tasks' as any)
      .select('*')
      .order('due_date', { ascending: true });
    if (error) {
      console.error('Error fetching tasks from Supabase:', error);
      throw error;
    }
    return data || [];
  },
  async addTask(task: Partial<TaskRow>) {
    const { data, error } = await supabase
      .from('tasks' as any)
      .insert([task])
      .select()
      .single();
    return { data, error };
  },
};