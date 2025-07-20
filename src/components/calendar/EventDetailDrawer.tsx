
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Clock, 
  MapPin, 
  User, 
  Calendar as CalendarIcon,
  Edit,
  Trash2,
  Copy,
  Building,
  Phone,
  Tag,
  Bell,
  Repeat,
  MoreHorizontal,
  Eye,
  EyeOff
} from "lucide-react";
import { type CalendarEvent } from "@/services/calendarService";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

interface EventDetailSheetProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (event: CalendarEvent) => void;
  onDelete?: (eventId: string) => void;
  onDuplicate?: (event: CalendarEvent) => void;
}

export function EventDetailSheet({ 
  event, 
  isOpen, 
  onClose, 
  onEdit, 
  onDelete, 
  onDuplicate 
}: EventDetailSheetProps) {
  const { user } = useAuth();
  
  if (!event) return null;

  // Check if current user is the event owner
  const isEventOwner = event.owner_id === user?.id;

  const getEventTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "meeting": return "bg-blue-500";
      case "call": return "bg-green-500";
      case "internal": return "bg-purple-500";
      case "onboarding": return "bg-orange-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed": return "bg-green-100 text-green-800 border-green-200";
      case "scheduled": return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled": return "bg-red-100 text-red-800 border-red-200";
      case "completed": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString([], { 
        weekday: 'long',
        year: 'numeric',
        month: 'long', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const startDateTime = formatDateTime(event.start_time);
  const endDateTime = formatDateTime(event.end_time);

  const handleEdit = () => {
    if (!isEventOwner) {
      alert('You can only edit events you created.');
      return;
    }
    onEdit?.(event);
    onClose();
  };

  const handleDelete = () => {
    if (!isEventOwner) {
      alert('You can only delete events you created.');
      return;
    }
    if (confirm('Are you sure you want to delete this event?')) {
      onDelete?.(event.id);
      onClose();
    }
  };

  const handleDuplicate = () => {
    onDuplicate?.(event);
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader className="space-y-4 pb-6 border-b">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <SheetTitle className="text-xl font-semibold mb-2 flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                {event.title}
              </SheetTitle>
              <div className="flex items-center gap-2 mb-2">
                <Badge className={getEventTypeColor(event.tags?.[0] || 'meeting')}>
                  {event.tags?.[0] || 'Meeting'}
                </Badge>
                <Badge variant="outline" className={getStatusColor(event.status || 'scheduled')}>
                  {event.status || 'Scheduled'}
                </Badge>
                <Badge variant={event.visibility === 'public' ? 'default' : 'secondary'} className="text-xs">
                  {event.visibility === 'public' ? 'Public' : 'Private'}
                </Badge>
                {!isEventOwner && (
                  <Badge variant="secondary" className="text-xs">
                    Created by {event.owner_name || 'Unknown'}
                  </Badge>
                )}
              </div>
              <SheetDescription>
                Event details and information
              </SheetDescription>
            </div>
            {isEventOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Event
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDuplicate}>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate Event
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Event
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Date & Time */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CalendarIcon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Date & Time</p>
                <p className="text-sm text-muted-foreground">{startDateTime.date}</p>
                <p className="text-sm text-muted-foreground">
                  {startDateTime.time} - {endDateTime.time}
                </p>
                {event.all_day && (
                  <p className="text-xs text-muted-foreground">All day event</p>
                )}
              </div>
            </div>
          </div>

          {/* Location */}
          {event.location && (
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Location</p>
                <p className="text-sm text-muted-foreground">{event.location}</p>
              </div>
            </div>
          )}

          {/* Related Entities */}
          <div className="space-y-3">
            {event.client_name && (
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Building className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Client</p>
                  <p className="text-sm text-muted-foreground">{event.client_name}</p>
                </div>
              </div>
            )}
            
            {event.contact_name && (
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <User className="h-5 w-5 text-orange-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Contact</p>
                  <p className="text-sm text-muted-foreground">{event.contact_name}</p>
                </div>
              </div>
            )}

            {event.deal_name && (
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Phone className="h-5 w-5 text-indigo-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Deal</p>
                  <p className="text-sm text-muted-foreground">{event.deal_name}</p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {event.description && (
            <div className="space-y-2">
              <p className="font-medium text-sm">Description</p>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-sm text-muted-foreground">
                  {event.description}
                </p>
              </div>
            </div>
          )}

          {/* Attendees */}
          {(event.attendee_users?.length > 0 || event.attendees?.length > 0) && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium text-sm">
                  Attendees ({event.attendee_users?.length || event.attendees?.length || 0})
                </p>
              </div>
              <div className="space-y-2">
                {event.attendee_users && event.attendee_users.length > 0 ? (
                  // Show attendees with full user data
                  event.attendee_users.map((attendee, index) => (
                    <div key={attendee.id} className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={attendee.avatar_url} />
                        <AvatarFallback className="text-sm bg-primary/10 text-primary">
                          {attendee.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <span className="text-sm font-medium">{attendee.name}</span>
                        <p className="text-xs text-muted-foreground">{attendee.email}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  // Fallback to show attendees as email strings
                  event.attendees?.map((attendee, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-sm bg-primary/10 text-primary">
                          {attendee.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <span className="text-sm font-medium">{attendee}</span>
                        <p className="text-xs text-muted-foreground">Email address</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium text-sm">Tags</p>
              </div>
              <div className="flex flex-wrap gap-1">
                {event.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Visibility */}
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                {event.visibility === 'public' ? (
                  <Eye className="h-5 w-5 text-indigo-600" />
                ) : (
                  <EyeOff className="h-5 w-5 text-indigo-600" />
                )}
              </div>
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">Visibility</p>
              <p className="text-sm text-muted-foreground">
                {event.visibility === 'public' ? 'Public (Visible to all users)' : 'Private (Only you and attendees can see)'}
              </p>
            </div>
          </div>

          {/* Reminder */}
          {event.reminder_minutes && event.reminder_minutes > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Bell className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Reminder</p>
                <p className="text-sm text-muted-foreground">
                  {event.reminder_minutes} minutes before event
                </p>
              </div>
            </div>
          )}

          {/* Recurring */}
          {event.is_recurring && (
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                  <Repeat className="h-5 w-5 text-pink-600" />
                </div>
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Recurring</p>
                <p className="text-sm text-muted-foreground">
                  {event.recurrence_rule?.includes('DAILY') ? 'Every day' :
                   event.recurrence_rule?.includes('WEEKLY') ? 'Every week' :
                   event.recurrence_rule?.includes('MONTHLY') ? 'Every month' :
                   event.recurrence_rule?.includes('YEARLY') ? 'Every year' :
                   'Recurring event'}
                </p>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="space-y-2 pt-4 border-t">
            {event.owner_name && (
              <p className="text-xs text-muted-foreground">
                Created by {event.owner_name} • {new Date(event.created_at || '').toLocaleDateString()}
              </p>
            )}
            {event.updated_at && (
              <p className="text-xs text-muted-foreground">
                Last modified • {new Date(event.updated_at).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <SheetFooter className="border-t pt-6">
          <div className="flex gap-2 w-full">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
