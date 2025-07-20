
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { 
  Paperclip, 
  Star, 
  Reply,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Email {
  id: number;
  from: string;
  fromName: string;
  to: string;
  subject: string;
  preview: string;
  body: string;
  date: string;
  read: boolean;
  starred: boolean;
  client: string;
  thread: number;
  attachments: string[];
  type: "Received" | "Sent";
  tags?: string[];
}

interface EmailListProps {
  emails: Email[];
  selectedEmails: number[];
  onEmailSelect: (emailId: number) => void;
  onEmailClick: (email: Email) => void;
  onBulkSelect: (emailIds: number[]) => void;
  folder: string;
}

export function EmailList({ 
  emails, 
  selectedEmails, 
  onEmailSelect, 
  onEmailClick, 
  onBulkSelect,
  folder 
}: EmailListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'date' | 'sender' | 'subject'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const itemsPerPage = 20;
  const totalPages = Math.ceil(emails.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const sortedEmails = [...emails].sort((a, b) => {
    let aValue: string | number = '';
    let bValue: string | number = '';

    switch (sortBy) {
      case 'date':
        aValue = new Date(a.date).getTime();
        bValue = new Date(b.date).getTime();
        break;
      case 'sender':
        aValue = a.fromName.toLowerCase();
        bValue = b.fromName.toLowerCase();
        break;
      case 'subject':
        aValue = a.subject.toLowerCase();
        bValue = b.subject.toLowerCase();
        break;
    }

    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const paginatedEmails = sortedEmails.slice(startIndex, endIndex);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const handleSort = (column: 'date' | 'sender' | 'subject') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onBulkSelect(paginatedEmails.map(email => email.id));
    } else {
      onBulkSelect([]);
    }
  };

  const isAllSelected = paginatedEmails.length > 0 && 
    paginatedEmails.every(email => selectedEmails.includes(email.id));

  return (
    <div className="flex flex-col h-full w-full flex-1">
      {/* Email List Header */}
      <div className="border-b border-border bg-background/95 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={handleSelectAll}
              aria-label="Select all emails"
            />
            <div className="text-sm text-muted-foreground">
              {emails.length} emails • {emails.filter(e => !e.read).length} unread
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => handleSort('date')}>
              Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleSort('sender')}>
              Sender {sortBy === 'sender' && (sortOrder === 'asc' ? '↑' : '↓')}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleSort('subject')}>
              Subject {sortBy === 'subject' && (sortOrder === 'asc' ? '↑' : '↓')}
            </Button>
          </div>
        </div>
      </div>

      {/* Email List */}
      <div className="flex-1 overflow-auto">
        {paginatedEmails.map((email) => (
          <div
            key={email.id}
            className={`flex items-center gap-3 p-4 border-b border-border hover:bg-accent/50 cursor-pointer transition-colors ${
              !email.read ? 'bg-blue-50/30' : ''
            } ${selectedEmails.includes(email.id) ? 'bg-accent/30' : ''}`}
            onClick={() => onEmailClick(email)}
          >
            <Checkbox
              checked={selectedEmails.includes(email.id)}
              onCheckedChange={() => onEmailSelect(email.id)}
              onClick={(e) => e.stopPropagation()}
            />
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Handle star toggle
              }}
            >
              <Star 
                className={`h-4 w-4 transition-colors ${
                  email.starred 
                    ? 'text-yellow-500 fill-current' 
                    : 'text-muted-foreground hover:text-yellow-500'
                }`} 
              />
            </button>

            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">
                {email.fromName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className={`font-medium truncate ${!email.read ? 'font-semibold' : ''}`}>
                  {email.fromName}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(email.date)}
                </span>
              </div>
              
              <div className="space-y-1">
                <p className={`text-sm truncate ${!email.read ? 'font-medium' : ''}`}>
                  {email.subject}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {email.preview}
                </p>
                
                <div className="flex items-center gap-2">
                  {email.tags && email.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {email.attachments.length > 0 && (
                    <Paperclip className="h-3 w-3 text-muted-foreground" />
                  )}
                  {email.thread > 1 && (
                    <span className="text-xs text-muted-foreground">
                      ({email.thread})
                    </span>
                  )}
                </div>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Reply className="mr-2 h-4 w-4" />
                  Reply
                </DropdownMenuItem>
                <DropdownMenuItem>Mark as unread</DropdownMenuItem>
                <DropdownMenuItem>Archive</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="border-t border-border p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(endIndex, emails.length)} of {emails.length}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <span className="text-sm font-medium">
              {currentPage} of {totalPages}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
