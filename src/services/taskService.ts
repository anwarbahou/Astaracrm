import { supabase } from '../integrations/supabase/client';
import { z } from 'zod';

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'todo' | 'blocked';
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskRelatedEntity = 'client' | 'contact' | 'deal' | null;

// Zod schema for task input validation
const taskInputSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
  description: z.string().nullable().optional(),
  due_date: z.string().nullable().optional().refine(
    (date) => !date || !isNaN(new Date(date).getTime()),
    'Invalid date format'
  ),
  priority: z.enum(['low', 'medium', 'high']),
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled', 'todo', 'blocked']),
  assigned_to: z.string().nullable().optional(),
  related_entity: z.enum(['client', 'contact', 'deal']).nullable().optional(),
  related_entity_id: z.string().nullable().optional(),
  tags: z.array(z.string()).nullable().optional(),
  time_spent: z.string().nullable().optional(),
  owner: z.string().optional(),
});

export type TaskInput = z.infer<typeof taskInputSchema>;

export interface TaskRow extends TaskInput {
  id: string;
  task_identifier: string;
  created_at: string;
  updated_at: string;
  completed_at?: string | null;
  user?: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
    email: string;
  } | null;
  related_entity_name?: string;
}

export class TaskServiceError extends Error {
  constructor(message: string, public code: string, public details?: any) {
    super(message);
    this.name = 'TaskServiceError';
  }
}

export interface TaskServiceOptions {
  userId: string;
  userRole: 'admin' | 'manager' | 'user';
}

