import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Editor, { Toolbar, BtnBold, BtnItalic, BtnUnderline, BtnBulletList, BtnNumberedList, BtnLink, createButton } from "react-simple-wysiwyg";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { User, Briefcase, Handshake, MoreHorizontal } from 'lucide-react';
import { useClientsForSelection } from '@/hooks/useClients';
import { contactsService } from '@/services/contactsService';
import { useDeals } from '@/hooks/useDeals';
import { useTasks } from '@/hooks/useTasks';
import { useUsersForSelection } from '@/hooks/useUsers';

interface AddTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BtnHeading1 = createButton('Heading 1', 'H1', () => document.execCommand('formatBlock', false, 'H1'));
const BtnHeading2 = createButton('Heading 2', 'H2', () => document.execCommand('formatBlock', false, 'H2'));

export function AddTaskModal({ open, onOpenChange }: AddTaskModalProps) {
  const { userProfile, user } = useAuth();
  const { addTask, isLoading: isAdding } = useTasks();
  const { users: allUsers, isLoading: usersLoading } = useUsersForSelection();
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "pending",
    due_date: "",
    related_entity: "",
    related_entity_id: "",
    related_entity_name: "",
    time_spent: "",
    assigned_to: ""
  });
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const { clients, isLoading: clientsLoading } = useClientsForSelection();
  const { deals, isLoading: dealsLoading } = useDeals();
  const [searchQuery, setSearchQuery] = useState('');
  const [contacts, setContacts] = useState<any[]>([]);
  const [contactsLoading, setContactsLoading] = useState(false);

  // Set assigned_to to current user id or selected user
  const isAdmin = userProfile?.role === 'admin';
  const assignedTo = isAdmin ? form.assigned_to || (allUsers[0]?.id ?? '') : userProfile ? userProfile.id : "";
  const assignedToName = isAdmin
    ? allUsers.find(u => u.id === assignedTo)?.name || ''
    : userProfile ? `${userProfile.first_name || ""} ${userProfile.last_name || ""}`.trim() || userProfile.email : "";

  const userId = userProfile?.id;
  const filteredClients = clients.filter(c => c.owner_id === userId);
  const filteredDeals = deals.filter(d => d.ownerId === userId);

  useEffect(() => {
    if (form.related_entity === 'contact' && userProfile) {
      setContactsLoading(true);
      contactsService.getContacts({ userId: userProfile.id, userRole: userProfile.role })
        .then(data => setContacts(data.map(c => ({ id: c.id, name: c.firstName + ' ' + c.lastName }))))
        .finally(() => setContactsLoading(false));
    }
  }, [form.related_entity, userProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDescriptionChange = (e: any) => {
    setForm({ ...form, description: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { related_entity_name, time_spent, ...taskToInsert } = form;

      await addTask({
        ...taskToInsert,
        due_date: taskToInsert.due_date || null,
        related_entity: taskToInsert.related_entity || null,
        related_entity_id: taskToInsert.related_entity_id || null,
        assigned_to: assignedTo,
        owner: user?.id,
      });

      setForm({
        title: "",
        description: "",
        priority: "medium",
        status: "pending",
        due_date: "",
        related_entity: "",
        related_entity_id: "",
        related_entity_name: "",
        time_spent: "",
        assigned_to: ""
      });
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="!w-[50vw] max-w-none flex flex-col p-0">
        <SheetHeader className="p-6 pb-0">
          <SheetTitle>Add New Task</SheetTitle>
        </SheetHeader>
        <form className="flex-1 flex flex-col overflow-hidden" onSubmit={handleSubmit}>
          <div className="flex-1 overflow-y-auto px-6 pt-4 pb-2">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div className="mb-4" />
            <div>
              <Label htmlFor="description">Description</Label>
              <div style={{ height: 240 }} className="relative mb-4">
                <ReactQuill
                  theme="snow"
                  value={form.description}
                  onChange={value => setForm({ ...form, description: value })}
                  style={{ height: 240, display: 'flex', flexDirection: 'column' }}
                  className="react-quill-fixed"
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, false] }],
                      ['bold', 'italic', 'underline'],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      ['link'],
                      ['clean']
                    ]
                  }}
                />
                <style>{`
                  .react-quill-fixed .ql-container {
                    height: 180px !important;
                    min-height: 180px !important;
                    max-height: 180px !important;
                  }
                  .react-quill-fixed .ql-editor {
                    height: 100% !important;
                    min-height: 100% !important;
                    max-height: 100% !important;
                  }
                `}</style>
              </div>
            </div>
            <div className="mb-4" />
            <div>
              <Label htmlFor="due_date">Due Date</Label>
              <Input
                id="due_date"
                type="date"
                value={form.due_date || ''}
                onChange={e => setForm({ ...form, due_date: e.target.value })}
              />
            </div>
            <div className="mb-4" />
            <div>
              <Label htmlFor="time_spent">Time Spent</Label>
              <Input
                id="time_spent"
                placeholder="e.g. 1m 3d 2h 39m"
                value={form.time_spent || ''}
                onChange={e => setForm({ ...form, time_spent: e.target.value })}
              />
            </div>
            <div className="mb-4" />
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="priority">Priority</Label>
                <select
                  id="priority"
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-2 bg-background text-foreground dark:bg-zinc-900 dark:text-zinc-100"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div className="flex-1">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-2 bg-background text-foreground dark:bg-zinc-900 dark:text-zinc-100"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div className="mb-4" />
            <div>
              <Label htmlFor="assignee">Assignee</Label>
              {isAdmin ? (
                <select
                  id="assignee"
                  name="assigned_to"
                  value={assignedTo}
                  onChange={e => setForm({ ...form, assigned_to: e.target.value })}
                  className="w-full border rounded px-2 py-2 bg-background text-foreground dark:bg-zinc-900 dark:text-zinc-100"
                  disabled={usersLoading}
                >
                  {usersLoading ? (
                    <option>Loading users...</option>
                  ) : (
                    allUsers.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))
                  )}
                </select>
              ) : (
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={userProfile?.avatar_url || ''} />
                    <AvatarFallback>
                      {userProfile?.first_name?.[0]}
                      {userProfile?.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <Input
                    id="assignee"
                    value={assignedToName}
                    readOnly
                    className="bg-muted-foreground/10 cursor-not-allowed"
                  />
                </div>
              )}
            </div>
            <div className="mb-4" />
            <div className="mb-4">
              <Label htmlFor="related_entity">Related To</Label>
              <div className="flex gap-4 mt-2 w-full">
                {/* Client Card */}
                <div className="flex-1">
                  <button
                    type="button"
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-colors flex-1 w-full h-20 ${form.related_entity === 'client' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-muted-foreground border-border hover:border-primary'}`}
                    onClick={() => {
                      setForm({ ...form, related_entity: 'client', related_entity_id: '', related_entity_name: '' });
                      setSearchQuery('');
                    }}
                  >
                    <User className="mb-1" />
                    <span className="text-xs font-medium">
                      {form.related_entity === 'client' && form.related_entity_name
                        ? form.related_entity_name
                        : 'Client'}
                    </span>
                  </button>
                </div>
                {/* Contact Card */}
                <div className="flex-1">
                  <button
                    type="button"
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-colors flex-1 w-full h-20 ${form.related_entity === 'contact' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-muted-foreground border-border hover:border-primary'}`}
                    onClick={() => {
                      setForm({ ...form, related_entity: 'contact', related_entity_id: '', related_entity_name: '' });
                      setSearchQuery('');
                    }}
                  >
                    <Handshake className="mb-1" />
                    <span className="text-xs font-medium">
                      {form.related_entity === 'contact' && form.related_entity_name
                        ? form.related_entity_name
                        : 'Contact'}
                    </span>
                  </button>
                </div>
                {/* Deal Card */}
                <div className="flex-1">
                  <button
                    type="button"
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-colors flex-1 w-full h-20 ${form.related_entity === 'deal' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-muted-foreground border-border hover:border-primary'}`}
                    onClick={() => {
                      setForm({ ...form, related_entity: 'deal', related_entity_id: '', related_entity_name: '' });
                      setSearchQuery('');
                    }}
                  >
                    <Briefcase className="mb-1" />
                    <span className="text-xs font-medium">
                      {form.related_entity === 'deal' && form.related_entity_name
                        ? form.related_entity_name
                        : 'Deal'}
                    </span>
                  </button>
                </div>
                {/* Other Card */}
                <div className="flex-1">
                  <button
                    type="button"
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-colors flex-1 w-full h-20 ${form.related_entity === 'other' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-muted-foreground border-border hover:border-primary'}`}
                    onClick={() => setForm({ ...form, related_entity: 'other', related_entity_id: '', related_entity_name: '' })}
                  >
                    <MoreHorizontal className="mb-1" />
                    <span className="text-xs font-medium">Other</span>
                  </button>
                </div>
              </div>
              {/* Search section below cards */}
              {form.related_entity && form.related_entity !== 'other' && (
                <div className="mt-4 mb-4">
                  <Input
                    placeholder={`Search for a ${form.related_entity}...`}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="mb-2"
                  />
                  <div className="max-h-40 overflow-y-auto border rounded bg-background">
                    {form.related_entity === 'client' && filteredClients.length === 0 && !clientsLoading && (
                      <div className="px-4 py-2 text-muted-foreground text-xs">No clients found.</div>
                    )}
                    {form.related_entity === 'client' && clientsLoading && (
                      <div className="px-4 py-2 text-muted-foreground text-xs">Loading clients...</div>
                    )}
                    {form.related_entity === 'client' && filteredClients.length > 0 && (
                      filteredClients
                        .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map(item => (
                          <div
                            key={item.id}
                            className={`px-4 py-2 cursor-pointer hover:bg-accent ${form.related_entity_id === item.id ? 'bg-primary text-primary-foreground' : ''}`}
                            onClick={() => setForm({ ...form, related_entity_id: item.id, related_entity_name: item.name })}
                          >
                            {item.name}
                          </div>
                        ))
                    )}
                    {form.related_entity === 'contact' && contacts.length === 0 && !contactsLoading && (
                      <div className="px-4 py-2 text-muted-foreground text-xs">No contacts found.</div>
                    )}
                    {form.related_entity === 'contact' && contactsLoading && (
                      <div className="px-4 py-2 text-muted-foreground text-xs">Loading contacts...</div>
                    )}
                    {form.related_entity === 'contact' && contacts.length > 0 && (
                      contacts
                        .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map(item => (
                          <div
                            key={item.id}
                            className={`px-4 py-2 cursor-pointer hover:bg-accent ${form.related_entity_id === item.id ? 'bg-primary text-primary-foreground' : ''}`}
                            onClick={() => setForm({ ...form, related_entity_id: item.id, related_entity_name: item.name })}
                          >
                            {item.name}
                          </div>
                        ))
                    )}
                    {form.related_entity === 'deal' && filteredDeals.length === 0 && !dealsLoading && (
                      <div className="px-4 py-2 text-muted-foreground text-xs">No deals found.</div>
                    )}
                    {form.related_entity === 'deal' && dealsLoading && (
                      <div className="px-4 py-2 text-muted-foreground text-xs">Loading deals...</div>
                    )}
                    {form.related_entity === 'deal' && filteredDeals.length > 0 && (
                      filteredDeals
                        .filter(item => (item.name || '').toLowerCase().includes(searchQuery.toLowerCase()))
                        .map(item => (
                          <div
                            key={item.id}
                            className={`px-4 py-2 cursor-pointer hover:bg-accent ${form.related_entity_id === item.id ? 'bg-primary text-primary-foreground' : ''}`}
                            onClick={() => setForm({ ...form, related_entity_id: item.id, related_entity_name: item.name })}
                          >
                            {item.name}
                          </div>
                        ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="p-6 border-t bg-background sticky bottom-0 z-10">
            <Button type="submit" disabled={loading || isAdding} className="w-full mt-4">
              {loading || isAdding ? "Adding..." : "Add Task"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
} 