
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  X,
  Users,
  FileText,
  MessageSquare,
  History,
  Upload
} from 'lucide-react';
import { Client } from '@/types/client';

interface ClientProfileModalProps {
  client: Client | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (client: Client) => void;
}

export function ClientProfileModal({ client, open, onOpenChange, onSave }: ClientProfileModalProps) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [editedClient, setEditedClient] = useState<Client | null>(null);

  React.useEffect(() => {
    if (client) {
      setEditedClient({ ...client });
    }
  }, [client]);

  if (!client || !editedClient) return null;

  const handleSave = () => {
    onSave(editedClient);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedClient({ ...client });
    setIsEditing(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Lead': return 'bg-yellow-500';
      case 'Active': return 'bg-green-500';
      case 'Inactive': return 'bg-red-500';
      case 'Prospect': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  // Mock contacts data
  const contacts = [
    { id: 1, name: 'John Smith', role: 'CEO', email: 'john@company.com', phone: '+212 661 234567', primary: true },
    { id: 2, name: 'Sarah Johnson', role: 'CTO', email: 'sarah@company.com', phone: '+212 661 234568', primary: false },
    { id: 3, name: 'Mike Wilson', role: 'Procurement', email: 'mike@company.com', phone: '+212 661 234569', primary: false },
  ];

  const activities = [
    { id: 1, type: 'Email', description: 'Sent proposal for new project', date: '2024-01-15 14:30', user: 'You' },
    { id: 2, type: 'Call', description: 'Discovery call with John Smith', date: '2024-01-14 10:00', user: 'Sarah Davis' },
    { id: 3, type: 'Meeting', description: 'Product demonstration', date: '2024-01-12 15:00', user: 'You' },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader className="space-y-6">
          <div className="flex items-center justify-between">
            <SheetTitle>{t('clients.profile.title')}</SheetTitle>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button size="sm" onClick={handleSave} className="gap-2">
                    <Save size={16} />
                    {t('clients.profile.save')}
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancel} className="gap-2">
                    <X size={16} />
                    {t('clients.profile.cancel')}
                  </Button>
                </>
              ) : (
                <Button size="sm" onClick={() => setIsEditing(true)} className="gap-2">
                  <Edit size={16} />
                  {t('clients.profile.edit')}
                </Button>
              )}
            </div>
          </div>

          {/* Profile Header */}
          <div className="flex items-start gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={client.avatar} />
              <AvatarFallback className="text-xl font-bold">
                {client.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-3">
              <div>
                {isEditing ? (
                  <Input
                    value={editedClient.name}
                    onChange={(e) => setEditedClient({ ...editedClient, name: e.target.value })}
                    className="text-xl font-bold"
                  />
                ) : (
                  <h2 className="text-xl font-bold">{client.name}</h2>
                )}
                <Badge className={`${getStageColor(client.stage)} text-white mt-2`}>
                  {client.stage}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {isEditing ? (
                    <Input
                      value={editedClient.email}
                      onChange={(e) => setEditedClient({ ...editedClient, email: e.target.value })}
                      className="text-sm"
                    />
                  ) : (
                    <span>{client.email}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {isEditing ? (
                    <Input
                      value={editedClient.phone}
                      onChange={(e) => setEditedClient({ ...editedClient, phone: e.target.value })}
                      className="text-sm"
                    />
                  ) : (
                    <span>{client.phone}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {isEditing ? (
                    <Input
                      value={editedClient.country}
                      onChange={(e) => setEditedClient({ ...editedClient, country: e.target.value })}
                      className="text-sm"
                    />
                  ) : (
                    <span>{client.country}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{t('clients.profile.memberSince')} {new Date(client.createdDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-primary">{formatCurrency(client.totalDealValue)}</p>
                <p className="text-xs text-muted-foreground">{t('clients.profile.totalDealValue')}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold">{client.contactsCount}</p>
                <p className="text-xs text-muted-foreground">{t('clients.table.contacts')}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-muted-foreground">{t('clients.profile.activeDeals')}</p>
              </CardContent>
            </Card>
          </div>
        </SheetHeader>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">{t('clients.profile.tabs.overview')}</TabsTrigger>
            <TabsTrigger value="contacts">{t('clients.profile.tabs.contacts')}</TabsTrigger>
            <TabsTrigger value="notes">{t('clients.profile.tabs.notes')}</TabsTrigger>
            <TabsTrigger value="files">{t('clients.profile.tabs.files')}</TabsTrigger>
            <TabsTrigger value="history">{t('clients.profile.tabs.history')}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('clients.profile.companyInformation')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>{t('clients.table.industry')}</Label>
                  {isEditing ? (
                    <Select
                      value={editedClient.industry}
                      onValueChange={(value) => setEditedClient({ ...editedClient, industry: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Technology">{t('industries.technology')}</SelectItem>
                        <SelectItem value="Healthcare">{t('industries.healthcare')}</SelectItem>
                        <SelectItem value="Finance">{t('industries.finance')}</SelectItem>
                        <SelectItem value="Retail">{t('industries.retail')}</SelectItem>
                        <SelectItem value="Manufacturing">{t('industries.manufacturing')}</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm">{client.industry}</p>
                  )}
                </div>
                
                <div>
                  <Label>{t('clients.table.owner')}</Label>
                  {isEditing ? (
                    <Input
                      value={editedClient.owner}
                      onChange={(e) => setEditedClient({ ...editedClient, owner: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm">{client.owner}</p>
                  )}
                </div>
                
                <div>
                  <Label>{t('clients.table.tags')}</Label>
                  <div className="flex gap-2 flex-wrap mt-1">
                    {client.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label>{t('addClientModal.notesLabel')}</Label>
                  {isEditing ? (
                    <Textarea
                      value={editedClient.notes || ''}
                      onChange={(e) => setEditedClient({ ...editedClient, notes: e.target.value })}
                      placeholder={t('addClientModal.notesPlaceholder')}
                      rows={4}
                    />
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{client.notes || 'No notes available'}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Users size={20} />
                    {t('clients.profile.companyContacts')}
                  </span>
                  <Button size="sm">{t('clients.profile.addContact')}</Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {contacts.map((contact) => (
                    <div key={contact.id} className="flex items-center gap-3 p-3 rounded-lg border">
                      <Avatar>
                        <AvatarFallback>{contact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{contact.name}</p>
                          {contact.primary && <Badge variant="default">{t('clients.profile.primary')}</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">{contact.role}</p>
                        <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                          <span>{contact.email}</span>
                          <span>{contact.phone}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText size={20} />
                  {t('clients.profile.notesTimeline')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex gap-3 p-3 rounded-lg border">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">{activity.type}</Badge>
                          <span className="text-sm text-muted-foreground">by {activity.user}</span>
                        </div>
                        <p className="text-sm">{activity.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="files" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Upload size={20} />
                    {t('clients.profile.filesDocuments')}
                  </span>
                  <Button size="sm">{t('clients.profile.uploadFile')}</Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium text-lg mb-2">{t('clients.profile.noFilesUploaded')}</h3>
                  <p className="text-muted-foreground mb-4">{t('clients.profile.uploadContracts')}</p>
                  <Button>{t('clients.profile.uploadFirstDocument')}</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History size={20} />
                  {t('clients.profile.changeHistory')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium text-lg mb-2">{t('clients.profile.noChangesRecorded')}</h3>
                  <p className="text-muted-foreground">{t('clients.profile.changesWillAppear')}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
