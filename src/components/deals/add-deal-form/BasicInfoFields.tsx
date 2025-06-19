
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { useClientsForSelection } from "@/hooks/useClients";

interface BasicInfoFieldsProps {
  formData: {
    name: string;
    client: string;
    clientId: string;
    value: number;
    notes: string;
  };
  onUpdateField: (field: string, value: any) => void;
}

export function BasicInfoFields({ formData, onUpdateField }: BasicInfoFieldsProps) {
  const { t } = useTranslation();
  const { clients, isLoading: isLoadingClients } = useClientsForSelection();

  const handleClientSelect = (clientId: string) => {
    const selectedClient = clients.find(c => c.id === clientId);
    if (selectedClient) {
      onUpdateField('clientId', clientId);
      onUpdateField('client', selectedClient.name);
    }
  };

  return (
    <>
      <div className="col-span-2">
        <Label htmlFor="dealName">{t('addDealModal.dealNameLabel')}</Label>
        <Input
          id="dealName"
          value={formData.name}
          onChange={(e) => onUpdateField('name', e.target.value)}
          placeholder={t('addDealModal.dealNamePlaceholder')}
          required
        />
      </div>

      <div>
        <Label htmlFor="client">{t('addDealModal.clientLabel')}</Label>
        <Select
          value={formData.clientId}
          onValueChange={handleClientSelect}
        >
          <SelectTrigger>
            <SelectValue placeholder={isLoadingClients ? "Loading clients..." : t('addDealModal.clientPlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                <div className="flex flex-col">
                  <span className="font-medium">{client.name}</span>
                  {client.email && (
                    <span className="text-sm text-muted-foreground">{client.email}</span>
                  )}
                </div>
              </SelectItem>
            ))}
            {clients.length === 0 && !isLoadingClients && (
              <SelectItem value="no-clients" disabled>
                No clients available
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="value">{t('addDealModal.valueLabel')}</Label>
        <Input
          id="value"
          type="number"
          value={formData.value}
          onChange={(e) => onUpdateField('value', parseInt(e.target.value) || 0)}
          placeholder="0"
          required
        />
      </div>

      <div className="col-span-2">
        <Label htmlFor="notes">{t('addDealModal.notesLabel')}</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => onUpdateField('notes', e.target.value)}
          placeholder={t('addDealModal.notesPlaceholder')}
          rows={3}
        />
      </div>
    </>
  );
}
