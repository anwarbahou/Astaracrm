import { AddClientModal } from "@/components/modals/AddClientModal";
import { ClientsTable } from "@/components/clients/ClientsTable";
import { ClientProfileModal } from "@/components/clients/ClientProfileModal";
import { useClients } from "@/hooks/useClients";
import { withPageTitle } from '@/components/withPageTitle';
import { ClientsPageHeader } from "@/components/clients/ClientsPageHeader";
import { ClientStats } from "@/components/clients/ClientStats";
import { ImportClientsModal } from "@/components/clients/ImportClientsModal";
import { Client } from "@/types/client";
import type { ClientInput } from "@/services/clientService";
import { ClientService } from "@/services/clientService";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { TableSkeleton } from "@/components/ui/skeleton-loader";
import { useLocation } from 'react-router-dom';

function Clients() {
  const {
    clients,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    addClientOpen,
    setAddClientOpen,
    selectedClient,
    profileModalOpen,
    setProfileModalOpen,
    filters,
    setFilters,
    handleClientClick,
    handleSaveClient,
    refreshClients,
  } = useClients();

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    if (user?.id && userProfile?.role && location.pathname === '/dashboard/clients') {
      refreshClients();
    }
  }, [user?.id, userProfile?.role, location.pathname]);

  const handleImportClients = async (newClients: Omit<Client, 'id' | 'created_at' | 'updated_at'>[]) => {
    if (!user?.id || !userProfile?.role) {
      toast({
        title: "Authentication Error",
        description: "User not authenticated. Please log in again.",
        variant: "destructive",
      });
      return;
    }
    try {
      await ClientService.importClients(newClients as unknown as ClientInput[], {
        userId: user.id,
        userRole: userProfile.role as 'user' | 'admin' | 'manager',
      });
      await refreshClients();
      toast({
        title: "Clients Imported",
        description: `${newClients.length} clients imported successfully.`,
      });
    } catch (error: any) {
      console.error("Error importing clients:", error);
      toast({
        title: "Import Error",
        description: error.message || "Failed to import clients.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-in">
        <ClientsPageHeader 
          onAddClient={() => setAddClientOpen(true)}
          onImportClients={() => setIsImportModalOpen(true)}
        />
        <div className="flex items-center justify-center py-12">
          <TableSkeleton rows={8} columns={6} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 animate-in">
        <ClientsPageHeader 
          onAddClient={() => setAddClientOpen(true)}
          onImportClients={() => setIsImportModalOpen(true)}
        />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-destructive mb-4">Error loading clients: {error}</p>
            <button 
              onClick={() => refreshClients()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 animate-in">
        <ClientsPageHeader 
          onAddClient={() => setAddClientOpen(true)}
          onImportClients={() => setIsImportModalOpen(true)}
        />

        <ClientStats clients={clients} />

        <ClientsTable
          clients={clients}
          onClientClick={handleClientClick}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filters={filters}
          onFiltersChange={setFilters}
        />
      </div>

      <AddClientModal 
        open={addClientOpen} 
        onOpenChange={setAddClientOpen}
        onClientAdded={refreshClients}
      />
      
      <ClientProfileModal
        clientId={selectedClient?.id || null}
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
        onSave={() => refreshClients()}
        onDelete={() => refreshClients()}
      />

      <ImportClientsModal
        open={isImportModalOpen}
        onOpenChange={setIsImportModalOpen}
        onImport={handleImportClients}
      />
    </>
  );
}

export default withPageTitle(Clients, 'clients');
