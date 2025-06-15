
import { Card, CardContent } from "@/components/ui/card";

interface Task {
  id: number;
  title: string;
  description: string;
  priority: string;
  status: string;
  assignee: string;
  dueDate: string;
  relatedTo: string;
  type: string;
  completed: boolean;
  createdDate: string;
}

interface TaskStatsProps {
  tasks: Task[];
}

export function TaskStats({ tasks }: TaskStatsProps) {
  const overdueTasks = tasks.filter(task => 
    new Date(task.dueDate) < new Date() && !task.completed
  );
  
  const todayTasks = tasks.filter(task => 
    new Date(task.dueDate).toDateString() === new Date().toDateString()
  );

  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-2xl font-bold">{tasks.length}</p>
            <p className="text-sm text-muted-foreground">Total Tasks</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{overdueTasks.length}</p>
            <p className="text-sm text-muted-foreground">Overdue</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{todayTasks.length}</p>
            <p className="text-sm text-muted-foreground">Due Today</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-2xl font-bold">{completedTasks.length}</p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
