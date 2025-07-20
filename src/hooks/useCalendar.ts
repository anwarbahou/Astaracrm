
import { useState } from "react";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import { type CalendarEvent, type CreateCalendarEventInput } from "@/services/calendarService";
import { useTranslation } from "react-i18next";

export function useCalendar() {
  const { t } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");
  const [calendarView, setCalendarView] = useState<"calendar" | "extended">("calendar");
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isEventDetailOpen, setIsEventDetailOpen] = useState(false);

  // Calculate date range for current month
  const getMonthDateRange = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    return {
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
    };
  };

  // Get calendar events with date range filter and mutations
  const { 
    events, 
    isLoading, 
    error, 
    createEvent,
    createEventAsync,
    updateEvent,
    deleteEvent
  } = useCalendarEvents(getMonthDateRange());

  // Filter events based on search query
  const filteredEvents = events.filter(event => 
    searchQuery === "" || 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (event.client_name && event.client_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEventDetailOpen(true);
  };

  const handleCreateEvent = async (eventData: CreateCalendarEventInput) => {
    try {
      await createEventAsync(eventData);
      closeNewEventModal();
    } catch (error) {
      console.error("Failed to create event:", error);
      // Error handling is done in the mutation
    }
  };

  const handleUpdateEvent = async (eventId: string, updates: Partial<CreateCalendarEventInput>) => {
    try {
      await updateEvent({ id: eventId, ...updates });
    } catch (error) {
      console.error("Failed to update event:", error);
      // Error handling is done in the mutation
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEvent(eventId);
      if (selectedEvent?.id === eventId) {
        closeEventDetail();
      }
    } catch (error) {
      console.error("Failed to delete event:", error);
      // Error handling is done in the mutation
    }
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
    isLoading,
    error,
    
    // Actions
    handleEventClick,
    handleCreateEvent,
    handleUpdateEvent,
    handleDeleteEvent,
    openNewEventModal,
    closeNewEventModal,
    closeEventDetail,
  };
}
