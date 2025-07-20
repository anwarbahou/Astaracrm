import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  X, 
  CalendarIcon, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  User,
  Briefcase,
  Handshake
} from 'lucide-react';
import { format, isPast } from 'date-fns';
import { cn } from '@/lib/utils';
import { Task } from '@/hooks/useTasks';
import { useTranslation } from 'react-i18next';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';

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
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="right" 
        className="h-full w-full sm:w-[600px] lg:w-[700px] xl:w-[800px] border-l shadow-2xl bg-background/95 backdrop-blur-sm p-0 flex flex-col"
      >
        {/* Header - Fixed */}
        <SheetHeader className="px-6 py-4 border-b border-border flex-shrink-0">
          <SheetTitle className="text-xl sm:text-2xl font-bold flex flex-col gap-2">
            <Badge
              variant="outline"
              className={cn(
                "px-3 py-1 rounded-full text-xs sm:text-sm font-semibold w-fit",
                getTaskStatusColor(task.status || 'todo')
              )}
            >
              {task.task_identifier || `LKP-${task.id.substring(0, 4).toUpperCase()}`}
            </Badge>
            <span className="text-lg sm:text-xl font-bold leading-tight">{task.title}</span>
          </SheetTitle>
        </SheetHeader>

        {/* Scrollable Content */}
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full w-full">
            <div className="px-6 py-4 space-y-6">
              {/* Priority Section */}
              <div className="space-y-3">
                <h2 className="text-base sm:text-lg font-semibold text-foreground">{t('tasks.previewTaskModal.priority')}</h2>
              {task.priority && (
                  <Badge variant="outline" className={cn("flex items-center gap-2 px-3 py-2 text-sm sm:text-base", priorityColors[task.priority])}>
                    <span className="text-lg">{priorityIcons[task.priority]}</span>
                    <span>{t(`tasks.priority.${task.priority}`)}</span>
                </Badge>
              )}
            </div>

              <Separator />

              {/* Description Section */}
              <div className="space-y-3">
                <h2 className="text-base sm:text-lg font-semibold text-foreground">{t('tasks.previewTaskModal.description')}</h2>
                <div className="prose dark:prose-invert max-w-none text-sm sm:text-base">
                <ReactQuill
                  value={task.description || ''}
                  readOnly={true}
                  theme="bubble"
                  modules={{ toolbar: false }}
                />
              </div>
            </div>

              <Separator />

              {/* Details Grid */}
            <div className="space-y-4">
                <h2 className="text-base sm:text-lg font-semibold text-foreground">{t('tasks.previewTaskModal.details')}</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Assignee */}
              {task.user && (
                    <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground font-medium">{t('tasks.previewTaskModal.assignee')}</p>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                      <AvatarImage src={task.user.avatar_url || undefined} />
                          <AvatarFallback className="text-sm">
                            {task.user.first_name?.charAt(0)}{task.user.last_name?.charAt(0)}
                          </AvatarFallback>
                    </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm sm:text-base">
                            {task.user.first_name} {task.user.last_name}
                          </span>
                          <span className="text-xs text-muted-foreground">{task.user.email}</span>
                        </div>
                  </div>
                </div>
              )}

              {/* Due Date */}
                  <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground font-medium">{t('tasks.previewTaskModal.dueDate')}</p>
                <div className={cn(
                      "flex items-center gap-2",
                  isOverdue ? "text-red-500 font-medium" : "text-foreground"
                )}>
                      <CalendarIcon className="h-5 w-5" />
                      <span className="text-sm sm:text-base">{formattedDueDate}</span>
                      {isOverdue && (
                        <Badge variant="destructive" className="text-xs">
                          {t('tasks.previewTaskModal.overdue')}
                        </Badge>
                      )}
                </div>
              </div>

              {/* Status */}
                  <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground font-medium">{t('tasks.previewTaskModal.status')}</p>
                    <Badge variant="outline" className={cn("flex items-center gap-2 w-fit px-3 py-2", getTaskStatusColor(task.status || 'todo'))}>
                      {statusIcons[task.status || 'todo']} 
                      <span className="text-sm sm:text-base">{t(`tasks.status.${task.status || 'todo'}`)}</span>
                </Badge>
              </div>

                  {/* Time Tracking */}
                  <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground font-medium">{t('tasks.previewTaskModal.timeTracking')}</p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm sm:text-base">
                        {task.time_spent || t('tasks.previewTaskModal.noTimeLogged')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Related To - Full Width */}
                {task.related_entity && task.related_entity_name && (
                  <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground font-medium">{t('tasks.previewTaskModal.relatedTo')}</p>
                    <div className="flex items-center gap-3">
                      {task.related_entity === 'client' && <Briefcase className="h-5 w-5 text-blue-500" />}
                      {task.related_entity === 'contact' && <User className="h-5 w-5 text-green-500" />}
                      {task.related_entity === 'deal' && <Handshake className="h-5 w-5 text-orange-500" />}
                      <div className="flex flex-col">
                        <span className="font-medium text-sm sm:text-base">{task.related_entity_name}</span>
                        <span className="text-xs text-muted-foreground">
                          {t(`tasks.addTaskModal.form.${task.related_entity}`)}
                        </span>
                      </div>
                    </div>
                </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}; 