import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddContactModal } from "@/components/modals/AddContactModal";
import { ContactsTable, Contact } from "@/components/contacts/ContactsTable";
import { ContactProfileModal } from "@/components/contacts/ContactProfileModal";
import { ContactFiltersPanel } from "@/components/contacts/ContactFiltersPanel";

export default function Contacts() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [addContactOpen, setAddContactOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
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

  // Enhanced mock contact data
  const [contacts] = useState<Contact[]>([
    {
      id: 1,
      firstName: "John",
      lastName: "Smith",
      email: "john@acme.com",
      phone: "+212 661 234567",
      role: "CEO",
      company: "Acme Corporation",
      tags: ["Decision Maker", "VIP"],
      country: "Morocco",
      status: "Active",
      createdDate: "2023-01-15",
      lastContacted: "2 days ago",
      avatar: "",
      notes: "Key decision maker for technology investments. Very interested in our CRM platform."
    },
    {
      id: 2,
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah@techsolutions.com",
      phone: "+33 1 42 86 83 02",
      role: "CTO",
      company: "Tech Solutions Ltd",
      tags: ["Technical", "Decision Maker"],
      country: "France",
      status: "Active",
      createdDate: "2023-03-20",
      lastContacted: "1 week ago",
      avatar: "",
      notes: "Technical lead evaluating our software solutions."
    },
    {
      id: 3,
      firstName: "Mike",
      lastName: "Chen",
      email: "mike@global.com",
      phone: "+34 91 123 4567",
      role: "Procurement Manager",
      company: "Global Industries",
      tags: ["Procurement"],
      country: "Spain",
      status: "Inactive",
      createdDate: "2022-11-10",
      lastContacted: "3 weeks ago",
      avatar: "",
      notes: "Handles procurement decisions for European operations."
    },
    {
      id: 4,
      firstName: "Emily",
      lastName: "Davis",
      email: "emily@startupxyz.com",
      phone: "+1 555 987 6543",
      role: "Founder",
      company: "StartupXYZ",
      tags: ["Founder", "Startup"],
      country: "USA",
      status: "Active",
      createdDate: "2023-06-05",
      lastContacted: "Yesterday",
      avatar: "",
      notes: "Startup founder looking for scalable CRM solutions."
    },
    {
      id: 5,
      firstName: "David",
      lastName: "Wilson",
      email: "david@enterprise.com",
      phone: "+971 4 123 4567",
      role: "VP Sales",
      company: "Enterprise Corp",
      tags: ["Sales", "VIP"],
      country: "UAE",
      status: "Active",
      createdDate: "2024-01-12",
      lastContacted: "1 month ago",
      avatar: "",
      notes: "Sales VP interested in pipeline management features."
    },
    {
      id: 6,
      firstName: "Lisa",
      lastName: "Anderson",
      email: "lisa@acme.com",
      phone: "+212 661 345678",
      role: "CTO",
      company: "Acme Corporation",
      tags: ["Technical", "Decision Maker"],
      country: "Morocco",
      status: "Active",
      createdDate: "2023-09-15",
      lastContacted: "3 days ago",
      avatar: "",
      notes: "Technical decision maker for IT infrastructure projects."
    },
    {
      id: 7,
      firstName: "Robert",
      lastName: "Garcia",
      email: "robert@consulting.com",
      phone: "+44 20 7946 0958",
      role: "Senior Consultant",
      company: "Consulting Pro",
      tags: ["Consulting"],
      country: "UK",
      status: "Active",
      createdDate: "2023-04-22",
      lastContacted: "5 days ago",
      avatar: "",
      notes: "Consultant specializing in digital transformation projects."
    },
    {
      id: 8,
      firstName: "Maria",
      lastName: "Rodriguez",
      email: "maria@healthcare.com",
      phone: "+212 661 567890",
      role: "IT Director",
      company: "HealthCare Plus",
      tags: ["Healthcare", "Technical"],
      country: "Morocco",
      status: "Active",
      createdDate: "2023-07-30",
      lastContacted: "2 weeks ago",
      avatar: "",
      notes: "IT Director overseeing healthcare technology initiatives."
    },
    {
      id: 9,
      firstName: "James",
      lastName: "Brown",
      email: "james@retail.com",
      phone: "+49 30 12345678",
      role: "Operations Manager",
      company: "Retail Masters",
      tags: ["Retail", "Operations"],
      country: "Germany",
      status: "Inactive",
      createdDate: "2022-12-08",
      lastContacted: "2 months ago",
      avatar: "",
      notes: "Operations manager for retail chain modernization project."
    },
    {
      id: 10,
      firstName: "Anna",
      lastName: "Schmidt",
      email: "anna@fintech.com",
      phone: "+41 44 123 4567",
      role: "Product Manager",
      company: "FinTech Solutions",
      tags: ["Finance", "Product"],
      country: "Switzerland",
      status: "Active",
      createdDate: "2024-02-14",
      lastContacted: "4 days ago",
      avatar: "",
      notes: "Product manager for financial technology solutions."
    }
  ]);

  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact);
    setProfileModalOpen(true);
  };

  const handleSaveContact = (updatedContact: Contact) => {
    // In a real app, this would update the contact in the database
    console.log('Saving contact:', updatedContact);
  };

  return (
    <>
      <div className="space-y-6 animate-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t('contacts.title')}</h1>
            <p className="text-muted-foreground mt-1">
              {t('contacts.description')}
            </p>
          </div>
          <Button className="gap-2" onClick={() => setAddContactOpen(true)}>
            <Plus size={16} />
            {t('contacts.addContact')}
          </Button>
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

        {/* Filters Panel */}
        <ContactFiltersPanel
          isOpen={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          filters={filters}
          onFiltersChange={setFilters}
        />

        {/* Contacts Table */}
        <ContactsTable
          contacts={contacts}
          onContactClick={handleContactClick}
          onFiltersToggle={() => setFiltersOpen(!filtersOpen)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* Modals */}
      <AddContactModal open={addContactOpen} onOpenChange={setAddContactOpen} />
      
      <ContactProfileModal
        contact={selectedContact}
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
        onSave={handleSaveContact}
      />
    </>
  );
}
