
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin } from "lucide-react";

interface Event {
  id: number;
  title: string;
  start: string;
  end: string;
  type: string;
  location: string;
  client: string;
  status: string;
  attendees: string[];
}

interface CalendarGridProps {
  currentDate: Date;
  viewMode: "month" | "week" | "day";
  events: Event[];
  onEventClick: (event: Event) => void;
}

export function CalendarGrid({ currentDate, viewMode, events, onEventClick }: CalendarGridProps) {
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "Meeting": return "bg-blue-500";
      case "Call": return "bg-green-500";
      case "Internal": return "bg-purple-500";
      case "Onboarding": return "bg-orange-500";
      default: return "bg-gray-500";
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDay = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return days;
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const isToday = (date: Date) => {
    return date.toDateString() === new Date().toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  if (viewMode === "month") {
    const days = getDaysInMonth();
    
    return (
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
            {/* Day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="bg-muted p-4 text-center text-sm font-medium">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {days.map((day, index) => {
              const dayEvents = getEventsForDate(day);
              const isCurrentDay = isToday(day);
              const isInCurrentMonth = isCurrentMonth(day);
              
              return (
                <div 
                  key={index} 
                  className={`bg-background p-2 min-h-[120px] ${
                    !isInCurrentMonth ? 'opacity-50' : ''
                  } ${isCurrentDay ? 'bg-accent/20' : ''}`}
                >
                  <div className={`text-sm font-medium mb-2 ${
                    isCurrentDay ? 'text-primary font-bold' : 
                    isInCurrentMonth ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {day.getDate()}
                  </div>
                  
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        onClick={() => onEventClick(event)}
                        className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity ${getEventTypeColor(event.type)} text-white`}
                      >
                        <div className="truncate font-medium">{event.title}</div>
                        <div className="truncate opacity-90">{formatTime(event.start)}</div>
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Week/Day view placeholder
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center py-20 text-muted-foreground">
          <h3 className="font-medium text-lg mb-2">{viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} View</h3>
          <p>Coming soon - Advanced {viewMode} calendar view</p>
        </div>
      </CardContent>
    </Card>
  );
}
