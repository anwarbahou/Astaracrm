
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Calendar, User } from "lucide-react";

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

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-500";
      case "In Progress": return "bg-blue-500";
      case "In Review": return "bg-purple-500";
      case "Not Started": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Follow-up": return "bg-blue-100 text-blue-800";
      case "Demo": return "bg-purple-100 text-purple-800";
      case "Proposal": return "bg-orange-100 text-orange-800";
      case "Legal": return "bg-red-100 text-red-800";
      case "Report": return "bg-green-100 text-green-800";
      case "Maintenance": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
      <Checkbox 
        checked={task.completed}
        className="mt-1"
      />
      
      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h4 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
              {task.title}
            </h4>
            <p className="text-sm text-muted-foreground">{task.description}</p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit Task</DropdownMenuItem>
              <DropdownMenuItem>Assign to Someone</DropdownMenuItem>
              <DropdownMenuItem>Set Reminder</DropdownMenuItem>
              <DropdownMenuItem>Mark Complete</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className={getPriorityColor(task.priority)}>
            {task.priority}
          </Badge>
          <Badge className={`${getStatusColor(task.status)} text-white`}>
            {task.status}
          </Badge>
          <Badge variant="outline" className={getTypeColor(task.type)}>
            {task.type}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span className={new Date(task.dueDate) < new Date() && !task.completed ? 'text-red-600 font-medium' : ''}>
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{task.assignee}</span>
            </div>
          </div>
          <span className="text-xs">Related to: {task.relatedTo}</span>
        </div>
      </div>
    </div>
  );
}
