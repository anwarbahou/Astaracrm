import { Contact } from './ContactsTable';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, Building2, MapPin, Eye, EyeOff } from 'lucide-react';

interface ContactsCardGridProps {
  contacts: Contact[];
  onContactClick: (contact: Contact) => void;
}

export function ContactsCardGrid({ contacts, onContactClick }: ContactsCardGridProps) {
  const { t } = useTranslation();

  const getStatusColor = (status: string) =>
    status === 'Active' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {contacts.map(contact => (
        <Card
          key={contact.id}
          className="cursor-pointer hover:shadow-md transition"
          onClick={() => onContactClick(contact)}
        >
          <CardContent className="flex gap-4 p-4 text-sm">
            {/* Left section */}
            <div className="w-40 shrink-0 space-y-3 text-sm border-r pr-4">
              <div className="flex flex-col items-center gap-2">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>
                    {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <p className="font-medium leading-tight">
                    {contact.firstName} {contact.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">{contact.role}</p>
                </div>
              </div>
              {/* Status + Visibility */}
              <div className="flex items-center justify-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <span className={`h-2 w-2 rounded-full ${getStatusColor(contact.status)}`} />
                  {contact.status}
                </div>
                <div className="flex items-center gap-1">
                  {contact.visibility === 'Private' ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  {t(`visibility.${contact.visibility.toLowerCase()}`)}
                </div>
              </div>
              <Button
                size="sm"
                className="w-full"
                onClick={() => onContactClick(contact)}
              >
                {t('common.view', 'View')}
              </Button>
            </div>

            {/* Right section */}
            <div className="flex-1 flex flex-col justify-center space-y-3">
              <div className="flex items-center gap-3 px-3 py-[6px]">
                <span className="rounded-full bg-muted p-1 flex items-center justify-center">
                  <Mail className="h-4 w-4 text-primary" />
                </span>
                {contact.email}
              </div>
              {contact.phone && (
                <div className="flex items-center gap-3 px-3 py-[6px]">
                  <span className="rounded-full bg-muted p-1 flex items-center justify-center">
                    <Phone className="h-4 w-4 text-primary" />
                  </span>
                  {contact.phone}
                </div>
              )}
              <div className="flex items-center gap-3 px-3 py-[6px]">
                <span className="rounded-full bg-muted p-1 flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-primary" />
                </span>
                {contact.company || t('common.unassigned')}
              </div>
              <div className="flex items-center gap-3 px-3 py-[6px]">
                <span className="rounded-full bg-muted p-1 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-primary" />
                </span>
                {contact.country || t('common.notSpecified')}
              </div>
              {/* Tags */}
              {contact.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {contact.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              <p className="text-[11px] text-muted-foreground pt-1">
                {t('contacts.table.header.created')}: {contact.createdDate}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 