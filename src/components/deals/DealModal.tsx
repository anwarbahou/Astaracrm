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
  X,
  ChevronDown,
  ChevronUp
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
  const [activeTab, setActiveTab] = useState('general');
  
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
      <SheetContent 
        side="right" 
        className="h-full w-full sm:w-[600px] lg:w-[700px] xl:w-[800px] border-l shadow-2xl bg-background/95 backdrop-blur-sm p-0 flex flex-col"
      >
          
          {/* Header content */}
          <SheetHeader className="px-6 pb-4">
            <div className="flex items-start justify-between w-full">
              <div className="space-y-2 flex-1 min-w-0">
                <SheetTitle className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
                {isEditing ? (
                  <Input
                    value={editedDeal.name}
                    onChange={(e) => updateField('name', e.target.value)}
                      className="text-xl sm:text-2xl font-semibold h-9 bg-transparent border-none p-0 focus-visible:ring-0"
                      placeholder="Deal name..."
                  />
                ) : (
                    <span className="truncate">{editedDeal.name}</span>
                )}
              </SheetTitle>
                <SheetDescription className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className={`${getStageColor(editedDeal.stage)} text-white text-xs`}>
                  {editedDeal.stage}
                </Badge>
                  <Badge variant="outline" className={`${getPriorityColor(editedDeal.priority)} text-white text-xs`}>
                  {editedDeal.priority} Priority
                </Badge>
                  <span className="text-muted-foreground text-xs">
                  Created {new Date(editedDeal.created_at).toLocaleDateString()}
                </span>
              </SheetDescription>
            </div>
              
              {/* Action buttons */}
              <div className="flex items-center gap-2 ml-4">
                <SheetClose asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <X className="h-4 w-4" />
                  </Button>
                </SheetClose>
              {isEditing ? (
                <>
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                    <Button size="sm" onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                      Save
                  </Button>
                </>
              ) : (
                  <Button variant="destructive" size="sm" onClick={handleDelete}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
              )}
            </div>
          </div>
        </SheetHeader>

          <Separator className="mx-6" />

          {/* Tabs for better organization */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-3 mx-6 mt-4">
              <TabsTrigger value="general" className="text-xs">General</TabsTrigger>
              <TabsTrigger value="financial" className="text-xs">Financial</TabsTrigger>
              <TabsTrigger value="details" className="text-xs">Details</TabsTrigger>
            </TabsList>

            <ScrollArea className="flex-1 px-6 py-4">
                            <TabsContent value="general" className="space-y-6 mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="deal-name" className="text-sm font-medium">Deal Name</Label>
                    <Input 
                      id="deal-name" 
                      value={editedDeal.name} 
                      onChange={e => updateField('name', e.target.value)} 
                      disabled={!isEditing}
                      className="h-10"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="client-name" className="text-sm font-medium">Client Name</Label>
                    <Input 
                      id="client-name" 
                      value={editedDeal.client} 
                      onChange={e => updateField('client', e.target.value)} 
                      disabled={!isEditing}
                      className="h-10"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="client-email" className="text-sm font-medium">Client Email</Label>
                    <Input 
                      id="client-email" 
                      value={editedDeal.clientEmail || ''} 
                      onChange={e => updateField('clientEmail', e.target.value)} 
                      disabled={!isEditing}
                      className="h-10"
                      placeholder="client@company.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="client-phone" className="text-sm font-medium">Client Phone</Label>
                    <Input 
                      id="client-phone" 
                      value={editedDeal.clientPhone || ''} 
                      onChange={e => updateField('clientPhone', e.target.value)} 
                      disabled={!isEditing}
                      className="h-10"
                      placeholder="+212 6XX XXX XXX"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client" className="text-sm font-medium">Client</Label>
                  <Select
                    value={editedDeal.clientId || ''}
                    onValueChange={v => {
                      const selectedClient = allClients.find(c => c.id === v);
                      updateField('clientId', v);
                      updateField('client', selectedClient?.name || '');
                    }}
                    disabled={!isEditing || clientsLoading}
                  >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
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
                  <div className="space-y-2">
                    <Label htmlFor="owner" className="text-sm font-medium">Owner</Label>
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
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select owner" />
                        </SelectTrigger>
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
                        className="h-10"
                    />
                  )}
                </div>
                  <div className="space-y-2">
                    <Label htmlFor="stage" className="text-sm font-medium">Stage</Label>
                  <Select value={editedDeal.stage} onValueChange={v => updateField('stage', v as DealStage)} disabled={!isEditing}>
                      <SelectTrigger className="h-10">
                        <SelectValue />
                      </SelectTrigger>
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
                  <div className="space-y-2">
                    <Label htmlFor="priority" className="text-sm font-medium">Priority</Label>
                  <Select value={editedDeal.priority} onValueChange={v => updateField('priority', v as Deal['priority'])} disabled={!isEditing}>
                      <SelectTrigger className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags" className="text-sm font-medium">Tags</Label>
                    <Input 
                      id="tags" 
                      value={editedDeal.tags.join(', ')} 
                      onChange={e => updateField('tags', e.target.value.split(',').map(t => t.trim()))} 
                      disabled={!isEditing}
                      placeholder="Enter tags separated by commas"
                      className="h-10"
                    />
            </div>
                </div>
              </TabsContent>

              <TabsContent value="financial" className="space-y-6 mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="value" className="text-sm font-medium">Deal Value</Label>
                    <Input 
                      id="value" 
                      type="number" 
                      value={editedDeal.value} 
                      onChange={e => updateField('value', Number(e.target.value))} 
                      disabled={!isEditing}
                      className="h-10"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-sm font-medium">Currency</Label>
                    <Input 
                      id="currency" 
                      value={editedDeal.currency} 
                      onChange={e => updateField('currency', e.target.value)} 
                      disabled={!isEditing}
                      className="h-10"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="probability" className="text-sm font-medium">Probability (%)</Label>
                    <Input 
                      id="probability" 
                      type="number"
                      min="0"
                      max="100"
                      value={editedDeal.probability} 
                      onChange={e => updateField('probability', Number(e.target.value))} 
                      disabled={!isEditing}
                      className="h-10"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="expected-close-date" className="text-sm font-medium">Expected Close Date</Label>
                    <Input 
                      id="expected-close-date" 
                      value={editedDeal.expectedCloseDate} 
                      onChange={e => updateField('expectedCloseDate', e.target.value)} 
                      disabled={!isEditing}
                      className="h-10"
                      type="date"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-6 mt-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="source" className="text-sm font-medium">Source</Label>
                    <Input 
                      id="source" 
                      value={editedDeal.source} 
                      onChange={e => updateField('source', e.target.value)} 
                      disabled={!isEditing}
                      className="h-10"
                      placeholder="Website, Referral, Cold Call, etc."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                    <Textarea 
                      id="description" 
                      value={editedDeal.description || ''} 
                      onChange={e => updateField('description', e.target.value)} 
                      disabled={!isEditing}
                      placeholder="Detailed description of the deal..."
                      className="min-h-[120px] resize-none"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-sm font-medium">Notes</Label>
                    <Textarea 
                      id="notes" 
                      value={editedDeal.notes || ''} 
                      onChange={e => updateField('notes', e.target.value)} 
                      disabled={!isEditing}
                      placeholder="Add notes about this deal..."
                      className="min-h-[120px] resize-none"
                    />
                  </div>
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </SheetContent>
      </Sheet>
  );
}
