import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ClientsPageHeaderProps {
    onAddClient: () => void;
}

export function ClientsPageHeader({ onAddClient }: ClientsPageHeaderProps) {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold truncate">{t('app.topNav.pageTitle.clients')}</h1>
                <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                    {t('app.topNav.pageDescription.clients')}
                </p>
            </div>
            <Button 
                className="gap-2 w-full sm:w-auto text-sm" 
                onClick={onAddClient}
            >
                <Plus size={16} />
                {t('clients.addClient')}
            </Button>
        </div>
    );
}
