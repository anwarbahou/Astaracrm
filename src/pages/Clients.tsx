
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddClientModal } from "@/components/modals/AddClientModal";
import { ClientsTable, Client } from "@/components/clients/ClientsTable";
import { ClientProfileModal } from "@/components/clients/ClientProfileModal";
import { ClientFiltersPanel } from "@/components/clients/ClientFiltersPanel";

export default function Clients() {
  const [searchQuery, setSearchQuery] = useState("");
  const [addClientOpen, setAddClientOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    owner: '',
    stage: '',
    industry: '',
    country: '',
    status: '',
    tags: [] as string[],
    dateCreatedFrom: '',
    dateCreatedTo: '',
    lastInteractionFrom: '',
    lastInteractionTo: '',
  });

  // Mock client data with enhanced fields
  const [clients] = useState<Client[]>([
    {
      id: 1,
      name: "Acme Corporation",
      email: "contact@acme.com",
      phone: "+212 661 234567",
      industry: "Technology",
      stage: "Active",
      tags: ["VIP", "Enterprise"],
      owner: "John Smith",
      country: "Morocco",
      contactsCount: 5,
      totalDealValue: 1450000,
      createdDate: "2023-01-15",
      lastInteraction: "2 days ago",
      status: "Active",
      avatar: "",
      notes: "Key client in the technology sector. Interested in expanding their digital infrastructure."
    },
    {
      id: 2,
      name: "Tech Solutions Ltd",
      email: "info@techsolutions.com",
      phone: "+212 661 987654",
      industry: "Technology",
      stage: "Active",
      tags: ["High Value", "SMB"],
      owner: "Sarah Johnson",
      country: "France",
      contactsCount: 3,
      totalDealValue: 895000,
      createdDate: "2023-03-20",
      lastInteraction: "1 week ago",
      status: "Active",
      avatar: "",
      notes: "Growing tech company looking for innovative solutions."
    },
    {
      id: 3,
      name: "Global Industries",
      email: "contact@global.com",
      phone: "+212 661 456789",
      industry: "Manufacturing",
      stage: "Inactive",
      tags: ["International"],
      owner: "Mike Wilson",
      country: "Spain",
      contactsCount: 2,
      totalDealValue: 230000,
      createdDate: "2022-11-10",
      lastInteraction: "3 weeks ago",
      status: "Active",
      avatar: "",
      notes: "Manufacturing company with operations across Europe."
    },
    {
      id: 4,
      name: "HealthCare Plus",
      email: "admin@healthcareplus.com",
      phone: "+212 661 321098",
      industry: "Healthcare",
      stage: "Active",
      tags: ["Healthcare", "Critical"],
      owner: "Emily Davis",
      country: "Morocco",
      contactsCount: 8,
      totalDealValue: 672000,
      createdDate: "2023-06-05",
      lastInteraction: "Yesterday",
      status: "Active",
      avatar: "",
      notes: "Leading healthcare provider focused on digital transformation."
    },
    {
      id: 5,
      name: "Financial Services Corp",
      email: "contact@finserv.com",
      phone: "+212 661 654321",
      industry: "Finance",
      stage: "Prospect",
      tags: ["Finance", "Urgent"],
      owner: "David Brown",
      country: "UAE",
      contactsCount: 4,
      totalDealValue: 0,
      createdDate: "2024-01-12",
      lastInteraction: "1 month ago",
      status: "Active",
      avatar: "",
      notes: "Potential client in the financial services sector."
    },
    {
      id: 6,
      name: "Retail Masters",
      email: "hello@retailmasters.com",
      phone: "+212 661 789012",
      industry: "Retail",
      stage: "Lead",
      tags: ["Retail", "SMB"],
      owner: "John Smith",
      country: "Morocco",
      contactsCount: 2,
      totalDealValue: 125000,
      createdDate: "2024-02-28",
      lastInteraction: "5 days ago",
      status: "Active",
      avatar: "",
      notes: "Retail chain looking to modernize their systems."
    },
    {
      id: 7,
      name: "Education Excellence",
      email: "info@eduexcellence.com",
      phone: "+212 661 345678",
      industry: "Education",
      stage: "Active",
      tags: ["Education", "Non-profit"],
      owner: "Sarah Johnson",
      country: "Morocco",
      contactsCount: 6,
      totalDealValue: 445000,
      createdDate: "2023-09-15",
      lastInteraction: "3 days ago",
      status: "Active",
      avatar: "",
      notes: "Educational institution focused on improving learning outcomes."
    },
    {
      id: 8,
      name: "Consulting Pro",
      email: "team@consultingpro.com",
      phone: "+212 661 567890",
      industry: "Consulting",
      stage: "Active",
      tags: ["Consulting", "Strategic"],
      owner: "Mike Wilson",
      country: "France",
      contactsCount: 3,
      totalDealValue: 780000,
      createdDate: "2023-04-22",
      lastInteraction: "1 week ago",
      status: "Active",
      avatar: "",
      notes: "Strategic consulting firm specializing in digital transformation."
    }
  ]);

  const handleClientClick = (client: Client) => {
    setSelectedClient(client);
    setProfileModalOpen(true);
  };

  const handleSaveClient = (updatedClient: Client) => {
    // In a real app, this would update the client in the database
    console.log('Saving client:', updatedClient);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const totalRevenue = clients.reduce((sum, client) => sum + client.totalDealValue, 0);

  return (
    <>
      <div className="space-y-6 animate-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Client Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage your client relationships and track business growth.
            </p>
          </div>
          <Button className="gap-2" onClick={() => setAddClientOpen(true)}>
            <Plus size={16} />
            Add Client
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold">{clients.length}</p>
                <p className="text-sm text-muted-foreground">Total Clients</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold">{clients.filter(c => c.stage === "Active").length}</p>
                <p className="text-sm text-muted-foreground">Active Clients</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold">{clients.filter(c => c.stage === "Prospect").length}</p>
                <p className="text-sm text-muted-foreground">Prospects</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters Panel */}
        <ClientFiltersPanel
          isOpen={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          filters={filters}
          onFiltersChange={setFilters}
        />

        {/* Clients Table */}
        <ClientsTable
          clients={clients}
          onClientClick={handleClientClick}
          onFiltersToggle={() => setFiltersOpen(!filtersOpen)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* Modals */}
      <AddClientModal open={addClientOpen} onOpenChange={setAddClientOpen} />
      
      <ClientProfileModal
        client={selectedClient}
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
        onSave={handleSaveClient}
      />
    </>
  );
}
