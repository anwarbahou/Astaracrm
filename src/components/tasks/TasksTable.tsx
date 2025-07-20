import React, { useState, useCallback } from 'react';
import { Task } from '@/hooks/useTasks';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TaskCard } from './TaskCard';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useTasks } from '@/hooks/useTasks';
import { AddTaskModal } from './AddTaskModal';

const STATUS_COLUMNS = [
  { key: 'todo', label: 'To Do' },
  { key: 'pending', label: 'Pending' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'blocked', label: 'Blocked' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

interface TasksBoardProps {
  tasks: Task[];
}

const TasksBoard: React.FC<TasksBoardProps> = ({ tasks }) => {
  const { t } = useTranslation(['tasks', 'common']);
  const { updateTask, addTask } = useTasks();
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('todo');

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      case 'in_progress': return 'bg-orange-500';
      case 'blocked': return 'bg-purple-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleAddTask = (status: string) => {
    setSelectedStatus(status);
    setAddTaskModalOpen(true);
  };

  const handleDragStart = useCallback((e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', task.id);
    
    // Add visual feedback
    const target = e.currentTarget as HTMLElement;
    if (target) {
      target.style.opacity = '0.5';
    }
  }, []);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    setDraggedTask(null);
    setDragOverColumn(null);
    
    // Remove visual feedback
    const target = e.currentTarget as HTMLElement;
    if (target) {
      target.style.opacity = '1';
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, columnKey: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(columnKey);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOverColumn(null);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();
    setDragOverColumn(null);
    
    if (!draggedTask) return;
    
    // Don't update if the status hasn't changed
    if (draggedTask.status === targetStatus) return;
    
    try {
      await updateTask({
        id: draggedTask.id,
        status: targetStatus as 'todo' | 'pending' | 'in_progress' | 'blocked' | 'completed' | 'cancelled',
      });
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  }, [draggedTask, updateTask]);

  if (tasks.length === 0) {
    return <div className="text-center text-muted-foreground py-12">{t('tasks.noTasksFound')}</div>;
  }

  return (
    <>
      <div className="flex flex-nowrap overflow-x-auto gap-2 py-1">
        {STATUS_COLUMNS.map(col => {
          const columnTasks = tasks.filter(task => task.status === col.key);
          const isDragOver = dragOverColumn === col.key;
          
          return (
            <Card
              key={col.key}
              className={cn(
                "flex flex-col transition-all duration-200 crm-surface",
                "bg-muted/40 rounded-lg p-1 min-h-[300px] min-w-[300px] border-0 shadow-none",
                isDragOver && "ring-2 ring-primary/50 bg-primary/5"
              )}
              onDragOver={(e) => handleDragOver(e, col.key)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.key)}
            >
              <CardHeader className="px-3 pt-3 mb-3 border-b border-muted-foreground/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-3 h-3 rounded-full", getTaskStatusColor(col.key))} />
                    <h3 className="font-semibold text-foreground text-base">{t(`tasks.status.${col.key}`)}</h3>
                  </div>
                  <Badge variant="secondary" className="bg-muted text-muted-foreground">
                    {columnTasks.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-0 overflow-hidden flex flex-col">
                <div className="space-y-3 h-[calc(100vh-400px)] overflow-y-auto px-3 pt-0 pb-3">
                  {columnTasks.length === 0 ? (
                    <div className={cn(
                      "text-center text-muted-foreground py-8 border-2 border-dashed border-muted-foreground/20 rounded-lg",
                      isDragOver && "border-primary/50 bg-primary/5"
                    )}>
                      {isDragOver ? t('tasks.dropHere') : t('tasks.noTasksInColumn')}
                    </div>
                  ) : (
                    columnTasks.map(task => (
                      <TaskCard 
                        key={task.id} 
                        task={task}
                        onDragStart={(e) => handleDragStart(e, task)}
                        onDragEnd={handleDragEnd}
                        isDragging={draggedTask?.id === task.id}
                      />
                    ))
                  )}
                  
                  {/* Add Task Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2 border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5"
                    onClick={() => handleAddTask(col.key)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t('tasks.addTask')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add Task Modal */}
      <AddTaskModal
        open={addTaskModalOpen}
        onOpenChange={setAddTaskModalOpen}
        initialStatus={selectedStatus}
      />
    </>
  );
};

export default TasksBoard; 