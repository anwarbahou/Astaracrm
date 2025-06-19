import { Deal, DealStage } from '@/types/deal';
import { useState } from 'react';
import * as React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
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
import { Calendar, FileText, MessageSquare, Activity, Save, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DealModalProps {
  deal: Deal | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (deal: Deal) => void;
  onDelete: (dealId: string) => void;
}

export function DealModal({ deal, open, onOpenChange, onSave, onDelete }: DealModalProps) {
  const [editedDeal, setEditedDeal] = useState<Deal | null>(deal);

  React.useEffect(() => {
    setEditedDeal(deal);
  }, [deal]);

  if (!deal || !editedDeal) return null;

  const handleSave = () => {
    onSave(editedDeal);
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this deal?')) {
      onDelete(deal.id);
      onOpenChange(false);
    }
  };

  const updateField = (field: keyof Deal, value: any) => {
    setEditedDeal(prev => prev ? { ...prev, [field]: value } : null);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Deal Details</SheetTitle>
          <SheetDescription>
            View and edit deal information
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {/* Deal Header Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="dealName">Deal Name</Label>
              <Input
                id="dealName"
                value={editedDeal.name}
                onChange={(e) => updateField('name', e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dealValue">Value (MAD)</Label>
                <Input
                  id="dealValue"
                  type="number"
                  value={editedDeal.value}
                  onChange={(e) => updateField('value', parseInt(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="probability">Probability (%)</Label>
                <Input
                  id="probability"
                  type="number"
                  min="0"
                  max="100"
                  value={editedDeal.probability}
                  onChange={(e) => updateField('probability', parseInt(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="stage">Stage</Label>
                <Select value={editedDeal.stage} onValueChange={(value) => updateField('stage', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select stage" />
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
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={editedDeal.priority} onValueChange={(value) => updateField('priority', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="closeDate">Expected Close Date</Label>
                <Input
                  id="closeDate"
                  type="date"
                  value={editedDeal.expectedCloseDate}
                  onChange={(e) => updateField('expectedCloseDate', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="source">Source</Label>
                <Input
                  id="source"
                  value={editedDeal.source}
                  onChange={(e) => updateField('source', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="client">Client</Label>
                <Input
                  id="client"
                  value={editedDeal.client}
                  onChange={(e) => updateField('client', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="owner">Owner</Label>
                <Input
                  id="owner"
                  value={editedDeal.owner}
                  onChange={(e) => updateField('owner', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="notes" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="notes" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Notes
              </TabsTrigger>
              <TabsTrigger value="files" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Files
              </TabsTrigger>
              <TabsTrigger value="activities" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Activities
              </TabsTrigger>
              <TabsTrigger value="communication" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Communication
              </TabsTrigger>
            </TabsList>

            <TabsContent value="notes" className="space-y-4">
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={editedDeal.notes || ''}
                  onChange={(e) => updateField('notes', e.target.value)}
                  className="mt-1 min-h-[200px]"
                  placeholder="Add your notes about this deal..."
                />
              </div>
            </TabsContent>

            <TabsContent value="files" className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No files</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by uploading a file.</p>
                <div className="mt-6">
                  <Button variant="outline">Upload File</Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="activities" className="space-y-4">
              <div className="space-y-4">
                {editedDeal.activities && editedDeal.activities.length > 0 ? (
                  editedDeal.activities.map((activity) => (
                    <div key={activity.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{activity.title}</h4>
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>{activity.user}</span>
                            <span>{new Date(activity.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <Badge variant="outline">{activity.type}</Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No activities recorded yet
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="communication" className="space-y-4">
              <div className="text-center py-8 text-muted-foreground">
                Communication history will be displayed here
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <Button variant="destructive" onClick={handleDelete} className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Delete Deal
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
