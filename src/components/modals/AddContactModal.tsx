import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { useTranslation } from "react-i18next";
import { AddContactForm } from "@/components/contacts/AddContactForm";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

interface AddContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContactAdded?: () => void;
}

export function AddContactModal({ open, onOpenChange, onContactAdded }: AddContactModalProps) {
  const { t } = useTranslation();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col max-h-[100vh] w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{t('addContactModal.title')}</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-4 py-2">
          <AddContactForm ref={formRef} onOpenChange={onOpenChange} onContactAdded={onContactAdded} />
        </div>
        <SheetFooter className="border-t pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('addContactModal.cancel')}
          </Button>
          <Button onClick={() => formRef.current?.requestSubmit() }>
            {t('addContactModal.addContact')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
