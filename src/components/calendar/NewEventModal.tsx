
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { X, Calendar as CalendarIcon, Clock, MapPin, User, Upload } from "lucide-react";

interface NewEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventData: any) => void;
}

export function NewEventModal({ isOpen, onClose, onSave }: NewEventModalProps) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Meeting");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [attendees, setAttendees] = useState<string[]>([]);
  const [currentAttendee, setCurrentAttendee] = useState("");
  const [linkedTo, setLinkedTo] = useState("");
  const [description, setDescription] = useState("");
  const [hasReminder, setHasReminder] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [visibility, setVisibility] = useState("public");

  const handleAddAttendee = () => {
    if (currentAttendee.trim() && !attendees.includes(currentAttendee.trim())) {
      setAttendees([...attendees, currentAttendee.trim()]);
      setCurrentAttendee("");
    }
  };

  const handleRemoveAttendee = (attendeeToRemove: string) => {
    setAttendees(attendees.filter(attendee => attendee !== attendeeToRemove));
  };

  const handleSave = () => {
    const eventData = {
      title,
      type,
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
      startTime,
      endTime,
      location,
      attendees,
      linkedTo,
      description,
      hasReminder,
      isRecurring,
      visibility,
    };

    onSave(eventData);
    handleClose();
  };

  const handleClose = () => {
    setTitle("");
    setType("Meeting");
    setStartDate(undefined);
    setEndDate(undefined);
    setStartTime("");
    setEndTime("");
    setLocation("");
    setAttendees([]);
    setCurrentAttendee("");
    setLinkedTo("");
    setDescription("");
    setHasReminder(false);
    setIsRecurring(false);
    setVisibility("public");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              placeholder="Enter event title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Type and Visibility */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Event Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Meeting">Meeting</SelectItem>
                  <SelectItem value="Call">Call</SelectItem>
                  <SelectItem value="Internal">Internal</SelectItem>
                  <SelectItem value="Reminder">Reminder</SelectItem>
                  <SelectItem value="Blocked">Blocked Time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Visibility</Label>
              <Select value={visibility} onValueChange={setVisibility}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="team">Team</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date and Time */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {startDate ? startDate.toLocaleDateString() : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
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
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {endDate ? endDate.toLocaleDateString() : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="Conference room, video call link, or address..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Attendees */}
          <div className="space-y-2">
            <Label>Attendees</Label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Add attendee name..."
                value={currentAttendee}
                onChange={(e) => setCurrentAttendee(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddAttendee()}
                className="flex-1"
              />
              <Button type="button" variant="outline" onClick={handleAddAttendee}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {attendees.map((attendee) => (
                <Badge key={attendee} variant="secondary" className="gap-1">
                  <Avatar className="h-4 w-4">
                    <AvatarFallback className="text-xs">
                      {attendee.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {attendee}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleRemoveAttendee(attendee)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Linked To */}
          <div className="space-y-2">
            <Label>Linked To</Label>
            <Select value={linkedTo} onValueChange={setLinkedTo}>
              <SelectTrigger>
                <SelectValue placeholder="Link to contact, deal, or client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contact-1">John Smith (Contact)</SelectItem>
                <SelectItem value="deal-1">Acme Corp Deal</SelectItem>
                <SelectItem value="client-1">Tech Solutions Ltd</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Notes & Description</Label>
            <Textarea
              id="description"
              placeholder="Event details, agenda, notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          {/* Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="reminder">Set reminder</Label>
              <Switch
                id="reminder"
                checked={hasReminder}
                onCheckedChange={setHasReminder}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="recurring">Recurring event</Label>
              <Switch
                id="recurring"
                checked={isRecurring}
                onCheckedChange={setIsRecurring}
              />
            </div>
          </div>

          {/* Attachments */}
          <div className="space-y-2">
            <Label>Attachments</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Drag & drop files here or click to browse
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title.trim()}>
            Create Event
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
