
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import { AddClientForm } from "@/components/clients/AddClientForm";

interface AddClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClientAdded?: () => void;
}

export function AddClientModal({ open, onOpenChange, onClientAdded }: AddClientModalProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('addClientModal.title')}</DialogTitle>
          <DialogDescription>
            {t('addClientModal.description')}
          </DialogDescription>
        </DialogHeader>
        <AddClientForm onOpenChange={onOpenChange} onClientAdded={onClientAdded} />
      </DialogContent>
    </Dialog>
  );
}
