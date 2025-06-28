import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { taskService, type TaskRow, type TaskInput } from '@/services/taskService';
import { useTranslation } from 'react-i18next';

export type Task = TaskRow;

export function useTasks(selectedUsers: string[] = []) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user, userProfile } = useAuth();
  const { t } = useTranslation();

  const {
    data: tasks = [],
    isLoading,
    error,
    refetch
  } = useQuery<Task[]>({
    queryKey: ['tasks', user?.id, userProfile?.role, selectedUsers],
    queryFn: async () => {
      if (!user?.id || !userProfile?.role) {
        throw new Error('User not authenticated');
      }
      return taskService.getTasks({
        userId: user.id,
        userRole: userProfile.role as 'admin' | 'manager' | 'user',
        assignedUsers: selectedUsers.length ? selectedUsers : undefined
      });
    },
    enabled: !!user?.id && !!userProfile?.role
  });

  const addTaskMutation = useMutation({
    mutationFn: async (newTask: Omit<TaskInput, 'owner'>) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      return taskService.addTask({
        ...newTask,
        owner: user.id
      });
    },
    onSuccess: (task) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: t('tasks.addTaskModal.toast.successTitle'),
        description: t('tasks.addTaskModal.toast.successDescription', { title: task.title }),
      });
    },
    onError: (error: Error) => {
      console.error('Task creation failed:', error);
      toast({
        title: t('tasks.addTaskModal.toast.errorTitle'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Task> & { id: string }) => {
      return taskService.updateTask(id, updates);
    },
    onSuccess: (task) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: t('tasks.editTaskModal.toast.successTitle'),
        description: t('tasks.editTaskModal.toast.successDescription', { title: task.title }),
      });
    },
    onError: (error: Error) => {
      console.error('Task update failed:', error);
      toast({
        title: t('tasks.editTaskModal.toast.errorTitle'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      return taskService.deleteTask(taskId);
    },
    onMutate: async (taskId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);

      // Optimistically update to the new value
      queryClient.setQueryData<Task[]>(['tasks'], old => {
        return old?.filter(task => task.id !== taskId) ?? [];
      });

      // Return a context object with the snapshotted value
      return { previousTasks };
    },
    onError: (error: Error, taskId, context) => {
      // Rollback to the previous value
      queryClient.setQueryData(['tasks'], context?.previousTasks);

      let errorMessage = t('tasks.deleteTaskModal.toast.unknownError');
      if (error instanceof Error) {
        switch (error.message) {
          case 'Task not found':
            errorMessage = t('tasks.deleteTaskModal.toast.notFound');
            break;
          case 'Cannot delete task with existing activity logs':
            errorMessage = t('tasks.deleteTaskModal.toast.hasDependencies');
            break;
          default:
            errorMessage = error.message;
        }
      }

      toast({
        title: t('tasks.deleteTaskModal.toast.errorTitle'),
        description: errorMessage,
        variant: 'destructive',
      });
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const bulkDeleteTasksMutation = useMutation({
    mutationFn: async (taskIds: string[]) => {
      return taskService.bulkDeleteTasks(taskIds);
    },
    onMutate: async (taskIds) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);

      queryClient.setQueryData<Task[]>(['tasks'], old => {
        return old?.filter(task => !taskIds.includes(task.id)) ?? [];
      });

      return { previousTasks };
    },
    onError: (error: Error, taskIds, context) => {
      queryClient.setQueryData(['tasks'], context?.previousTasks);

      let errorMessage = t('tasks.bulkDeleteModal.toast.unknownError');
      if (error instanceof Error) {
        switch (error.message) {
          case 'Some tasks not found':
            errorMessage = t('tasks.bulkDeleteModal.toast.someNotFound');
            break;
          case 'Cannot delete tasks with existing activity logs':
            errorMessage = t('tasks.bulkDeleteModal.toast.hasDependencies');
            break;
          default:
            errorMessage = error.message;
        }
      }

      toast({
        title: t('tasks.bulkDeleteModal.toast.errorTitle'),
        description: errorMessage,
        variant: 'destructive',
      });
    },
    onSuccess: (_, taskIds) => {
      toast({
        title: t('tasks.bulkDeleteModal.toast.successTitle'),
        description: t('tasks.bulkDeleteModal.toast.successDescription', { count: taskIds.length }),
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const getTasksByUser = async (userId: string) => {
    return taskService.getTasksByUser(userId);
  };

  const getTasksByEntity = async (entityType: 'client' | 'contact' | 'deal', entityId: string) => {
    return taskService.getTasksByEntity(entityType, entityId);
  };

  return {
    tasks,
    isLoading,
    error,
    refetch,
    addTask: addTaskMutation.mutate,
    addTaskAsync: addTaskMutation.mutateAsync,
    updateTask: updateTaskMutation.mutate,
    updateTaskAsync: updateTaskMutation.mutateAsync,
    deleteTask: deleteTaskMutation.mutate,
    deleteTaskAsync: deleteTaskMutation.mutateAsync,
    bulkDeleteTasks: bulkDeleteTasksMutation.mutate,
    bulkDeleteTasksAsync: bulkDeleteTasksMutation.mutateAsync,
    getTasksByUser,
    getTasksByEntity,
    isAdding: addTaskMutation.isPending,
    isUpdating: updateTaskMutation.isPending,
    isDeleting: deleteTaskMutation.isPending,
    isBulkDeleting: bulkDeleteTasksMutation.isPending,
  };
} 