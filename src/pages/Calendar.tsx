
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  User,
  Video,
  Phone,
  MapPin
} from "lucide-react";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");

  // Mock calendar events
  const events = [
    {
      id: 1,
      title: "Product Demo - Acme Corp",
      start: "2024-12-15T10:00:00",
      end: "2024-12-15T11:00:00",
      type: "Meeting",
      attendees: ["John Smith", "Sarah Wilson"],
      location: "Conference Room A",
      client: "Acme Corporation",
      status: "Confirmed"
    },
    {
      id: 2,
      title: "Q4 Sales Review",
      start: "2024-12-15T14:00:00",
      end: "2024-12-15T15:30:00",
      type: "Internal",
      attendees: ["Sales Team"],
      location: "Virtual - Zoom",
      client: "Internal",
      status: "Confirmed"
    },
    {
      id: 3,
      title: "Follow-up Call - Tech Solutions",
      start: "2024-12-16T09:00:00",
      end: "2024-12-16T09:30:00",
      type: "Call",
      attendees: ["Sarah Johnson"],
      location: "Phone Call",
      client: "Tech Solutions Ltd",
      status: "Pending"
    },
    {
      id: 4,
      title: "Contract Negotiation",
      start: "2024-12-17T11:00:00",
      end: "2024-12-17T12:30:00",
      type: "Meeting",
      attendees: ["Mike Chen", "Legal Team"],
      location: "Conference Room B",
      client: "Global Industries",
      status: "Confirmed"
    },
    {
      id: 5,
      title: "Team Standup",
      start: "2024-12-16T09:00:00",
      end: "2024-12-16T09:30:00",
      type: "Internal",
      attendees: ["Development Team"],
      location: "Office",
      client: "Internal",
      status: "Confirmed"
    },
    {
      id: 6,
      title: "Client Onboarding",
      start: "2024-12-18T15:00:00",
      end: "2024-12-18T16:00:00",
      type: "Onboarding",
      attendees: ["Emily Davis", "Support Team"],
      location: "Virtual - Teams",
      client: "StartupXYZ",
      status: "Confirmed"
    }
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "Meeting": return "bg-blue-500";
      case "Call": return "bg-green-500";
      case "Internal": return "bg-purple-500";
      case "Onboarding": return "bg-orange-500";
      default: return "bg-gray-500";
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "Meeting": return Video;
      case "Call": return Phone;
      case "Internal": return User;
      case "Onboarding": return User;
      default: return CalendarIcon;
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

  // Get events for today
  const today = new Date().toDateString();
  const todayEvents = events.filter(event => 
    new Date(event.start).toDateString() === today
  );

  // Get upcoming events (next 7 days)
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.start);
    return eventDate > new Date() && eventDate <= nextWeek;
  });

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString([], { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric' 
    });
  };

  const EventCard = ({ event }: { event: any }) => {
    const EventIcon = getEventIcon(event.type);
    
    return (
      <div className="flex items-start gap-3 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
        <div className={`w-3 h-3 rounded-full mt-2 ${getEventTypeColor(event.type)}`} />
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium">{event.title}</h4>
              <p className="text-sm text-muted-foreground">{event.client}</p>
            </div>
            <Badge variant="secondary" className={getStatusColor(event.status)}>
              {event.status}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{formatTime(event.start)} - {formatTime(event.end)}</span>
            </div>
            <div className="flex items-center gap-1">
              <EventIcon className="h-3 w-3" />
              <span>{event.location}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <User className="h-3 w-3 text-muted-foreground" />
            <div className="flex items-center gap-1">
              {event.attendees.slice(0, 3).map((attendee, index) => (
                <Avatar key={index} className="h-6 w-6">
                  <AvatarFallback className="text-xs">
                    {attendee.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              ))}
              {event.attendees.length > 3 && (
                <span className="text-xs text-muted-foreground ml-1">
                  +{event.attendees.length - 3} more
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calendar & Appointments</h1>
          <p className="text-muted-foreground mt-1">
            Manage your meetings, calls, and appointments.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-1 border rounded-lg p-1">
            <Button 
              size="sm" 
              variant={viewMode === "month" ? "default" : "ghost"}
              onClick={() => setViewMode("month")}
            >
              Month
            </Button>
            <Button 
              size="sm" 
              variant={viewMode === "week" ? "default" : "ghost"}
              onClick={() => setViewMode("week")}
            >
              Week
            </Button>
            <Button 
              size="sm" 
              variant={viewMode === "day" ? "default" : "ghost"}
              onClick={() => setViewMode("day")}
            >
              Day
            </Button>
          </div>
          <Button className="gap-2">
            <Plus size={16} />
            Schedule Meeting
          </Button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <ChevronLeft size={16} />
              </Button>
              <h2 className="text-xl font-semibold">
                {currentDate.toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </h2>
              <Button variant="outline" size="sm">
                <ChevronRight size={16} />
              </Button>
            </div>
            <Button variant="outline">Today</Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{todayEvents.length}</p>
              <p className="text-sm text-muted-foreground">Today's Events</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{upcomingEvents.length}</p>
              <p className="text-sm text-muted-foreground">This Week</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{events.filter(e => e.type === "Meeting").length}</p>
              <p className="text-sm text-muted-foreground">Meetings</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{events.filter(e => e.type === "Call").length}</p>
              <p className="text-sm text-muted-foreground">Calls</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar Grid */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Calendar View</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-20 text-muted-foreground">
              <CalendarIcon className="h-16 w-16 mx-auto mb-4" />
              <h3 className="font-medium text-lg mb-2">Calendar Component</h3>
              <p>Interactive calendar view would be implemented here</p>
              <p className="text-sm mt-2">
                Shows: {viewMode} view for {currentDate.toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar with Today's Events */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayEvents.length > 0 ? (
                  todayEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <CalendarIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No events today</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.slice(0, 3).map((event) => (
                  <div key={event.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{event.title}</span>
                      <Badge variant="outline" className="text-xs">
                        {event.type}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(event.start)} at {formatTime(event.start)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {event.client}
                    </div>
                  </div>
                ))}
                {upcomingEvents.length === 0 && (
                  <div className="text-center py-8">
                    <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No upcoming events</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* All Events List */}
      <Card>
        <CardHeader>
          <CardTitle>All Scheduled Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
