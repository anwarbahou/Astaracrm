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

interface TaskFiltersProps {
  selectedOwners: string[];
  onSelectOwner: (ownerId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function TaskFilters({
  selectedOwners,
  onSelectOwner,
  searchQuery,
  setSearchQuery,
}: TaskFiltersProps) {
  const { users, isLoading: isLoadingUsers } = useUsersForSelection();

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
      </CardContent>
    </Card>
  );
}
