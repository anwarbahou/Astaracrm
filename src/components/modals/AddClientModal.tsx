
import { useState } from "react";
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
import { useTranslation } from "react-i18next";

interface AddClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddClientModal({ open, onOpenChange }: AddClientModalProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    industry: "",
    stage: "",
    owner: "",
    country: "",
    notes: "",
    tags: [] as string[],
    avatar: "",
  });
  
  const [newTag, setNewTag] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: t("toasts.addClient.success.title"),
      description: t("toasts.addClient.success.description"),
    });
    onOpenChange(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      industry: "",
      stage: "",
      owner: "",
      country: "",
      notes: "",
      tags: [],
      avatar: "",
    });
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('addClientModal.title')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture Section */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={formData.avatar} />
              <AvatarFallback className="text-xl">
                {formData.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Label>{t('addClientModal.profilePicture')}</Label>
              <Button type="button" variant="outline" size="sm" className="gap-2">
                <Upload size={16} />
                {t('addClientModal.uploadPhoto')}
              </Button>
              <p className="text-xs text-muted-foreground">{t('addClientModal.uploadHint')}</p>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">{t('addClientModal.nameLabel')}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t('addClientModal.namePlaceholder')}
                required
              />
            </div>

            <div>
              <Label htmlFor="email">{t('addClientModal.emailLabel')}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder={t('addClientModal.emailPlaceholder')}
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">{t('addClientModal.phoneLabel')}</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder={t('addClientModal.phonePlaceholder')}
              />
            </div>

            <div>
              <Label htmlFor="country">{t('addClientModal.countryLabel')}</Label>
              <Select
                value={formData.country}
                onValueChange={(value) => setFormData({ ...formData, country: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('addClientModal.countryPlaceholder')} />
                </SelectTrigger>
                <SelectContent className="bg-background border">
                  <SelectItem value="Morocco">{t('countries.morocco')}</SelectItem>
                  <SelectItem value="France">{t('countries.france')}</SelectItem>
                  <SelectItem value="Spain">{t('countries.spain')}</SelectItem>
                  <SelectItem value="USA">{t('countries.usa')}</SelectItem>
                  <SelectItem value="UAE">{t('countries.uae')}</SelectItem>
                  <SelectItem value="UK">{t('countries.uk')}</SelectItem>
                  <SelectItem value="Germany">{t('countries.germany')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Business Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="industry">{t('addClientModal.industryLabel')}</Label>
              <Select
                value={formData.industry}
                onValueChange={(value) => setFormData({ ...formData, industry: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('addClientModal.industryPlaceholder')} />
                </SelectTrigger>
                <SelectContent className="bg-background border">
                  <SelectItem value="Technology">{t('industries.technology')}</SelectItem>
                  <SelectItem value="Healthcare">{t('industries.healthcare')}</SelectItem>
                  <SelectItem value="Finance">{t('industries.finance')}</SelectItem>
                  <SelectItem value="Retail">{t('industries.retail')}</SelectItem>
                  <SelectItem value="Manufacturing">{t('industries.manufacturing')}</SelectItem>
                  <SelectItem value="Consulting">{t('industries.consulting')}</SelectItem>
                  <SelectItem value="Education">{t('industries.education')}</SelectItem>
                  <SelectItem value="Real Estate">{t('industries.real_estate')}</SelectItem>
                  <SelectItem value="Other">{t('industries.other')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="stage">{t('addClientModal.stageLabel')}</Label>
              <Select
                value={formData.stage}
                onValueChange={(value) => setFormData({ ...formData, stage: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('addClientModal.stagePlaceholder')} />
                </SelectTrigger>
                <SelectContent className="bg-background border">
                  <SelectItem value="Lead">{t('clientStages.lead')}</SelectItem>
                  <SelectItem value="Prospect">{t('clientStages.prospect')}</SelectItem>
                  <SelectItem value="Active">{t('clientStages.active')}</SelectItem>
                  <SelectItem value="Inactive">{t('clientStages.inactive')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="owner">{t('addClientModal.ownerLabel')}</Label>
              <Select
                value={formData.owner}
                onValueChange={(value) => setFormData({ ...formData, owner: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('addClientModal.ownerPlaceholder')} />
                </SelectTrigger>
                <SelectContent className="bg-background border">
                  <SelectItem value="John Smith">John Smith</SelectItem>
                  <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                  <SelectItem value="Mike Wilson">Mike Wilson</SelectItem>
                  <SelectItem value="Emily Davis">Emily Davis</SelectItem>
                  <SelectItem value="David Brown">David Brown</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tags Section */}
          <div>
            <Label>{t('addClientModal.tagsLabel')}</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('addClientModal.tagsPlaceholder')}
                  className="flex-1"
                />
                <Button type="button" onClick={addTag} size="sm">
                  {t('common.add')}
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

          {/* Notes Section */}
          <div>
            <Label htmlFor="notes">{t('addClientModal.notesLabel')}</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder={t('addClientModal.notesPlaceholder')}
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
            <Button type="submit">{t('addClientModal.submitButton')}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
