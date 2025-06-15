
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Upload, X } from "lucide-react";

interface AddContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const initialFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  role: "",
  company: "",
  tags: [] as string[],
  country: "",
  status: "",
  notes: "",
  avatar: "",
};

export function AddContactModal({ open, onOpenChange }: AddContactModalProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(initialFormData);
  
  const [newTag, setNewTag] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would handle form submission here
    console.log("New Contact Data:", formData);
    toast({
      title: t('addContactModal.toastSuccessTitle'),
      description: t('addContactModal.toastSuccessDescription'),
    });
    onOpenChange(false);
    setFormData(initialFormData);
  };

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({ ...formData, tags: [...formData.tags, newTag] });
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };
  
  const companies = ["Acme Corporation", "Tech Solutions Ltd", "Global Industries", "StartupXYZ", "Enterprise Corp"];
  const companyKeys = ["acme", "tech", "global", "startup", "enterprise"];

  const countries = ["Morocco", "France", "Spain", "USA", "UK", "Germany"];
  const countryKeys = ["morocco", "france", "spain", "usa", "uk", "germany"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('addContactModal.title')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={formData.avatar} />
              <AvatarFallback className="text-xl">
                {formData.firstName?.[0]}{formData.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Label>{t('addContactModal.profilePicture')}</Label>
              <Button type="button" variant="outline" size="sm" className="gap-2">
                <Upload size={16} />
                {t('addContactModal.uploadPhoto')}
              </Button>
              <p className="text-xs text-muted-foreground">{t('addContactModal.uploadHint')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">{t('addContactModal.firstNameLabel')}</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder={t('addContactModal.firstNamePlaceholder')}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">{t('addContactModal.lastNameLabel')}</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder={t('addContactModal.lastNamePlaceholder')}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">{t('addContactModal.emailLabel')}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder={t('addContactModal.emailPlaceholder')}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">{t('addContactModal.phoneLabel')}</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder={t('addContactModal.phonePlaceholder')}
              />
            </div>
          </div>

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
                  <SelectValue placeholder={t('addContactModal.selectCompany')} />
                </SelectTrigger>
                <SelectContent className="bg-background border">
                  {companies.map((company, index) => (
                    <SelectItem key={company} value={company}>{t(`contacts.companies.${companyKeys[index]}`)}</SelectItem>
                  ))}
                  <SelectItem value="Other">{t('contacts.companies.other')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

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
                   {countries.map((country, index) => (
                      <SelectItem key={country} value={country}>{t(`countries.${countryKeys[index]}`)}</SelectItem>
                    ))}
                  <SelectItem value="Other">{t('countries.other')}</SelectItem>
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
                  <SelectItem value="Active">{t('contacts.statuses.active')}</SelectItem>
                  <SelectItem value="Inactive">{t('contacts.statuses.inactive')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>{t('addContactModal.tagsLabel')}</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('addContactModal.tagsPlaceholder')}
                  className="flex-1"
                />
                <Button type="button" onClick={addTag} size="sm">
                  {t('addContactModal.addTagButton')}
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {tag}
                      <X 
                        size={12} 
                        className="cursor-pointer hover:text-destructive"
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="notes">{t('addContactModal.notesLabel')}</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder={t('addContactModal.notesPlaceholder')}
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button type="submit">{t('addContactModal.submitButton')}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
