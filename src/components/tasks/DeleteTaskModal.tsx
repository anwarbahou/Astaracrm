import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Task, useTasks } from '@/hooks/useTasks';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';

interface DeleteTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  onDeleted?: () => void;
}

export const DeleteTaskModal: React.FC<DeleteTaskModalProps> = ({
  isOpen,
  onClose,
  task,
  onDeleted
}) => {
  const { deleteTask, isDeleting } = useTasks();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isConfirming, setIsConfirming] = React.useState(false);

  const handleDelete = async () => {
    setIsConfirming(true);
    try {
      await deleteTask(task.id);
      onDeleted?.();
      onClose();
      
      // Show success toast with undo button
      toast({
        title: t('tasks.deleteTaskModal.toast.successTitle'),
        description: t('tasks.deleteTaskModal.toast.successDescription'),
        action: (
          <AlertDialogAction
            onClick={() => {
              // TODO: Implement undo functionality
              toast({
                title: "Coming Soon",
                description: "Undo functionality will be available soon!",
              });
            }}
          >
            Undo
          </AlertDialogAction>
        ),
      });
    } catch (error) {
      toast({
        title: t('tasks.deleteTaskModal.toast.errorTitle'),
        description: error instanceof Error ? error.message : t('tasks.deleteTaskModal.toast.unknownError'),
        variant: "destructive",
      });
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('tasks.deleteTaskModal.title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('tasks.deleteTaskModal.confirmMessage')}
            <br />
            <strong>{task.title}</strong>
            <br />
            <span className="text-destructive">{t('tasks.deleteTaskModal.warning')}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting || isConfirming}>
            {t('tasks.deleteTaskModal.cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting || isConfirming}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {(isDeleting || isConfirming) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isDeleting || isConfirming ? t('tasks.deleting') : t('tasks.deleteTaskModal.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}; 