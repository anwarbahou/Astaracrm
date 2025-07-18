
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Reply, 
  Forward, 
  Archive, 
  Trash2, 
  Star,
  Paperclip,
  Send,
  MoreHorizontal
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

interface EmailDetailModalProps {
  email: Email | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReply?: () => void;
  onForward?: () => void;
}

export function EmailDetailModal({ 
  email, 
  open, 
  onOpenChange, 
  onReply, 
  onForward 
}: EmailDetailModalProps) {
  const [replyText, setReplyText] = useState("");
  const [showReply, setShowReply] = useState(false);

  if (!email) return null;

  const handleQuickReply = () => {
    // Handle quick reply
    setReplyText("");
    setShowReply(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-[600px] sm:max-w-[600px]">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="truncate pr-4">{email.subject}</SheetTitle>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm">
                <Star className={`h-4 w-4 ${email.starred ? 'text-yellow-500 fill-current' : ''}`} />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Mark as unread</DropdownMenuItem>
                  <DropdownMenuItem>Add label</DropdownMenuItem>
                  <DropdownMenuItem>
                    <Archive className="mr-2 h-4 w-4" />
                    Archive
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </SheetHeader>

        <div className="flex flex-col h-full mt-6">
          {/* Email Header */}
          <div className="space-y-4 pb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {email.fromName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{email.fromName}</p>
                  <p className="text-sm text-muted-foreground">{email.from}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  {new Date(email.date).toLocaleString()}
                </p>
                <Badge variant="outline" className="mt-1">{email.client}</Badge>
              </div>
            </div>
            
            <div className="text-sm space-y-1">
              <p><span className="text-muted-foreground">To:</span> {email.to}</p>
              {email.tags && email.tags.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Tags:</span>
                  {email.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            {email.attachments.length > 0 && (
              <div className="flex items-center gap-2">
                <Paperclip className="h-4 w-4 text-muted-foreground" />
                <div className="flex gap-2">
                  {email.attachments.map((attachment, index) => (
                    <Badge key={index} variant="secondary" className="gap-1 cursor-pointer hover:bg-secondary/80">
                      <span>{attachment}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Email Body */}
          <div className="flex-1 py-6 overflow-auto">
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {email.body}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t pt-4 space-y-4">
            <div className="flex items-center gap-2">
              <Button onClick={() => setShowReply(!showReply)} className="gap-2">
                <Reply className="h-4 w-4" />
                Reply
              </Button>
              <Button variant="outline" onClick={onForward} className="gap-2">
                <Forward className="h-4 w-4" />
                Forward
              </Button>
              <Button variant="outline" className="gap-2">
                <Archive className="h-4 w-4" />
                Archive
              </Button>
            </div>

            {/* Quick Reply */}
            {showReply && (
              <div className="space-y-3 p-4 border rounded-lg bg-accent/20">
                <h4 className="font-medium text-sm">Quick Reply</h4>
                <Textarea 
                  placeholder="Type your reply..." 
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="min-h-24 resize-none"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowReply(false)}
                    >
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleQuickReply} className="gap-2">
                      <Send className="h-4 w-4" />
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
