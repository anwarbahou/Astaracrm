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
  const { clients, isLoading: loadingClients } = useClientsForSelection();
  
  // 4. Memoized values
  const availableClients = useMemo(() => {
    if (!clients) return [];
    if (userProfile?.role === 'admin') return clients;
    return clients.filter(client => client.owner_id === userProfile?.id);
  }, [clients, userProfile]);

  // 5. Effects
  useEffect(() => {
    if (deal) {
      setEditedDeal(deal);
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
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    Edit Deal
                  </Button>
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
          <div className="space-y-6">
            {/* Key Details stacked */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Financial Details
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Value</span>
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={editedDeal.value}
                        onChange={(e) => updateField('value', Number(e.target.value))}
                        className="w-32 text-right"
                      />
                      <Select
                        value={editedDeal.currency}
                        onValueChange={(value) => updateField('currency', value)}
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue placeholder="Currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MAD">MAD</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <span className="font-semibold">{editedDeal.value.toLocaleString()} {editedDeal.currency}</span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Probability</span>
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={editedDeal.probability}
                        onChange={(e) => updateField('probability', Number(e.target.value))}
                        className="w-20 text-right"
                      />
                      <span>%</span>
                    </div>
                  ) : (
                    <span className="font-semibold">{editedDeal.probability}%</span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Expected Revenue</span>
                  <span className="font-semibold">{(editedDeal.value * (editedDeal.probability / 100)).toLocaleString()} {editedDeal.currency}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Users className="w-4 h-4" />
                People
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Client</span>
                  {isEditing ? (
                    <Select
                      value={editedDeal.clientId || ''}
                      onValueChange={(value) => {
                        const selectedClient = availableClients.find(c => c.id === value);
                        updateField('clientId', value);
                        updateField('client', selectedClient?.name || '');
                      }}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        {loadingClients ? (
                          <SelectItem value="loading" disabled>Loading clients...</SelectItem>
                        ) : availableClients.length === 0 ? (
                          <SelectItem value="none" disabled>No clients available</SelectItem>
                        ) : (
                          availableClients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className="font-semibold">{editedDeal.client}</span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Owner</span>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={editedDeal.ownerAvatar} />
                      <AvatarFallback>{editedDeal.owner.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-semibold">{editedDeal.owner}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Tags
              </h3>
              {isEditing ? (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {editedDeal.tags.map((tag) => (
                      <Badge 
                        key={tag} 
                        variant="secondary"
                        className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => updateField('tags', editedDeal.tags.filter(t => t !== tag))}
                      >
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add new tag"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value) {
                          updateField('tags', [...editedDeal.tags, e.currentTarget.value]);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {editedDeal.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Tabs below details */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <BarChart className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="activities" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Activities
                </TabsTrigger>
                <TabsTrigger value="files" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Files
                </TabsTrigger>
                <TabsTrigger value="notes" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Notes
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 mt-6">
                <div className="space-y-6">
                  {/* Timeline */}
                  <div className="space-y-4">
                    <h4 className="font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Timeline
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Created</span>
                        <span>{new Date(editedDeal.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Last Updated</span>
                        <span>{new Date(editedDeal.updated_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Expected Close</span>
                        <span>{editedDeal.expectedCloseDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Source Details */}
                  <div className="space-y-4">
                    <h4 className="font-medium flex items-center gap-2">
                      <Link className="w-4 h-4" />
                      Source Details
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Source</span>
                        <span>{editedDeal.source || 'Not specified'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Risk Assessment */}
                  <div className="space-y-4">
                    <h4 className="font-medium flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Risk Assessment
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold">{editedDeal.probability}%</div>
                        <div className="text-sm text-muted-foreground">Win Probability</div>
                      </div>
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold">{editedDeal.stage}</div>
                        <div className="text-sm text-muted-foreground">Current Stage</div>
                      </div>
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold">{editedDeal.priority}</div>
                        <div className="text-sm text-muted-foreground">Priority Level</div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="activities" className="mt-6">
                <div className="space-y-4">
                  {editedDeal.activities?.length ? (
                    editedDeal.activities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                        <div className="p-2 bg-background rounded">
                          <Activity className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{activity.title}</div>
                          <div className="text-sm text-muted-foreground">{activity.description}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {activity.user} - {new Date(activity.date).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      No activities recorded yet
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="files" className="mt-6">
                <div className="space-y-4">
                  {editedDeal.files?.length ? (
                    editedDeal.files.map((file) => (
                      <div key={file.id} className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                        <FileText className="w-4 h-4" />
                        <div className="flex-1">
                          <div className="font-medium">{file.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {(file.size / 1024).toFixed(2)} KB - Uploaded by {file.uploadedBy}
                          </div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a href={file.url} target="_blank" rel="noopener noreferrer">
                            Download
                          </a>
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      No files attached to this deal
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="notes" className="mt-6">
                {isEditing ? (
                  <Textarea
                    value={editedDeal.notes || ''}
                    onChange={(e) => updateField('notes', e.target.value)}
                    placeholder="Add notes about this deal..."
                    className="min-h-[200px]"
                  />
                ) : (
                  <div className="p-4 bg-muted rounded-lg whitespace-pre-wrap">
                    {editedDeal.notes || 'No notes added yet'}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
