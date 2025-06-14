
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, LogOut } from "lucide-react";
import { AddClientModal } from "@/components/modals/AddClientModal";
import { ClientsTable } from "@/components/clients/ClientsTable";
import { ClientProfileModal } from "@/components/clients/ClientProfileModal";
import { ClientFiltersPanel } from "@/components/clients/ClientFiltersPanel";
import { useClients } from "@/hooks/useClients";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { Database } from '@/integrations/supabase/types';

type Client = Database['public']['Tables']['clients']['Row'];

// Transform database client to match the existing Client interface
const transformClientForTable = (dbClient: Client, index: number) => ({
  id: index + 1, // Use index as numeric ID for the table
  dbId: dbClient.id, // Keep the actual database ID for operations
  name: dbClient.name || '',
  email: dbClient.email || '',
  phone: dbClient.phone || '',
  industry: dbClient.industry || '',
  stage: dbClient.stage || 'lead',
  tags: dbClient.tags || [],
  owner: 'Current User', // We'll enhance this later when we have user profiles
  country: dbClient.country || '',
  contactsCount: dbClient.contacts_count || 0,
  totalDealValue: Number(dbClient.total_deal_value) || 0,
  createdDate: dbClient.created_at ? new Date(dbClient.created_at).toLocaleDateString() : '',
  lastInteraction: 'Recently', // We'll enhance this later with actual interaction data
  status: dbClient.status === 'active' ? 'Active' as const : 'Archived' as const,
  avatar: dbClient.avatar_url || "",
  notes: dbClient.notes || ""
});

export default function Clients() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { clients: dbClients, loading, addClient, updateClient } = useClients();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [addClientOpen, setAddClientOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
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

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to auth if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Transform database clients for the table
  const clients = dbClients.map((dbClient, index) => transformClientForTable(dbClient, index));

  const handleClientClick = (client: any) => {
    // Find the original database client using dbId
    const dbClient = dbClients.find(db => db.id === client.dbId);
    if (dbClient) {
      setSelectedClient({
        ...client,
        id: dbClient.id, // Use the actual database ID for operations
        address: dbClient.address || '',
        website: dbClient.website || ''
      });
      setProfileModalOpen(true);
    }
  };

  const handleSaveClient = async (updatedClient: any) => {
    try {
      await updateClient(updatedClient.id, {
        name: updatedClient.name,
        email: updatedClient.email,
        phone: updatedClient.phone,
        industry: updatedClient.industry,
        stage: updatedClient.stage,
        tags: updatedClient.tags,
        country: updatedClient.country,
        notes: updatedClient.notes,
        address: updatedClient.address,
        website: updatedClient.website,
      });
    } catch (error) {
      console.error('Error updating client:', error);
    }
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const totalRevenue = clients.reduce((sum, client) => sum + client.totalDealValue, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSignOut} className="gap-2">
              <LogOut size={16} />
              Sign Out
            </Button>
            <Button className="gap-2" onClick={() => setAddClientOpen(true)}>
              <Plus size={16} />
              Add Client
            </Button>
          </div>
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
                <p className="text-2xl font-bold">{clients.filter(c => c.stage === "active").length}</p>
                <p className="text-sm text-muted-foreground">Active Clients</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold">{clients.filter(c => c.stage === "prospect").length}</p>
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
      <AddClientModal 
        open={addClientOpen} 
        onOpenChange={setAddClientOpen}
        onClientAdded={() => {
          // The useClients hook will automatically refetch and update the state
        }}
      />
      
      <ClientProfileModal
        client={selectedClient}
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
        onSave={handleSaveClient}
      />
    </>
  );
}
