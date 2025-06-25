import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTasks, Task } from '@/hooks/useTasks';
import { useToast } from '@/components/ui/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, User, Briefcase, Handshake, MoreHorizontal, CheckIcon } from "lucide-react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useClientsForSelection } from '@/hooks/useClients';
import { contactsService } from '@/services/contactsService';
import { useDeals } from '@/hooks/useDeals';
import { useUsersForSelection } from '@/hooks/useUsers';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
}

// Define form state type explicitly
interface EditFormState {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in_progress" | "completed" | "cancelled" | "todo" | "blocked";
  due_date: string;
  related_entity: "none" | "client" | "contact" | "deal"; // Use 'none' instead of ''
  related_entity_id: string | null;
  related_entity_name: string | null;
  time_spent: string;
  assigned_to: string | null;
}

function isUUID(str: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({ isOpen, onClose, task }) => {
  const { userProfile, user } = useAuth();
  const { updateTask, isLoading: isUpdating } = useTasks();
  const { users: allUsers, isLoading: usersLoading } = useUsersForSelection();

  const { t } = useTranslation();

  const [form, setForm] = useState<EditFormState>(() => {
    const initialRelatedEntity = (task.related_entity && ["client", "contact", "deal"].includes(task.related_entity)) ?
      task.related_entity as "client" | "contact" | "deal" : "none";

    // Sanitize IDs on initialization
    const sanitizedRelatedEntityId = task.related_entity_id && isUUID(task.related_entity_id) ? task.related_entity_id : null;
    const sanitizedAssignedTo = task.assigned_to && isUUID(task.assigned_to) ? task.assigned_to : null;

    return {
      title: task.title || "",
      description: task.description || "",
      priority: task.priority || "medium",
      status: task.status || "pending",
      due_date: task.due_date ? format(new Date(task.due_date), 'yyyy-MM-dd') : "",
      related_entity: initialRelatedEntity,
      related_entity_id: sanitizedRelatedEntityId,
      related_entity_name: task.related_entity_name || null,
      time_spent: "",
      assigned_to: sanitizedAssignedTo,
    };
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
  const assignedTo = isAdmin ? (form.assigned_to || (allUsers[0]?.id ?? null)) : (userProfile ? userProfile.id : null);
  const assignedToName = isAdmin
    ? allUsers.find(u => u.id === assignedTo)?.name || ''
    : userProfile ? `${userProfile.first_name || ""} ${userProfile.last_name || ""}`.trim() || userProfile.email : "";

  const { toast } = useToast();

  useEffect(() => {
    const initialRelatedEntity = (task.related_entity && ["client", "contact", "deal"].includes(task.related_entity)) ?
      task.related_entity as "client" | "contact" | "deal" : "none";

    // Sanitize IDs on update
    const sanitizedRelatedEntityId = task.related_entity_id && isUUID(task.related_entity_id) ? task.related_entity_id : null;
    const sanitizedAssignedTo = task.assigned_to && isUUID(task.assigned_to) ? task.assigned_to : null;

    setForm({
      title: task.title || "",
      description: task.description || "",
      priority: task.priority || "medium",
      status: task.status || "pending",
      due_date: task.due_date ? format(new Date(task.due_date), 'yyyy-MM-dd') : "",
      related_entity: initialRelatedEntity,
      related_entity_id: sanitizedRelatedEntityId,
      related_entity_name: task.related_entity_name || null,
      time_spent: "",
      assigned_to: sanitizedAssignedTo,
    });
    if (initialRelatedEntity === 'contact' && userProfile) {
      setContactsLoading(true);
      contactsService.getContacts({ userId: userProfile.id, userRole: userProfile.role })
        .then(data => setContacts(data.map(c => ({ id: c.id, name: `${c.firstName} ${c.lastName}` }))))
        .finally(() => setContactsLoading(false));
    }
  }, [task, userProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDescriptionChange = (value: string) => {
    setForm(prev => ({ ...prev, description: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { related_entity_name, time_spent, related_entity_id, assigned_to, ...taskToUpdate } = form;

      const finalRelatedEntity = form.related_entity === "none" ? null : form.related_entity;
      const finalRelatedEntityId = form.related_entity === "none" || !isUUID(form.related_entity_id || "") ? null : form.related_entity_id;
      const finalAssignedTo = !isUUID(form.assigned_to || "") ? null : form.assigned_to;
      const finalRelatedEntityName = form.related_entity === "none" ? null : (related_entity_name || null);

      const payload = {
        id: task.id,
        ...taskToUpdate,
        due_date: taskToUpdate.due_date || null,
        related_entity: finalRelatedEntity,
        related_entity_id: finalRelatedEntityId,
        assigned_to: finalAssignedTo,
      };
      console.log("EditTaskModal - Payload for updateTask:", JSON.stringify(payload, null, 2));

      await updateTask(payload);

      toast({
        title: t('tasks.editTaskModal.toast.successTitle'),
        description: t('tasks.editTaskModal.toast.successDescription', { title: form.title }), 
      });
      onClose();
    } catch (error) {
      toast({
        title: t('tasks.editTaskModal.toast.errorTitle'),
        description: error instanceof Error ? error.message : t('tasks.editTaskModal.toast.unknownError'),
        variant: "destructive",
      });
      console.error("Failed to update task:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRelatedEntityChange = (entityType: "none" | "client" | "contact" | "deal", id: string | null, name: string | null) => {
    setForm(prev => ({ ...prev, related_entity: entityType, related_entity_id: id, related_entity_name: name }));
    setDropdownOpen(null);
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDeals = deals.filter(deal =>
    deal.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="!w-[50vw] max-w-none flex flex-col p-0">
        <SheetHeader className="p-6 pb-0">
          <SheetTitle>{t('tasks.editTaskModal.title')}</SheetTitle>
        </SheetHeader>
        <form className="flex-1 flex flex-col overflow-hidden" onSubmit={handleSubmit}>
          <div className="flex-1 overflow-y-auto px-6 pt-4 pb-2">
            <div>
              <Label htmlFor="title">{t('tasks.editTaskModal.form.title')}</Label>
              <Input
                id="title"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div className="mb-4" />
            <div>
              <Label htmlFor="description">{t('tasks.editTaskModal.form.description')}</Label>
              <div style={{ height: 240 }} className="relative mb-4">
                <ReactQuill
                  theme="snow"
                  value={form.description}
                  onChange={handleDescriptionChange}
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
              <Label htmlFor="due_date">{t('tasks.editTaskModal.form.dueDate')}</Label>
              <Input
                id="due_date"
                type="date"
                value={form.due_date || ''}
                onChange={e => setForm({ ...form, due_date: e.target.value })}
              />
            </div>
            <div className="mb-4" />
            <div>
              <Label htmlFor="time_spent">{t('tasks.editTaskModal.form.timeSpent')}</Label>
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
                <Label htmlFor="priority">{t('tasks.editTaskModal.form.priority')}</Label>
                <Select
                  value={form.priority}
                  onValueChange={value => setForm(prev => ({ ...prev, priority: value as "high" | "medium" | "low" }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('tasks.editTaskModal.form.selectPriority')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">{t('tasks.priority.high')}</SelectItem>
                    <SelectItem value="medium">{t('tasks.priority.medium')}</SelectItem>
                    <SelectItem value="low">{t('tasks.priority.low')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Label htmlFor="status">{t('tasks.editTaskModal.form.status')}</Label>
                <Select
                  value={form.status}
                  onValueChange={value => setForm(prev => ({ ...prev, status: value as "pending" | "in_progress" | "completed" | "cancelled" | "todo" | "blocked" }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('tasks.editTaskModal.form.selectStatus')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">{t('tasks.status.todo')}</SelectItem>
                    <SelectItem value="pending">{t('tasks.status.pending')}</SelectItem>
                    <SelectItem value="in_progress">{t('tasks.status.in_progress')}</SelectItem>
                    <SelectItem value="blocked">{t('tasks.status.blocked')}</SelectItem>
                    <SelectItem value="completed">{t('tasks.status.completed')}</SelectItem>
                    <SelectItem value="cancelled">{t('tasks.status.cancelled')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mb-4" />
            <div>
              <Label htmlFor="assigned_to">{t('tasks.editTaskModal.form.assignedTo')}</Label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(dropdownOpen === 'assigned_to' ? null : 'assigned_to')}
                  className="w-full border rounded px-3 py-2 bg-background text-foreground text-left flex justify-between items-center dark:bg-zinc-900 dark:text-zinc-100"
                >
                  <span>{assignedToName || t('tasks.editTaskModal.form.selectUser')}</span>
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </button>
                {dropdownOpen === 'assigned_to' && (
                  <div className="absolute z-10 w-full bg-popover border rounded shadow-md mt-1 max-h-48 overflow-y-auto dark:bg-zinc-800">
                    {usersLoading ? (
                      <div className="p-2 text-center text-muted-foreground">{t('tasks.editTaskModal.form.loadingUsers')}</div>
                    ) : (
                      allUsers.map(u => (
                        <div
                          key={u.id}
                          className="flex items-center gap-2 p-2 hover:bg-accent cursor-pointer"
                          onClick={() => {
                            setForm(prev => ({ ...prev, assigned_to: u.id }));
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
              <Label htmlFor="related_entity">{t('tasks.editTaskModal.form.relatedEntity')}</Label>
              <div className="relative">
                <Select
                  value={form.related_entity}
                  onValueChange={value => setForm(prev => ({
                    ...prev,
                    related_entity: value as "none" | "client" | "contact" | "deal",
                    related_entity_id: value === "none" ? null : prev.related_entity_id,
                    related_entity_name: value === "none" ? null : prev.related_entity_name
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('tasks.editTaskModal.form.selectRelatedEntity')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">{t('tasks.editTaskModal.form.none')}</SelectItem>
                    <SelectItem value="client">{t('tasks.editTaskModal.form.client')}</SelectItem>
                    <SelectItem value="contact">{t('tasks.editTaskModal.form.contact')}</SelectItem>
                    <SelectItem value="deal">{t('tasks.editTaskModal.form.deal')}</SelectItem>
                  </SelectContent>
                </Select>

                {form.related_entity !== "none" && (
                  <div className="mt-4">
                    <Input
                      type="text"
                      placeholder={t('tasks.editTaskModal.form.searchEntities')}
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="mb-2"
                    />
                    <div className="max-h-48 overflow-y-auto border rounded">
                      {loading || clientsLoading || dealsLoading || contactsLoading ? (
                        <div className="p-2 text-center text-muted-foreground">{t('tasks.editTaskModal.form.loading')}</div>
                      ) : (
                        {
                          client: filteredClients,
                          contact: filteredContacts,
                          deal: filteredDeals,
                        }[form.related_entity]?.length === 0 ? (
                          <div className="p-2 text-center text-muted-foreground">{t('tasks.editTaskModal.form.noEntitiesFound')}</div>
                        ) : (
                          {
                            client: filteredClients,
                            contact: filteredContacts,
                            deal: filteredDeals,
                          }[form.related_entity]?.map((entity: any) => (
                            <div
                              key={entity.id}
                              className="flex items-center gap-2 p-2 hover:bg-accent cursor-pointer"
                              onClick={() => {
                                handleRelatedEntityChange(form.related_entity, entity.id, entity.name);
                              }}
                            >
                              {form.related_entity === 'client' && <Briefcase className="h-4 w-4 text-blue-500" />}
                              {form.related_entity === 'contact' && <User className="h-4 w-4 text-green-500" />}
                              {form.related_entity === 'deal' && <Handshake className="h-4 w-4 text-orange-500" />}
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
            <Button type="submit" disabled={isUpdating || loading}>
              {isUpdating || loading ? t('tasks.editTaskModal.saving') : t('tasks.editTaskModal.saveChanges')}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}; 