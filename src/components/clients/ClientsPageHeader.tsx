
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ClientsPageHeaderProps {
    onAddClient: () => void;
}

export function ClientsPageHeader({ onAddClient }: ClientsPageHeaderProps) {
    const { t } = useTranslation();

    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold">{t('topNav.pageTitle.clients')}</h1>
                <p className="text-muted-foreground mt-1">
                    {t('topNav.pageDescription.clients')}
                </p>
            </div>
            <Button className="gap-2" onClick={onAddClient}>
                <Plus size={16} />
                {t('clients.addClient')}
            </Button>
        </div>
    );
}
