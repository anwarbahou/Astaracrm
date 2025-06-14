
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter } from "lucide-react";
import type { NoteFilters as NoteFiltersType } from "@/types/note";

interface NoteFiltersProps {
  filters: NoteFiltersType;
  onFiltersChange: (filters: NoteFiltersType) => void;
}

export function NoteFilters({ filters, onFiltersChange }: NoteFiltersProps) {
  const availableTags = ["Strategy", "Q4", "Important", "Product", "Ideas", "Brainstorming", "Process", "Onboarding", "Checklist", "Research", "Competition", "Analysis", "Team", "Standup", "Daily", "Metrics", "Success"];

  const handleTagToggle = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    
    onFiltersChange({ ...filters, tags: newTags });
  };

  const handleTypeChange = (type: NoteFiltersType["type"]) => {
    onFiltersChange({ ...filters, type });
  };

  const handleVisibilityChange = (visibility: NoteFiltersType["visibility"]) => {
    onFiltersChange({ ...filters, visibility });
  };

  const handleSortChange = (sortBy: NoteFiltersType["sortBy"]) => {
    onFiltersChange({ ...filters, sortBy });
  };

  const activeFiltersCount = 
    filters.tags.length + 
    (filters.type !== "all" ? 1 : 0) + 
    (filters.visibility !== "all" ? 1 : 0);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter size={16} />
          Filters
          {activeFiltersCount > 0 && (
            <span className="bg-primary text-primary-foreground rounded-full text-xs px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end">
        <DropdownMenuLabel>Filter Notes</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Sort By */}
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
          Sort By
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup value={filters.sortBy} onValueChange={handleSortChange}>
          <DropdownMenuRadioItem value="modified">Last Modified</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="created">Date Created</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="title">Title</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        
        <DropdownMenuSeparator />
        
        {/* Type Filter */}
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
          Type
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup value={filters.type} onValueChange={handleTypeChange}>
          <DropdownMenuRadioItem value="all">All Types</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="general">General</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="meeting">Meeting</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="task">Task</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="idea">Idea</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        
        <DropdownMenuSeparator />
        
        {/* Visibility Filter */}
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
          Visibility
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup value={filters.visibility} onValueChange={handleVisibilityChange}>
          <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="public">Public</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="team">Team</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="private">Private</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        
        <DropdownMenuSeparator />
        
        {/* Tag Filter */}
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
          Tags
        </DropdownMenuLabel>
        <div className="max-h-32 overflow-y-auto">
          {availableTags.map((tag) => (
            <DropdownMenuCheckboxItem
              key={tag}
              checked={filters.tags.includes(tag)}
              onCheckedChange={() => handleTagToggle(tag)}
            >
              {tag}
            </DropdownMenuCheckboxItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
