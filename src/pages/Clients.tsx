
import { AddClientModal } from "@/components/modals/AddClientModal";
import { ClientsTable } from "@/components/clients/ClientsTable";
import { ClientProfileModal } from "@/components/clients/ClientProfileModal";
import { ClientFiltersPanel } from "@/components/clients/ClientFiltersPanel";
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
    filtersOpen,
    setFiltersOpen,
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

        <ClientFiltersPanel
          isOpen={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          filters={filters}
          onFiltersChange={setFilters}
        />

        <ClientsTable
          clients={clients}
          onClientClick={handleClientClick}
          onFiltersToggle={() => setFiltersOpen(!filtersOpen)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
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
