import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';
import { useAuth } from '@/contexts/AuthContext';

type DbTask = Database['public']['Tables']['tasks']['Row'];

export interface Task {
  id: string;
  created_at: string;
  title: string;
  description: string | null;
  due_date: string | null;
  priority: 'low' | 'medium' | 'high' | null;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'todo' | 'blocked' | null;
  assigned_to: string;
  related_entity: 'client' | 'contact' | 'deal' | 'other' | null;
  related_entity_id: string | null;
  task_identifier: string | null;
  user?: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  } | null;
  related_entity_name?: string;
  time_spent?: string | null;
}

const fetchTasks = async (): Promise<Task[]> => {
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      user:users!tasks_assigned_to_fkey (
        first_name,
        last_name,
        avatar_url
      )
    ,time_spent
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }

  const tasksWithRelatedNames = await Promise.all(
    (data as any[]).map(async (task) => {
      let related_entity_name: string | undefined = undefined;
      if (task.related_entity && task.related_entity_id) {
        let tableName = task.related_entity;
        if (tableName === 'client') {
          tableName = 'clients';
        }
        // NOTE: This makes N+1 queries. For production, you might want to create a database view or function.
        try {
          const { data: entityData, error: entityError } = await supabase
            .from(tableName)
            .select('name')
            .eq('id', task.related_entity_id)
            .single();
          
          if (entityError) {
            console.error(`Error fetching related ${task.related_entity}:`, entityError.message);
          } else if (entityData) {
            related_entity_name = (entityData as any).name;
          }
        } catch (e) {
            console.error(e)
        }
      }
      return { ...task, related_entity_name };
    })
  );

  return tasksWithRelatedNames as Task[];
};

export function useTasks() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: tasks = [], isLoading, error } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  });

  const addTaskMutation = useMutation({
    mutationFn: async (newTask: Database['public']['Tables']['tasks']['Insert']) => {
      if (!user) {
        throw new Error('User not authenticated.');
      }
      const { data, error } = await supabase.from('tasks').insert({ ...newTask, owner: user.id }).select().single();
      if (error) {
        console.error('Error creating task:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['tasks'] });
      toast({
        title: 'Task Added',
        description: 'The new task has been added successfully.',
      });
    },
    onError: (error: any) => {
      console.error('Task creation failed:', error);
      toast({
        title: 'Error Adding Task',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const { error } = await supabase.from('tasks').delete().eq('id', taskId);
      if (error) throw error;
      return taskId;
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['tasks'] });
      toast({
        title: 'Task Deleted',
        description: 'The task has been deleted.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error Deleting Task',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async (updatedTask: Database['public']['Tables']['tasks']['Update']) => {
      const { data, error } = await supabase.from('tasks').update(updatedTask).eq('id', updatedTask.id).select().single();
      if (error) {
        console.error('Error updating task:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['tasks'] });
      toast({
        title: 'Task Updated',
        description: 'The task has been updated successfully.',
      });
    },
    onError: (error: any) => {
      console.error('Task update failed:', error);
      toast({
        title: 'Error Updating Task',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    tasks,
    isLoading,
    error,
    addTask: addTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
  };
} 