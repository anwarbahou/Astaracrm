
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TaskFilters } from "@/components/tasks/TaskFilters";
import { TaskStats } from "@/components/tasks/TaskStats";
import { TaskTabs } from "@/components/tasks/TaskTabs";

export default function Tasks() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock tasks data
  const tasks = [
    {
      id: 1,
      title: "Follow up with Acme Corp",
      description: "Send proposal follow-up email and schedule demo",
      priority: "High",
      status: "In Progress",
      assignee: "John Doe",
      dueDate: "2024-12-15",
      relatedTo: "Acme Corporation",
      type: "Follow-up",
      completed: false,
      createdDate: "2024-12-10"
    },
    {
      id: 2,
      title: "Prepare Q4 sales report",
      description: "Compile quarterly sales data and performance metrics",
      priority: "Medium",
      status: "Not Started",
      assignee: "Sarah Smith",
      dueDate: "2024-12-20",
      relatedTo: "Internal",
      type: "Report",
      completed: false,
      createdDate: "2024-12-12"
    },
    {
      id: 3,
      title: "Contract review with Legal",
      description: "Review enterprise contract terms with legal team",
      priority: "High",
      status: "In Review",
      assignee: "Mike Johnson",
      dueDate: "2024-12-16",
      relatedTo: "Global Industries",
      type: "Legal",
      completed: false,
      createdDate: "2024-12-11"
    },
    {
      id: 4,
      title: "Product demo for StartupXYZ",
      description: "Deliver 30-minute product demonstration",
      priority: "Medium",
      status: "Completed",
      assignee: "Emily Davis",
      dueDate: "2024-12-14",
      relatedTo: "StartupXYZ",
      type: "Demo",
      completed: true,
      createdDate: "2024-12-08"
    },
    {
      id: 5,
      title: "Update CRM database",
      description: "Clean and update contact information in CRM",
      priority: "Low",
      status: "In Progress",
      assignee: "David Wilson",
      dueDate: "2024-12-22",
      relatedTo: "Internal",
      type: "Maintenance",
      completed: false,
      createdDate: "2024-12-13"
    },
    {
      id: 6,
      title: "Send pricing proposal",
      description: "Prepare and send custom pricing proposal",
      priority: "High",
      status: "Not Started",
      assignee: "John Doe",
      dueDate: "2024-12-17",
      relatedTo: "Tech Solutions Ltd",
      type: "Proposal",
      completed: false,
      createdDate: "2024-12-13"
    }
  ];

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.assignee.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.relatedTo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Task Management</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage all your sales activities and follow-ups.
          </p>
        </div>
        <Button className="gap-2">
          <Plus size={16} />
          Add Task
        </Button>
      </div>

      {/* Filters and Search */}
      <TaskFilters searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Stats Cards */}
      <TaskStats tasks={filteredTasks} />

      {/* Task Lists */}
      <TaskTabs tasks={filteredTasks} />
    </div>
  );
}
