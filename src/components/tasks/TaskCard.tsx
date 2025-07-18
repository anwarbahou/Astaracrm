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

export const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [previewModalOpen, setPreviewModalOpen] = React.useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const dropdownTriggerRef = React.useRef<HTMLButtonElement>(null);
  const { t } = useTranslation();
  const { user, isAdmin } = useAuth();

  // Only show menu if user is admin or owner/assignee of the task
  const canManageTask = isAdmin || task.owner === user?.id || task.assigned_to === user?.id;

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

  return (
    <>
      <div
        onClick={handlePreview}
        className="relative w-full cursor-pointer rounded-2xl border border-transparent bg-card p-4 flex flex-col gap-2 shadow-sm transition-all duration-300 ease-in-out hover:scale-[1.01] hover:shadow-lg hover:border-muted/40 group hover:ring-2 hover:ring-muted/30 hover:ring-offset-2 dark:hover:ring-0 dark:hover:ring-offset-0 dark:hover:ring-transparent"
      >
        <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-muted/20 dark:border-white/10 group-hover:border-muted-foreground/40 dark:group-hover:border-white/20" />

        <div className="flex justify-between items-start mb-1 relative z-10">
          <div className="font-semibold text-base truncate pr-8" title={task.title}>
            {task.title}
          </div>
          {canManageTask && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                ref={dropdownTriggerRef}
                className="p-1 rounded hover:bg-accent focus:outline-none"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem onClick={handlePreview}>{t('tasks.viewDetails')}</DropdownMenuItem>
              <DropdownMenuItem onClick={handleEdit}>{t('tasks.edit')}</DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setDeleteModalOpen(true)} 
                className="text-red-600"
              >
                {t('tasks.delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {/* Status */}
          <Badge
            variant="outline"
            className={`flex items-center gap-1 ${
              task.status === 'completed'
                ? 'bg-green-500/10 text-green-500 border-green-500/20'
                : task.status === 'cancelled'
                ? 'bg-red-500/10 text-red-500 border-red-500/20'
                : task.status === 'blocked'
                ? 'bg-gray-500/10 text-gray-500 border-gray-500/20'
                : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
            }`}
          >
            {statusIcons[task.status || 'todo']}
            <span className="capitalize">{t(`tasks.status.${task.status || 'todo'}`)}</span>
          </Badge>

          {/* Priority */}
          <Badge
            variant="outline"
            className={`flex items-center gap-1 ${
              task.priority === 'high'
                ? 'bg-red-500/10 text-red-500 border-red-500/20'
                : task.priority === 'medium'
                ? 'bg-orange-500/10 text-orange-500 border-orange-500/20'
                : 'bg-green-500/10 text-green-500 border-green-500/20'
            }`}
          >
            {priorityIcons[task.priority || 'medium']}
            <span className="capitalize">{t(`tasks.priority.${task.priority || 'medium'}`)}</span>
          </Badge>
        </div>

        {/* Footer with Task ID and Avatar */}
        <div className="flex items-center justify-between mt-2">
          {/* Task Identifier */}
          <Badge variant="outline" className="text-xs">
            {task.task_identifier || `LKP-${task.id.substring(0, 4).toUpperCase()}`}
          </Badge>

          {/* Assignee Avatar and Name */}
          {task.user && (
            <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={task.user.avatar_url || undefined} />
              <AvatarFallback>
                {task.user.first_name?.[0] || task.user.email[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
              <span className="text-xs font-medium">
                {task.user.first_name} {task.user.last_name}
              </span>
            </div>
          )}
        </div>
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
