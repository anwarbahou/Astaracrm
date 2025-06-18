import { AddClientModal } from "@/components/modals/AddClientModal";
import { ClientsTable } from "@/components/clients/ClientsTable";
import { ClientProfileModal } from "@/components/clients/ClientProfileModal";
import { useClients } from "@/hooks/useClients";
import { ClientsPageHeader } from "@/components/clients/ClientsPageHeader";
import { ClientStats } from "@/components/clients/ClientStats";

export default function Clients() {
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

  if (loading) {
    return (
      <div className="space-y-6 animate-in">
        <ClientsPageHeader onAddClient={() => setAddClientOpen(true)} />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading clients...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 animate-in">
        <ClientsPageHeader onAddClient={() => setAddClientOpen(true)} />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-destructive mb-4">Error loading clients: {error}</p>
            <button 
              onClick={refreshClients}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 animate-in">
        <ClientsPageHeader onAddClient={() => setAddClientOpen(true)} />

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
        onSave={refreshClients}
      />
    </>
  );
}
