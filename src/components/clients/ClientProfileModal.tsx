import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useUsers } from '@/hooks/useUsers';
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  X,
  Loader2,
  AlertCircle,
  Users,
  FileText,
  MessageSquare,
  Upload,
  Trash,
} from 'lucide-react';
import { useClientProfile } from '@/hooks/useClientProfile';
import type { ClientProfile } from '@/services/clientService';
import { ClientService } from '@/services/clientService';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

// Define client stage type locally since it might not be in Database types
type ClientStage = 'lead' | 'prospect' | 'active' | 'inactive';

interface ClientProfileModalProps {
  clientId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (client: ClientProfile) => void;
  onDelete?: () => void;
}

export function ClientProfileModal({ clientId, open, onOpenChange, onSave, onDelete }: ClientProfileModalProps) {
  const { t } = useTranslation(['clients', 'common', 'profile', 'fields']);
  const { toast } = useToast();
  const { isAdmin, isManager } = useAuth();
  const { data: users = [] } = useUsers();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editedClient, setEditedClient] = useState<Partial<ClientProfile>>({});

  const {
    client,
    contacts,
    deals,
    activities,
    documents,
    loading,
    error,
    refreshData,
    updateClient,
  } = useClientProfile(clientId);

  // Initialize edited client when client data changes
  useEffect(() => {
    if (client) {
      setEditedClient({ ...client });
    }
  }, [client]);

  const handleSave = async () => {
    if (!client || !clientId) return;

    setSaving(true);
    try {
      const success = await updateClient(editedClient);
      if (success) {
        setIsEditing(false);
        onSave?.(client);
        
        toast({
          title: t('clients.profile.save'),
          description: 'Client profile updated successfully',
          variant: 'default',
        });

        // Refresh data to get updated values
        await refreshData();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to update client profile',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error saving client:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (client) {
      setEditedClient({ ...client });
    }
    setIsEditing(false);
  };

  const handleDeleteConfirmed = async () => {
    if (!clientId) return;

    setDeleting(true);
    try {
      const success = await ClientService.deleteClient(clientId);
      if (success) {
        toast({
          title: t('clients.profile.deleted', 'Client deleted'),
          variant: 'default',
        });
        onDelete?.();
        onOpenChange(false); // Close the drawer
      } else {
        toast({
          title: t('clients.profile.errorDeleting', 'Error'),
          description: t('clients.profile.failedDelete', 'Failed to delete client'),
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting client:', error);
      toast({
        title: t('clients.profile.errorDeleting', 'Error'),
        description: t('clients.profile.unexpectedError', 'An unexpected error occurred'),
        variant: 'destructive',
      });
    } finally {
      setDeleting(false);
    }
  };

  const getUserDisplayName = (user: any) => {
    if (!user) return 'Unassigned';
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    return `${firstName} ${lastName}`.trim() || user.email;
  };

  const handleOwnerChange = (userId: string) => {
    const selectedUser = users.find(u => u.id === userId);
    if (selectedUser) {
      setEditedClient(prev => ({
        ...prev,
        owner_id: userId,
        owner: {
          id: userId,
          first_name: selectedUser.first_name,
          last_name: selectedUser.last_name,
          email: selectedUser.email,
          avatar_url: selectedUser.avatar_url
        }
      }));
    }
  };

  const formatCurrency = (amount: number | null | undefined) => {
    if (!amount) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStageColor = (stage: string | null) => {
    switch (stage) {
      case 'lead': return 'bg-yellow-500';
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-red-500';
      case 'prospect': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStageLabel = (stage: string | null) => {
    return t(`clients.profile.stages.${stage || 'unknown'}`);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return t('clients.profile.fields.notAvailable');
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString: string | null | undefined) => {
    if (!dateString) return t('clients.profile.fields.notAvailable');
    return new Date(dateString).toLocaleString();
  };

  // Loading state
  if (loading) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <div className="flex items-center justify-center h-96">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>{t('clients.profile.loading')}</span>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Error state
  if (error || !client) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <div className="flex items-center justify-center h-96">
            <Alert className="max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error || t('clients.profile.notFound')}
              </AlertDescription>
            </Alert>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl flex flex-col">
        <div className="flex-1 overflow-y-auto pr-1">
          <SheetHeader className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle>{t('clients.profile.title')}</SheetTitle>
                <SheetDescription>
                  {t('clients.profile.description')}
                </SheetDescription>
              </div>
            </div>

            {/* Profile Header */}
            <div className="flex items-start gap-6">
              <div className="flex-1 space-y-3">
                <div>
                  {isEditing ? (
                    <Input
                      value={editedClient.name || ''}
                      onChange={(e) => setEditedClient({ ...editedClient, name: e.target.value })}
                      className="text-xl font-bold"
                    />
                  ) : (
                    <h2 className="text-xl font-bold">{client.name}</h2>
                  )}
                  
                  {isEditing ? (
                    <Select
                      value={editedClient.stage || 'lead'}
                      onValueChange={(value: 'lead' | 'prospect' | 'active' | 'inactive') => setEditedClient({ 
                        ...editedClient, 
                        stage: value
                      })}
                    >
                      <SelectTrigger className="mt-2 max-w-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lead">{t('clients.profile.stages.lead')}</SelectItem>
                        <SelectItem value="prospect">{t('clients.profile.stages.prospect')}</SelectItem>
                        <SelectItem value="active">{t('clients.profile.stages.active')}</SelectItem>
                        <SelectItem value="inactive">{t('clients.profile.stages.inactive')}</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className={`${getStageColor(client.stage)} text-white mt-2`}>
                      {getStageLabel(client.stage)}
                    </Badge>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {isEditing ? (
                      <Input
                        value={editedClient.email || ''}
                        onChange={(e) => setEditedClient({ ...editedClient, email: e.target.value })}
                        className="text-sm"
                      />
                    ) : (
                      <span>{client.email || t('clients.profile.fields.noEmail')}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {isEditing ? (
                      <Input
                        value={editedClient.phone || ''}
                        onChange={(e) => setEditedClient({ ...editedClient, phone: e.target.value })}
                        className="text-sm"
                      />
                    ) : (
                      <span>{client.phone || t('clients.profile.fields.noPhone')}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {isEditing ? (
                      <Input
                        value={editedClient.country || ''}
                        onChange={(e) => setEditedClient({ ...editedClient, country: e.target.value })}
                        className="text-sm"
                      />
                    ) : (
                      <span>{client.country || t('clients.profile.fields.noCountry')}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {isEditing ? (
                      <Textarea
                        value={editedClient.address || ''}
                        onChange={(e) => setEditedClient({ ...editedClient, address: e.target.value })}
                        placeholder={t('clients.profile.fields.addressPlaceholder')}
                        className="text-sm"
                        rows={2}
                      />
                    ) : (
                      <span>{client.address || t('clients.profile.fields.noAddress')}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{t('clients.profile.memberSince')} {formatDate(client.created_at)}</span>
                  </div>
                  <div className="col-span-2">
                    {isEditing ? (
                      <Input
                        value={(editedClient.tags || []).join(', ')}
                        onChange={(e) => {
                          const tagsArray = e.target.value
                            .split(',')
                            .map(tag => tag.trim())
                            .filter(tag => tag.length > 0);
                          setEditedClient({ ...editedClient, tags: tagsArray });
                        }}
                        placeholder={t('clients.profile.fields.tagsPlaceholder')}
                        className="text-sm"
                      />
                    ) : (
                      <div className="flex gap-2 flex-wrap">
                        {client.tags && client.tags.length > 0 ? (
                          client.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary">{tag}</Badge>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">{t('common:notSpecified')}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-primary">{formatCurrency(client.total_deal_value)}</p>
                  <p className="text-xs text-muted-foreground">{t('clients.profile.totalDealValue')}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold">{client.contacts_count || 0}</p>
                  <p className="text-xs text-muted-foreground">{t('clients.table.contacts')}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold">{deals.filter(d => d.stage !== 'won' && d.stage !== 'lost').length}</p>
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
              <TabsTrigger value="deals">{t('clients.profile.tabs.deals')}</TabsTrigger>
              <TabsTrigger value="notes">{t('clients.profile.tabs.notes')}</TabsTrigger>
              <TabsTrigger value="files">{t('clients.profile.tabs.files')}</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle>{t('clients.profile.companyInformation')}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditing(!isEditing)}
                    className="h-8 w-8"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>{t('clients.profile.fields.owner')}</Label>
                    {isEditing && (isAdmin || isManager) ? (
                      <div className="mt-1.5">
                        <Select
                          value={editedClient.owner_id || ''}
                          onValueChange={handleOwnerChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={t('clients.profile.fields.selectOwner')} />
                          </SelectTrigger>
                          <SelectContent>
                            {users.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    {user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user.email}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {user.email} • {user.role}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mt-1.5">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{getUserDisplayName(client.owner)}</span>
                      </div>
                    )}
                    {isEditing && !isAdmin && !isManager && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('clients.profile.ownershipRestriction')}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>{t('clients.table.industry')}</Label>
                    {isEditing ? (
                      <div className="mt-1.5">
                        <Select
                          value={editedClient.industry || ''}
                          onValueChange={(value) => setEditedClient({ ...editedClient, industry: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={t('clients.profile.fields.selectIndustry')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Technology">{t('industries.technology')}</SelectItem>
                            <SelectItem value="Healthcare">{t('industries.healthcare')}</SelectItem>
                            <SelectItem value="Finance">{t('industries.finance')}</SelectItem>
                            <SelectItem value="Retail">{t('industries.retail')}</SelectItem>
                            <SelectItem value="Manufacturing">{t('industries.manufacturing')}</SelectItem>
                            <SelectItem value="Education">{t('industries.education')}</SelectItem>
                            <SelectItem value="Other">{t('industries.other')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <p className="text-sm mt-1.5">{client.industry || t('common:notSpecified')}</p>
                    )}
                  </div>

                  <div>
                    <Label>{t('clients.profile.fields.notes')}</Label>
                    {isEditing ? (
                      <Textarea
                        value={editedClient.notes || ''}
                        onChange={(e) => setEditedClient({ ...editedClient, notes: e.target.value })}
                        placeholder={t('clients.profile.fields.notesPlaceholder')}
                        className="mt-1.5"
                      />
                    ) : (
                      <p className="text-sm mt-1.5 whitespace-pre-wrap">
                        {client.notes || t('common:notSpecified')}
                      </p>
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
                    {contacts.length > 0 ? (
                      contacts.map((contact) => (
                        <div key={contact.id} className="flex items-center gap-3 p-3 rounded-lg border">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{contact.name}</p>
                              {contact.is_primary && <Badge variant="default">{t('clients.profile.primary')}</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground">{contact.role || t('clients.profile.fields.noRoleSpecified')}</p>
                            <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                              <span>{contact.email || t('clients.profile.fields.noEmail')}</span>
                              <span>{contact.phone || t('clients.profile.fields.noPhone')}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-medium text-lg mb-2">{t('clients.profile.contacts.noContactsYet')}</h3>
                        <p className="text-muted-foreground mb-4">{t('clients.profile.contacts.addContactsToStart')}</p>
                        <Button>{t('clients.profile.addContact')}</Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="deals" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{t('clients.profile.deals.title')}</span>
                    <Button size="sm">{t('clients.profile.deals.addDeal')}</Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {deals.length > 0 ? (
                      deals.map((deal) => (
                        <div key={deal.id} className="flex items-center justify-between p-3 rounded-lg border">
                          <div className="flex-1">
                            <h4 className="font-medium">{deal.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {t('clients.profile.deals.closeDate')} {deal.close_date ? formatDate(deal.close_date) : t('clients.profile.deals.notSet')}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="font-medium">{formatCurrency(deal.value)}</p>
                              <p className="text-sm text-muted-foreground">{deal.probability}% {t('clients.profile.deals.probability')}</p>
                            </div>
                            <Badge className={`${getStageColor(deal.stage)} text-white`}>
                              {deal.stage}
                            </Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-medium text-lg mb-2">{t('clients.profile.deals.noDealsYet')}</h3>
                        <p className="text-muted-foreground mb-4">{t('clients.profile.deals.createDealsToTrack')}</p>
                        <Button>{t('clients.profile.deals.addFirstDeal')}</Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText size={20} />
                    {t('clients.profile.activities.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activities.length > 0 ? (
                      activities.map((activity) => (
                        <div key={activity.id} className="flex gap-3 p-3 rounded-lg border">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline">{activity.type.replace('_', ' ')}</Badge>
                              <span className="text-sm text-muted-foreground">
                                {t('clients.profile.activities.by')} {activity.user?.first_name || t('clients.profile.activities.unknown')}
                              </span>
                            </div>
                            <p className="text-sm">{activity.title}</p>
                            {activity.description && (
                              <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDateTime(activity.created_at)}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-medium text-lg mb-2">{t('clients.profile.activities.noActivitiesYet')}</h3>
                        <p className="text-muted-foreground">{t('clients.profile.activities.activitiesWillAppear')}</p>
                      </div>
                    )}
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
          </Tabs>
        </div> {/* end scrollable container */}

        {/* Fixed Footer */}
        <div className="border-t py-3 px-6 flex items-center justify-between bg-background">
          {/* Left side: Delete button */}
          {isEditing ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={deleting}
                  className="gap-2"
                >
                  {deleting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Trash size={16} />
                  )}
                  {t('clients.profile.delete', 'Delete')}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('clients.profile.confirmDeleteTitle', 'Delete client?')}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('clients.profile.confirmDelete', 'Are you sure you want to delete this client? This action cannot be undone.')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('clients.profile.cancel')}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteConfirmed} disabled={deleting} className="gap-2 bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    {deleting ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash size={16} />
                    )}
                    {t('clients.profile.delete', 'Delete')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <span />
          )}

          {/* Right side: Save/Cancel or Edit */}
          {isEditing ? (
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleSave}
                className="gap-2"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    {t('clients.profile.saving')}
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    {t('clients.profile.save')}
                  </>
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                className="gap-2"
                disabled={saving}
              >
                <X size={16} />
                {t('clients.profile.cancel')}
              </Button>
            </div>
          ) : (
            <Button size="sm" onClick={() => setIsEditing(true)} className="gap-2">
              <Edit size={16} />
              {t('clients.profile.edit')}
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
