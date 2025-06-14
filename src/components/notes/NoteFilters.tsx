
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
          {t('notes.filters.button')}
          {activeFiltersCount > 0 && (
            <span className="bg-primary text-primary-foreground rounded-full text-xs px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end">
        <DropdownMenuLabel>{t('notes.filters.title')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Sort By */}
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
          {t('notes.filters.sortBy.label')}
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup value={filters.sortBy} onValueChange={handleSortChange}>
          <DropdownMenuRadioItem value="modified">{t('notes.filters.sortBy.modified')}</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="created">{t('notes.filters.sortBy.created')}</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="title">{t('notes.filters.sortBy.title')}</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        
        <DropdownMenuSeparator />
        
        {/* Type Filter */}
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
          {t('notes.filters.type.label')}
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup value={filters.type} onValueChange={handleTypeChange}>
          <DropdownMenuRadioItem value="all">{t('notes.filters.type.all')}</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="general">{t('notes.noteType.general')}</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="meeting">{t('notes.noteType.meeting')}</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="task">{t('notes.noteType.task')}</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="idea">{t('notes.noteType.idea')}</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        
        <DropdownMenuSeparator />
        
        {/* Visibility Filter */}
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
          {t('notes.filters.visibility.label')}
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup value={filters.visibility} onValueChange={handleVisibilityChange}>
          <DropdownMenuRadioItem value="all">{t('notes.filters.visibility.all')}</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="public">{t('notes.visibility.public')}</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="team">{t('notes.visibility.team')}</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="private">{t('notes.visibility.private')}</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        
        <DropdownMenuSeparator />
        
        {/* Tag Filter */}
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
          {t('notes.filters.tags.label')}
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
