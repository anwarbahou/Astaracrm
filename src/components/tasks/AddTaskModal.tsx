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
import { useTranslation } from 'react-i18next';

interface AddTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BtnHeading1 = createButton('Heading 1', 'H1', () => document.execCommand('formatBlock', false, 'H1'));
const BtnHeading2 = createButton('Heading 2', 'H2', () => document.execCommand('formatBlock', false, 'H2'));

// Helper to check for valid UUID
function isUUID(str: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

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
  const { t } = useTranslation();

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
      const { related_entity_name, ...taskToInsert } = form;

      // Sanitize UUID fields
      const finalAssignedTo = isUUID(assignedTo) ? assignedTo : null;
      const finalRelatedEntityId = isUUID(taskToInsert.related_entity_id) ? taskToInsert.related_entity_id : null;

      await addTask({
        ...taskToInsert,
        due_date: taskToInsert.due_date || null,
        related_entity: taskToInsert.related_entity || null,
        related_entity_id: finalRelatedEntityId,
        assigned_to: finalAssignedTo,
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
          <SheetTitle>{t('tasks.addTaskModal.title')}</SheetTitle>
        </SheetHeader>
        <form className="flex-1 flex flex-col overflow-hidden" onSubmit={handleSubmit}>
          <div className="flex-1 overflow-y-auto px-6 pt-4 pb-2">
            <div>
              <Label htmlFor="title">{t('tasks.addTaskModal.form.title')}</Label>
              <Input
                id="title"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div className="mb-4" />
            <div>
              <Label htmlFor="description">{t('tasks.addTaskModal.form.description')}</Label>
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
              <Label htmlFor="due_date">{t('tasks.addTaskModal.form.dueDate')}</Label>
              <Input
                id="due_date"
                type="date"
                value={form.due_date || ''}
                onChange={e => setForm({ ...form, due_date: e.target.value })}
              />
            </div>
            <div className="mb-4" />
            <div>
              <Label htmlFor="time_spent">{t('tasks.addTaskModal.form.timeSpent')}</Label>
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
                <Label htmlFor="priority">{t('tasks.addTaskModal.form.priority')}</Label>
                <select
                  id="priority"
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-2 bg-background text-foreground dark:bg-zinc-900 dark:text-zinc-100"
                >
                  <option value="high">{t('tasks.priority.high')}</option>
                  <option value="medium">{t('tasks.priority.medium')}</option>
                  <option value="low">{t('tasks.priority.low')}</option>
                </select>
              </div>
              <div className="flex-1">
                <Label htmlFor="status">{t('tasks.addTaskModal.form.status')}</Label>
                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-2 bg-background text-foreground dark:bg-zinc-900 dark:text-zinc-100"
                >
                  <option value="todo">{t('tasks.status.todo')}</option>
                  <option value="pending">{t('tasks.status.pending')}</option>
                  <option value="in_progress">{t('tasks.status.in_progress')}</option>
                  <option value="blocked">{t('tasks.status.blocked')}</option>
                  <option value="completed">{t('tasks.status.completed')}</option>
                  <option value="cancelled">{t('tasks.status.cancelled')}</option>
                </select>
              </div>
            </div>
            <div className="mb-4" />
            <div>
              <Label htmlFor="assigned_to">{t('tasks.addTaskModal.form.assignedTo')}</Label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(dropdownOpen === 'assigned_to' ? null : 'assigned_to')}
                  className="w-full border rounded px-3 py-2 bg-background text-foreground text-left flex justify-between items-center dark:bg-zinc-900 dark:text-zinc-100"
                >
                  <span>{assignedToName || t('tasks.addTaskModal.form.selectUser')}</span>
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </button>
                {dropdownOpen === 'assigned_to' && (
                  <div className="absolute z-10 w-full bg-popover border rounded shadow-md mt-1 max-h-48 overflow-y-auto dark:bg-zinc-800">
                    {usersLoading ? (
                      <div className="p-2 text-center text-muted-foreground">{t('tasks.addTaskModal.form.loadingUsers')}</div>
                    ) : (
                      allUsers.map(u => (
                        <div
                          key={u.id}
                          className="flex items-center gap-2 p-2 hover:bg-accent cursor-pointer"
                          onClick={() => {
                            setForm({ ...form, assigned_to: u.id });
                            setDropdownOpen(null);
                          }}
                        >
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={u.avatar_url || undefined} />
                            <AvatarFallback>{u.name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{u.name}</span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-4" />
            <div>
              <Label htmlFor="related_entity">{t('tasks.addTaskModal.form.relatedEntity')}</Label>
              <div className="relative">
                <select
                  id="related_entity"
                  name="related_entity"
                  value={form.related_entity}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-2 bg-background text-foreground dark:bg-zinc-900 dark:text-zinc-100"
                >
                  <option value="">{t('tasks.addTaskModal.form.none')}</option>
                  <option value="client">{t('tasks.addTaskModal.form.client')}</option>
                  <option value="contact">{t('tasks.addTaskModal.form.contact')}</option>
                  <option value="deal">{t('tasks.addTaskModal.form.deal')}</option>
                </select>

                {form.related_entity && (
                  <div className="mt-4">
                    <Input
                      type="text"
                      placeholder={t('tasks.addTaskModal.form.searchEntities')}
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="mb-2"
                    />
                    <div className="max-h-48 overflow-y-auto border rounded">
                      {loading || clientsLoading || dealsLoading || contactsLoading ? (
                        <div className="p-2 text-center text-muted-foreground">{t('tasks.addTaskModal.form.loading')}</div>
                      ) : (
                        {
                          client: filteredClients.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())),
                          contact: contacts.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())),
                          deal: filteredDeals.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase())),
                        }[form.related_entity]?.length === 0 ? (
                          <div className="p-2 text-center text-muted-foreground">{t('tasks.addTaskModal.form.noEntitiesFound')}</div>
                        ) : (
                          {
                            client: filteredClients.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())),
                            contact: contacts.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())),
                            deal: filteredDeals.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase())),
                          }[form.related_entity]?.map((entity: any) => (
                            <div
                              key={entity.id}
                              className="flex items-center gap-2 p-2 hover:bg-accent cursor-pointer"
                              onClick={() => {
                                setForm({ ...form, related_entity_id: entity.id, related_entity_name: entity.name });
                                setSearchQuery('');
                              }}
                            >
                              {form.related_entity === 'client' && <Briefcase className="h-4 w-4 text-muted-foreground" />}
                              {form.related_entity === 'contact' && <User className="h-4 w-4 text-muted-foreground" />}
                              {form.related_entity === 'deal' && <Handshake className="h-4 w-4 text-muted-foreground" />}
                              <span>{entity.name}</span>
                            </div>
                          ))
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end p-6 pt-2 border-t">
            <Button type="submit" disabled={isAdding || loading}>
              {isAdding || loading ? t('tasks.addTaskModal.saving') : t('tasks.addTaskModal.saveTask')}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
} 