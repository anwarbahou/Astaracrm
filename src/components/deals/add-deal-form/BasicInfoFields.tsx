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
    clientPhone?: string;
    clientEmail?: string;
    value: number;
    currency: string;
    notes: string;
    description?: string;
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
        <Label htmlFor="dealName">
          {t('addDealModal.dealNameLabel')} <span className="text-red-500">*</span>
        </Label>
        <Input
          id="dealName"
          value={formData.name}
          onChange={(e) => onUpdateField('name', e.target.value)}
          placeholder={t('addDealModal.dealNamePlaceholder')}
          required
          className={!formData.name.trim() ? "border-red-300 focus:border-red-500" : ""}
        />
      </div>

      <div>
        <Label htmlFor="client">
          {t('addDealModal.clientLabel')} <span className="text-red-500">*</span>
        </Label>
        <Select
          value={formData.clientId}
          onValueChange={handleClientSelect}
          required
        >
          <SelectTrigger className={!formData.clientId ? "border-red-300 focus:border-red-500" : ""}>
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
        <Label htmlFor="value">
          {t('addDealModal.valueLabel')} <span className="text-red-500">*</span>
        </Label>
        <Input
          id="value"
          type="number"
          value={formData.value}
          onChange={(e) => onUpdateField('value', parseInt(e.target.value) || 0)}
          placeholder="0"
          required
          min="1"
          className={formData.value <= 0 ? "border-red-300 focus:border-red-500" : ""}
        />
      </div>

      <div>
        <Label htmlFor="currency">Currency</Label>
        <Input
          id="currency"
          value={formData.currency}
          onChange={(e) => onUpdateField('currency', e.target.value)}
          placeholder="MAD"
        />
      </div>

      <div>
        <Label htmlFor="client-email">Client Email</Label>
        <Input
          id="client-email"
          type="email"
          value={formData.clientEmail || ''}
          onChange={(e) => onUpdateField('clientEmail', e.target.value)}
          placeholder="client@company.com"
        />
      </div>

      <div>
        <Label htmlFor="client-phone">Client Phone</Label>
        <Input
          id="client-phone"
          value={formData.clientPhone || ''}
          onChange={(e) => onUpdateField('clientPhone', e.target.value)}
          placeholder="+212 6XX XXX XXX"
        />
      </div>

      <div className="col-span-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => onUpdateField('description', e.target.value)}
          placeholder="Detailed description of the deal..."
          rows={3}
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
