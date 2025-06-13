
export interface ActivityLog {
  id: number;
  type: string;
  action: string;
  details: string;
  user: string;
  userAvatar: string;
  timestamp: string;
  entity: string;
  entityId: string | null;
  relatedTo: string;
  changes: Record<string, string>;
}
