import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { PlusCircle } from 'lucide-react';
import { AddTaskModal } from '@/components/tasks/AddTaskModal';
import { TaskFilters } from '@/components/tasks/TaskFilters';
import TasksTable from '@/components/tasks/TasksTable';
import { useTasks } from '@/hooks/useTasks';

const Tasks: React.FC = () => {
  const { t } = useTranslation();
  const [isAddTaskModalOpen, setAddTaskModalOpen] = useState(false);
  const { tasks } = useTasks();
  const [selectedOwners, setSelectedOwners] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRelatedEntity, setSelectedRelatedEntity] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<string>("");

  console.log("Tasks component - current tasks:", tasks);

  const handleSelectOwner = (ownerId: string) => {
    setSelectedOwners(prev =>
      prev.includes(ownerId)
        ? prev.filter(id => id !== ownerId)
        : [...prev, ownerId]
    );
  };

  const filteredTasks = tasks.filter(task => {
    const matchesOwner = selectedOwners.length === 0 || selectedOwners.includes(task.assigned_to || '');
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.user?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.user?.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.related_entity_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRelatedEntity = selectedRelatedEntity === "" || task.related_entity === selectedRelatedEntity;
    const matchesPriority = selectedPriority === "" || task.priority === selectedPriority;

    return matchesOwner && matchesSearch && matchesRelatedEntity && matchesPriority;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('tasks.title')}</h1>
        <Button onClick={() => setAddTaskModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {t('tasks.addTask')}
        </Button>
      </div>

      <div className="mt-6">
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

      <div className="mt-6">
        <TasksTable tasks={filteredTasks} />
      </div>

      <AddTaskModal
        open={isAddTaskModalOpen}
        onOpenChange={setAddTaskModalOpen}
      />
    </div>
  );
};

export default Tasks;
