import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import { AddContactModal } from "@/components/modals/AddContactModal";
import { ContactsCardGrid } from "@/components/contacts/ContactsCardGrid";
import { ContactProfileModal } from "@/components/contacts/ContactProfileModal";
import { contactsService } from "@/services/contactsService";
import { useAuth } from "@/contexts/AuthContext";
import { ImportContactsModal } from "@/components/contacts/ImportContactsModal";
import { useToast } from "@/hooks/use-toast";
import { Contact } from "@/components/contacts/ContactsTable";

export default function Contacts() {
  const { t } = useTranslation();
  const { user, userProfile } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [addContactOpen, setAddContactOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    company: '',
    role: '',
    country: '',
    status: '',
    tags: [] as string[],
    dateCreatedFrom: '',
    dateCreatedTo: '',
    lastContactedFrom: '',
    lastContactedTo: '',
  });
  const { toast } = useToast();

  // Load contacts on component mount
  useEffect(() => {
    if (user?.id && userProfile?.role) {
      loadContacts();
    }
  }, [user?.id, userProfile?.role]);

  const loadContacts = async () => {
    if (!user?.id || !userProfile?.role) return;
    
    try {
      setIsLoading(true);
      const fetchedContacts = await contactsService.getContacts({
        userId: user.id,
        userRole: userProfile.role as 'user' | 'admin' | 'manager'
      });
      setContacts(fetchedContacts);
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact);
    setProfileModalOpen(true);
  };

  const handleSaveContact = async (updatedContact: Contact) => {
    if (!user?.id || !userProfile?.role) return;
    
    try {
      // Reload contacts to reflect changes
      await loadContacts();
    } catch (error) {
      console.error('Error reloading contacts:', error);
    }
  };

  const handleContactAdded = (newContact: Contact) => {
    setContacts(prev => [newContact, ...prev]);
    // Optionally, reload in the background for sync
    loadContacts();
  };

  const handleImportContacts = async (newContacts: Omit<Contact, 'id' | 'created_at' | 'updated_at'>[]): Promise<number> => {
    if (!user?.id || !userProfile?.role) return 0;
    try {
      const inserted = await contactsService.importContacts(newContacts, { userId: user.id, userRole: userProfile.role as 'user' | 'admin' | 'manager' });
      await loadContacts();
      toast({
        title: inserted > 0 ? 'Contacts Imported' : 'No New Contacts',
        description: inserted > 0
          ? `${inserted} new contacts imported successfully.`
          : 'All provided emails already exist, nothing was added.',
      });
      return inserted;
    } catch (error: any) {
      console.error("Error importing contacts:", error);
      toast({
        title: 'Import Error',
        description: error.message || 'Failed to import contacts.',
        variant: 'destructive',
      });
      return 0;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-muted-foreground">{t('contacts.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 animate-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t('contacts.title')}</h1>
            <p className="text-muted-foreground mt-1">
              {t('contacts.description')}
              {userProfile?.role === 'admin' && (
                <span className="block text-sm text-primary font-medium mt-1">
                  Admin view: Showing all contacts from all users
                </span>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <Button className="gap-2" onClick={() => setAddContactOpen(true)}>
              <Plus size={16} />
              {t('contacts.addContact')}
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => setIsImportModalOpen(true)}>
              <Upload size={16} />
              {t('contacts.importContacts')}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold">{contacts.length}</p>
                <p className="text-sm text-muted-foreground">{t('contacts.stats.total')}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold">{contacts.filter(c => c.status === "Active").length}</p>
                <p className="text-sm text-muted-foreground">{t('contacts.stats.active')}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold">{contacts.filter(c => c.tags.includes("Decision Maker")).length}</p>
                <p className="text-sm text-muted-foreground">{t('contacts.stats.decisionMakers')}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold">{new Set(contacts.map(c => c.company)).size}</p>
                <p className="text-sm text-muted-foreground">{t('contacts.stats.companies')}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contacts Grid */}
        <ContactsCardGrid
          contacts={contacts}
          onContactClick={handleContactClick}
        />
      </div>

      {/* Modals */}
      <AddContactModal 
        open={addContactOpen} 
        onOpenChange={setAddContactOpen}
        onContactAdded={handleContactAdded}
      />
      
      <ContactProfileModal
        contact={selectedContact}
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
        onSave={handleSaveContact}
      />
      <ImportContactsModal
        open={isImportModalOpen}
        onOpenChange={setIsImportModalOpen}
        onImport={handleImportContacts}
      />
    </>
  );
}
