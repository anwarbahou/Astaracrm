
export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  type: "general" | "meeting" | "task" | "idea";
  visibility: "public" | "private" | "team";
  linkedTo?: {
    type: "contact" | "deal" | "client";
    id: string;
    name: string;
  };
  isPinned: boolean;
  hasReminder: boolean;
  reminderDate?: string;
  attachments: Array<{
    id: string;
    name: string;
    type: string;
    size: number;
    url: string;
  }>;
  createdBy: {
    id: string;
    name: string;
    avatar: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface NoteFilters {
  tags: string[];
  type: "all" | "general" | "meeting" | "task" | "idea";
  visibility: "all" | "public" | "private" | "team";
  sortBy: "created" | "modified" | "title";
}
