
import React from "react";
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
import { type CalendarEvent } from "@/services/calendarService";

interface ExtendedAgendaViewProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

export function ExtendedAgendaView({ events, onEventClick }: ExtendedAgendaViewProps) {
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
      case "confirmed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
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
    const grouped: { [key: string]: CalendarEvent[] } = {};
    events.forEach(event => {
      const date = new Date(event.start_time).toDateString();
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
        <CardContent className="p-6">
          <div className="text-center py-20 text-muted-foreground">
            <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="font-medium text-lg mb-2">No Events Found</h3>
            <p>No events scheduled for this time period.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedEvents).map(([date, dayEvents]) => (
        <Card key={date}>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              {getDateLabel(date)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dayEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => onEventClick(event)}
                >
                  {/* Event Type Badge */}
                  <Badge className={`${getEventTypeColor(event.tags?.[0] || 'meeting')} text-white`}>
                    {event.tags?.[0] || 'Meeting'}
                  </Badge>

                  {/* Event Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-lg mb-1">{event.title}</h3>
                    
                    {event.description && (
                      <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                        {event.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {/* Time */}
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>
                          {formatTime(event.start_time)} - {formatTime(event.end_time)}
                        </span>
                      </div>

                      {/* Location */}
                      {event.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                      )}

                      {/* Client */}
                      {event.client_name && (
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{event.client_name}</span>
                        </div>
                      )}
                    </div>

                    {/* Attendees */}
                    {event.attendees && event.attendees.length > 0 && (
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-xs text-muted-foreground">Attendees:</span>
                        <div className="flex -space-x-2">
                          {event.attendees.slice(0, 3).map((attendee, index) => (
                            <Avatar key={index} className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {attendee.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {event.attendees.length > 3 && (
                            <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs">
                              +{event.attendees.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Status */}
                  <Badge className={getStatusColor(event.status || 'scheduled')}>
                    {event.status || 'Scheduled'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
