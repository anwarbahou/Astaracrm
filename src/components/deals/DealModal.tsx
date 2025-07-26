import { Deal, DealStage } from '@/types/deal';
import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import {
  Save,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { useUsersForSelection } from '@/hooks/useUsers';
import { useClientsForSelection } from '@/hooks/useClients';
import { useAuth } from '@/contexts/AuthContext';
import { noteService } from '@/services/noteService';
import type { Note } from '@/types/note';
import { useToast } from '@/hooks/use-toast';
import { QuickNoteCreator } from '@/components/notes/QuickNoteCreator';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DealModalProps {
  deal: Deal | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (deal: Deal) => void;
  onDelete: (dealId: string) => void;
}

export function DealModal({ deal, open, onOpenChange, onSave, onDelete }: DealModalProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { userProfile } = useAuth();
  const { users: allUsers, isLoading: usersLoading, userRole } = useUsersForSelection();
  const { clients: allClients, isLoading: clientsLoading } = useClientsForSelection();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    clientId: '',
    clientPhone: '',
    clientEmail: '',
    value: 0,
    currency: 'MAD',
    stage: 'Prospect' as DealStage,
    probability: 25,
    expectedCloseDate: '',
    source: '',
    owner: '',
    ownerId: '',
    priority: 'Medium' as 'Low' | 'Medium' | 'High',
    tags: [] as string[],
    notes: '',
    description: '',
    website: '',
    rating: undefined as number | undefined,
    assigneeId: '',
  });

  // Notes for this deal
  const [attachedNotes, setAttachedNotes] = useState<Note[]>([]);
  const [showValidationError, setShowValidationError] = useState(false);

  // Initialize form data when deal changes
  useEffect(() => {
    if (deal) {
      setFormData({
        name: deal.name || '',
        client: deal.client || '',
        clientId: deal.clientId || '',
        clientPhone: deal.clientPhone || '',
        clientEmail: deal.clientEmail || '',
        value: deal.value || 0,
        currency: deal.currency || 'MAD',
        stage: deal.stage || 'Prospect',
        probability: deal.probability || 25,
        expectedCloseDate: deal.expectedCloseDate || '',
        source: deal.source || '',
        owner: deal.owner || '',
        ownerId: deal.ownerId || '',
        priority: deal.priority || 'Medium',
        tags: deal.tags || [],
        notes: deal.notes || '',
        description: deal.description || '',
        website: deal.website || '',
        rating: deal.rating,
        assigneeId: deal.assigneeId || '',
      });
    }
  }, [deal]);

  // Fetch notes
  useEffect(() => {
    async function fetchNotes() {
      if (deal && userProfile) {
        const allNotes = await noteService.getNotes({ userId: userProfile.id, userRole: userProfile.role as any });
        setAttachedNotes(allNotes.filter(n => n.relatedEntityType === 'deal' && n.relatedEntityId === deal.id));
      } else {
        setAttachedNotes([]);
      }
    }
    fetchNotes();
  }, [deal, userProfile, userRole]);

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    return !!(
      formData.name.trim() && 
      formData.clientId && 
      formData.expectedCloseDate && 
      formData.value > 0 &&
      formData.ownerId
    );
  };

  const getValidationErrors = () => {
    const errors = [];
    if (!formData.name.trim()) errors.push('Deal name');
    if (!formData.clientId) errors.push('Client assignment');
    if (!formData.expectedCloseDate) errors.push('Expected close date');
    if (formData.value <= 0) errors.push('Deal value (must be greater than 0)');
    if (!formData.ownerId) errors.push('Deal owner');
    return errors;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      const errors = getValidationErrors();
      setShowValidationError(true);
      toast({
        title: "Required Fields Missing",
        description: `Please fill in: ${errors.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    const updatedDeal: Deal = {
      ...deal!,
      ...formData,
      tags: formData.tags,
      priority: formData.priority,
    };

    onSave?.(updatedDeal);
    setShowValidationError(false);
  };

  const handleClose = () => {
    onOpenChange(false);
    setShowValidationError(false);
  };

  const handleDelete = () => {
    if (deal && window.confirm('Are you sure you want to delete this deal?')) {
      onDelete(deal.id);
      onOpenChange(false);
    }
  };

  const handleNoteCreated = async () => {
    if (deal && userProfile) {
      const allNotes = await noteService.getNotes({ userId: userProfile.id, userRole: userProfile.role as any });
      setAttachedNotes(allNotes.filter(n => n.relatedEntityType === 'deal' && n.relatedEntityId === deal.id));
    }
  };

  if (!deal) return null;

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent 
        side="right" 
        className="h-full w-full sm:w-[600px] lg:w-[700px] xl:w-[800px] border-l shadow-2xl bg-background/95 backdrop-blur-sm p-0 flex flex-col"
      >
        <SheetHeader className="px-6 py-4">
          <SheetTitle>Edit Deal</SheetTitle>
          <SheetDescription>
            Update the deal information
            <br />
            <span className="text-sm text-muted-foreground mt-2 block">
              Fields marked with <span className="text-red-500">*</span> are required
            </span>
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 px-6 py-4 overflow-y-auto">
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Basic Info Fields */}
              <div className="space-y-4">
                <div className="col-span-2">
                  <Label htmlFor="dealName">Deal Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="dealName"
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="Enter deal name"
                  />
                </div>

                <div>
                  <Label htmlFor="client">Client <span className="text-red-500">*</span></Label>
                  <Select
                    value={formData.clientId}
                    onValueChange={(value) => {
                      const selectedClient = allClients.find(c => c.id === value);
                      updateField('clientId', value);
                      updateField('client', selectedClient?.name || '');
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={clientsLoading ? "Loading clients..." : "Select client"} />
                    </SelectTrigger>
                    <SelectContent>
                      {allClients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{client.name}</span>
                            {client.email && (
                              <span className="text-sm text-muted-foreground">{client.email}</span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="value">Value <span className="text-red-500">*</span></Label>
                  <Input
                    id="value"
                    type="number"
                    value={formData.value}
                    onChange={(e) => updateField('value', parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    value={formData.currency}
                    onChange={(e) => updateField('currency', e.target.value)}
                    placeholder="MAD"
                  />
                </div>

                <div>
                  <Label htmlFor="client-email">Client Email</Label>
                  <Input
                    id="client-email"
                    type="email"
                    value={formData.clientEmail || ''}
                    onChange={(e) => updateField('clientEmail', e.target.value)}
                    placeholder="client@company.com"
                  />
                </div>

                <div>
                  <Label htmlFor="client-phone">Client Phone</Label>
                  <Input
                    id="client-phone"
                    value={formData.clientPhone || ''}
                    onChange={(e) => updateField('clientPhone', e.target.value)}
                    placeholder="+212 6XX XXX XXX"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) => updateField('description', e.target.value)}
                    placeholder="Detailed description of the deal..."
                    rows={3}
                  />
                </div>

                <div className="col-span-2">
                  <Label>Notes</Label>
                  
                  {/* Quick Note Creator */}
                  {deal && (
                    <QuickNoteCreator
                      dealId={deal.id}
                      dealName={deal.name}
                      onNoteCreated={handleNoteCreated}
                      isEditing={true}
                    />
                  )}
                  
                  {/* Display attached notes */}
                  {attachedNotes.length > 0 && (
                    <div className="space-y-3 mt-4">
                      <Label className="text-sm font-medium">Attached Notes</Label>
                      <div className="space-y-2">
                        {attachedNotes.map((note) => (
                          <div key={note.id} className="p-3 bg-muted rounded-lg border">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium text-sm">{note.title}</h4>
                              <Badge 
                                variant={note.priority === 'high' ? 'destructive' : note.priority === 'medium' ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {note.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground whitespace-pre-line">
                              {note.content}
                            </p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                              <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                              {note.isPinned && <Badge variant="outline" className="text-xs">Pinned</Badge>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Deal Details Fields */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="stage">Stage</Label>
                  <Select value={formData.stage} onValueChange={(value) => updateField('stage', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Prospect">Prospect</SelectItem>
                      <SelectItem value="Lead">Lead</SelectItem>
                      <SelectItem value="Qualified">Qualified</SelectItem>
                      <SelectItem value="Negotiation">Negotiation</SelectItem>
                      <SelectItem value="Won/Lost">Won/Lost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="probability">Probability (%)</Label>
                  <Input
                    id="probability"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.probability}
                    onChange={(e) => updateField('probability', parseInt(e.target.value) || 0)}
                  />
                </div>

                <div>
                  <Label htmlFor="closeDate">Expected Close Date <span className="text-red-500">*</span></Label>
                  <Input
                    id="closeDate"
                    type="date"
                    value={formData.expectedCloseDate}
                    onChange={(e) => updateField('expectedCloseDate', e.target.value)}
                    required
                    className={!formData.expectedCloseDate ? "border-red-300 focus:border-red-500" : ""}
                  />
                </div>

                <div>
                  <Label htmlFor="source">Source</Label>
                  <Input
                    id="source"
                    value={formData.source}
                    onChange={(e) => updateField('source', e.target.value)}
                    placeholder="Website, Referral, Cold Call, etc."
                  />
                </div>

                <div>
                  <Label htmlFor="owner">Owner <span className="text-red-500">*</span></Label>
                  <Select
                    value={formData.ownerId}
                    onValueChange={(value) => {
                      const selectedUser = allUsers.find(u => u.id === value);
                      updateField('ownerId', value);
                      updateField('owner', selectedUser?.name || '');
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={usersLoading ? "Loading users..." : "Select owner"} />
                    </SelectTrigger>
                    <SelectContent>
                      {allUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name || user.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => updateField('priority', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="assignee">Assignee</Label>
                  <Select
                    value={formData.assigneeId}
                    onValueChange={(value) => updateField('assigneeId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      {allUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name || user.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website || ''}
                    onChange={(e) => updateField('website', e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="rating">Rating</Label>
                  <Input
                    id="rating"
                    type="number"
                    min={1}
                    max={5}
                    value={formData.rating ?? ''}
                    onChange={(e) => updateField('rating', e.target.value === '' ? undefined : Math.max(1, Math.min(5, Math.round(Number(e.target.value)))))}
                    placeholder="1-5"
                  />
                </div>

                <div>
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    value={formData.tags.join(', ')}
                    onChange={(e) => updateField('tags', e.target.value.split(',').map(t => t.trim()))}
                    placeholder="Enter tags separated by commas"
                  />
                </div>
              </div>
            </div>

            {showValidationError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please fill in all required fields: {getValidationErrors().join(', ')}
                </AlertDescription>
              </Alert>
            )}
          </form>
        </div>

        <SheetFooter className="px-6 py-4 border-t">
          <Button type="button" variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
