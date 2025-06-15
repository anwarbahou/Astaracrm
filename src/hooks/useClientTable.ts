
import { useState, useMemo } from 'react';
import { Client, ClientFilters } from '@/types/client';

type SortField = keyof Client;
type SortDirection = 'asc' | 'desc';

interface UseClientTableProps {
  clients: Client[];
  searchQuery: string;
  filters: ClientFilters;
  initialSortField?: SortField;
  initialSortDirection?: SortDirection;
}

export const useClientTable = ({ 
  clients, 
  searchQuery, 
  filters,
  initialSortField = 'name',
  initialSortDirection = 'asc',
}: UseClientTableProps) => {
  const [sortField, setSortField] = useState<SortField>(initialSortField);
  const [sortDirection, setSortDirection] = useState<SortDirection>(initialSortDirection);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedClients = useMemo(() => {
    let filtered = clients.filter(client => {
      const searchMatch =
        searchQuery === '' ||
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.owner.toLowerCase().includes(searchQuery.toLowerCase());

      const ownerMatch = !filters.owner || client.owner === filters.owner;
      const stageMatch = !filters.stage || client.stage === filters.stage;
      const industryMatch = !filters.industry || client.industry === filters.industry;
      const countryMatch = !filters.country || client.country === filters.country;
      const statusMatch = !filters.status || client.status === filters.status;
      const tagsMatch = filters.tags.length === 0 || filters.tags.every(tag => client.tags.includes(tag));
      const createdFromMatch = !filters.dateCreatedFrom || new Date(client.createdDate) >= new Date(filters.dateCreatedFrom);
      const createdToMatch = !filters.dateCreatedTo || new Date(client.createdDate) <= new Date(filters.dateCreatedTo);
      const lastInteractionFromMatch = !filters.lastInteractionFrom || new Date(client.lastInteraction) >= new Date(filters.lastInteractionFrom);
      const lastInteractionToMatch = !filters.lastInteractionTo || new Date(client.lastInteraction) <= new Date(filters.lastInteractionTo);

      return searchMatch && ownerMatch && stageMatch && industryMatch && countryMatch && statusMatch && tagsMatch && createdFromMatch && createdToMatch && lastInteractionFromMatch && lastInteractionToMatch;
    });

    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });

    return filtered;
  }, [clients, searchQuery, sortField, sortDirection, filters]);

  const paginatedClients = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredAndSortedClients.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredAndSortedClients, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedClients.length / rowsPerPage);

  return {
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
  };
};
