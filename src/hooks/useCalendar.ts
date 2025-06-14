
import { useState } from "react";
import { CalendarEvent, mockCalendarEvents } from "@/data/mockCalendarEvents";

export function useCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");
  const [calendarView, setCalendarView] = useState<"calendar" | "extended">("calendar");
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isEventDetailOpen, setIsEventDetailOpen] = useState(false);

  const events = mockCalendarEvents;

  const filteredEvents = events.filter(event => 
    searchQuery === "" || 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEventDetailOpen(true);
  };

  const handleCreateEvent = (eventData: any) => {
    console.log("Creating event:", eventData);
    // In a real app, this would call an API to create the event
  };

  const openNewEventModal = () => setIsNewEventModalOpen(true);
  const closeNewEventModal = () => setIsNewEventModalOpen(false);
  const closeEventDetail = () => setIsEventDetailOpen(false);

  return {
    // State
    currentDate,
    setCurrentDate,
    viewMode,
    setViewMode,
    calendarView,
    setCalendarView,
    searchQuery,
    setSearchQuery,
    isNewEventModalOpen,
    selectedEvent,
    isEventDetailOpen,
    filteredEvents,
    
    // Actions
    handleEventClick,
    handleCreateEvent,
    openNewEventModal,
    closeNewEventModal,
    closeEventDetail,
  };
}
