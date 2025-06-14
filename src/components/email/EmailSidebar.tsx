
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Inbox, 
  Send, 
  FileText, 
  Archive, 
  Trash2,
  Plus,
  Star,
  Tag
} from "lucide-react";

interface EmailSidebarProps {
  selectedFolder: string;
  onFolderSelect: (folder: string) => void;
  onComposeClick: () => void;
  unreadCounts: Record<string, number>;
}

export function EmailSidebar({ 
  selectedFolder, 
  onFolderSelect, 
  onComposeClick,
  unreadCounts 
}: EmailSidebarProps) {
  const folders = [
    { id: 'inbox', label: 'Inbox', icon: Inbox },
    { id: 'sent', label: 'Sent', icon: Send },
    { id: 'drafts', label: 'Drafts', icon: FileText },
    { id: 'starred', label: 'Starred', icon: Star },
    { id: 'archive', label: 'Archive', icon: Archive },
    { id: 'trash', label: 'Trash', icon: Trash2 },
  ];

  const tags = [
    { id: 'priority', label: 'Priority', color: 'bg-red-500' },
    { id: 'clients', label: 'Clients', color: 'bg-blue-500' },
    { id: 'internal', label: 'Internal', color: 'bg-green-500' },
    { id: 'follow-up', label: 'Follow-up', color: 'bg-yellow-500' },
  ];

  return (
    <div className="w-64 border-r border-border bg-background flex flex-col h-full">
      {/* Compose Button */}
      <div className="p-4">
        <Button 
          onClick={onComposeClick}
          className="w-full gap-2 bg-primary hover:bg-primary/90"
        >
          <Plus size={16} />
          Compose Email
        </Button>
      </div>

      {/* Folders */}
      <div className="flex-1 px-3">
        <div className="space-y-1">
          {folders.map((folder) => {
            const IconComponent = folder.icon;
            const unreadCount = unreadCounts[folder.id] || 0;
            
            return (
              <button
                key={folder.id}
                onClick={() => onFolderSelect(folder.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors hover:bg-accent ${
                  selectedFolder === folder.id 
                    ? 'bg-accent text-accent-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconComponent size={16} />
                  <span>{folder.label}</span>
                </div>
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="text-xs h-5 px-1.5">
                    {unreadCount}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>

        {/* Tags Section */}
        <div className="mt-6">
          <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-muted-foreground">
            <Tag size={12} />
            TAGS
          </div>
          <div className="space-y-1">
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => onFolderSelect(`tag:${tag.id}`)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors hover:bg-accent ${
                  selectedFolder === `tag:${tag.id}`
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${tag.color}`} />
                <span>{tag.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
