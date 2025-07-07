export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  relatedEntityType: 'client' | 'contact' | 'deal' | null;
  relatedEntityId: string | null;
  ownerId: string;
  owner?: string;
  priority: 'low' | 'medium' | 'high' | null;
  status: 'active' | 'archived' | 'completed' | null;
}

export interface NoteFilters {
  search: string;
  tags: string[];
  relatedEntityType: "all" | "client" | "contact" | "deal";
  isPinned: "all" | "pinned" | "unpinned";
  sortBy: "created" | "modified" | "title";
  dateRange: { start: string; end: string } | null;
  priority: 'low' | 'medium' | 'high' | null;
  status: 'active' | 'archived' | 'completed' | null;
}

export interface NoteInput {
  title: string;
  content: string;
  tags?: string[];
  is_pinned?: boolean;
  related_entity_type?: 'client' | 'contact' | 'deal' | null;
  related_entity_id?: string | null;
  owner_id: string;
  priority?: 'low' | 'medium' | 'high' | null;
  status?: 'active' | 'archived' | 'completed' | null;
}
