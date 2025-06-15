
import React from 'react';
import { Client, ClientFilters } from '@/types/client';
import { useClientTable } from '@/hooks/useClientTable';
import { ClientsTableHeader } from './table/ClientsTableHeader';
import { ClientsTableContent } from './table/ClientsTableContent';
import { ClientsTablePagination } from './table/ClientsTablePagination';
import { Card, CardContent } from "@/components/ui/card";

interface ClientsTableProps {
  clients: Client[];
  onClientClick: (client: Client) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: ClientFilters;
  onFiltersChange: (filters: ClientFilters) => void;
}

export function ClientsTable({ 
  clients, 
  onClientClick, 
  searchQuery, 
  onSearchChange,
  filters,
  onFiltersChange,
}: ClientsTableProps) {
  const {
    sortField,
    sortDirection,
    currentPage,
    rowsPerPage,
    paginatedClients,
    totalPages,
    filteredAndSortedClients,
    handleSort,
    setCurrentPage,
    setRowsPerPage,
  } = useClientTable({ clients, searchQuery, filters });

  return (
    <div className="space-y-4">
      <ClientsTableHeader 
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        filters={filters}
        onFiltersChange={onFiltersChange}
      />
      
      <Card>
        <CardContent className="p-0">
          <ClientsTableContent
            clients={paginatedClients}
            onClientClick={onClientClick}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
          {filteredAndSortedClients.length > 0 && (
            <ClientsTablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              rowsPerPage={rowsPerPage}
              totalRows={filteredAndSortedClients.length}
              onPageChange={setCurrentPage}
              onRowsPerPageChange={setRowsPerPage}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
