
import { useState } from "react";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { NewEventModal } from "@/components/calendar/NewEventModal";
import { EventDetailDrawer } from "@/components/calendar/EventDetailDrawer";
import { ExtendedAgendaView } from "@/components/calendar/ExtendedAgendaView";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");
  const [calendarView, setCalendarView] = useState<"calendar" | "extended">("calendar");
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isEventDetailOpen, setIsEventDetailOpen] = useState(false);

  // Enhanced mock calendar events
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
      attendees: ["Sales Team", "Marketing Team"],
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
      attendees: ["Mike Chen", "Legal Team", "Client Representative"],
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
    },
    {
      id: 7,
      title: "Strategic Planning Session",
      start: "2024-12-19T13:00:00",
      end: "2024-12-19T16:00:00",
      type: "Internal",
      attendees: ["Executive Team", "Department Heads"],
      location: "Executive Conference Room",
      client: "Internal",
      status: "Confirmed"
    },
    {
      id: 8,
      title: "Product Roadmap Review",
      start: "2024-12-20T10:00:00",
      end: "2024-12-20T12:00:00",
      type: "Meeting",
      attendees: ["Product Team", "Engineering Team"],
      location: "Innovation Lab",
      client: "Internal",
      status: "Confirmed"
    }
  ];

  const filteredEvents = events.filter(event => 
    searchQuery === "" || 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setIsEventDetailOpen(true);
  };

  const handleCreateEvent = (eventData: any) => {
    console.log("Creating event:", eventData);
    // In a real app, this would call an API to create the event
  };

  return (
    <div className="min-h-screen bg-background">
      <CalendarHeader
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        viewMode={viewMode}
        setViewMode={setViewMode}
        calendarView={calendarView}
        setCalendarView={setCalendarView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onNewEvent={() => setIsNewEventModalOpen(true)}
      />

      {/* Main Content */}
      <div className="p-6">
        {calendarView === "calendar" ? (
          <CalendarGrid
            currentDate={currentDate}
            viewMode={viewMode}
            events={filteredEvents}
            onEventClick={handleEventClick}
          />
        ) : (
          <ExtendedAgendaView
            events={filteredEvents}
            onEventClick={handleEventClick}
          />
        )}
      </div>

      {/* Modals */}
      <NewEventModal
        isOpen={isNewEventModalOpen}
        onClose={() => setIsNewEventModalOpen(false)}
        onSave={handleCreateEvent}
      />

      <EventDetailDrawer
        event={selectedEvent}
        isOpen={isEventDetailOpen}
        onClose={() => setIsEventDetailOpen(false)}
      />
    </div>
  );
}
