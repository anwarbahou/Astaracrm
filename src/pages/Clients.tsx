import { AddClientModal } from "@/components/modals/AddClientModal";
import { ClientsTable } from "@/components/clients/ClientsTable";
import { ClientsCardView } from "@/components/clients/ClientsCardView";
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
import { useTranslation } from 'react-i18next';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

function Clients() {
  const { t } = useTranslation();
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
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
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

  const handleDeleteClient = async (client: Client) => {
    setClientToDelete(client);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteClient = async () => {
    if (!clientToDelete) return;

    setIsDeleting(true);
    try {
      const success = await ClientService.deleteClient(clientToDelete.id);
      if (success) {
        toast({
          title: "Client Deleted",
          description: `${clientToDelete.name} has been deleted successfully.`,
        });
        await refreshClients();
      } else {
        toast({
          title: "Delete Error",
          description: "Failed to delete client.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error deleting client:", error);
      toast({
        title: "Delete Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setClientToDelete(null);
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
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
        
        {viewMode === 'card' && (
          <ClientsCardView
            clients={clients}
            onClientClick={handleClientClick}
            onEditClient={(client) => {
              handleClientClick(client);
              setProfileModalOpen(true);
            }}
            onDeleteClient={handleDeleteClient}
          />
        )}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('clients.deleteDialog.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('clients.deleteDialog.description', { name: clientToDelete?.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {t('clients.deleteDialog.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteClient}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('clients.deleteDialog.deleting')}
                </>
              ) : (
                t('clients.deleteDialog.confirm')
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default withPageTitle(Clients, 'clients');
