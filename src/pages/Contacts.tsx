import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddContactModal } from "@/components/modals/AddContactModal";
import { ContactsTable, Contact } from "@/components/contacts/ContactsTable";
import { ContactProfileModal } from "@/components/contacts/ContactProfileModal";
import { contactsService } from "@/services/contactsService";
import { useAuth } from "@/contexts/AuthContext";

export default function Contacts() {
  const { t } = useTranslation();
  const { user, userProfile } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [addContactOpen, setAddContactOpen] = useState(false);
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
        userRole: userProfile.role
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
      await contactsService.updateContact(updatedContact.id, {
        firstName: updatedContact.firstName,
        lastName: updatedContact.lastName,
        email: updatedContact.email,
        phone: updatedContact.phone,
        role: updatedContact.role,
        company: updatedContact.company,
        country: updatedContact.country,
        status: updatedContact.status,
        tags: updatedContact.tags,
        notes: updatedContact.notes,
      }, {
        userId: user.id,
        userRole: userProfile.role
      });
      
      // Reload contacts to reflect changes
      await loadContacts();
    } catch (error) {
      console.error('Error saving contact:', error);
    }
  };

  const handleContactAdded = () => {
    // Reload contacts when a new contact is added
    loadContacts();
  };

  // Development helpers for testing admin functionality
  const handleSeedTestData = async () => {
    try {
      await contactsService.seedTestContacts(user?.id);
      await loadContacts();
      console.log('✅ Test data seeded successfully');
    } catch (error) {
      console.error('Error seeding test data:', error);
    }
  };

  const handleClearAllData = async () => {
    try {
      await contactsService.clearAllContacts();
      // Clear any remaining localStorage data
      localStorage.removeItem('crm_contacts');
      await loadContacts();
      console.log('✅ All contacts cleared');
    } catch (error) {
      console.error('Error clearing contacts:', error);
    }
  };

  const handleShowUserInfo = () => {
    console.log('=== Current User Info ===');
    console.log('User ID:', user?.id);
    console.log('User Email:', user?.email);
    console.log('User Role:', userProfile?.role);
    console.log('Is Admin:', userProfile?.role === 'admin');
    console.log('========================');
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
            {/* Development buttons for testing admin functionality */}
            {process.env.NODE_ENV === 'development' && (
              <>
                <Button variant="outline" size="sm" onClick={handleShowUserInfo}>
                  Show User Info
                </Button>
                <Button variant="outline" size="sm" onClick={handleSeedTestData}>
                  Seed Test Data
                </Button>
                <Button variant="outline" size="sm" onClick={handleClearAllData}>
                  Clear All
                </Button>
              </>
            )}
            <Button className="gap-2" onClick={() => setAddContactOpen(true)}>
              <Plus size={16} />
              {t('contacts.addContact')}
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

        {/* Contacts Table */}
        <ContactsTable
          contacts={contacts}
          onContactClick={handleContactClick}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filters={filters}
          onFiltersChange={setFilters}
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
    </>
  );
}
