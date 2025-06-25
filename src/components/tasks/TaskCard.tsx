import React from 'react';
import { useTasks, Task } from '@/hooks/useTasks';
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
  pending: <Clock className="h-4 w-4 text-yellow-500" />,
  in_progress: <Clock className="h-4 w-4 text-blue-500" />,
  completed: <CheckCircle className="h-4 w-4 text-green-500" />,
  cancelled: <AlertTriangle className="h-4 w-4 text-red-500" />,
  todo: <Clock className="h-4 w-4 text-gray-400" />,
  blocked: <AlertTriangle className="h-4 w-4 text-purple-500" />,
};

export const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
  const { deleteTask } = useTasks();
  const [deleting, setDeleting] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [previewModalOpen, setPreviewModalOpen] = React.useState(false);
  const dropdownTriggerRef = React.useRef<HTMLButtonElement>(null);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteTask(task.id);
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = () => {
    setEditModalOpen(true);
  };

  const handlePreview = (e: React.MouseEvent) => {
    if (dropdownTriggerRef.current && dropdownTriggerRef.current.contains(e.target as Node)) {
      return;
    }
    if (!previewModalOpen) {
      setPreviewModalOpen(true);
    }
  };

  return (
    <div
      onClick={handlePreview}
      className="relative w-full cursor-pointer rounded-2xl border border-transparent bg-card p-4 flex flex-col gap-2 shadow-sm transition-all duration-300 ease-in-out hover:scale-[1.01] hover:shadow-lg hover:border-muted/40 group hover:ring-2 hover:ring-muted/30 hover:ring-offset-2 dark:hover:ring-0 dark:hover:ring-offset-0 dark:hover:ring-transparent"
      >
      <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-muted/20 dark:border-white/10 group-hover:border-muted-foreground/40 dark:group-hover:border-white/20" />

      <div className="flex justify-between items-start mb-1 relative z-10">
        <div className="font-semibold text-base truncate pr-8" title={task.title}>
          {task.title}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              ref={dropdownTriggerRef}
              className="p-1 rounded hover:bg-accent focus:outline-none"
              disabled={deleting}
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem onClick={handlePreview}>View Details</DropdownMenuItem>
            <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="text-red-600" disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-col gap-1 relative z-0">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
          {task.status && (
            <Badge variant="outline" className="flex items-center gap-1">
              {statusIcons[task.status]}{' '}
              {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('_', ' ')}
            </Badge>
          )}
          {task.priority && (
            <Badge variant="outline" className={`flex items-center gap-1 ${priorityColors[task.priority]}`}>
              {priorityIcons[task.priority]}{' '}
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm mt-auto pt-2 border-t border-dashed border-muted-foreground/20">
        <div className="flex items-center gap-1 text-muted-foreground">
          <p className="font-medium">
            {task.task_identifier || `LKP-${task.id.substring(0, 4).toUpperCase()}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {task.due_date && (
            <span className="text-muted-foreground flex items-center gap-1">
              {Math.ceil((new Date(task.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}d
            </span>
          )}
          {task.user && (
            <Avatar className="h-6 w-6">
              <AvatarImage src={task.user.avatar_url || undefined} />
              <AvatarFallback>
                {task.user.first_name?.charAt(0)}
                {task.user.last_name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>

      <EditTaskModal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} task={task} />
      <PreviewTaskModal isOpen={previewModalOpen} onClose={() => setPreviewModalOpen(false)} task={task} />
    </div>
  );
};
