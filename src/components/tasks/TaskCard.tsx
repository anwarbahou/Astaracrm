import React from 'react';
import { useTasks, Task } from '@/hooks/useTasks';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { EditTaskModal } from './EditTaskModal';
import { PreviewTaskModal } from './PreviewTaskModal';
import { DeleteTaskModal } from './DeleteTaskModal';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

const priorityIcons = {
  low: '🟢',
  medium: '🟠',
  high: '🔴',
};

const priorityColors = {
  low: 'bg-green-500 text-white',
  medium: 'bg-orange-500 text-white',
  high: 'bg-red-500 text-white',
};

const statusIcons = {
  todo: <Clock className="h-4 w-4 text-blue-500" />,
  pending: <Clock className="h-4 w-4 text-orange-500" />,
  in_progress: <Clock className="h-4 w-4 text-yellow-500" />,
  completed: <CheckCircle className="h-4 w-4 text-green-500" />,
  cancelled: <AlertTriangle className="h-4 w-4 text-red-500" />,
  blocked: <AlertTriangle className="h-4 w-4 text-gray-500" />,
};

interface TaskCardProps {
  task: Task;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  isDragging?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onDragStart, 
  onDragEnd, 
  isDragging = false 
}) => {
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [previewModalOpen, setPreviewModalOpen] = React.useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const dropdownTriggerRef = React.useRef<HTMLButtonElement>(null);
  const { t } = useTranslation();
  const { user, isAdmin } = useAuth();

  // Only show menu if user is admin or owner of the task (not assigned_to)
  const canManageTask = isAdmin || task.owner === user?.id;

  const handleEdit = () => {
    setEditModalOpen(true);
  };

  const handlePreview = (e: React.MouseEvent) => {
    // Don't open preview if clicking on the dropdown menu
    if (dropdownTriggerRef.current?.contains(e.target as Node)) {
      return;
    }
    // Don't open preview if edit modal is open
    if (editModalOpen) {
      return;
    }
    setPreviewModalOpen(true);
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (onDragStart) {
      onDragStart(e);
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if (onDragEnd) {
      onDragEnd(e);
    }
  };

  return (
    <>
      <div
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={handlePreview}
        className={cn(
          "relative w-full cursor-pointer rounded-2xl border border-transparent bg-card p-4 flex flex-col gap-2 shadow-sm transition-all duration-300 ease-in-out hover:scale-[1.01] hover:shadow-lg hover:border-muted/40 group hover:ring-2 hover:ring-muted/30 hover:ring-offset-2 dark:hover:ring-0 dark:hover:ring-offset-0 dark:hover:ring-transparent",
          isDragging && "opacity-50 scale-95"
        )}
      >
        <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-muted/20 dark:border-white/10 group-hover:border-muted-foreground/40 dark:group-hover:border-white/20" />

        <div className="flex justify-between items-start mb-1 relative z-10">
          <div className={cn("font-semibold text-base truncate flex-1", canManageTask ? "pr-2" : "pr-0")} title={task.title}>
            {task.title}
          </div>
          {canManageTask && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  ref={dropdownTriggerRef}
                  className="p-1 rounded hover:bg-accent focus:outline-none flex-shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                <DropdownMenuItem onClick={handlePreview}>{t('tasks.viewDetails')}</DropdownMenuItem>
                <DropdownMenuItem onClick={handleEdit}>{t('tasks.edit')}</DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => {
                    console.log('Delete task clicked for task:', task.id, 'User owns task:', task.owner === user?.id, 'User can manage:', canManageTask);
                    setDeleteModalOpen(true);
                  }} 
                  className="text-red-600"
                >
                  {t('tasks.delete')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Priority Badge */}
        {task.priority && (
          <Badge variant="outline" className={cn("w-fit text-xs", priorityColors[task.priority])}>
            <span className="mr-1">{priorityIcons[task.priority]}</span>
            {t(`tasks.priority.${task.priority}`)}
          </Badge>
        )}

        {/* Description Preview */}
        {task.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {task.description.replace(/<[^>]*>/g, '')}
          </p>
        )}

        {/* Task Details */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            {statusIcons[task.status || 'todo']}
            <span>{t(`tasks.status.${task.status || 'todo'}`)}</span>
          </div>
          
          {/* Assignee */}
          {task.user && (
            <div className="flex items-center gap-1">
              <Avatar className="h-5 w-5">
                <AvatarImage 
                  src={task.user.avatar_url || undefined} 
                  className="object-cover"
                />
                <AvatarFallback className="text-xs">
                  {task.user.first_name?.charAt(0)}{task.user.last_name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="truncate max-w-[80px]">
                {task.user.first_name} {task.user.last_name}
              </span>
            </div>
          )}
        </div>

        {/* Related Entity */}
        {task.related_entity && task.related_entity_name && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span className="font-medium">{t(`tasks.addTaskModal.form.${task.related_entity}`)}:</span>
            <span className="truncate">{task.related_entity_name}</span>
          </div>
        )}
      </div>

      {/* Modals */}
      <EditTaskModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        task={task}
      />
      
      <PreviewTaskModal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        task={task}
      />
      
      <DeleteTaskModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        task={task}
      />
    </>
  );
};
