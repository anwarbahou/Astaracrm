import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Task } from '@/hooks/useTasks';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon, Clock, CheckCircle, AlertTriangle, User, Briefcase, Handshake } from 'lucide-react';
import { format, isPast } from "date-fns";
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface PreviewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
}

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

const getTaskStatusColor = (status: string) => {
  switch (status) {
    case 'todo': return 'bg-gray-400';
    case 'pending': return 'bg-yellow-500';
    case 'in_progress': return 'bg-blue-500';
    case 'blocked': return 'bg-purple-500';
    case 'completed': return 'bg-green-500';
    case 'cancelled': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

export const PreviewTaskModal: React.FC<PreviewTaskModalProps> = ({
  isOpen,
  onClose,
  task,
}) => {
  const formattedDueDate = task.due_date ? format(new Date(task.due_date), "PPP") : "N/A";
  const isOverdue = task.due_date && isPast(new Date(task.due_date)) && task.status !== 'completed';
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] flex flex-col max-h-[90vh] overflow-hidden p-0" onClick={(e) => e.stopPropagation()}>
        <DialogHeader className="p-6 pb-4 border-b border-border">
          <DialogTitle className="text-2xl font-bold flex items-center">
            <Badge
              variant="outline"
              className={cn(
                "mr-2 px-2 py-0.5 rounded-full text-xs font-semibold",
                getTaskStatusColor(task.status || 'todo')
              )}
            >
              {task.task_identifier || `LKP-${task.id.substring(0, 4).toUpperCase()}`}
            </Badge>
            {task.title}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">{t('tasks.previewTaskModal.priority')}</h2>
              {task.priority && (
                <Badge variant="outline" className={cn("flex items-center gap-1 w-fit", priorityColors[task.priority])}>
                  {priorityIcons[task.priority]} {t(`tasks.priority.${task.priority}`)}
                </Badge>
              )}
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">{t('tasks.previewTaskModal.description')}</h2>
              <div className="prose dark:prose-invert max-w-none text-[1px]">
                <ReactQuill
                  value={task.description || ''}
                  readOnly={true}
                  theme="bubble"
                />
              </div>
            </div>

            {/* Additional Sections from Image - Placeholders or Not Applicable */}
          </div>

          {/* Right Sidebar for Details */}
          <div className="w-80 border-l border-border p-6 flex flex-col">
            <h2 className="text-lg font-semibold mb-4">{t('tasks.previewTaskModal.details')}</h2>
            <div className="space-y-4">
              {/* Assignee */}
              {task.user && (
                <div>
                  <p className="text-sm text-muted-foreground">{t('tasks.previewTaskModal.assignee')}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={task.user.avatar_url || undefined} />
                      <AvatarFallback>{task.user.first_name?.charAt(0)}{task.user.last_name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{task.user.first_name} {task.user.last_name}</span>
                  </div>
                </div>
              )}

              {/* Due Date */}
              <div>
                <p className="text-sm text-muted-foreground">{t('tasks.previewTaskModal.dueDate')}</p>
                <div className={cn(
                  "flex items-center gap-2 mt-1",
                  isOverdue ? "text-red-500 font-medium" : "text-foreground"
                )}>
                  <CalendarIcon className="h-4 w-4" />
                  <span>{formattedDueDate}</span>
                  {isOverdue && <span className="text-xs ml-2">({t('tasks.previewTaskModal.overdue')})</span>}
                </div>
              </div>

              {/* Status */}
              <div>
                <p className="text-sm text-muted-foreground">{t('tasks.previewTaskModal.status')}</p>
                <Badge variant="outline" className={cn("flex items-center gap-1 w-fit mt-1", getTaskStatusColor(task.status || 'todo'))}>
                  {statusIcons[task.status || 'todo']} {t(`tasks.status.${task.status || 'todo'}`)}
                </Badge>
              </div>

              {/* Related To */}
              {task.related_entity && task.related_entity_name && (
                <div>
                  <p className="text-sm text-muted-foreground">{t('tasks.previewTaskModal.relatedTo')}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {task.related_entity === 'client' && <Briefcase className="h-4 w-4 text-blue-500" />}
                    {task.related_entity === 'contact' && <User className="h-4 w-4 text-green-500" />}
                    {task.related_entity === 'deal' && <Handshake className="h-4 w-4 text-orange-500" />}
                    <span className="font-medium">{task.related_entity_name} ({t(`tasks.relatedEntity.${task.related_entity}`)})</span>
                  </div>
                </div>
              )}

              {/* Time Tracking - Show actual time spent if present */}
              <div>
                <p className="text-sm text-muted-foreground">{t('tasks.previewTaskModal.timeTracking')}</p>
                {task.time_spent ? (
                  <p className="text-foreground mt-1">{task.time_spent}</p>
                ) : (
                <p className="text-foreground mt-1">{t('tasks.previewTaskModal.noTimeLogged')}</p>
                )}
              </div>

              {/* Labels - Placeholder */}
              <div>
                <p className="text-sm text-muted-foreground">{t('tasks.previewTaskModal.labels')}</p>
                <Badge variant="secondary" className="bg-gray-200 text-gray-700 mt-1">{t('tasks.previewTaskModal.frontendLabel')}</Badge>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 