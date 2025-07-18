import { Deal, DealStage } from '@/types/deal';
import { useState, useEffect, useMemo } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import {
  Calendar,
  FileText,
  MessageSquare,
  Activity,
  Save,
  Trash2,
  DollarSign,
  Users,
  Tag,
  Clock,
  BarChart,
  Link,
  AlertCircle,
  X
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useUsersForSelection } from '@/hooks/useUsers';
import { useClientsForSelection } from '@/hooks/useClients';
import { useAuth } from '@/contexts/AuthContext';

interface DealModalProps {
  deal: Deal | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (deal: Deal) => void;
  onDelete: (dealId: string) => void;
}

export function DealModal({ deal, open, onOpenChange, onSave, onDelete }: DealModalProps) {
  // 1. All useState hooks
  const [editedDeal, setEditedDeal] = useState<Deal>(deal);
  const [isEditing, setIsEditing] = useState(false);
  
  // 2. All context hooks
  const { t } = useTranslation();
  const { userProfile } = useAuth();
  
  // 3. All other hooks
  const { users: allUsers, isLoading: usersLoading, userRole, currentUser } = useUsersForSelection();
  const { clients: allClients, isLoading: clientsLoading } = useClientsForSelection();
  
  // 4. Memoized values
  const availableClients = useMemo(() => {
    if (!allClients) return [];
    if (userProfile?.role === 'admin') return allClients;
    return allClients.filter(client => client.owner_id === userProfile?.id);
  }, [allClients, userProfile]);

  // 5. Effects
  useEffect(() => {
    if (deal) {
      setEditedDeal(deal);
      setIsEditing(true); // Always open in edit mode
    }
  }, [deal]);

  // 6. Callbacks and handlers
  const handleSave = () => {
    onSave?.(editedDeal);
    setIsEditing(false);
  };

  const updateField = <K extends keyof Deal>(field: K, value: Deal[K]) => {
    setEditedDeal(prev => ({ ...prev, [field]: value }));
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'High': 'bg-red-500',
      'Medium': 'bg-yellow-500',
      'Low': 'bg-green-500'
    };
    return colors[priority] || 'bg-gray-500';
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this deal?')) {
      onDelete(deal.id);
      onOpenChange(false);
    }
  };

  const getStageColor = (stage: DealStage) => {
    const stageColors = {
      'Lead': 'bg-purple-500',
      'Prospect': 'bg-blue-500',
      'Qualified': 'bg-green-500',
      'Proposal': 'bg-yellow-500',
      'Negotiation': 'bg-orange-500',
      'Won/Lost': 'bg-gray-500'
    };
    return stageColors[stage] || 'bg-gray-500';
  };

  if (!deal || !editedDeal) return null;

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setIsEditing(false);
    }
    onOpenChange(open);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="max-w-2xl w-full overflow-hidden flex flex-col bg-background rounded-none border-l shadow-xl">
        <SheetClose asChild>
          <button
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
            onClick={() => handleOpenChange(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </SheetClose>
        <SheetHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <SheetTitle className="text-2xl font-semibold flex items-center gap-2">
                {isEditing ? (
                  <Input
                    value={editedDeal.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    className="text-2xl font-semibold h-9"
                  />
                ) : (
                  editedDeal.name
                )}
              </SheetTitle>
              <SheetDescription className="flex items-center gap-3">
                <Badge variant="secondary" className={`${getStageColor(editedDeal.stage)} text-white`}>
                  {editedDeal.stage}
                </Badge>
                <Badge variant="outline" className={`${getPriorityColor(editedDeal.priority)} text-white`}>
                  {editedDeal.priority} Priority
                </Badge>
                <span className="text-muted-foreground">
                  Created {new Date(editedDeal.created_at).toLocaleDateString()}
                </span>
              </SheetDescription>
            </div>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="destructive" onClick={handleDelete}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>
        </SheetHeader>

        <Separator className="my-4" />

        <ScrollArea className="flex-1 px-1">
          <div className="space-y-8">
            {/* General Info Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">General Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="deal-name">Deal Name</Label>
                  <Input id="deal-name" value={editedDeal.name} onChange={e => updateField('name', e.target.value)} disabled={!isEditing} />
                </div>
                <div>
                  <Label htmlFor="client">Client</Label>
                  <Select
                    value={editedDeal.clientId || ''}
                    onValueChange={v => {
                      const selectedClient = allClients.find(c => c.id === v);
                      updateField('clientId', v);
                      updateField('client', selectedClient?.name || '');
                    }}
                    disabled={!isEditing || clientsLoading}
                  >
                    <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
                    <SelectContent>
                      {clientsLoading ? (
                        <SelectItem value="loading" disabled>Loading clients...</SelectItem>
                      ) : allClients.length === 0 ? (
                        <SelectItem value="none" disabled>No clients available</SelectItem>
                  ) : (
                        allClients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="owner">Owner</Label>
                  {userRole === 'admin' ? (
                    <Select
                      value={editedDeal.ownerId || ''}
                      onValueChange={v => {
                        const selectedUser = allUsers.find(u => u.id === v);
                        updateField('ownerId', v);
                        updateField('owner', selectedUser?.name || '');
                      }}
                      disabled={!isEditing || usersLoading}
                    >
                      <SelectTrigger><SelectValue placeholder="Select owner" /></SelectTrigger>
                      <SelectContent>
                        {usersLoading ? (
                          <SelectItem value="loading" disabled>Loading users...</SelectItem>
                        ) : allUsers.length === 0 ? (
                          <SelectItem value="none" disabled>No users available</SelectItem>
                        ) : (
                          allUsers.map((user) => (
                            <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id="owner"
                      value={editedDeal.owner}
                      disabled
                    />
                  )}
                </div>
                <div>
                  <Label htmlFor="stage">Stage</Label>
                  <Select value={editedDeal.stage} onValueChange={v => updateField('stage', v as DealStage)} disabled={!isEditing}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Prospect">Prospect</SelectItem>
                      <SelectItem value="Lead">Lead</SelectItem>
                      <SelectItem value="Qualified">Qualified</SelectItem>
                      <SelectItem value="Proposal">Proposal</SelectItem>
                      <SelectItem value="Negotiation">Negotiation</SelectItem>
                      <SelectItem value="Won/Lost">Won/Lost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={editedDeal.priority} onValueChange={v => updateField('priority', v as Deal['priority'])} disabled={!isEditing}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  </div>
                <div>
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input id="tags" value={editedDeal.tags.join(', ')} onChange={e => updateField('tags', e.target.value.split(',').map(t => t.trim()))} disabled={!isEditing} />
                </div>
              </div>
            </div>
            {/* Financial Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Financial</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="value">Value</Label>
                  <Input id="value" type="number" value={editedDeal.value} onChange={e => updateField('value', Number(e.target.value))} disabled={!isEditing} />
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Input id="currency" value={editedDeal.currency} onChange={e => updateField('currency', e.target.value)} disabled={!isEditing} />
                </div>
                <div>
                  <Label htmlFor="probability">Probability (%)</Label>
                  <Input id="probability" type="number" value={editedDeal.probability} onChange={e => updateField('probability', Number(e.target.value))} disabled={!isEditing} />
                </div>
                <div>
                  <Label htmlFor="expectedCloseDate">Expected Close Date</Label>
                  <Input id="expectedCloseDate" type="date" value={editedDeal.expectedCloseDate} onChange={e => updateField('expectedCloseDate', e.target.value)} disabled={!isEditing} />
                          </div>
                        </div>
                      </div>
            {/* Details Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="source">Source</Label>
                  <Input id="source" value={editedDeal.source} onChange={e => updateField('source', e.target.value)} disabled={!isEditing} />
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" value={editedDeal.notes || ''} onChange={e => updateField('notes', e.target.value)} disabled={!isEditing} />
                </div>
              </div>
                  </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
