import { Card, CardContent } from "@/components/ui/card";
import { useUsersForSelection } from '@/hooks/useUsers';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/contexts/AuthContext';

interface TaskFiltersProps {
  selectedOwners: string[];
  onSelectOwner: (ownerId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedRelatedEntity: string;
  setSelectedRelatedEntity: (entity: string) => void;
  selectedPriority: string;
  setSelectedPriority: (priority: string) => void;
}

export function TaskFilters({
  selectedOwners,
  onSelectOwner,
  searchQuery,
  setSearchQuery,
  selectedRelatedEntity,
  setSelectedRelatedEntity,
  selectedPriority,
  setSelectedPriority,
}: TaskFiltersProps) {
  const { users, isLoading: isLoadingUsers } = useUsersForSelection();
  const { userProfile } = useAuth();

  if (isLoadingUsers) {
    return null; // Or a loading spinner
  }

  return (
    <Card>
      <CardContent className="p-6 flex items-center gap-4">
        <div className="relative w-[300px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center -space-x-2">
          <TooltipProvider>
            {users.map((user, index) => (
              <Tooltip key={user.id}>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      "relative cursor-pointer rounded-full transition-transform duration-200 hover:scale-105",
                      selectedOwners.includes(user.id) ? "ring-2 ring-primary ring-offset-2" : "",
                      "p-0.5"
                    )}
                    onClick={() => onSelectOwner(user.id)}
                    style={{ zIndex: users.length - index }}
                  >
                    <Avatar className="h-8 w-8 rounded-full border-2 border-background">
                      <AvatarImage src={user.avatar_url || ''} />
                      <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                    </Avatar>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{user.name}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>

        {/* Related Entity Filter */}
        <div className="relative">
          {selectedRelatedEntity !== "" && (
            <Badge variant="secondary" className="absolute -top-2 -right-2 z-10 text-xs px-1 py-0.5">
              {selectedRelatedEntity.charAt(0).toUpperCase() + selectedRelatedEntity.slice(1)}
            </Badge>
          )}
          <Select
            value={selectedRelatedEntity}
            onValueChange={setSelectedRelatedEntity}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Related To" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Related Entities</SelectItem>
              <SelectItem value="client">Client</SelectItem>
              <SelectItem value="contact">Contact</SelectItem>
              <SelectItem value="deal">Deal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Priority Filter */}
        <div className="relative">
          {selectedPriority !== "" && (
            <Badge variant="secondary" className="absolute -top-2 -right-2 z-10 text-xs px-1 py-0.5">
              {selectedPriority.charAt(0).toUpperCase() + selectedPriority.slice(1)}
            </Badge>
          )}
          <Select
            value={selectedPriority}
            onValueChange={setSelectedPriority}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
