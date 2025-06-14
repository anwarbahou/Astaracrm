import { Deal, DealStage } from '@/types/deal';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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

interface AddDealModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export function AddDealModal({ open, onOpenChange, onSubmit }: AddDealModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    value: 0,
    stage: 'Prospect' as DealStage,
    probability: 25,
    expectedCloseDate: '',
    source: '',
    owner: 'John Doe',
    priority: 'Medium' as 'Low' | 'Medium' | 'High',
    tags: [] as string[],
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.client || !formData.expectedCloseDate) {
      alert('Please fill in all required fields');
      return;
    }

    const newDeal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'> = {
      name: formData.name,
      client: formData.client,
      value: formData.value,
      currency: 'MAD',
      stage: formData.stage,
      probability: formData.probability,
      expectedCloseDate: formData.expectedCloseDate,
      source: formData.source,
      owner: formData.owner,
      tags: formData.tags,
      priority: formData.priority,
      notes: formData.notes,
      activities: []
    };

    onSubmit(newDeal);
    onOpenChange(false);
    resetForm();
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      client: '',
      value: 0,
      stage: 'Prospect',
      probability: 25,
      expectedCloseDate: '',
      source: '',
      owner: 'John Doe',
      priority: 'Medium',
      tags: [],
      notes: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Deal</DialogTitle>
          <DialogDescription>
            Create a new deal in your sales pipeline
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="dealName">Deal Name *</Label>
              <Input
                id="dealName"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Enter deal name"
                required
              />
            </div>

            <div>
              <Label htmlFor="client">Client *</Label>
              <Input
                id="client"
                value={formData.client}
                onChange={(e) => updateField('client', e.target.value)}
                placeholder="Enter client name"
                required
              />
            </div>

            <div>
              <Label htmlFor="value">Value (MAD) *</Label>
              <Input
                id="value"
                type="number"
                value={formData.value}
                onChange={(e) => updateField('value', parseInt(e.target.value) || 0)}
                placeholder="0"
                required
              />
            </div>

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
              <Label htmlFor="closeDate">Expected Close Date *</Label>
              <Input
                id="closeDate"
                type="date"
                value={formData.expectedCloseDate}
                onChange={(e) => updateField('expectedCloseDate', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="source">Source</Label>
              <Input
                id="source"
                value={formData.source}
                onChange={(e) => updateField('source', e.target.value)}
                placeholder="e.g., Website, Referral, Cold Call"
              />
            </div>

            <div>
              <Label htmlFor="owner">Owner</Label>
              <Select value={formData.owner} onValueChange={(value) => updateField('owner', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select owner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="John Doe">John Doe</SelectItem>
                  <SelectItem value="Sarah Smith">Sarah Smith</SelectItem>
                  <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                  <SelectItem value="Emily Davis">Emily Davis</SelectItem>
                  <SelectItem value="David Wilson">David Wilson</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => updateField('priority', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                placeholder="Add any additional notes about this deal..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Deal</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
