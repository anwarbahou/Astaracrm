import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { X, Calendar as CalendarIcon, Clock, MapPin, User, Building, Phone, Tag } from "lucide-react";
import { type CalendarEvent, type CreateCalendarEventInput } from "@/services/calendarService";
import { useUsersForSelection } from "@/hooks/useUsers";
import { useClientsForSelection } from "@/hooks/useClients";
import { useDeals } from "@/hooks/useDeals";
import { contactsService } from "@/services/contactsService";
import { useAuth } from "@/contexts/AuthContext";

interface EditEventSheetProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventId: string, eventData: CreateCalendarEventInput) => void;
}

export function EditEventSheet({ event, isOpen, onClose, onSave }: EditEventSheetProps) {
  const { user, userProfile } = useAuth();
  const { users: allUsers, isLoading: usersLoading } = useUsersForSelection();
  const { clients: allClients, isLoading: clientsLoading } = useClientsForSelection();
  const { deals: allDeals, isLoading: dealsLoading } = useDeals();
  const [contacts, setContacts] = useState<any[]>([]);
  const [contactsLoading, setContactsLoading] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [allDay, setAllDay] = useState(false);
  const [location, setLocation] = useState("");
  const [attendees, setAttendees] = useState<string[]>([]);
  const [currentAttendee, setCurrentAttendee] = useState<string | undefined>(undefined);
  const [clientId, setClientId] = useState<string | undefined>(undefined);
  const [contactId, setContactId] = useState<string | undefined>(undefined);
  const [dealId, setDealId] = useState<string | undefined>(undefined);
  const [description, setDescription] = useState("");
  const [reminderMinutes, setReminderMinutes] = useState(15);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceRule, setRecurrenceRule] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<"scheduled" | "confirmed" | "cancelled" | "completed">("scheduled");
  const [visibility, setVisibility] = useState<"public" | "private">("private");

  // Load contacts when component mounts
  useEffect(() => {
    if (userProfile) {
      setContactsLoading(true);
      contactsService.getContacts({ 
        userId: userProfile.id, 
        userRole: (userProfile.role || 'user') as 'user' | 'admin' | 'manager'
      })
        .then(data => setContacts(data.map(c => ({ 
          id: c.id, 
          name: `${c.firstName} ${c.lastName}`.trim() || c.email,
          email: c.email 
        }))))
        .finally(() => setContactsLoading(false));
    }
  }, [userProfile]);

  // Initialize form with event data when event changes
  useEffect(() => {
    if (event) {
      setTitle(event.title || "");
      setTags(event.tags || []);
      setDescription(event.description || "");
      setLocation(event.location || "");
      setAttendees(event.attendees || []);
      setClientId(event.client_id || undefined);
      setContactId(event.contact_id || undefined);
      setDealId(event.deal_id || undefined);
      setReminderMinutes(event.reminder_minutes || 15);
      setIsRecurring(event.is_recurring || false);
      setRecurrenceRule(event.recurrence_rule || undefined);
      setStatus(event.status || "scheduled");
      setVisibility(event.visibility || "private");

      // Parse dates
      if (event.start_time) {
        const startDate = new Date(event.start_time);
        setStartDate(startDate);
        setStartTime(startDate.toTimeString().slice(0, 5));
      }
      if (event.end_time) {
        const endDate = new Date(event.end_time);
        setEndDate(endDate);
        setEndTime(endDate.toTimeString().slice(0, 5));
      }
      setAllDay(event.all_day || false);
    }
  }, [event]);

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleRemoveAttendee = (attendeeToRemove: string) => {
    setAttendees(attendees.filter(attendee => attendee !== attendeeToRemove));
  };

  const handleSave = () => {
    if (!event) return;

    // Set default dates if not provided
    const defaultStartDate = startDate || new Date();
    const defaultEndDate = endDate || new Date(defaultStartDate.getTime() + 60 * 60 * 1000); // 1 hour later

    // Combine date and time
    const startDateTime = new Date(defaultStartDate);
    const endDateTime = new Date(defaultEndDate);
    
    if (!allDay && startTime) {
      const [startHours, startMinutes] = startTime.split(':');
      startDateTime.setHours(parseInt(startHours), parseInt(startMinutes), 0, 0);
    } else if (!allDay) {
      // Set default time to current time if no time provided
      const now = new Date();
      startDateTime.setHours(now.getHours(), now.getMinutes(), 0, 0);
      endDateTime.setHours(now.getHours() + 1, now.getMinutes(), 0, 0);
    }
    
    if (!allDay && endTime) {
      const [endHours, endMinutes] = endTime.split(':');
      endDateTime.setHours(parseInt(endHours), parseInt(endMinutes), 0, 0);
    }

    const eventData: CreateCalendarEventInput = {
      title,
      description,
      start_time: startDateTime.toISOString(),
      end_time: endDateTime.toISOString(),
      all_day: allDay,
      location,
      attendees,
      client_id: clientId || undefined,
      contact_id: contactId || undefined,
      deal_id: dealId || undefined,
      reminder_minutes: reminderMinutes,
      is_recurring: isRecurring,
      recurrence_rule: recurrenceRule || undefined,
      tags,
      status,
      visibility,
    };

    onSave(event.id, eventData);
    handleClose();
  };

  const handleClose = () => {
    setTitle("");
    setTags([]);
    setCurrentTag("");
    setStartDate(undefined);
    setEndDate(undefined);
    setStartTime("");
    setEndTime("");
    setAllDay(false);
    setLocation("");
    setAttendees([]);
    setCurrentAttendee(undefined);
    setClientId(undefined);
    setContactId(undefined);
    setDealId(undefined);
    setDescription("");
    setReminderMinutes(15);
    setIsRecurring(false);
    setRecurrenceRule(undefined);
    setStatus("scheduled");
    setVisibility("private");
    onClose();
  };

  const isFormValid = title.trim() && attendees.length > 0;

  if (!event) return null;

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader className="space-y-4 pb-6 border-b">
          <SheetTitle className="text-xl font-semibold flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Edit Event
          </SheetTitle>
          <SheetDescription>
            Modify the event details below.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Event Title *
            </Label>
            <Input
              id="title"
              placeholder="Enter event title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Event Tags
            </Label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Add tag..."
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                className="flex-1"
              />
              <Button type="button" variant="outline" size="sm" onClick={handleAddTag}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-destructive" 
                    onClick={() => handleRemoveTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Status</Label>
            <Select value={status} onValueChange={(value: any) => setStatus(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Visibility */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Visibility</Label>
            <Select value={visibility} onValueChange={(value: any) => setVisibility(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Private (Only you and attendees can see)</SelectItem>
                <SelectItem value="public">Public (Visible to all users)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date and Time */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="allDay"
                checked={allDay}
                onCheckedChange={setAllDay}
              />
              <Label htmlFor="allDay" className="text-sm font-medium">All day event</Label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {startDate ? startDate.toLocaleDateString() : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {endDate ? endDate.toLocaleDateString() : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {!allDay && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime" className="text-sm font-medium">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime" className="text-sm font-medium">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location
            </Label>
            <Input
              id="location"
              placeholder="Conference room, video call link, or address..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Attendees */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              Attendees *
            </Label>
            <div className="space-y-2">
              <Select 
                value={currentAttendee || "none"} 
                onValueChange={(value) => {
                  if (value && value !== "none" && !attendees.includes(value)) {
                    setAttendees([...attendees, value]);
                    setCurrentAttendee(undefined);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={usersLoading ? "Loading users..." : "Select attendee"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Select an attendee</SelectItem>
                  {allUsers && allUsers.length > 0 ? allUsers.map((user) => (
                    <SelectItem key={user.id} value={user.email}>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-4 w-4">
                          <AvatarImage src={user.avatar_url} />
                          <AvatarFallback className="text-xs">
                            {user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span>{user.name}</span>
                        <span className="text-xs text-muted-foreground">({user.email})</span>
                      </div>
                    </SelectItem>
                  )) : (
                    <SelectItem value="no-users" disabled>No users available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-wrap gap-2">
              {attendees.map((attendee) => {
                const user = allUsers?.find(u => u.email === attendee);
                return (
                  <Badge key={attendee} variant="secondary" className="gap-1">
                    <Avatar className="h-4 w-4">
                      <AvatarImage src={user?.avatar_url} />
                      <AvatarFallback className="text-xs">
                        {user?.name.charAt(0).toUpperCase() || attendee.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {user?.name || attendee}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-destructive" 
                      onClick={() => handleRemoveAttendee(attendee)}
                    />
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* Related Entities */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Building className="h-4 w-4" />
                Client
              </Label>
              <Select value={clientId || "none"} onValueChange={(value) => setClientId(value === "none" ? undefined : value)}>
                <SelectTrigger>
                  <SelectValue placeholder={clientsLoading ? "Loading..." : "Select client"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No client</SelectItem>
                  {allClients && allClients.length > 0 ? allClients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  )) : (
                    <SelectItem value="no-clients" disabled>No clients available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Contact
              </Label>
              <Select value={contactId || "none"} onValueChange={(value) => setContactId(value === "none" ? undefined : value)}>
                <SelectTrigger>
                  <SelectValue placeholder={contactsLoading ? "Loading..." : "Select contact"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No contact</SelectItem>
                  {contacts && contacts.length > 0 ? contacts.map((contact) => (
                    <SelectItem key={contact.id} value={contact.id}>
                      {contact.name}
                    </SelectItem>
                  )) : (
                    <SelectItem value="no-contacts" disabled>No contacts available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Deal
              </Label>
              <Select value={dealId || "none"} onValueChange={(value) => setDealId(value === "none" ? undefined : value)}>
                <SelectTrigger>
                  <SelectValue placeholder={dealsLoading ? "Loading..." : "Select deal"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No deal</SelectItem>
                  {allDeals && allDeals.length > 0 ? allDeals.map((deal) => (
                    <SelectItem key={deal.id} value={deal.id}>
                      {deal.name}
                    </SelectItem>
                  )) : (
                    <SelectItem value="no-deals" disabled>No deals available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Description</Label>
            <Textarea
              id="description"
              placeholder="Event details, agenda, notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>

          {/* Reminder */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Reminder
            </Label>
            <Select value={reminderMinutes.toString()} onValueChange={(value) => setReminderMinutes(parseInt(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">No reminder</SelectItem>
                <SelectItem value="5">5 minutes before</SelectItem>
                <SelectItem value="15">15 minutes before</SelectItem>
                <SelectItem value="30">30 minutes before</SelectItem>
                <SelectItem value="60">1 hour before</SelectItem>
                <SelectItem value="1440">1 day before</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Recurring */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="recurring"
                checked={isRecurring}
                onCheckedChange={setIsRecurring}
              />
              <Label htmlFor="recurring" className="text-sm font-medium">Recurring event</Label>
            </div>

            {isRecurring && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Recurrence Frequency</Label>
                <Select value={recurrenceRule || "none"} onValueChange={(value) => setRecurrenceRule(value === "none" ? undefined : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select how often this event repeats" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FREQ=DAILY">Every day</SelectItem>
                    <SelectItem value="FREQ=WEEKLY">Every week</SelectItem>
                    <SelectItem value="FREQ=MONTHLY">Every month</SelectItem>
                    <SelectItem value="FREQ=YEARLY">Every year</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  This will create 10 recurring events starting from the selected date.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <SheetFooter className="border-t pt-6">
          <div className="flex gap-2 w-full">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={!isFormValid}
              className="flex-1"
            >
              {isFormValid ? "Update Event" : "Fill required fields"}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
} 