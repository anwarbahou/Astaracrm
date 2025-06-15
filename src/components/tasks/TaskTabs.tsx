
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Calendar } from "lucide-react";
import { TaskCard } from "./TaskCard";

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

interface TaskTabsProps {
  tasks: Task[];
}

export function TaskTabs({ tasks }: TaskTabsProps) {
  const overdueTasks = tasks.filter(task => 
    new Date(task.dueDate) < new Date() && !task.completed
  );
  
  const todayTasks = tasks.filter(task => 
    new Date(task.dueDate).toDateString() === new Date().toDateString()
  );

  const upcomingTasks = tasks.filter(task => 
    new Date(task.dueDate) > new Date() && 
    new Date(task.dueDate).getTime() - new Date().getTime() <= 7 * 24 * 60 * 60 * 1000
  );

  const EmptyState = ({ title, description, icon: Icon }: { title: string; description: string; icon: any }) => (
    <div className="text-center py-12">
      <Icon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="font-medium text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );

  return (
    <Tabs defaultValue="all" className="space-y-4">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="all">All Tasks</TabsTrigger>
        <TabsTrigger value="overdue">Overdue ({overdueTasks.length})</TabsTrigger>
        <TabsTrigger value="today">Today ({todayTasks.length})</TabsTrigger>
        <TabsTrigger value="upcoming">Upcoming ({upcomingTasks.length})</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>All Tasks ({tasks.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="overdue" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Overdue Tasks ({overdueTasks.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {overdueTasks.length > 0 ? (
                overdueTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))
              ) : (
                <EmptyState
                  title="No overdue tasks"
                  description="Great job staying on top of your tasks!"
                  icon={Clock}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="today" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-orange-600">Due Today ({todayTasks.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayTasks.length > 0 ? (
                todayTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))
              ) : (
                <EmptyState
                  title="No tasks due today"
                  description="Enjoy your lighter workload!"
                  icon={Calendar}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="upcoming" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks ({upcomingTasks.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTasks.length > 0 ? (
                upcomingTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))
              ) : (
                <EmptyState
                  title="No upcoming tasks"
                  description="Time to plan your next week!"
                  icon={Clock}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
