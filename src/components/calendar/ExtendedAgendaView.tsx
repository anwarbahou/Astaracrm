
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  MapPin, 
  User, 
  Calendar as CalendarIcon,
  Edit,
  Trash2
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

interface ExtendedAgendaViewProps {
  events: Event[];
  onEventClick: (event: Event) => void;
}

export function ExtendedAgendaView({ events, onEventClick }: ExtendedAgendaViewProps) {
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "Meeting": return "bg-blue-500";
      case "Call": return "bg-green-500";
      case "Internal": return "bg-purple-500";
      case "Onboarding": return "bg-orange-500";
      default: return "bg-gray-500";
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

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString([], { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Group events by date
  const groupEventsByDate = () => {
    const grouped: { [key: string]: Event[] } = {};
    events.forEach(event => {
      const date = new Date(event.start).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(event);
    });
    return grouped;
  };

  const groupedEvents = groupEventsByDate();
  const today = new Date().toDateString();
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toDateString();

  const getDateLabel = (dateString: string) => {
    if (dateString === today) return "Today";
    if (dateString === tomorrow) return "Tomorrow";
    return formatDate(dateString);
  };

  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="p-20">
          <div className="text-center text-muted-foreground">
            <CalendarIcon className="h-16 w-16 mx-auto mb-4" />
            <h3 className="font-medium text-lg mb-2">No events scheduled</h3>
            <p>Your agenda is clear. Time to schedule some meetings!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedEvents)
        .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
        .map(([date, dayEvents]) => (
          <Card key={date}>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium">
                {getDateLabel(date)}
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  {dayEvents.length} {dayEvents.length === 1 ? 'event' : 'events'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dayEvents
                .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
                .map((event) => (
                  <div
                    key={event.id}
                    onClick={() => onEventClick(event)}
                    className="p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-1 h-16 rounded ${getEventTypeColor(event.type)}`} />
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-base">{event.title}</h4>
                            <p className="text-sm text-muted-foreground">{event.client}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className={getStatusColor(event.status)}>
                              {event.status}
                            </Badge>
                            <Badge className={`${getEventTypeColor(event.type)} text-white`}>
                              {event.type}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{formatTime(event.start)} - {formatTime(event.end)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{event.attendees.length} attendees</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {event.attendees.slice(0, 3).map((attendee, index) => (
                              <Avatar key={index} className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {attendee.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                            {event.attendees.length > 3 && (
                              <span className="text-xs text-muted-foreground">
                                +{event.attendees.length - 3} more
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" onClick={(e) => {
                              e.stopPropagation();
                              // Handle edit
                            }}>
                              <Edit size={14} />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={(e) => {
                              e.stopPropagation();
                              // Handle delete
                            }}>
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        ))}
    </div>
  );
}
