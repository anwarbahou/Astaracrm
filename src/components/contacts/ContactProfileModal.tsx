import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  Calendar,
  Edit,
  Trash2,
  FileText,
  MessageSquare,
  Clock
} from "lucide-react";
import { Contact } from "./ContactsTable";
import { useToast } from "@/hooks/use-toast";
import { contactsService } from "@/services/contactsService";
import { useAuth } from "@/contexts/AuthContext";

interface ContactProfileModalProps {
  contact: Contact | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (contact: Contact) => void;
}

export function ContactProfileModal({ contact, open, onOpenChange, onSave }: ContactProfileModalProps) {
  const { t } = useTranslation();
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [displayContact, setDisplayContact] = useState<Contact | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (contact) {
      setDisplayContact({ ...contact });
    }
  }, [contact]);

  const handleSave = async () => {
    if (!displayContact || !user?.id || !userProfile?.role) return;

    try {
      await contactsService.updateContact(displayContact.id, {
        firstName: displayContact.firstName,
        lastName: displayContact.lastName,
        email: displayContact.email,
        phone: displayContact.phone,
        role: displayContact.role,
        company: displayContact.company,
        country: displayContact.country,
        status: displayContact.status,
        tags: displayContact.tags,
        notes: displayContact.notes,
      }, {
        userId: user.id,
        userRole: userProfile.role
      });

      onSave(displayContact);
      setIsEditing(false);
      
      toast({
        title: t('contacts.profile.success'),
        description: t('contacts.profile.contactUpdated'),
      });
    } catch (error) {
      console.error('Error updating contact:', error);
      toast({
        title: t('contacts.profile.error'),
        description: error instanceof Error ? error.message : t('contacts.profile.updateFailed'),
        variant: "destructive"
      });
    }
  };

  const handleDelete = async () => {
    if (!displayContact || !user?.id || !userProfile?.role) return;

    try {
      setIsDeleting(true);
      const success = await contactsService.deleteContact(displayContact.id, {
        userId: user.id,
        userRole: userProfile.role
      });

      if (success) {
        toast({
          title: t('contacts.profile.success'),
          description: t('contacts.profile.contactDeleted'),
        });
        onOpenChange(false);
        // Trigger a refresh of the contacts list
        window.location.reload();
      } else {
        throw new Error('Failed to delete contact');
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast({
        title: t('contacts.profile.error'),
        description: error instanceof Error ? error.message : t('contacts.profile.deleteFailed'),
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const canEdit = () => {
    if (!displayContact || !userProfile?.role) return false;
    
    // Admins can edit all contacts
    if (userProfile.role === 'admin') return true;
    
    // Users and managers can only edit their own contacts
    // For localStorage implementation, we check if the contact has an ownerId
    const storedContact = displayContact as any;
    return storedContact.ownerId === user?.id || !storedContact.ownerId;
  };

  const canDelete = () => {
    return canEdit(); // Same permissions as editing
  };

  if (!displayContact) {
    return null;
  }

  const getTagColor = (tag: string) => {
    switch (tag) {
      case "Decision Maker": return "bg-purple-100 text-purple-800";
      case "VIP": return "bg-yellow-100 text-yellow-800";
      case "Technical": return "bg-blue-100 text-blue-800";
      case "Founder": return "bg-green-100 text-green-800";
      case "Startup": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader className="space-y-6">
          <div className="flex items-center justify-between">
            <SheetTitle>{t('contacts.profile.title')}</SheetTitle>
            <div className="flex gap-2">
              {canEdit() && (
                <>
                  {isEditing ? (
                    <>
                      <Button size="sm" onClick={handleSave}>
                        <Edit className="h-4 w-4 mr-2" />
                        {t('contacts.profile.save')}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => {
                          setIsEditing(false);
                          setDisplayContact({ ...contact! });
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        {t('contacts.profile.cancel')}
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      {t('contacts.profile.edit')}
                    </Button>
                  )}
                  
                  {canDelete() && !isEditing && (
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {isDeleting ? t('contacts.profile.deleting') : t('contacts.profile.delete')}
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Profile Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary text-xl font-medium">
                    {displayContact.firstName[0]}{displayContact.lastName[0]}
                  </span>
                </div>
                <div className="flex-1 space-y-4">
                  {isEditing ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">{t('contacts.profile.firstName')}</Label>
                        <Input
                          id="firstName"
                          value={displayContact.firstName}
                          onChange={(e) => setDisplayContact({
                            ...displayContact,
                            firstName: e.target.value
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">{t('contacts.profile.lastName')}</Label>
                        <Input
                          id="lastName"
                          value={displayContact.lastName}
                          onChange={(e) => setDisplayContact({
                            ...displayContact,
                            lastName: e.target.value
                          })}
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-2xl font-bold">{displayContact.firstName} {displayContact.lastName}</h2>
                      <p className="text-lg text-muted-foreground">{displayContact.role}</p>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2">
                    {displayContact.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className={getTagColor(tag)}>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </SheetHeader>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">{t('contacts.profile.tabs.overview')}</TabsTrigger>
            <TabsTrigger value="notes">{t('contacts.profile.tabs.notes')}</TabsTrigger>
            <TabsTrigger value="files">{t('contacts.profile.tabs.files')}</TabsTrigger>
            <TabsTrigger value="messages">{t('contacts.profile.tabs.messages')}</TabsTrigger>
            <TabsTrigger value="history">{t('contacts.profile.tabs.history')}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('contacts.profile.contactInformation')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">{t('contacts.profile.email')}</Label>
                      <Input
                        id="email"
                        type="email"
                        value={displayContact.email}
                        onChange={(e) => setDisplayContact({
                          ...displayContact,
                          email: e.target.value
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">{t('contacts.profile.phone')}</Label>
                      <Input
                        id="phone"
                        value={displayContact.phone}
                        onChange={(e) => setDisplayContact({
                          ...displayContact,
                          phone: e.target.value
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">{t('contacts.profile.role')}</Label>
                      <Input
                        id="role"
                        value={displayContact.role}
                        onChange={(e) => setDisplayContact({
                          ...displayContact,
                          role: e.target.value
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="company">{t('contacts.profile.company')}</Label>
                      <Input
                        id="company"
                        value={displayContact.company}
                        onChange={(e) => setDisplayContact({
                          ...displayContact,
                          company: e.target.value
                        })}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">{t('contacts.profile.email')}</p>
                          <p className="font-medium">{displayContact.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">{t('contacts.profile.phone')}</p>
                          <p className="font-medium">{displayContact.phone}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">{t('contacts.profile.company')}</p>
                          <p className="font-medium">{displayContact.company}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">{t('contacts.profile.location')}</p>
                          <p className="font-medium">{displayContact.country}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Activity Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('contacts.profile.activitySummary')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">{t('contacts.profile.created')}</p>
                      <p className="font-medium">{displayContact.createdDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">{t('contacts.profile.lastContacted')}</p>
                      <p className="font-medium">{displayContact.lastContacted}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {t('contacts.profile.notes.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder={t('contacts.profile.notes.placeholder')}
                    className="min-h-[120px]"
                    value={displayContact.notes || ''}
                    readOnly={!isEditing}
                    onChange={(e) => setDisplayContact({
                      ...displayContact,
                      notes: e.target.value
                    })}
                  />
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">{t('contacts.profile.notes.recentNotes')}</h4>
                    <div className="space-y-2">
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm">{t('contacts.profile.notes.note1')}</p>
                        <p className="text-xs text-muted-foreground mt-1">{t('contacts.profile.notes.timeAgo.2days')}</p>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm">{t('contacts.profile.notes.note2')}</p>
                        <p className="text-xs text-muted-foreground mt-1">{t('contacts.profile.notes.timeAgo.1week')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="files" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('contacts.profile.files.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>{t('contacts.profile.files.noFiles')}</p>
                  <Button variant="outline" className="mt-4">
                    {t('contacts.profile.files.uploadFiles')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  {t('contacts.profile.messages.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>{t('contacts.profile.messages.noMessages')}</p>
                  <Button variant="outline" className="mt-4">
                    {t('contacts.profile.messages.sendMessage')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('contacts.profile.history.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 border-l-2 border-blue-500 bg-blue-50">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{t('contacts.profile.history.contactCreated')}</p>
                      <p className="text-xs text-muted-foreground">{displayContact.createdDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border-l-2 border-green-500 bg-green-50">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{t('contacts.profile.history.emailSent')}</p>
                      <p className="text-xs text-muted-foreground">{t('contacts.profile.history.timeAgo.3days')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border-l-2 border-orange-500 bg-orange-50">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{t('contacts.profile.history.meetingScheduled')}</p>
                      <p className="text-xs text-muted-foreground">{t('contacts.profile.history.timeAgo.1week')}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
