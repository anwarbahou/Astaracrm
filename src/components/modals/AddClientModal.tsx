
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader className="space-y-6">
          <SheetTitle>{t('addClientModal.title')}</SheetTitle>
          <SheetDescription>
            {t('addClientModal.description')}
          </SheetDescription>
        </SheetHeader>
        <AddClientForm onOpenChange={onOpenChange} onClientAdded={onClientAdded} />
      </SheetContent>
    </Sheet>
  );
}
