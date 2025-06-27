import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { User, Briefcase, Handshake, MoreHorizontal, Calendar } from 'lucide-react';
import { useClientsForSelection } from '@/hooks/useClients';
import { contactsService } from '@/services/contactsService';
import { useDeals } from '@/hooks/useDeals';
import { useTasks, Task } from '@/hooks/useTasks';
import { useUsersForSelection } from '@/hooks/useUsers';
import { useTranslation } from 'react-i18next';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

interface AddTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormErrors {
  title?: string;
  priority?: string;
  status?: string;
  due_date?: string;
  related_entity?: string;
}

export function AddTaskModal({ open, onOpenChange }: AddTaskModalProps) {
  const { userProfile, user } = useAuth();
  const { addTask, isAdding } = useTasks();
  const { users: allUsers, isLoading: usersLoading } = useUsersForSelection();
  const { t } = useTranslation();
  
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium" as const,
    status: "pending" as const,
    due_date: "",
    related_entity: "" as "" | "client" | "contact" | "deal",
    related_entity_id: "",
    related_entity_name: "",
    time_spent: "",
    assigned_to: ""
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const { clients, isLoading: clientsLoading } = useClientsForSelection();
  const { deals, isLoading: dealsLoading } = useDeals();
  const [searchQuery, setSearchQuery] = useState('');
  const [contacts, setContacts] = useState<any[]>([]);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [date, setDate] = useState<Date>();

  // Set assigned_to to current user id or selected user
  const isAdmin = userProfile?.role === 'admin';
  const assignedTo = isAdmin ? form.assigned_to || (allUsers[0]?.id ?? '') : userProfile?.id ?? '';
  const assignedToName = isAdmin
    ? allUsers.find(u => u.id === assignedTo)?.name || ''
    : userProfile ? `${userProfile.first_name || ""} ${userProfile.last_name || ""}`.trim() || userProfile.email : "";

  useEffect(() => {
    if (form.related_entity === 'contact' && userProfile) {
      setContactsLoading(true);
      contactsService.getContacts({ 
        userId: userProfile.id, 
        userRole: userProfile.role as 'user' | 'admin' | 'manager' 
      })
        .then(data => setContacts(data.map(c => ({ id: c.id, name: c.firstName + ' ' + c.lastName }))))
        .finally(() => setContactsLoading(false));
    }
  }, [form.related_entity, userProfile]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.title.trim()) {
      newErrors.title = t('tasks.addTaskModal.form.validation.titleRequired');
    }

    if (form.priority && !['low', 'medium', 'high'].includes(form.priority)) {
      newErrors.priority = t('tasks.addTaskModal.form.validation.invalidPriority');
    }

    if (form.status && !['pending', 'in_progress', 'completed', 'cancelled', 'todo', 'blocked'].includes(form.status)) {
      newErrors.status = t('tasks.addTaskModal.form.validation.invalidStatus');
    }

    if (form.due_date) {
      const dueDate = new Date(form.due_date);
      if (isNaN(dueDate.getTime())) {
        newErrors.due_date = t('tasks.addTaskModal.form.validation.invalidDueDate');
      }
    }

    if (form.related_entity && !['client', 'contact', 'deal', ''].includes(form.related_entity)) {
      newErrors.related_entity = t('tasks.addTaskModal.form.validation.invalidEntityType');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear error when field is edited
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleDescriptionChange = (value: string) => {
    setForm(prev => ({ ...prev, description: value }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    setDate(date);
    if (date) {
      setForm(prev => ({ ...prev, due_date: format(date, 'yyyy-MM-dd') }));
      if (errors.due_date) {
        setErrors(prev => ({ ...prev, due_date: undefined }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await addTask({
        title: form.title,
        description: form.description,
        priority: form.priority,
        status: form.status,
        due_date: form.due_date || null,
        related_entity: form.related_entity || null,
        related_entity_id: form.related_entity_id || null,
        time_spent: form.time_spent || null,
        assigned_to: assignedTo || null
      });

      // Reset form
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
      setDate(undefined);
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting task:', error);
    }
  };

  const handleRelatedEntityChange = (entityType: "client" | "contact" | "deal", id: string, name: string) => {
    setForm(prev => ({
      ...prev,
      related_entity: entityType,
      related_entity_id: id,
      related_entity_name: name
    }));
    setDropdownOpen(null);
    if (errors.related_entity) {
      setErrors(prev => ({ ...prev, related_entity: undefined }));
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{t('tasks.addTaskModal.title')}</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          <div className="space-y-2">
            <Label htmlFor="title">{t('tasks.addTaskModal.form.title')}</Label>
            <Input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder={t('tasks.addTaskModal.form.titlePlaceholder')}
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label>{t('tasks.addTaskModal.form.description')}</Label>
            <ReactQuill
              value={form.description}
              onChange={handleDescriptionChange}
              placeholder={t('tasks.addTaskModal.form.descriptionPlaceholder')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('tasks.addTaskModal.form.priority')}</Label>
              <Select
                value={form.priority}
                onValueChange={(value) => {
                  setForm(prev => ({ ...prev, priority: value as typeof form.priority }));
                  if (errors.priority) {
                    setErrors(prev => ({ ...prev, priority: undefined }));
                  }
                }}
              >
                <SelectTrigger className={errors.priority ? 'border-red-500' : ''}>
                  <SelectValue placeholder={t('tasks.addTaskModal.form.priorityPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">{t('tasks.priority.low')}</SelectItem>
                  <SelectItem value="medium">{t('tasks.priority.medium')}</SelectItem>
                  <SelectItem value="high">{t('tasks.priority.high')}</SelectItem>
                </SelectContent>
              </Select>
              {errors.priority && <p className="text-sm text-red-500">{errors.priority}</p>}
            </div>

            <div className="space-y-2">
              <Label>{t('tasks.addTaskModal.form.status')}</Label>
              <Select
                value={form.status}
                onValueChange={(value) => {
                  setForm(prev => ({ ...prev, status: value as typeof form.status }));
                  if (errors.status) {
                    setErrors(prev => ({ ...prev, status: undefined }));
                  }
                }}
              >
                <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                  <SelectValue placeholder={t('tasks.addTaskModal.form.statusPlaceholder')} />
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
              {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('tasks.addTaskModal.form.dueDate')}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground",
                      errors.due_date && "border-red-500"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.due_date && <p className="text-sm text-red-500">{errors.due_date}</p>}
            </div>

            <div className="space-y-2">
              <Label>{t('tasks.addTaskModal.form.timeSpent')}</Label>
              <Input
                name="time_spent"
                value={form.time_spent}
                onChange={handleChange}
                placeholder={t('tasks.addTaskModal.form.timeSpentPlaceholder')}
              />
            </div>
          </div>

          {isAdmin && (
            <div className="space-y-2">
              <Label>{t('tasks.addTaskModal.form.assignedTo')}</Label>
              <Select
                value={form.assigned_to}
                onValueChange={(value) => setForm(prev => ({ ...prev, assigned_to: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('tasks.addTaskModal.form.selectUser')} />
                </SelectTrigger>
                <SelectContent>
                  {usersLoading ? (
                    <SelectItem value="">{t('tasks.addTaskModal.form.loadingUsers')}</SelectItem>
                  ) : (
                    allUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={user.avatar_url || undefined} />
                            <AvatarFallback>
                              {user.name.split(' ')[0]?.[0]}
                              {user.name.split(' ')[1]?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span>{user.name}</span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label>{t('tasks.addTaskModal.form.relatedEntity')}</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={form.related_entity === "" ? "default" : "outline"}
                onClick={() => {
                  setForm(prev => ({
                    ...prev,
                    related_entity: "",
                    related_entity_id: "",
                    related_entity_name: ""
                  }));
                  if (errors.related_entity) {
                    setErrors(prev => ({ ...prev, related_entity: undefined }));
                  }
                }}
              >
                {t('tasks.addTaskModal.form.none')}
              </Button>

              <Popover open={dropdownOpen === 'client'} onOpenChange={(open) => setDropdownOpen(open ? 'client' : null)}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant={form.related_entity === "client" ? "default" : "outline"}
                  >
                    <Briefcase className="mr-2 h-4 w-4" />
                    {t('tasks.addTaskModal.form.client')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <Input
                      placeholder={t('tasks.addTaskModal.form.searchEntities')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="max-h-48 overflow-auto">
                      {clientsLoading ? (
                        <div className="text-center py-2">{t('tasks.addTaskModal.form.loading')}</div>
                      ) : clients.length === 0 ? (
                        <div className="text-center py-2">{t('tasks.addTaskModal.form.noEntitiesFound')}</div>
                      ) : (
                        clients.map((client) => (
                          <Button
                            key={client.id}
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => handleRelatedEntityChange("client", client.id, client.name)}
                          >
                            {client.name}
                          </Button>
                        ))
                      )}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Popover open={dropdownOpen === 'contact'} onOpenChange={(open) => setDropdownOpen(open ? 'contact' : null)}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant={form.related_entity === "contact" ? "default" : "outline"}
                  >
                    <User className="mr-2 h-4 w-4" />
                    {t('tasks.addTaskModal.form.contact')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <Input
                      placeholder={t('tasks.addTaskModal.form.searchEntities')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="max-h-48 overflow-auto">
                      {contactsLoading ? (
                        <div className="text-center py-2">{t('tasks.addTaskModal.form.loading')}</div>
                      ) : contacts.length === 0 ? (
                        <div className="text-center py-2">{t('tasks.addTaskModal.form.noEntitiesFound')}</div>
                      ) : (
                        contacts.map((contact) => (
                          <Button
                            key={contact.id}
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => handleRelatedEntityChange("contact", contact.id, contact.name)}
                          >
                            {contact.name}
                          </Button>
                        ))
                      )}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Popover open={dropdownOpen === 'deal'} onOpenChange={(open) => setDropdownOpen(open ? 'deal' : null)}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant={form.related_entity === "deal" ? "default" : "outline"}
                  >
                    <Handshake className="mr-2 h-4 w-4" />
                    {t('tasks.addTaskModal.form.deal')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <Input
                      placeholder={t('tasks.addTaskModal.form.searchEntities')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="max-h-48 overflow-auto">
                      {dealsLoading ? (
                        <div className="text-center py-2">{t('tasks.addTaskModal.form.loading')}</div>
                      ) : deals.length === 0 ? (
                        <div className="text-center py-2">{t('tasks.addTaskModal.form.noEntitiesFound')}</div>
                      ) : (
                        deals.map((deal) => (
                          <Button
                            key={deal.id}
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => handleRelatedEntityChange("deal", deal.id, deal.name)}
                          >
                            {deal.name}
                          </Button>
                        ))
                      )}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            {errors.related_entity && <p className="text-sm text-red-500">{errors.related_entity}</p>}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isAdding}
          >
            {isAdding ? t('tasks.addTaskModal.saving') : t('tasks.addTaskModal.saveTask')}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
} 