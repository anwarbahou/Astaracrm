
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SectionProps } from ".";

export function ProfessionalInfoSection({ formData, setFormData }: SectionProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="role">{t('addContactModal.roleLabel')}</Label>
        <Input
          id="role"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          placeholder={t('addContactModal.rolePlaceholder')}
        />
      </div>
      <div>
        <Label htmlFor="company">{t('addContactModal.companyLabel')}</Label>
        <Select
          value={formData.company}
          onValueChange={(value) => setFormData({ ...formData, company: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('addContactModal.companyPlaceholder')} />
          </SelectTrigger>
          <SelectContent className="bg-background border">
            <SelectItem value="Acme Corporation">Acme Corporation</SelectItem>
            <SelectItem value="Tech Solutions Ltd">Tech Solutions Ltd</SelectItem>
            <SelectItem value="Global Industries">Global Industries</SelectItem>
            <SelectItem value="StartupXYZ">StartupXYZ</SelectItem>
            <SelectItem value="Enterprise Corp">Enterprise Corp</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
