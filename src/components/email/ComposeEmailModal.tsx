
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Send, 
  Paperclip, 
  X,
  Plus,
  Clock,
  FileText
} from "lucide-react";

interface ComposeEmailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ComposeEmailModal({ open, onOpenChange }: ComposeEmailModalProps) {
  const [to, setTo] = useState<string[]>([]);
  const [cc, setCc] = useState<string[]>([]);
  const [bcc, setBcc] = useState<string[]>([]);
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [template, setTemplate] = useState("");

  const templates = [
    { id: "follow-up", name: "Follow-up After Demo", content: "Hi {{name}},\n\nThank you for taking the time to see our product demonstration..." },
    { id: "proposal", name: "Proposal Submission", content: "Dear {{name}},\n\nPlease find attached our detailed proposal..." },
    { id: "meeting", name: "Meeting Reminder", content: "Hi {{name}},\n\nThis is a friendly reminder about our meeting..." }
  ];

  const contacts = [
    "john@acme.com",
    "sarah@techsolutions.com", 
    "mike@global.com",
    "emily@startupxyz.com"
  ];

  const addRecipient = (email: string, type: 'to' | 'cc' | 'bcc') => {
    if (!email.trim()) return;
    
    switch (type) {
      case 'to':
        if (!to.includes(email)) setTo([...to, email]);
        break;
      case 'cc':
        if (!cc.includes(email)) setCc([...cc, email]);
        break;
      case 'bcc':
        if (!bcc.includes(email)) setBcc([...bcc, email]);
        break;
    }
  };

  const removeRecipient = (email: string, type: 'to' | 'cc' | 'bcc') => {
    switch (type) {
      case 'to':
        setTo(to.filter(e => e !== email));
        break;
      case 'cc':
        setCc(cc.filter(e => e !== email));
        break;
      case 'bcc':
        setBcc(bcc.filter(e => e !== email));
        break;
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const selectedTemplate = templates.find(t => t.id === templateId);
    if (selectedTemplate) {
      setBody(selectedTemplate.content);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments([...attachments, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSend = () => {
    // Handle send logic
    console.log('Sending email:', { to, cc, bcc, subject, body, attachments });
    onOpenChange(false);
  };

  const handleSaveDraft = () => {
    // Handle save draft logic
    console.log('Saving draft:', { to, cc, bcc, subject, body, attachments });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Compose Email</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* To Field */}
          <div className="space-y-2">
            <Label htmlFor="to">To</Label>
            <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-10">
              {to.map((email) => (
                <Badge key={email} variant="secondary" className="gap-1">
                  {email}
                  <button onClick={() => removeRecipient(email, 'to')}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              <Input
                placeholder="Add recipients..."
                className="border-none shadow-none flex-1 min-w-32"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ',') {
                    e.preventDefault();
                    addRecipient(e.currentTarget.value, 'to');
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowCc(!showCc)}
              >
                CC
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowBcc(!showBcc)}
              >
                BCC
              </Button>
            </div>
          </div>

          {/* CC Field */}
          {showCc && (
            <div className="space-y-2">
              <Label htmlFor="cc">CC</Label>
              <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-10">
                {cc.map((email) => (
                  <Badge key={email} variant="secondary" className="gap-1">
                    {email}
                    <button onClick={() => removeRecipient(email, 'cc')}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                <Input
                  placeholder="Add CC recipients..."
                  className="border-none shadow-none flex-1 min-w-32"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault();
                      addRecipient(e.currentTarget.value, 'cc');
                      e.currentTarget.value = '';
                    }
                  }}
                />
              </div>
            </div>
          )}

          {/* BCC Field */}
          {showBcc && (
            <div className="space-y-2">
              <Label htmlFor="bcc">BCC</Label>
              <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-10">
                {bcc.map((email) => (
                  <Badge key={email} variant="secondary" className="gap-1">
                    {email}
                    <button onClick={() => removeRecipient(email, 'bcc')}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                <Input
                  placeholder="Add BCC recipients..."
                  className="border-none shadow-none flex-1 min-w-32"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault();
                      addRecipient(e.currentTarget.value, 'bcc');
                      e.currentTarget.value = '';
                    }
                  }}
                />
              </div>
            </div>
          )}

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject..."
            />
          </div>

          {/* Template Selector */}
          <div className="space-y-2">
            <Label>Template</Label>
            <Select onValueChange={handleTemplateSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a template..." />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {template.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Message Body */}
          <div className="space-y-2">
            <Label htmlFor="body">Message</Label>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Type your message..."
              className="min-h-60 resize-none"
            />
          </div>

          {/* Attachments */}
          <div className="space-y-2">
            <Label>Attachments</Label>
            <div className="border border-dashed border-border rounded-md p-4">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center gap-2 cursor-pointer"
              >
                <Paperclip className="h-6 w-6 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Click to attach files or drag and drop
                </span>
              </label>
              
              {attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-accent/50 rounded">
                      <span className="text-sm">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Clock className="h-4 w-4 mr-2" />
                Send Later
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button variant="outline" onClick={handleSaveDraft}>
                Save Draft
              </Button>
              <Button onClick={handleSend} className="gap-2">
                <Send className="h-4 w-4" />
                Send Now
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
