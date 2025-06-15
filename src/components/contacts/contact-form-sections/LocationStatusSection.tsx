
import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SectionProps } from ".";

export function LocationStatusSection({ formData, setFormData }: SectionProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="country">{t('addContactModal.countryLabel')}</Label>
        <Select
          value={formData.country}
          onValueChange={(value) => setFormData({ ...formData, country: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('addContactModal.countryPlaceholder')} />
          </SelectTrigger>
          <SelectContent className="bg-background border">
            <SelectItem value="Morocco">Morocco</SelectItem>
            <SelectItem value="France">France</SelectItem>
            <SelectItem value="Spain">Spain</SelectItem>
            <SelectItem value="USA">United States</SelectItem>
            <SelectItem value="UK">United Kingdom</SelectItem>
            <SelectItem value="Germany">Germany</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="status">{t('addContactModal.statusLabel')}</Label>
        <Select
          value={formData.status}
          onValueChange={(value) => setFormData({ ...formData, status: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('addContactModal.statusPlaceholder')} />
          </SelectTrigger>
          <SelectContent className="bg-background border">
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
