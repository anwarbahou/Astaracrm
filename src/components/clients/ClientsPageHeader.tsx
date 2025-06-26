import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";

interface ClientsPageHeaderProps {
    onAddClient: () => void;
    onImportClients: () => void;
}

export function ClientsPageHeader({ onAddClient, onImportClients }: ClientsPageHeaderProps) {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold truncate">{t('app.topNav.pageTitle.clients')}</h1>
                <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                    {t('app.topNav.pageDescription.clients')}
                </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button 
                  className="gap-2 w-full sm:w-auto text-sm" 
                  onClick={onAddClient}
              >
                  <Plus size={16} />
                  {t('clients.addClient')}
              </Button>
              <Button 
                  variant="outline"
                  className="gap-2 w-full sm:w-auto text-sm" 
                  onClick={onImportClients}
              >
                  <Upload size={16} />
                  {t('clients.importClients', 'Import Clients')}
              </Button>
            </div>
        </div>
    );
}