class TaskService {
  private async validateInput(input: unknown): Promise<TaskInput> {
    try {
      return taskInputSchema.parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new TaskServiceError(
          'Invalid task data',
          'VALIDATION_ERROR',
          error.errors
        );
      }
      throw error;
    }
  }

  private async getRelatedEntityName(entityType: TaskRelatedEntity, entityId: string | null): Promise<string | undefined> {
    if (!entityType || !entityId) return undefined;

    const tableName = entityType === 'client' ? 'clients' : entityType + 's';
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('name')
        .eq('id', entityId)
        .single();

      if (error) {
        console.error(`Error fetching related ${entityType}:`, error.message);
        return undefined;
      }

      return data?.name;
    } catch (error) {
      console.error(`Error fetching related ${entityType}:`, error);
      return undefined;
    }
  }

  async getTasks(options: TaskServiceOptions & { assignedUsers?: string[] }): Promise<TaskRow[]> {
    try {
      let query = supabase
        .from('tasks')
        .select(`
          *,
          user:users!tasks_assigned_to_fkey (
            first_name,
            last_name,
            avatar_url,
            email
          )
        `)
        .order('created_at', { ascending: false });

      // Filter by assigned users if provided
      if (options.assignedUsers?.length) {
        query = query.in('assigned_to', options.assignedUsers);
      }

      const { data, error } = await query;

      if (error) {
        throw new TaskServiceError(
          'Failed to fetch tasks',
          'FETCH_ERROR',
          error
        );
      }

      const tasksWithRelatedNames = await Promise.all(
        (data || []).map(async (task: any) => {
          const related_entity_name = await this.getRelatedEntityName(
            task.related_entity,
            task.related_entity_id
          );
          return { ...task, related_entity_name };
        })
      );

      return tasksWithRelatedNames;
    } catch (error) {
      if (error instanceof TaskServiceError) throw error;
      throw new TaskServiceError(
        'An unexpected error occurred while fetching tasks',
        'UNKNOWN_ERROR',
        error
      );
    }
  }

  async addTask(input: Omit<TaskInput, 'task_identifier'>): Promise<TaskRow> {
    try {
      const validatedInput = await this.validateInput(input);
      
      const { data, error } = await supabase
        .from('tasks')
        .insert({ ...validatedInput })
        .select(`
          *,
          user:users!tasks_assigned_to_fkey (
            first_name,
            last_name,
            avatar_url,
            email
          )
        `)
        .single();

      if (error) {
        throw new TaskServiceError(
          'Failed to create task',
          'INSERT_ERROR',
          error
        );
      }

      if (!data) {
        throw new TaskServiceError(
          'No data returned after creating task',
          'NO_DATA_ERROR'
        );
      }

      const related_entity_name = await this.getRelatedEntityName(
        data.related_entity,
        data.related_entity_id
      );

      return { ...data, related_entity_name };
    } catch (error) {
      if (error instanceof TaskServiceError) throw error;
      throw new TaskServiceError(
        'An unexpected error occurred while creating task',
        'UNKNOWN_ERROR',
        error
      );
    }
  }

  async updateTask(id: string, updates: Partial<TaskInput>): Promise<TaskRow> {
    try {
      // Validate the update data
      const validatedUpdates = await this.validateInput({
        ...updates,
        // Add dummy required fields for validation
        title: updates.title || 'dummy',
        priority: updates.priority || 'medium',
        status: updates.status || 'pending'
      });

      // Remove dummy fields if they weren't in the original updates
      if (!updates.title) delete validatedUpdates.title;
      if (!updates.priority) delete validatedUpdates.priority;
      if (!updates.status) delete validatedUpdates.status;

      const { data, error } = await supabase
        .from('tasks')
        .update(validatedUpdates)
        .eq('id', id)
        .select(`
          *,
          user:users!tasks_assigned_to_fkey (
            first_name,
            last_name,
            avatar_url,
            email
          )
        `)
        .single();

      if (error) {
        throw new TaskServiceError(
          'Failed to update task',
          'UPDATE_ERROR',
          error
        );
      }

      if (!data) {
        throw new TaskServiceError(
          'No data returned after updating task',
          'NO_DATA_ERROR'
        );
      }

      const related_entity_name = await this.getRelatedEntityName(
        data.related_entity,
        data.related_entity_id
      );

      return { ...data, related_entity_name };
    } catch (error) {
      if (error instanceof TaskServiceError) throw error;
      throw new TaskServiceError(
        'An unexpected error occurred while updating task',
        'UNKNOWN_ERROR',
        error
      );
    }
  }

  async deleteTask(id: string): Promise<void> {
    try {
      // First check if the task exists and get its details
      const { data: task, error: fetchError } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          throw new TaskServiceError(
            'Task not found',
            'NOT_FOUND_ERROR'
          );
        }
        throw new TaskServiceError(
          'Failed to fetch task before deletion',
          'FETCH_ERROR',
          fetchError
        );
      }

      // Check for any dependencies or related data
      const { data: dependencies, error: dependencyError } = await supabase
        .from('activity_logs')
        .select('count')
        .eq('task_id', id)
        .single();

      if (dependencyError) {
        throw new TaskServiceError(
          'Failed to check task dependencies',
          'DEPENDENCY_CHECK_ERROR',
          dependencyError
        );
      }

      if (dependencies?.count > 0) {
        throw new TaskServiceError(
          'Cannot delete task with existing activity logs',
          'HAS_DEPENDENCIES_ERROR'
        );
      }

      // Perform the deletion
      const { error: deleteError } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw new TaskServiceError(
          'Failed to delete task',
          'DELETE_ERROR',
          deleteError
        );
      }

      // Store the deleted task data in case we need to implement undo functionality
      const deletedTask = task;
    } catch (error) {
      if (error instanceof TaskServiceError) throw error;
      throw new TaskServiceError(
        'An unexpected error occurred while deleting task',
        'UNKNOWN_ERROR',
        error
      );
    }
  }

  async bulkDeleteTasks(ids: string[]): Promise<void> {
    try {
      // First check if all tasks exist
      const { data: tasks, error: fetchError } = await supabase
        .from('tasks')
        .select('id')
        .in('id', ids);

      if (fetchError) {
        throw new TaskServiceError(
          'Failed to fetch tasks before deletion',
          'FETCH_ERROR',
          fetchError
        );
      }

      if (!tasks || tasks.length !== ids.length) {
        throw new TaskServiceError(
          'Some tasks not found',
          'NOT_FOUND_ERROR'
        );
      }

      // Check for dependencies
      const { data: dependencies, error: dependencyError } = await supabase
        .from('activity_logs')
        .select('task_id')
        .in('task_id', ids);

      if (dependencyError) {
        throw new TaskServiceError(
          'Failed to check task dependencies',
          'DEPENDENCY_CHECK_ERROR',
          dependencyError
        );
      }

      if (dependencies && dependencies.length > 0) {
        const tasksWithDependencies = dependencies.map(d => d.task_id);
        throw new TaskServiceError(
          'Cannot delete tasks with existing activity logs',
          'HAS_DEPENDENCIES_ERROR',
          { tasksWithDependencies }
        );
      }

      // Perform the bulk deletion
      const { error: deleteError } = await supabase
        .from('tasks')
        .delete()
        .in('id', ids);

      if (deleteError) {
        throw new TaskServiceError(
          'Failed to delete tasks',
          'DELETE_ERROR',
          deleteError
        );
      }

    } catch (error) {
      if (error instanceof TaskServiceError) throw error;
      throw new TaskServiceError(
        'An unexpected error occurred while deleting tasks',
        'UNKNOWN_ERROR',
        error
      );
    }
  }

  async getTasksByUser(userId: string): Promise<TaskRow[]> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          user:users!tasks_assigned_to_fkey (
            first_name,
            last_name,
            avatar_url,
            email
          )
        `)
        .eq('assigned_to', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new TaskServiceError(
          'Failed to fetch user tasks',
          'FETCH_ERROR',
          error
        );
      }

      const tasksWithRelatedNames = await Promise.all(
        (data || []).map(async (task: any) => {
          const related_entity_name = await this.getRelatedEntityName(
            task.related_entity,
            task.related_entity_id
          );
          return { ...task, related_entity_name };
        })
      );

      return tasksWithRelatedNames;
    } catch (error) {
      if (error instanceof TaskServiceError) throw error;
      throw new TaskServiceError(
        'An unexpected error occurred while fetching user tasks',
        'UNKNOWN_ERROR',
        error
      );
    }
  }

  async getTasksByEntity(entityType: 'client' | 'contact' | 'deal', entityId: string): Promise<TaskRow[]> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          user:users!tasks_assigned_to_fkey (
            first_name,
            last_name,
            avatar_url,
            email
          )
        `)
        .eq('related_entity', entityType)
        .eq('related_entity_id', entityId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new TaskServiceError(
          'Failed to fetch entity tasks',
          'FETCH_ERROR',
          error
        );
      }

      const tasksWithRelatedNames = await Promise.all(
        (data || []).map(async (task: any) => {
          const related_entity_name = await this.getRelatedEntityName(
            task.related_entity,
            task.related_entity_id
          );
          return { ...task, related_entity_name };
        })
      );

      return tasksWithRelatedNames;
    } catch (error) {
      if (error instanceof TaskServiceError) throw error;
      throw new TaskServiceError(
        'An unexpected error occurred while fetching entity tasks',
        'UNKNOWN_ERROR',
        error
      );
    }
  }
}

export const taskService = new TaskService();