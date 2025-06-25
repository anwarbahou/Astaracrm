import React from 'react';
import { Task } from '@/hooks/useTasks';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TaskCard } from './TaskCard';
import { Badge } from "@/components/ui/badge";

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
  if (tasks.length === 0) {
    return <div className="text-center text-muted-foreground py-12">No tasks found.</div>;
  }

  return (
    <div className="flex flex-nowrap overflow-x-auto gap-2 py-1">
      {STATUS_COLUMNS.map(col => (
        <Card
          key={col.key}
          className={cn(
            "flex flex-col transition-all duration-200 crm-surface",
            "bg-muted/40 rounded-lg p-1 min-h-[300px] min-w-[300px] border-0 shadow-none"
          )}
        >
          <CardHeader className="px-3 pt-3 mb-3 border-b border-muted-foreground/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn("w-3 h-3 rounded-full", getTaskStatusColor(col.key))} />
                <h3 className="font-semibold text-foreground text-base">{col.label}</h3>
              </div>
              <Badge variant="secondary" className="bg-muted text-muted-foreground">
                {tasks.filter(task => task.status === col.key).length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden flex flex-col">
            <div className="space-y-3 h-[calc(100vh-400px)] overflow-y-auto px-3 pt-0 pb-3">
              {tasks.filter(task => task.status === col.key).length === 0 ? (
                <div className="text-center text-muted-foreground py-8">No tasks</div>
              ) : (
                tasks.filter(task => task.status === col.key).map(task => (
                  <TaskCard key={task.id} task={task} />
                ))
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
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

export default TasksBoard; 