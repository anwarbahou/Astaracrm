
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Client } from "@/components/clients/ClientsTable";

interface ClientStatsProps {
    clients: Client[];
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-MA', {
        style: 'currency',
        currency: 'MAD',
        minimumFractionDigits: 0,
    }).format(amount);
};

export function ClientStats({ clients }: ClientStatsProps) {
    const { t } = useTranslation();

    const totalRevenue = clients.reduce((sum, client) => sum + client.totalDealValue, 0);
    const activeClients = clients.filter(c => c.stage === "Active").length;
    const prospects = clients.filter(c => c.stage === "Prospect").length;

    return (
        <div className="grid gap-4 md:grid-cols-4">
            <Card>
                <CardContent className="p-6">
                    <div className="text-center">
                        <p className="text-2xl font-bold">{clients.length}</p>
                        <p className="text-sm text-muted-foreground">{t('clients.totalClients')}</p>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-6">
                    <div className="text-center">
                        <p className="text-2xl font-bold">{activeClients}</p>
                        <p className="text-sm text-muted-foreground">{t('clients.activeClients')}</p>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-6">
                    <div className="text-center">
                        <p className="text-2xl font-bold">{prospects}</p>
                        <p className="text-sm text-muted-foreground">{t('clients.prospects')}</p>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-6">
                    <div className="text-center">
                        <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
                        <p className="text-sm text-muted-foreground">{t('clients.totalRevenue')}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
