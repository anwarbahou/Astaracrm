
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { 
  Clock, 
  MapPin, 
  User, 
  Calendar as CalendarIcon,
  Edit,
  Trash2,
  Copy
} from "lucide-react";

interface Event {
  id: number;
  title: string;
  start: string;
  end: string;
  type: string;
  attendees: string[];
  location: string;
  client: string;
  status: string;
}

interface EventDetailDrawerProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EventDetailDrawer({ event, isOpen, onClose }: EventDetailDrawerProps) {
  if (!event) return null;

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "Meeting": return "bg-blue-500 text-white";
      case "Call": return "bg-green-500 text-white";
      case "Internal": return "bg-purple-500 text-white";
      case "Onboarding": return "bg-orange-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed": return "bg-green-100 text-green-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
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

  const startDateTime = formatDateTime(event.start);
  const endDateTime = formatDateTime(event.end);

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-w-md ml-auto h-full">
        <DrawerHeader className="border-b">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DrawerTitle className="text-xl font-semibold mb-2">
                {event.title}
              </DrawerTitle>
              <div className="flex items-center gap-2 mb-3">
                <Badge className={getEventTypeColor(event.type)}>
                  {event.type}
                </Badge>
                <Badge variant="secondary" className={getStatusColor(event.status)}>
                  {event.status}
                </Badge>
              </div>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="sm">×</Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Date & Time */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CalendarIcon className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{startDateTime.date}</p>
                <p className="text-sm text-muted-foreground">
                  {startDateTime.time} - {endDateTime.time}
                </p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Location</p>
              <p className="text-sm text-muted-foreground">{event.location}</p>
            </div>
          </div>

          {/* Client/Company */}
          <div className="space-y-2">
            <p className="font-medium text-sm">Linked to</p>
            <p className="text-sm text-muted-foreground">{event.client}</p>
          </div>

          {/* Attendees */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <p className="font-medium">Attendees ({event.attendees.length})</p>
            </div>
            <div className="space-y-2">
              {event.attendees.map((attendee, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-sm">
                      {attendee.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{attendee}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Event Details */}
          <div className="space-y-2">
            <p className="font-medium text-sm">Event Details</p>
            <p className="text-sm text-muted-foreground">
              This is a sample event description that would contain meeting agenda, 
              notes, or other relevant information about the event.
            </p>
          </div>

          {/* Attachments */}
          <div className="space-y-2">
            <p className="font-medium text-sm">Attachments</p>
            <div className="text-sm text-muted-foreground">
              No attachments
            </div>
          </div>

          {/* Metadata */}
          <div className="space-y-2 pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              Created by John Doe • {new Date(event.start).toLocaleDateString()}
            </p>
            <p className="text-xs text-muted-foreground">
              Last modified • {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t bg-background">
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 gap-2">
              <Edit size={16} />
              Edit
            </Button>
            <Button variant="outline" className="flex-1 gap-2">
              <Copy size={16} />
              Duplicate
            </Button>
            <Button variant="outline" size="icon" className="text-destructive hover:text-destructive">
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
