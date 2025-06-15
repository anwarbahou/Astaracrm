
import { AddClientModal } from "@/components/modals/AddClientModal";
import { ClientsTable } from "@/components/clients/ClientsTable";
import { ClientProfileModal } from "@/components/clients/ClientProfileModal";
import { useClients } from "@/hooks/useClients";
import { ClientsPageHeader } from "@/components/clients/ClientsPageHeader";
import { ClientStats } from "@/components/clients/ClientStats";

export default function Clients() {
  const {
    clients,
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
  } = useClients();

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
