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
}

export interface NoteFilters {
  tags: string[];
  relatedEntityType: "all" | "client" | "contact" | "deal";
  isPinned: "all" | "pinned" | "unpinned";
  sortBy: "created" | "modified" | "title";
}
