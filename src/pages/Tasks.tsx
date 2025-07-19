import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { PlusCircle } from 'lucide-react';
import { AddTaskModal } from '@/components/tasks/AddTaskModal';
import { TaskFilters } from '@/components/tasks/TaskFilters';
import TasksTable from '@/components/tasks/TasksTable';
import { useTasks } from '@/hooks/useTasks';
import { withPageTitle } from '@/components/withPageTitle';
import { TableSkeleton } from "@/components/ui/skeleton-loader";
import { useLocation } from 'react-router-dom';

const Tasks: React.FC = () => {
  const { t } = useTranslation();
  const [isAddTaskModalOpen, setAddTaskModalOpen] = useState(false);
  const [selectedOwners, setSelectedOwners] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRelatedEntity, setSelectedRelatedEntity] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<string>("");

  const { tasks, isLoading, error, refetch } = useTasks(selectedOwners);
  const location = useLocation();

  useEffect(() => {
    refetch();
  }, [location.pathname, refetch]);

  const handleSelectOwner = (ownerId: string) => {
    setSelectedOwners(prev =>
      prev.includes(ownerId)
        ? prev.filter(id => id !== ownerId)
        : [...prev, ownerId]
    );
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.user?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.user?.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.related_entity_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRelatedEntity = selectedRelatedEntity === "" || task.related_entity === selectedRelatedEntity;
    const matchesPriority = selectedPriority === "" || task.priority === selectedPriority;

    return matchesSearch && matchesRelatedEntity && matchesPriority;
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Tasks</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <TableSkeleton rows={8} columns={6} />
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="space-y-6 animate-in">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Tasks</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-destructive mb-4">Error loading tasks: {typeof error === 'string' ? error : (error instanceof Error ? error.message : 'Unknown error')}</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">{t('tasks.title')}</h1>
        <Button onClick={() => setAddTaskModalOpen(true)} className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          {t('tasks.addTask')}
        </Button>
      </div>

      <div className="mt-4 sm:mt-6">
        <TaskFilters
          selectedOwners={selectedOwners}
          onSelectOwner={handleSelectOwner}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedRelatedEntity={selectedRelatedEntity}
          setSelectedRelatedEntity={setSelectedRelatedEntity}
          selectedPriority={selectedPriority}
          setSelectedPriority={setSelectedPriority}
        />
      </div>

      <div className="mt-4 sm:mt-6">
        <TasksTable tasks={filteredTasks} />
      </div>

      <AddTaskModal
        open={isAddTaskModalOpen}
        onOpenChange={setAddTaskModalOpen}
      />
    </div>
  );
};

export default withPageTitle(Tasks, 'tasks');
